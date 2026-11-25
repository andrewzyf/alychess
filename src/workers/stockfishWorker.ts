import { Chess } from 'chess.js';
import {
  EngineLine,
  GameMetadata,
  GameReviewReport,
  PositionEvaluation,
} from '../types/chess';
import {
  buildGameReviewReport,
  cpToWinPct,
  extractGamePlies,
  mateToCpWhite,
} from '../utils/capsCalculator';
import { uciLineToSan } from '../utils/chessHelpers';

export type WorkerInboundMessage =
  | {
      type: 'REVIEW_GAME';
      requestId: string;
      game: GameMetadata;
      depth?: number;
    }
  | {
      type: 'EVAL_SINGLE_PLY';
      requestId: string;
      ply: number;
      fen: string;
      depth: number;
      multiPv: number;
      maxNodes?: number;
    }
  | {
      type: 'ANALYZE_POSITION';
      requestId: string;
      fen: string;
      depth?: number;
      multiPv?: number;
    }
  | {
      type: 'PLAY_BOT_MOVE';
      requestId: string;
      fenBeforeUserMove?: string;
      userMoveUci?: string;
      fen: string;
      elo: number;
    }
  | {
      type: 'STOP';
    }
  | {
      type: 'SF_PROXY_LINE';
      line: string;
    };

export type WorkerOutboundMessage =
  | { type: 'ENGINE_READY' }
  | { type: 'REQUEST_SF_PROXY' }
  | { type: 'SF_PROXY_SEND'; cmd: string }
  | {
      type: 'PLY_EVAL_RESULT';
      requestId: string;
      ply: number;
      evaluation: PositionEvaluation;
    }
  | {
      type: 'REVIEW_PROGRESS';
      requestId: string;
      completedPlies: number;
      totalPlies: number;
      percent: number;
      currentPly: number;
      fen: string;
      from?: string;
      to?: string;
      cpWhite: number;
      mateWhite: number | null;
    }
  | {
      type: 'REVIEW_COMPLETE';
      requestId: string;
      report: GameReviewReport;
    }
  | {
      type: 'ANALYSIS_UPDATE';
      requestId: string;
      evaluation: PositionEvaluation;
    }
  | {
      type: 'BOT_MOVE_RESULT';
      requestId: string;
      bestMoveUci: string;
      cpWhiteAfterUser?: number;
      mateWhiteAfterUser?: number | null;
      userWinLoss?: number;
      userPlayedBest?: boolean;
    }
  | {
      type: 'WORKER_ERROR';
      requestId?: string;
      message: string;
    };

interface RawSearchResult {
  bestMoveUci: string;
  evaluation: PositionEvaluation;
}

let sfSubWorker: Worker | null = null;
let useMainThreadProxy = false;
let engineBooted = false;
let bootResolvers: Array<() => void> = [];

const lineListeners = new Set<(line: string) => void>();
let currentTaskToken = 0;
let serialQueue: Promise<void> = Promise.resolve();

// Track UCI options to avoid redundant setoption overhead on every ply
let lastMultiPv = -1;
let lastLimitStrength: boolean | null = null;
let lastSkillLevel = -1;

function postOut(msg: WorkerOutboundMessage) {
  self.postMessage(msg);
}

function sendUci(cmd: string) {
  if (useMainThreadProxy) {
    postOut({ type: 'SF_PROXY_SEND', cmd });
  } else if (sfSubWorker) {
    sfSubWorker.postMessage(cmd);
  }
}

function handleEngineLine(rawLine: unknown) {
  if (typeof rawLine !== 'string') return;
  const line = rawLine.trim();
  if (!line) return;

  if (line === 'uciok') {
    sendUci('setoption name Hash value 32');
    sendUci('isready');
    return;
  }

  if (line === 'readyok' && !engineBooted) {
    engineBooted = true;
    postOut({ type: 'ENGINE_READY' });
    const list = bootResolvers.slice();
    bootResolvers = [];
    list.forEach((fn) => fn());
  }

  for (const fn of Array.from(lineListeners)) {
    fn(line);
  }
}

function initStockfishEngine() {
  if (typeof Worker !== 'undefined') {
    try {
      sfSubWorker = new Worker('/stockfish/stockfish-19-lite-single.js');
      sfSubWorker.onmessage = (ev) => handleEngineLine(ev.data);
      sfSubWorker.onerror = () => {
        try {
          sfSubWorker?.terminate();
          sfSubWorker = new Worker('/stockfish/stockfish-19-asm.js');
          sfSubWorker.onmessage = (ev2) => handleEngineLine(ev2.data);
          sfSubWorker.postMessage('uci');
        } catch (err) {
          postOut({
            type: 'WORKER_ERROR',
            message: `Engine initialization failed: ${String(err)}`,
          });
        }
      };
      sfSubWorker.postMessage('uci');
      return;
    } catch {
      // Fallback to proxy
    }
  }

  useMainThreadProxy = true;
  postOut({ type: 'REQUEST_SF_PROXY' });
}

function waitUntilBooted(): Promise<void> {
  if (engineBooted) return Promise.resolve();
  return new Promise((resolve) => {
    bootResolvers.push(resolve);
  });
}

function waitForReadyOk(): Promise<void> {
  return new Promise((resolve) => {
    const onLine = (line: string) => {
      if (line === 'readyok') {
        lineListeners.delete(onLine);
        resolve();
      }
    };
    lineListeners.add(onLine);
    sendUci('isready');
  });
}

function parseInfoLine(
  line: string,
  turn: 'w' | 'b'
): {
  depth: number;
  multipv: number;
  cpWhite: number;
  mateWhite: number | null;
  pvUci: string[];
  isBound: boolean;
} | null {
  if (!line.startsWith('info ') || !line.includes(' score ') || !line.includes(' pv ')) {
    return null;
  }

  const isBound = line.includes('upperbound') || line.includes('lowerbound');
  const depthMatch = line.match(/\bdepth\s+(\d+)/);
  if (!depthMatch) return null;
  const depth = parseInt(depthMatch[1], 10);

  const multipvMatch = line.match(/\bmultipv\s+(\d+)/);
  const multipv = multipvMatch ? parseInt(multipvMatch[1], 10) : 1;

  let cpWhite = 0;
  let mateWhite: number | null = null;

  const mateMatch = line.match(/\bscore\s+mate\s+(-?\d+)/);
  const cpMatch = line.match(/\bscore\s+cp\s+(-?\d+)/);

  if (mateMatch) {
    const mateSideToMove = parseInt(mateMatch[1], 10);
    mateWhite = turn === 'w' ? mateSideToMove : -mateSideToMove;
    cpWhite = mateToCpWhite(mateWhite);
  } else if (cpMatch) {
    const cpSideToMove = parseInt(cpMatch[1], 10);
    cpWhite = turn === 'w' ? cpSideToMove : -cpSideToMove;
  } else {
    return null;
  }

  const pvIndex = line.indexOf(' pv ');
  const pvStr = pvIndex >= 0 ? line.slice(pvIndex + 4).trim() : '';
  const pvUci = pvStr ? pvStr.split(/\s+/).filter(Boolean) : [];

  return {
    depth,
    multipv,
    cpWhite,
    mateWhite,
    pvUci,
    isBound,
  };
}

async function evaluateSinglePosition(
  fen: string,
  options: {
    depth: number;
    multiPv: number;
    maxNodes?: number;
    limitStrength?: boolean;
    elo?: number;
    skillLevel?: number;
    onDepthUpdate?: (ev: PositionEvaluation) => void;
    taskToken: number;
  }
): Promise<RawSearchResult | null> {
  await waitUntilBooted();
  if (options.taskToken !== currentTaskToken) return null;

  let chess: Chess;
  try {
    chess = new Chess(fen);
  } catch {
    return null;
  }

  const turn = chess.turn();
  if (chess.isGameOver()) {
    if (chess.isCheckmate()) {
      const cpWhite = turn === 'w' ? -10000 : 10000;
      const winPctWhite = turn === 'w' ? 0 : 100;
      return {
        bestMoveUci: '(none)',
        evaluation: {
          fen,
          depth: options.depth,
          cpWhite,
          mateWhite: 0,
          winPctWhite,
          lines: [],
        },
      };
    }
    return {
      bestMoveUci: '(none)',
      evaluation: {
        fen,
        depth: options.depth,
        cpWhite: 0,
        mateWhite: null,
        winPctWhite: 50,
        lines: [],
      },
    };
  }

  // Only send UCI options that actually changed to eliminate unnecessary sync latency
  let optionsDirty = false;
  if (lastMultiPv !== options.multiPv) {
    sendUci(`setoption name MultiPV value ${options.multiPv}`);
    lastMultiPv = options.multiPv;
    optionsDirty = true;
  }

  const wantLimit = Boolean(options.limitStrength);
  const wantSkill = wantLimit ? options.skillLevel ?? 10 : 20;
  if (wantLimit) {
    const clampedUciElo = Math.max(1320, Math.min(3190, options.elo || 1320));
    sendUci('setoption name UCI_LimitStrength value true');
    sendUci(`setoption name UCI_Elo value ${clampedUciElo}`);
    sendUci(`setoption name Skill Level value ${wantSkill}`);
    lastLimitStrength = true;
    lastSkillLevel = wantSkill;
    optionsDirty = true;
  } else if (lastLimitStrength !== false || lastSkillLevel !== 20) {
    sendUci('setoption name UCI_LimitStrength value false');
    sendUci('setoption name Skill Level value 20');
    lastLimitStrength = false;
    lastSkillLevel = 20;
    optionsDirty = true;
  }

  if (optionsDirty) {
    await waitForReadyOk();
    if (options.taskToken !== currentTaskToken) return null;
  }

  return new Promise<RawSearchResult | null>((resolve) => {
    const lineMap = new Map<
      number,
      { depth: number; cpWhite: number; mateWhite: number | null; pvUci: string[] }
    >();
    let highestDepthSeen = 0;

    const buildSnapshot = (): PositionEvaluation => {
      const sortedKeys = Array.from(lineMap.keys()).sort((a, b) => a - b);
      const lines: EngineLine[] = sortedKeys.map((mpv) => {
        const item = lineMap.get(mpv)!;
        return {
          multipv: mpv,
          depth: item.depth,
          cpWhite: item.cpWhite,
          mateWhite: item.mateWhite,
          pvUci: item.pvUci,
          pvSan: uciLineToSan(fen, item.pvUci, 7),
        };
      });
      const primary = lines[0];
      const cpWhite = primary ? primary.cpWhite : 0;
      const mateWhite = primary ? primary.mateWhite : null;
      return {
        fen,
        depth: highestDepthSeen,
        cpWhite,
        mateWhite,
        winPctWhite: cpToWinPct(cpWhite),
        lines,
      };
    };

    const onLine = (line: string) => {
      if (line.startsWith('info ')) {
        if (options.taskToken !== currentTaskToken) return;
        const parsed = parseInfoLine(line, turn);
        if (parsed && (!parsed.isBound || !lineMap.has(parsed.multipv))) {
          lineMap.set(parsed.multipv, {
            depth: parsed.depth,
            cpWhite: parsed.cpWhite,
            mateWhite: parsed.mateWhite,
            pvUci: parsed.pvUci,
          });
          if (parsed.depth > highestDepthSeen) {
            highestDepthSeen = parsed.depth;
          }
          if (options.onDepthUpdate && parsed.multipv === 1 && parsed.depth >= 2) {
            options.onDepthUpdate(buildSnapshot());
          }
        }
      } else if (line.startsWith('bestmove ')) {
        lineListeners.delete(onLine);
        if (options.taskToken !== currentTaskToken) {
          resolve(null);
          return;
        }
        const parts = line.split(/\s+/);
        const bestMoveUci = parts[1] || '(none)';
        resolve({
          bestMoveUci,
          evaluation: buildSnapshot(),
        });
      }
    };

    lineListeners.add(onLine);
    sendUci(`position fen ${fen}`);
    if (options.maxNodes && options.maxNodes > 0) {
      sendUci(`go depth ${options.depth} nodes ${options.maxNodes}`);
    } else {
      sendUci(`go depth ${options.depth}`);
    }
  });
}

function enqueueExclusiveTask(taskFn: (token: number) => Promise<void>) {
  const token = ++currentTaskToken;
  if (engineBooted) {
    sendUci('stop');
  }
  serialQueue = serialQueue
    .catch(() => {})
    .then(async () => {
      await waitUntilBooted();
      if (token !== currentTaskToken) return;
      await waitForReadyOk();
      if (token !== currentTaskToken) return;
      await taskFn(token);
    })
    .catch((err) => {
      postOut({
        type: 'WORKER_ERROR',
        message: err instanceof Error ? err.message : String(err),
      });
    });
}

async function runSinglePlyEval(
  token: number,
  requestId: string,
  ply: number,
  fen: string,
  depth: number,
  multiPv: number,
  maxNodes?: number
) {
  const res = await evaluateSinglePosition(fen, {
    depth,
    multiPv,
    maxNodes,
    limitStrength: false,
    taskToken: token,
  });
  if (token === currentTaskToken && res) {
    postOut({
      type: 'PLY_EVAL_RESULT',
      requestId,
      ply,
      evaluation: res.evaluation,
    });
  }
}

async function runFullGameReview(
  token: number,
  requestId: string,
  game: GameMetadata,
  depth = 14
) {
  sendUci('ucinewgame');
  await waitForReadyOk();
  if (token !== currentTaskToken) return;

  let parsedPlies;
  try {
    parsedPlies = extractGamePlies(game.pgn);
  } catch (err) {
    postOut({
      type: 'WORKER_ERROR',
      requestId,
      message: `Failed to parse PGN: ${err instanceof Error ? err.message : String(err)}`,
    });
    return;
  }

  const totalPlies = parsedPlies.length;
  const evaluations: PositionEvaluation[] = [];

  for (let i = 0; i < totalPlies; i++) {
    if (token !== currentTaskToken) return;

    const plyItem = parsedPlies[i];
    const res = await evaluateSinglePosition(plyItem.fen, {
      depth,
      multiPv: 2,
      maxNodes: 110000,
      limitStrength: false,
      taskToken: token,
    });

    if (token !== currentTaskToken || !res) return;

    evaluations.push(res.evaluation);
    const completed = i + 1;
    const percent = Math.round((completed / totalPlies) * 100);

    postOut({
      type: 'REVIEW_PROGRESS',
      requestId,
      completedPlies: completed,
      totalPlies,
      percent,
      currentPly: i,
      fen: plyItem.fen,
      from: plyItem.from,
      to: plyItem.to,
      cpWhite: res.evaluation.cpWhite,
      mateWhite: res.evaluation.mateWhite,
    });
  }

  if (token !== currentTaskToken) return;

  const report = buildGameReviewReport(game, parsedPlies, evaluations);
  postOut({
    type: 'REVIEW_COMPLETE',
    requestId,
    report,
  });
}

async function runLiveAnalysis(
  token: number,
  requestId: string,
  fen: string,
  depth = 18,
  multiPv = 3
) {
  const res = await evaluateSinglePosition(fen, {
    depth,
    multiPv,
    limitStrength: false,
    taskToken: token,
    onDepthUpdate: (evaluation) => {
      if (token === currentTaskToken) {
        postOut({
          type: 'ANALYSIS_UPDATE',
          requestId,
          evaluation,
        });
      }
    },
  });

  if (token === currentTaskToken && res) {
    postOut({
      type: 'ANALYSIS_UPDATE',
      requestId,
      evaluation: res.evaluation,
    });
  }
}

function mapEloToBotConfig(elo: number): {
  skillLevel: number;
  depth: number;
  limitStrength: boolean;
} {
  if (elo <= 400) return { skillLevel: 0, depth: 2, limitStrength: true };
  if (elo <= 800) return { skillLevel: 3, depth: 4, limitStrength: true };
  if (elo <= 1200) return { skillLevel: 7, depth: 6, limitStrength: true };
  if (elo <= 1600) return { skillLevel: 12, depth: 10, limitStrength: true };
  if (elo <= 2000) return { skillLevel: 16, depth: 13, limitStrength: true };
  return { skillLevel: 20, depth: 16, limitStrength: true };
}

async function runBotTurn(
  token: number,
  requestId: string,
  fen: string,
  elo: number,
  fenBeforeUserMove?: string,
  userMoveUci?: string
) {
  let userWinLoss: number | undefined;
  let userPlayedBest = false;
  let cpWhiteAfterUser: number | undefined;
  let mateWhiteAfterUser: number | null | undefined;

  if (fenBeforeUserMove && userMoveUci) {
    const beforeRes = await evaluateSinglePosition(fenBeforeUserMove, {
      depth: 10,
      multiPv: 2,
      maxNodes: 35000,
      limitStrength: false,
      taskToken: token,
    });
    if (token !== currentTaskToken) return;

    const afterRes = await evaluateSinglePosition(fen, {
      depth: 10,
      multiPv: 1,
      maxNodes: 35000,
      limitStrength: false,
      taskToken: token,
    });
    if (token !== currentTaskToken) return;

    if (beforeRes && afterRes) {
      const userTurn = new Chess(fenBeforeUserMove).turn();
      const winBefore =
        userTurn === 'w'
          ? beforeRes.evaluation.winPctWhite
          : 100 - beforeRes.evaluation.winPctWhite;
      const winAfter =
        userTurn === 'w'
          ? afterRes.evaluation.winPctWhite
          : 100 - afterRes.evaluation.winPctWhite;
      const bestUci = beforeRes.evaluation.lines[0]?.pvUci[0];
      userPlayedBest = Boolean(bestUci && bestUci === userMoveUci);
      userWinLoss = userPlayedBest ? 0 : Math.max(0, winBefore - winAfter);
      cpWhiteAfterUser = afterRes.evaluation.cpWhite;
      mateWhiteAfterUser = afterRes.evaluation.mateWhite;
    }
  }

  const cfg = mapEloToBotConfig(elo);
  const botRes = await evaluateSinglePosition(fen, {
    depth: cfg.depth,
    multiPv: elo <= 800 ? 3 : 1,
    limitStrength: cfg.limitStrength,
    elo,
    skillLevel: cfg.skillLevel,
    taskToken: token,
  });

  if (token !== currentTaskToken || !botRes) return;

  let chosenMove = botRes.bestMoveUci;
  if (elo <= 400 && botRes.evaluation.lines.length >= 2 && Math.random() < 0.45) {
    const altIdx = Math.min(
      botRes.evaluation.lines.length - 1,
      Math.random() < 0.6 ? 1 : 2
    );
    const altMove = botRes.evaluation.lines[altIdx]?.pvUci[0];
    if (altMove) chosenMove = altMove;
  }

  postOut({
    type: 'BOT_MOVE_RESULT',
    requestId,
    bestMoveUci: chosenMove,
    cpWhiteAfterUser,
    mateWhiteAfterUser,
    userWinLoss,
    userPlayedBest,
  });
}

self.onmessage = (event: MessageEvent<WorkerInboundMessage>) => {
  const msg = event.data;
  if (!msg) return;

  switch (msg.type) {
    case 'SF_PROXY_LINE':
      handleEngineLine(msg.line);
      break;
    case 'STOP':
      currentTaskToken++;
      if (engineBooted) sendUci('stop');
      break;
    case 'EVAL_SINGLE_PLY':
      enqueueExclusiveTask((token) =>
        runSinglePlyEval(
          token,
          msg.requestId,
          msg.ply,
          msg.fen,
          msg.depth,
          msg.multiPv,
          msg.maxNodes
        )
      );
      break;
    case 'REVIEW_GAME':
      enqueueExclusiveTask((token) =>
        runFullGameReview(token, msg.requestId, msg.game, msg.depth ?? 14)
      );
      break;
    case 'ANALYZE_POSITION':
      enqueueExclusiveTask((token) =>
        runLiveAnalysis(
          token,
          msg.requestId,
          msg.fen,
          msg.depth ?? 18,
          msg.multiPv ?? 3
        )
      );
      break;
    case 'PLAY_BOT_MOVE':
      enqueueExclusiveTask((token) =>
        runBotTurn(
          token,
          msg.requestId,
          msg.fen,
          msg.elo,
          msg.fenBeforeUserMove,
          msg.userMoveUci
        )
      );
      break;
  }
};

initStockfishEngine();
