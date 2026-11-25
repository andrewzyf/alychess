import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import {
  AlyMood,
  AppMode,
  BOARD_THEMES,
  BoardArrow,
  BoardThemeId,
  CLASSIFICATION_META,
  ChessComPlayerProfile,
  EngineLine,
  GameMetadata,
  GameReviewReport,
  PositionEvaluation,
} from './types/chess';
import { engineService, ReviewProgressPayload } from './services/engineService';
import {
  enrichGameWithProfiles,
  fetchChessComProfile,
  getAccurateRatingForTimeControl,
} from './services/profileService';
import {
  computeMaterial,
  formatCountdownMs,
  formatInitialClock,
  formatPgnClock,
  uciToMoveObj,
} from './utils/chessHelpers';
import { lookupOpeningByFen } from './utils/ecoBook';
import { DEFAULT_SAMPLE_GAME, SAMPLE_GAMES } from './utils/sampleGames';
import { soundManager, SoundType } from './utils/sound';
import { AnalysisNode, AnalysisPanel } from './components/AnalysisPanel';
import { ChessBoard } from './components/ChessBoard';
import { CcGlyphCogwheel, CcGlyphFlipBoard } from './components/ChessComIcons';
import { EvalBar } from './components/EvalBar';
import {
  EngineLinePreviewState,
  GameReviewPanel,
} from './components/GameReviewPanel';
import { HomePage } from './components/HomePage';
import { GamesTabPanel, ImportModal } from './components/ImportModal';
import { LocalPlayPanel, LocalTimeOption } from './components/LocalPlayPanel';
import { PlayerBanner } from './components/PlayerBanner';
import {
  AlyEloTier,
  ColorChoice,
  PlayAlyPanel,
  PlayTimeOption,
} from './components/PlayAlyPanel';
import { ProfilePage } from './components/ProfilePage';
import { Sidebar } from './components/Sidebar';

const START_FEN = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
const THEME_CYCLE: BoardThemeId[] = ['green', 'brown', 'icy', 'slate'];

function soundForMoveFlags(opts: {
  isCheckmate?: boolean;
  isCheck?: boolean;
  isCastle?: boolean;
  promotion?: string;
  captured?: string;
}): SoundType {
  if (opts.isCheckmate) return 'game-end';
  if (opts.isCheck) return 'check';
  if (opts.promotion) return 'promote';
  if (opts.isCastle) return 'castle';
  if (opts.captured) return 'capture';
  return 'move';
}

function pgnToAnalysisNodes(pgn: string): AnalysisNode[] {
  const chess = new Chess();
  try {
    chess.loadPgn(pgn);
  } catch {
    return [{ ply: 0, fen: START_FEN }];
  }
  const headers = chess.getHeaders();
  const startFen =
    headers.SetUp === '1' && headers.FEN ? headers.FEN : START_FEN;
  const replay = new Chess(startFen);
  const nodes: AnalysisNode[] = [{ ply: 0, fen: startFen }];
  chess.history({ verbose: true }).forEach((m, idx) => {
    replay.move(m);
    nodes.push({
      ply: idx + 1,
      fen: replay.fen(),
      san: m.san,
      uci: `${m.from}${m.to}${m.promotion || ''}`,
      from: m.from,
      to: m.to,
      color: m.color,
    });
  });
  return nodes;
}

export const App: React.FC = () => {
  // Default first page is the Chess.com-style Home & Add Game landing page!
  const [mode, setMode] = useState<AppMode>('home');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [rightGamesOpen, setRightGamesOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('IceChoker');
  const [activeUserProfile, setActiveUserProfile] =
    useState<ChessComPlayerProfile | null>(null);
  const [viewedProfileUser, setViewedProfileUser] = useState<string>('IceChoker');
  const [themeId, setThemeId] = useState<BoardThemeId>('green');
  const [uiLightMode, setUiLightMode] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(false);
  const [flipped, setFlipped] = useState<boolean>(false);
  const [importModalOpen, setImportModalOpen] = useState<boolean>(false);

  // Fetch accurate live Chess.com profile, avatar, flag & Elo for active username
  useEffect(() => {
    let cancelled = false;
    fetchChessComProfile(username).then((prof) => {
      if (!cancelled) {
        setActiveUserProfile(prof);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [username]);

  const openPlayerProfile = useCallback(
    (targetUser?: string) => {
      const target = (targetUser || username || 'IceChoker').trim();
      if (!target || target.toLowerCase().startsWith('coach aly') || target.toLowerCase().startsWith('aly (')) {
        return;
      }
      engineService.stop();
      setIsAutoPlaying(false);
      setRightGamesOpen(false);
      setViewedProfileUser(target);
      setMode('profile');
    },
    [username]
  );

  // Center Board Stage responsive sizing (re-attaches whenever entering board workspace from 'home')
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [boardSize, setBoardSize] = useState<number>(600);

  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const updateSize = () => {
      const rect = el.getBoundingClientRect();
      const maxW = rect.width - 72;
      // 16px top + 40px top player + 10px gap + 10px gap + 40px bottom player + 16px bottom = 132px
      const maxH = rect.height - 132;
      const raw = Math.max(200, Math.min(maxW, maxH));
      setBoardSize(Math.floor(raw / 8) * 8);
    };
    updateSize();
    const ro = new ResizeObserver(updateSize);
    ro.observe(el);
    return () => ro.disconnect();
  }, [mode, sidebarCollapsed]);

  // ==================== 1. GAME REVIEW STATE ====================
  const [activeGameMeta, setActiveGameMeta] = useState<GameMetadata>(DEFAULT_SAMPLE_GAME);
  const [reviewReport, setReviewReport] = useState<GameReviewReport | null>(null);
  const [isReviewing, setIsReviewing] = useState<boolean>(false);
  const [reviewProgress, setReviewProgress] = useState<ReviewProgressPayload | null>(null);
  const [reviewSubView, setReviewSubView] = useState<'summary' | 'moves'>('summary');
  const [reviewPly, setReviewPly] = useState<number>(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState<boolean>(false);
  const [enginePreview, setEnginePreview] = useState<EngineLinePreviewState | null>(null);

  // ==================== 2. SELF-ANALYSIS STATE ====================
  const [analysisNodes, setAnalysisNodes] = useState<AnalysisNode[]>(() =>
    pgnToAnalysisNodes(DEFAULT_SAMPLE_GAME.pgn)
  );
  const [analysisIdx, setAnalysisIdx] = useState<number>(0);
  const [analysisBranchNote, setAnalysisBranchNote] = useState<string | null>(null);
  const [analysisEval, setAnalysisEval] = useState<PositionEvaluation | null>(null);
  const [analysisEngineOn, setAnalysisEngineOn] = useState<boolean>(true);
  const [showThreatArrow, setShowThreatArrow] = useState<boolean>(false);
  const [hoveredEngineLine, setHoveredEngineLine] = useState<EngineLine | null>(null);

  const launchGameReview = useCallback((game: GameMetadata) => {
    setRightGamesOpen(false);
    setMode('review');
    setIsAutoPlaying(false);
    setEnginePreview(null);
    setActiveGameMeta(game);
    setAnalysisNodes(pgnToAnalysisNodes(game.pgn));
    setAnalysisIdx(0);
    setAnalysisBranchNote(null);
    setFlipped(game.perspective === 'b');
    setReviewSubView('summary');
    setReviewPly(0);
    setIsReviewing(true);
    setReviewProgress({
      completedPlies: 0,
      totalPlies: 1,
      percent: 2,
      currentPly: 0,
      fen: START_FEN,
      cpWhite: 20,
      mateWhite: null,
      workersActive: 4,
    });

    // Fetch real Chess.com avatars, flags & titles for both players in parallel with Stockfish!
    const profilePromise = enrichGameWithProfiles(game);
    profilePromise.then((enriched) => {
      setActiveGameMeta((cur) => (cur.id === game.id ? enriched : cur));
      setReviewReport((cur) =>
        cur && cur.game.id === game.id
          ? {
              ...cur,
              game: {
                ...cur.game,
                white: enriched.white,
                black: enriched.black,
              },
            }
          : cur
      );
    });

    engineService
      .reviewGame(
        game,
        (prog) => {
          setReviewProgress(prog);
        },
        15
      )
      .then(async (report) => {
        const enriched = await profilePromise.catch(() => game);
        const finalReport: GameReviewReport = {
          ...report,
          game: {
            ...report.game,
            white: { ...report.game.white, ...enriched.white },
            black: { ...report.game.black, ...enriched.black },
          },
        };
        setActiveGameMeta(finalReport.game);
        setReviewReport(finalReport);
        setIsReviewing(false);
        setReviewPly(finalReport.plies.length - 1);
      })
      .catch((err) => {
        console.error('Review failed:', err);
        setIsReviewing(false);
      });
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || mode !== 'review' || !reviewReport) return;
    if (reviewPly >= reviewReport.plies.length - 1) {
      setIsAutoPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      const next = reviewPly + 1;
      const plyObj = reviewReport.plies[next];
      if (plyObj) {
        soundManager.play(soundForMoveFlags(plyObj));
      }
      setEnginePreview(null);
      setReviewPly(next);
    }, 1050);
    return () => window.clearTimeout(timer);
  }, [isAutoPlaying, mode, reviewReport, reviewPly]);

  const handleSelectReviewPly = useCallback(
    (ply: number) => {
      if (!reviewReport) return;
      const clamped = Math.max(0, Math.min(reviewReport.plies.length - 1, ply));
      setEnginePreview(null);
      if (clamped === reviewPly + 1 && clamped > 0) {
        const p = reviewReport.plies[clamped];
        soundManager.play(soundForMoveFlags(p));
      } else if (clamped !== reviewPly) {
        soundManager.play('move');
      }
      setReviewPly(clamped);
    },
    [reviewReport, reviewPly]
  );

  const handleStartShowBest = () => {
    if (!reviewReport || reviewPly < 1) return;
    const cur = reviewReport.plies[reviewPly];
    const prev = reviewReport.plies[reviewPly - 1];
    if (!cur?.bestLineUci?.length || !prev) return;
    setIsAutoPlaying(false);
    setEnginePreview({
      mode: 'best',
      label: `Best Line (${cur.bestMoveSan})`,
      baseFen: prev.fen,
      uciMoves: cur.bestLineUci,
      sanMoves: cur.bestLineSan || [],
      stepIndex: 0,
    });
    soundManager.play('move');
  };

  const handleStartExplain = () => {
    if (!reviewReport) return;
    const cur = reviewReport.plies[reviewPly];
    if (!cur?.continuationUci?.length) return;
    setIsAutoPlaying(false);
    setEnginePreview({
      mode: 'explain',
      label: 'Continuation Line',
      baseFen: cur.fen,
      uciMoves: cur.continuationUci,
      sanMoves: cur.continuationSan || [],
      stepIndex: 0,
    });
    soundManager.play('move');
  };

  const handleStepEnginePreview = () => {
    setEnginePreview((prev) => {
      if (!prev || prev.stepIndex >= prev.uciMoves.length - 1) return prev;
      soundManager.play('move');
      return { ...prev, stepIndex: prev.stepIndex + 1 };
    });
  };

  const handleJumpNextKeyMove = () => {
    if (!reviewReport) return;
    setEnginePreview(null);
    for (let i = reviewPly + 1; i < reviewReport.plies.length; i++) {
      const cls = reviewReport.plies[i].classification;
      if (cls && CLASSIFICATION_META[cls].isKeyMove) {
        handleSelectReviewPly(i);
        return;
      }
    }
    for (let i = 1; i <= reviewPly; i++) {
      const cls = reviewReport.plies[i].classification;
      if (cls && CLASSIFICATION_META[cls].isKeyMove) {
        handleSelectReviewPly(i);
        return;
      }
    }
  };

  // Run Stockfish live MultiPV 3 when in Self-Analysis mode
  useEffect(() => {
    if (mode !== 'analysis' || rightGamesOpen || !analysisEngineOn) {
      return;
    }
    const currentFen = analysisNodes[analysisIdx]?.fen || START_FEN;
    const cancel = engineService.analyzePosition(
      currentFen,
      (ev) => {
        setAnalysisEval(ev);
      },
      18,
      3
    );
    return () => {
      cancel();
    };
  }, [mode, rightGamesOpen, analysisEngineOn, analysisNodes, analysisIdx]);

  const handleAnalysisMove = useCallback(
    (move: { from: string; to: string; promotion?: string }): boolean => {
      const baseNode = analysisNodes[analysisIdx];
      if (!baseNode) return false;
      const chess = new Chess(baseNode.fen);
      let res;
      try {
        res = chess.move(move);
      } catch {
        return false;
      }
      if (!res) return false;

      soundManager.play(
        soundForMoveFlags({
          isCheckmate: chess.isCheckmate(),
          isCheck: chess.inCheck(),
          isCastle: res.san === 'O-O' || res.san === 'O-O-O',
          promotion: res.promotion,
          captured: res.captured,
        })
      );

      const newPly = baseNode.ply + 1;
      const uci = `${res.from}${res.to}${res.promotion || ''}`;
      const existingNext = analysisNodes[analysisIdx + 1];

      if (existingNext && existingNext.uci === uci) {
        setAnalysisIdx(analysisIdx + 1);
        return true;
      }

      const branched = analysisIdx < analysisNodes.length - 1;
      const updated = [
        ...analysisNodes.slice(0, analysisIdx + 1),
        {
          ply: newPly,
          fen: chess.fen(),
          san: res.san,
          uci,
          from: res.from,
          to: res.to,
          color: res.color,
        },
      ];
      setAnalysisNodes(updated);
      setAnalysisIdx(updated.length - 1);
      if (branched) {
        setAnalysisBranchNote(`Variation`);
      }
      return true;
    },
    [analysisNodes, analysisIdx]
  );

  const buildPgnFromNodes = (
    nodes: AnalysisNode[],
    whiteUser: string,
    blackUser: string
  ): GameMetadata => {
    const startFen = nodes[0]?.fen || START_FEN;
    const chess = new Chess(startFen);
    for (let i = 1; i < nodes.length; i++) {
      if (nodes[i].san) {
        chess.move(nodes[i].san!);
      }
    }
    let result: GameMetadata['result'] = '*';
    if (chess.isCheckmate()) {
      result = chess.turn() === 'w' ? '0-1' : '1-0';
    } else if (chess.isDraw()) {
      result = '1/2-1/2';
    }
    chess.setHeader('White', whiteUser);
    chess.setHeader('Black', blackUser);
    chess.setHeader('WhiteElo', String(activeGameMeta.white.rating || 1200));
    chess.setHeader('BlackElo', String(activeGameMeta.black.rating || 1200));
    chess.setHeader('Result', result);

    return {
      id: `analysis-${Date.now()}`,
      white: { username: whiteUser, rating: activeGameMeta.white.rating || 1200 },
      black: { username: blackUser, rating: activeGameMeta.black.rating || 1200 },
      result,
      timeControl: activeGameMeta.timeControl || '600',
      pgn: chess.pgn(),
      perspective: flipped ? 'b' : 'w',
    };
  };

  // ==================== 3. PLAY VS ALY STATE ====================
  const [alyElo, setAlyElo] = useState<AlyEloTier>(1200);
  const [alyColorChoice, setAlyColorChoice] = useState<ColorChoice>('w');
  const [alyTimeOption, setAlyTimeOption] = useState<PlayTimeOption>('300');
  const [alyUserColor, setAlyUserColor] = useState<'w' | 'b'>('w');
  const [alyMatchActive, setAlyMatchActive] = useState<boolean>(false);
  const [alyThinking, setAlyThinking] = useState<boolean>(false);
  const [alyFen, setAlyFen] = useState<string>(START_FEN);
  const [alyLastMove, setAlyLastMove] = useState<{ from: string; to: string } | null>(null);
  const [alySanHistory, setAlySanHistory] = useState<string[]>([]);
  const [alyHintArrow, setAlyHintArrow] = useState<BoardArrow | null>(null);
  const [alyEvalCpWhite, setAlyEvalCpWhite] = useState<number>(0);
  const [alyEvalMateWhite, setAlyEvalMateWhite] = useState<number | null>(null);
  const [alyWhiteMs, setAlyWhiteMs] = useState<number>(300_000);
  const [alyBlackMs, setAlyBlackMs] = useState<number>(300_000);
  const [alyGameOver, setAlyGameOver] = useState<{
    title: string;
    subtitle: string;
    result: GameMetadata['result'];
  } | null>(null);
  const [alySpeech, setAlySpeech] = useState<{
    title: string;
    body: string;
    mood: AlyMood;
  }>({
    title: 'Ready when you are!',
    body: 'Pick my Elo tier, choose your color, and let’s play a training game.',
    mood: 'happy',
  });

  const alyChessRef = useRef<Chess>(new Chess());

  const finalizeAlyMatch = useCallback(
    (title: string, subtitle: string, result: GameMetadata['result'], mood: AlyMood) => {
      setAlyMatchActive(false);
      setAlyThinking(false);
      setAlyGameOver({ title, subtitle, result });
      setAlySpeech({
        title,
        body: `${subtitle} Click "Game Review" below for full CAPS2 move analysis!`,
        mood,
      });
      soundManager.play('game-end');
    },
    []
  );

  const triggerAlyBotTurn = useCallback(
    (fenBeforeUserMove?: string, userMoveUci?: string) => {
      const currentFen = alyChessRef.current.fen();
      setAlyThinking(true);
      engineService
        .requestBotMove({
          fen: currentFen,
          elo: alyElo,
          fenBeforeUserMove,
          userMoveUci,
        })
        .then((res) => {
          setAlyThinking(false);
          if (res.cpWhiteAfterUser !== undefined) {
            setAlyEvalCpWhite(res.cpWhiteAfterUser);
            setAlyEvalMateWhite(res.mateWhiteAfterUser ?? null);
          }

          const book = lookupOpeningByFen(currentFen);
          if (res.userWinLoss !== undefined) {
            if (res.userWinLoss > 20) {
              setAlySpeech({
                title: 'Careful—tactical slip!',
                body: 'That move gave away significant ground. Watch how I respond!',
                mood: 'shocked',
              });
            } else if (res.userWinLoss > 9) {
              setAlySpeech({
                title: 'Slight inaccuracy',
                body: 'There was a tighter square available, though plenty of fight remains!',
                mood: 'thinking',
              });
            } else if (book && alyChessRef.current.history().length <= 10) {
              setAlySpeech({
                title: `${book.name}`,
                body: `Solid opening theory (${book.eco})—keeping your pieces coordinated!`,
                mood: 'book',
              });
            } else if (res.userPlayedBest) {
              setAlySpeech({
                title: 'Top engine move!',
                body: 'Spot on! You found the sharpest move in the position.',
                mood: 'excited',
              });
            } else {
              setAlySpeech({
                title: 'Good practical move',
                body: 'Clean positional play—let’s see how you handle my reply.',
                mood: 'happy',
              });
            }
          }

          const parsed = uciToMoveObj(res.bestMoveUci);
          if (!parsed) return;

          const moveObj = alyChessRef.current.move(parsed);
          if (!moveObj) return;

          setAlyFen(alyChessRef.current.fen());
          setAlyLastMove({ from: moveObj.from, to: moveObj.to });
          setAlySanHistory(alyChessRef.current.history());

          soundManager.play(
            soundForMoveFlags({
              isCheckmate: alyChessRef.current.isCheckmate(),
              isCheck: alyChessRef.current.inCheck(),
              isCastle: moveObj.san === 'O-O' || moveObj.san === 'O-O-O',
              promotion: moveObj.promotion,
              captured: moveObj.captured,
            })
          );

          if (alyChessRef.current.isCheckmate()) {
            finalizeAlyMatch(
              'Aly Won by Checkmate',
              `Good effort against Aly (${alyElo} Elo)!`,
              alyUserColor === 'w' ? '0-1' : '1-0',
              'thinking'
            );
          } else if (alyChessRef.current.isDraw()) {
            finalizeAlyMatch(
              'Game Drawn',
              'Balanced battle from start to finish!',
              '1/2-1/2',
              'happy'
            );
          }
        })
        .catch(() => {
          setAlyThinking(false);
        });
    },
    [alyElo, alyUserColor, finalizeAlyMatch]
  );

  const handleStartAlyMatch = () => {
    const chosenColor: 'w' | 'b' =
      alyColorChoice === 'random'
        ? Math.random() < 0.5
          ? 'w'
          : 'b'
        : alyColorChoice;

    alyChessRef.current = new Chess();
    setAlyUserColor(chosenColor);
    setFlipped(chosenColor === 'b');
    setAlyFen(START_FEN);
    setAlyLastMove(null);
    setAlySanHistory([]);
    setAlyHintArrow(null);
    setAlyEvalCpWhite(20);
    setAlyEvalMateWhite(null);
    setAlyGameOver(null);

    const baseMs =
      alyTimeOption === 'unlimited' ? 0 : parseInt(alyTimeOption, 10) * 1000;
    setAlyWhiteMs(baseMs);
    setAlyBlackMs(baseMs);
    setAlyMatchActive(true);
    setAlySpeech({
      title: `Match Started (${alyElo} Elo)`,
      body:
        chosenColor === 'w'
          ? 'You have the White pieces—claim the center!'
          : 'You have Black—let me kick things off!',
      mood: 'happy',
    });
    soundManager.play('game-start');

    if (chosenColor === 'b') {
      triggerAlyBotTurn();
    }
  };

  useEffect(() => {
    if (mode !== 'play-aly' || !alyMatchActive || alyTimeOption === 'unlimited') {
      return;
    }
    const interval = window.setInterval(() => {
      const turn = alyChessRef.current.turn();
      if (turn === 'w') {
        setAlyWhiteMs((prev) => {
          if (prev <= 100) {
            finalizeAlyMatch(
              alyUserColor === 'w' ? 'Out of Time' : 'You Won on Time!',
              alyUserColor === 'w'
                ? 'Your clock flagged before checkmate.'
                : 'Aly ran out of time.',
              '0-1',
              alyUserColor === 'w' ? 'concerned' : 'excited'
            );
            return 0;
          }
          return prev - 100;
        });
      } else {
        setAlyBlackMs((prev) => {
          if (prev <= 100) {
            finalizeAlyMatch(
              alyUserColor === 'b' ? 'Out of Time' : 'You Won on Time!',
              alyUserColor === 'b'
                ? 'Your clock flagged before checkmate.'
                : 'Aly ran out of time.',
              '1-0',
              alyUserColor === 'b' ? 'concerned' : 'excited'
            );
            return 0;
          }
          return prev - 100;
        });
      }
    }, 100);
    return () => window.clearInterval(interval);
  }, [mode, alyMatchActive, alyTimeOption, alyUserColor, finalizeAlyMatch]);

  const handlePlayAlyUserMove = (move: {
    from: string;
    to: string;
    promotion?: string;
  }): boolean => {
    if (!alyMatchActive || alyThinking) return false;
    if (alyChessRef.current.turn() !== alyUserColor) return false;

    const fenBefore = alyChessRef.current.fen();
    let res;
    try {
      res = alyChessRef.current.move(move);
    } catch {
      return false;
    }
    if (!res) return false;

    setAlyHintArrow(null);
    setAlyFen(alyChessRef.current.fen());
    setAlyLastMove({ from: res.from, to: res.to });
    setAlySanHistory(alyChessRef.current.history());

    soundManager.play(
      soundForMoveFlags({
        isCheckmate: alyChessRef.current.isCheckmate(),
        isCheck: alyChessRef.current.inCheck(),
        isCastle: res.san === 'O-O' || res.san === 'O-O-O',
        promotion: res.promotion,
        captured: res.captured,
      })
    );

    if (alyChessRef.current.isCheckmate()) {
      finalizeAlyMatch(
        'You Won by Checkmate!',
        `Awesome victory over Aly (${alyElo} Elo)!`,
        alyUserColor === 'w' ? '1-0' : '0-1',
        'excited'
      );
      return true;
    }
    if (alyChessRef.current.isDraw()) {
      finalizeAlyMatch(
        'Game Drawn',
        'Solid draw against Coach Aly!',
        '1/2-1/2',
        'happy'
      );
      return true;
    }

    const uci = `${res.from}${res.to}${res.promotion || ''}`;
    triggerAlyBotTurn(fenBefore, uci);
    return true;
  };

  const handleRequestAlyHint = () => {
    if (!alyMatchActive || alyThinking) return;
    const cancel = engineService.analyzePosition(
      alyChessRef.current.fen(),
      (ev) => {
        const top = ev.lines[0]?.pvUci[0];
        const san = ev.lines[0]?.pvSan[0];
        if (top && ev.depth >= 8) {
          const parsed = uciToMoveObj(top);
          if (parsed) {
            setAlyHintArrow({
              from: parsed.from,
              to: parsed.to,
              color: '#81b64c',
              opacity: 0.9,
            });
            setAlySpeech({
              title: `Hint: Consider ${san}`,
              body: `Take a look at ${san}—it fights for maximum activity here!`,
              mood: 'happy',
            });
          }
          cancel();
        }
      },
      10,
      1
    );
  };

  const handleAlyTakeback = () => {
    if (!alyMatchActive || alyThinking || alyChessRef.current.history().length < 2) {
      return;
    }
    alyChessRef.current.undo();
    alyChessRef.current.undo();
    setAlyFen(alyChessRef.current.fen());
    setAlySanHistory(alyChessRef.current.history());
    setAlyLastMove(null);
    setAlyHintArrow(null);
    soundManager.play('move');
  };

  const handleReviewAlyFinishedGame = () => {
    const userAccurateElo = getAccurateRatingForTimeControl(
      activeUserProfile,
      alyTimeOption
    );
    const whiteIsUser = alyUserColor === 'w';
    const whitePlayer = whiteIsUser
      ? {
          username: activeUserProfile?.displayUsername || username,
          rating: userAccurateElo,
          avatarUrl: activeUserProfile?.avatar,
          country: activeUserProfile?.countryCode,
          title: activeUserProfile?.title,
        }
      : { username: `Aly (${alyElo})`, rating: alyElo, isBot: true };
    const blackPlayer = !whiteIsUser
      ? {
          username: activeUserProfile?.displayUsername || username,
          rating: userAccurateElo,
          avatarUrl: activeUserProfile?.avatar,
          country: activeUserProfile?.countryCode,
          title: activeUserProfile?.title,
        }
      : { username: `Aly (${alyElo})`, rating: alyElo, isBot: true };
    const res = alyGameOver?.result || '*';
    alyChessRef.current.setHeader('White', whitePlayer.username);
    alyChessRef.current.setHeader('Black', blackPlayer.username);
    alyChessRef.current.setHeader('WhiteElo', String(whitePlayer.rating));
    alyChessRef.current.setHeader('BlackElo', String(blackPlayer.rating));
    alyChessRef.current.setHeader('Result', res);

    launchGameReview({
      id: `aly-match-${Date.now()}`,
      white: whitePlayer,
      black: blackPlayer,
      result: res,
      timeControl: alyTimeOption === 'unlimited' ? '600' : alyTimeOption,
      pgn: alyChessRef.current.pgn(),
      perspective: alyUserColor,
    });
  };

  // ==================== 4. LOCAL 2-PLAYER STATE ====================
  const localChessRef = useRef<Chess>(new Chess());
  const [localWhiteName, setLocalWhiteName] = useState<string>('IceChoker');
  const [localBlackName, setLocalBlackName] = useState<string>('Player 2');
  const [localTimeOption, setLocalTimeOption] = useState<LocalTimeOption>('180');
  const [localAutoFlip, setLocalAutoFlip] = useState<boolean>(false);
  const [localFen, setLocalFen] = useState<string>(START_FEN);
  const [localLastMove, setLocalLastMove] = useState<{ from: string; to: string } | null>(null);
  const [localSanHistory, setLocalSanHistory] = useState<string[]>([]);
  const [localStarted, setLocalStarted] = useState<boolean>(false);
  const [localPaused, setLocalPaused] = useState<boolean>(false);
  const [localWhiteMs, setLocalWhiteMs] = useState<number>(180_000);
  const [localBlackMs, setLocalBlackMs] = useState<number>(180_000);
  const [localGameOver, setLocalGameOver] = useState<{
    title: string;
    subtitle: string;
    result: GameMetadata['result'];
  } | null>(null);

  const resetLocalGame = useCallback(
    (newTimeOpt: LocalTimeOption = localTimeOption) => {
      localChessRef.current = new Chess();
      setLocalFen(START_FEN);
      setLocalLastMove(null);
      setLocalSanHistory([]);
      setLocalStarted(false);
      setLocalPaused(false);
      setLocalGameOver(null);
      const ms = newTimeOpt === 'unlimited' ? 0 : parseInt(newTimeOpt, 10) * 1000;
      setLocalWhiteMs(ms);
      setLocalBlackMs(ms);
      setFlipped(false);
    },
    [localTimeOption]
  );

  useEffect(() => {
    if (
      mode !== 'local-2p' ||
      !localStarted ||
      localPaused ||
      localGameOver ||
      localTimeOption === 'unlimited'
    ) {
      return;
    }
    const timer = window.setInterval(() => {
      const turn = localChessRef.current.turn();
      if (turn === 'w') {
        setLocalWhiteMs((prev) => {
          if (prev <= 100) {
            setLocalGameOver({
              title: `${localBlackName} Won on Time!`,
              subtitle: `${localWhiteName}'s clock expired.`,
              result: '0-1',
            });
            soundManager.play('game-end');
            return 0;
          }
          return prev - 100;
        });
      } else {
        setLocalBlackMs((prev) => {
          if (prev <= 100) {
            setLocalGameOver({
              title: `${localWhiteName} Won on Time!`,
              subtitle: `${localBlackName}'s clock expired.`,
              result: '1-0',
            });
            soundManager.play('game-end');
            return 0;
          }
          return prev - 100;
        });
      }
    }, 100);
    return () => window.clearInterval(timer);
  }, [
    mode,
    localStarted,
    localPaused,
    localGameOver,
    localTimeOption,
    localWhiteName,
    localBlackName,
  ]);

  const handleLocalMove = (move: {
    from: string;
    to: string;
    promotion?: string;
  }): boolean => {
    if (localGameOver) return false;
    let res;
    try {
      res = localChessRef.current.move(move);
    } catch {
      return false;
    }
    if (!res) return false;

    if (!localStarted) setLocalStarted(true);
    setLocalFen(localChessRef.current.fen());
    setLocalLastMove({ from: res.from, to: res.to });
    setLocalSanHistory(localChessRef.current.history());

    soundManager.play(
      soundForMoveFlags({
        isCheckmate: localChessRef.current.isCheckmate(),
        isCheck: localChessRef.current.inCheck(),
        isCastle: res.san === 'O-O' || res.san === 'O-O-O',
        promotion: res.promotion,
        captured: res.captured,
      })
    );

    if (localChessRef.current.isCheckmate()) {
      const winner = res.color === 'w' ? localWhiteName : localBlackName;
      setLocalGameOver({
        title: `${winner} Won by Checkmate!`,
        subtitle: 'Decisive finish over the board.',
        result: res.color === 'w' ? '1-0' : '0-1',
      });
    } else if (localChessRef.current.isDraw()) {
      setLocalGameOver({
        title: 'Game Drawn',
        subtitle: 'Stalemate, repetition, or insufficient material.',
        result: '1/2-1/2',
      });
    } else if (localAutoFlip) {
      setFlipped(localChessRef.current.turn() === 'b');
    }

    return true;
  };

  const handleReviewLocalGame = () => {
    const res = localGameOver?.result || '*';
    const whiteElo =
      localWhiteName.trim().toLowerCase() === username.trim().toLowerCase()
        ? getAccurateRatingForTimeControl(activeUserProfile, localTimeOption)
        : 1000;
    localChessRef.current.setHeader('White', localWhiteName || 'White');
    localChessRef.current.setHeader('Black', localBlackName || 'Black');
    localChessRef.current.setHeader('WhiteElo', String(whiteElo));
    localChessRef.current.setHeader('BlackElo', '1000');
    localChessRef.current.setHeader('Result', res);

    launchGameReview({
      id: `local-${Date.now()}`,
      white: {
        username: localWhiteName || 'White',
        rating: whiteElo,
        avatarUrl:
          localWhiteName.trim().toLowerCase() === username.trim().toLowerCase()
            ? activeUserProfile?.avatar
            : undefined,
        country:
          localWhiteName.trim().toLowerCase() === username.trim().toLowerCase()
            ? activeUserProfile?.countryCode
            : undefined,
      },
      black: { username: localBlackName || 'Black', rating: 1000 },
      result: res,
      timeControl: localTimeOption === 'unlimited' ? '600' : localTimeOption,
      pgn: localChessRef.current.pgn(),
      perspective: 'w',
    });
  };

  // ==================== KEYBOARD NAVIGATION ====================
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (mode === 'review' && reviewReport && !rightGamesOpen) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setIsAutoPlaying(false);
          handleSelectReviewPly(reviewPly - 1);
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setIsAutoPlaying(false);
          handleSelectReviewPly(reviewPly + 1);
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setIsAutoPlaying(false);
          handleSelectReviewPly(0);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setIsAutoPlaying(false);
          handleSelectReviewPly(reviewReport.plies.length - 1);
        }
      } else if (mode === 'analysis' && !rightGamesOpen) {
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          setAnalysisIdx((i) => Math.max(0, i - 1));
        } else if (e.key === 'ArrowRight') {
          e.preventDefault();
          setAnalysisIdx((i) => Math.min(analysisNodes.length - 1, i + 1));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setAnalysisIdx(0);
        } else if (e.key === 'ArrowDown') {
          e.preventDefault();
          setAnalysisIdx(analysisNodes.length - 1);
        }
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [
    mode,
    rightGamesOpen,
    reviewReport,
    reviewPly,
    handleSelectReviewPly,
    analysisNodes.length,
  ]);

  // ==================== UNIFIED BOARD PROPS ====================
  const boardView = useMemo(() => {
    if (mode === 'review') {
      if (enginePreview) {
        const sim = new Chess(enginePreview.baseFen);
        let last: { from: string; to: string } | null = null;
        for (let i = 0; i <= enginePreview.stepIndex; i++) {
          const parsed = uciToMoveObj(enginePreview.uciMoves[i]);
          if (!parsed) break;
          const m = sim.move(parsed);
          if (m) last = { from: m.from, to: m.to };
        }
        const arrows: BoardArrow[] = [];
        const nextUci = enginePreview.uciMoves[enginePreview.stepIndex + 1];
        if (nextUci) {
          const np = uciToMoveObj(nextUci);
          if (np) {
            arrows.push({
              from: np.from,
              to: np.to,
              color:
                enginePreview.mode === 'explain' && enginePreview.stepIndex % 2 === 0
                  ? '#e58f2a'
                  : '#81b64c',
            });
          }
        }
        const curPly = reviewReport?.plies[reviewPly];
        return {
          fen: sim.fen(),
          interactive: false,
          allowedTurn: 'both' as const,
          lastMove: last,
          destinationBadge: null,
          arrows,
          cpWhite: curPly?.cpWhite ?? 0,
          mateWhite: curPly?.mateWhite ?? null,
        };
      }

      if (isReviewing && reviewProgress) {
        return {
          fen: reviewProgress.fen || START_FEN,
          interactive: false,
          allowedTurn: 'both' as const,
          lastMove:
            reviewProgress.from && reviewProgress.to
              ? { from: reviewProgress.from, to: reviewProgress.to }
              : null,
          destinationBadge: null,
          arrows: [] as BoardArrow[],
          cpWhite: reviewProgress.cpWhite,
          mateWhite: reviewProgress.mateWhite,
        };
      }

      const plyObj = reviewReport?.plies[reviewPly];
      const arrows: BoardArrow[] = [];
      if (plyObj && reviewSubView === 'moves') {
        if (
          plyObj.bestMoveUci &&
          plyObj.bestMoveUci !== plyObj.uci &&
          plyObj.classification &&
          ['inaccuracy', 'mistake', 'miss', 'blunder'].includes(plyObj.classification)
        ) {
          const bp = uciToMoveObj(plyObj.bestMoveUci);
          if (bp) {
            arrows.push({ from: bp.from, to: bp.to, color: '#81b64c', opacity: 0.85 });
          }
        }
      }

      return {
        fen: plyObj?.fen || START_FEN,
        interactive: !isReviewing,
        allowedTurn: 'both' as const,
        lastMove:
          plyObj?.from && plyObj?.to ? { from: plyObj.from, to: plyObj.to } : null,
        destinationBadge:
          reviewSubView === 'moves' && plyObj?.to && plyObj?.classification
            ? { square: plyObj.to, classification: plyObj.classification }
            : null,
        arrows,
        cpWhite: plyObj?.cpWhite ?? 0,
        mateWhite: plyObj?.mateWhite ?? null,
      };
    }

    if (mode === 'analysis') {
      const node = analysisNodes[analysisIdx] || analysisNodes[0];
      const arrows: BoardArrow[] = [];

      if (analysisEngineOn) {
        const targetLine = hoveredEngineLine || analysisEval?.lines[0];
        if (targetLine?.pvUci[0]) {
          const p1 = uciToMoveObj(targetLine.pvUci[0]);
          if (p1) {
            arrows.push({ from: p1.from, to: p1.to, color: '#81b64c', opacity: 0.86 });
          }
        }
        if (showThreatArrow && analysisEval?.lines[0]?.pvUci[1]) {
          const threat = uciToMoveObj(analysisEval.lines[0].pvUci[1]);
          if (threat) {
            arrows.push({
              from: threat.from,
              to: threat.to,
              color: '#e58f2a',
              opacity: 0.82,
            });
          }
        }
      }

      return {
        fen: node.fen,
        interactive: true,
        allowedTurn: 'both' as const,
        lastMove: node.from && node.to ? { from: node.from, to: node.to } : null,
        destinationBadge: null,
        arrows,
        cpWhite: analysisEngineOn ? analysisEval?.cpWhite ?? 0 : 0,
        mateWhite: analysisEngineOn ? analysisEval?.mateWhite ?? null : null,
      };
    }

    if (mode === 'play-aly') {
      return {
        fen: alyFen,
        interactive: alyMatchActive && !alyThinking,
        allowedTurn: alyUserColor,
        lastMove: alyLastMove,
        destinationBadge: null,
        arrows: alyHintArrow ? [alyHintArrow] : [],
        cpWhite: alyEvalCpWhite,
        mateWhite: alyEvalMateWhite,
      };
    }

    return {
      fen: localFen,
      interactive: !localGameOver && !localPaused,
      allowedTurn: 'both' as const,
      lastMove: localLastMove,
      destinationBadge: null,
      arrows: [] as BoardArrow[],
      cpWhite: 0,
      mateWhite: null,
    };
  }, [
    mode,
    enginePreview,
    isReviewing,
    reviewProgress,
    reviewReport,
    reviewPly,
    reviewSubView,
    analysisNodes,
    analysisIdx,
    analysisEngineOn,
    hoveredEngineLine,
    analysisEval,
    showThreatArrow,
    alyFen,
    alyMatchActive,
    alyThinking,
    alyUserColor,
    alyLastMove,
    alyHintArrow,
    alyEvalCpWhite,
    alyEvalMateWhite,
    localFen,
    localGameOver,
    localPaused,
    localLastMove,
  ]);

  const handleBoardMove = (move: {
    from: string;
    to: string;
    promotion?: string;
  }): boolean => {
    if (mode === 'review' && reviewReport) {
      const baseNodes: AnalysisNode[] = reviewReport.plies
        .slice(0, reviewPly + 1)
        .map((p) => ({
          ply: p.ply,
          fen: p.fen,
          san: p.san,
          uci: p.uci,
          from: p.from,
          to: p.to,
          color: p.color,
        }));
      const lastNode = baseNodes[baseNodes.length - 1];
      const chess = new Chess(lastNode.fen);
      let res;
      try {
        res = chess.move(move);
      } catch {
        return false;
      }
      if (!res) return false;

      soundManager.play(
        soundForMoveFlags({
          isCheckmate: chess.isCheckmate(),
          isCheck: chess.inCheck(),
          isCastle: res.san === 'O-O' || res.san === 'O-O-O',
          promotion: res.promotion,
          captured: res.captured,
        })
      );

      const branchedNodes: AnalysisNode[] = [
        ...baseNodes,
        {
          ply: lastNode.ply + 1,
          fen: chess.fen(),
          san: res.san,
          uci: `${res.from}${res.to}${res.promotion || ''}`,
          from: res.from,
          to: res.to,
          color: res.color,
        },
      ];
      setAnalysisNodes(branchedNodes);
      setAnalysisIdx(branchedNodes.length - 1);
      setAnalysisBranchNote(`Variation`);
      setRightGamesOpen(false);
      setMode('analysis');
      return true;
    }

    if (mode === 'analysis') return handleAnalysisMove(move);
    if (mode === 'play-aly') return handlePlayAlyUserMove(move);
    if (mode === 'local-2p') return handleLocalMove(move);
    return false;
  };

  const material = useMemo(() => computeMaterial(boardView.fen), [boardView.fen]);

  const playerDisplays = useMemo(() => {
    const alyUserElo = getAccurateRatingForTimeControl(
      activeUserProfile,
      alyTimeOption
    );
    const localWhiteElo =
      localWhiteName.trim().toLowerCase() === username.trim().toLowerCase()
        ? getAccurateRatingForTimeControl(activeUserProfile, localTimeOption)
        : 1000;

    let whiteMeta: {
      username: string;
      rating: number;
      country?: string;
      avatarUrl?: string;
      title?: string;
      isAly: boolean;
      clock: string;
      active: boolean;
    } = {
      username: activeGameMeta.white.username,
      rating: activeGameMeta.white.rating,
      country: activeGameMeta.white.country,
      avatarUrl: activeGameMeta.white.avatarUrl,
      title: activeGameMeta.white.title,
      isAly: Boolean(activeGameMeta.white.isBot),
      clock: formatInitialClock(activeGameMeta.timeControl),
      active: false,
    };
    let blackMeta: {
      username: string;
      rating: number;
      country?: string;
      avatarUrl?: string;
      title?: string;
      isAly: boolean;
      clock: string;
      active: boolean;
    } = {
      username: activeGameMeta.black.username,
      rating: activeGameMeta.black.rating,
      country: activeGameMeta.black.country,
      avatarUrl: activeGameMeta.black.avatarUrl,
      title: activeGameMeta.black.title,
      isAly: Boolean(activeGameMeta.black.isBot),
      clock: formatInitialClock(activeGameMeta.timeControl),
      active: false,
    };

    if (mode === 'review' && reviewReport) {
      const initClk = formatInitialClock(reviewReport.game.timeControl);
      let wClk = initClk;
      let bClk = initClk;
      for (let i = 1; i <= reviewPly; i++) {
        const p = reviewReport.plies[i];
        if (p?.clock) {
          if (p.color === 'w') wClk = formatPgnClock(p.clock, initClk);
          else bClk = formatPgnClock(p.clock, initClk);
        }
      }
      const nextTurn = reviewReport.plies[reviewPly]?.fen.split(' ')[1] || 'w';
      whiteMeta = {
        username: reviewReport.game.white.username,
        rating: reviewReport.game.white.rating,
        country: reviewReport.game.white.country,
        avatarUrl: reviewReport.game.white.avatarUrl,
        title: reviewReport.game.white.title,
        isAly: Boolean(reviewReport.game.white.isBot),
        clock: wClk,
        active: nextTurn === 'w',
      };
      blackMeta = {
        username: reviewReport.game.black.username,
        rating: reviewReport.game.black.rating,
        country: reviewReport.game.black.country,
        avatarUrl: reviewReport.game.black.avatarUrl,
        title: reviewReport.game.black.title,
        isAly: Boolean(reviewReport.game.black.isBot),
        clock: bClk,
        active: nextTurn === 'b',
      };
    } else if (mode === 'analysis') {
      whiteMeta = {
        username: activeGameMeta.white.username || activeUserProfile?.displayUsername || username,
        rating: activeGameMeta.white.rating || getAccurateRatingForTimeControl(activeUserProfile, '600'),
        country: activeGameMeta.white.country,
        avatarUrl: activeGameMeta.white.avatarUrl,
        title: activeGameMeta.white.title,
        isAly: false,
        clock: '--:--',
        active: false,
      };
      blackMeta = {
        username: activeGameMeta.black.username || 'Player2',
        rating: activeGameMeta.black.rating,
        country: activeGameMeta.black.country,
        avatarUrl: activeGameMeta.black.avatarUrl,
        title: activeGameMeta.black.title,
        isAly: false,
        clock: '--:--',
        active: false,
      };
    } else if (mode === 'play-aly') {
      const turn = alyFen.split(' ')[1] || 'w';
      const wClock =
        alyTimeOption === 'unlimited' ? '∞' : formatCountdownMs(alyWhiteMs);
      const bClock =
        alyTimeOption === 'unlimited' ? '∞' : formatCountdownMs(alyBlackMs);
      const userBanner = {
        username: activeUserProfile?.displayUsername || username,
        rating: alyUserElo,
        country: activeUserProfile?.countryCode,
        avatarUrl: activeUserProfile?.avatar,
        title: activeUserProfile?.title,
        isAly: false,
      };
      const botBanner = {
        username: 'Coach Aly',
        rating: alyElo,
        country: undefined,
        avatarUrl: undefined,
        title: undefined,
        isAly: true,
      };
      if (alyUserColor === 'w') {
        whiteMeta = { ...userBanner, clock: wClock, active: alyMatchActive && turn === 'w' };
        blackMeta = { ...botBanner, clock: bClock, active: alyMatchActive && turn === 'b' };
      } else {
        whiteMeta = { ...botBanner, clock: wClock, active: alyMatchActive && turn === 'w' };
        blackMeta = { ...userBanner, clock: bClock, active: alyMatchActive && turn === 'b' };
      }
    } else if (mode === 'local-2p') {
      const turn = localFen.split(' ')[1] || 'w';
      const whiteIsActiveUser =
        localWhiteName.trim().toLowerCase() === username.trim().toLowerCase();
      whiteMeta = {
        username: localWhiteName || 'White',
        rating: localWhiteElo,
        country: whiteIsActiveUser ? activeUserProfile?.countryCode : undefined,
        avatarUrl: whiteIsActiveUser ? activeUserProfile?.avatar : undefined,
        title: whiteIsActiveUser ? activeUserProfile?.title : undefined,
        isAly: false,
        clock:
          localTimeOption === 'unlimited' ? '∞' : formatCountdownMs(localWhiteMs),
        active: localStarted && !localGameOver && turn === 'w',
      };
      blackMeta = {
        username: localBlackName || 'Black',
        rating: 1000,
        country: undefined,
        avatarUrl: undefined,
        title: undefined,
        isAly: false,
        clock:
          localTimeOption === 'unlimited' ? '∞' : formatCountdownMs(localBlackMs),
        active: localStarted && !localGameOver && turn === 'b',
      };
    }

    return { whiteMeta, blackMeta };
  }, [
    activeGameMeta,
    activeUserProfile,
    mode,
    reviewReport,
    reviewPly,
    alyFen,
    alyTimeOption,
    alyWhiteMs,
    alyBlackMs,
    alyUserColor,
    alyMatchActive,
    alyElo,
    username,
    localFen,
    localWhiteName,
    localBlackName,
    localTimeOption,
    localWhiteMs,
    localBlackMs,
    localStarted,
    localGameOver,
  ]);

  const topColor: 'w' | 'b' = flipped ? 'w' : 'b';
  const bottomColor: 'w' | 'b' = flipped ? 'b' : 'w';
  const topPlayer =
    topColor === 'w' ? playerDisplays.whiteMeta : playerDisplays.blackMeta;
  const bottomPlayer =
    bottomColor === 'w' ? playerDisplays.whiteMeta : playerDisplays.blackMeta;

  const showEvalBar = mode === 'review' || mode === 'analysis';

  const handleRightTabSelect = (tab: AppMode | 'games') => {
    setIsAutoPlaying(false);
    if (tab === 'games') {
      setRightGamesOpen(true);
    } else if (tab === 'review') {
      setRightGamesOpen(false);
      if (!reviewReport && !isReviewing) {
        launchGameReview(activeGameMeta);
      } else {
        setMode('review');
      }
    } else {
      setRightGamesOpen(false);
      if (tab === 'play-aly') {
        setFlipped(alyColorChoice === 'b');
      } else if (tab === 'local-2p') {
        setFlipped(false);
      }
      engineService.stop();
      setMode(tab);
    }
  };

  const cycleTheme = () => {
    const idx = THEME_CYCLE.indexOf(themeId);
    setThemeId(THEME_CYCLE[(idx + 1) % THEME_CYCLE.length]);
  };

  const analysisOpening = useMemo(
    () => lookupOpeningByFen(analysisNodes[analysisIdx]?.fen || START_FEN),
    [analysisNodes, analysisIdx]
  );

  const loadGameIntoAnalysis = (game: GameMetadata) => {
    setActiveGameMeta(game);
    const nodes = pgnToAnalysisNodes(game.pgn);
    setAnalysisNodes(nodes);
    setAnalysisIdx(0);
    setAnalysisBranchNote(null);
    setRightGamesOpen(false);
    setMode('analysis');
    enrichGameWithProfiles(game).then((enriched) => {
      setActiveGameMeta((cur) => (cur.id === game.id ? enriched : cur));
    });
  };

  const kingOutcome = useMemo(() => {
    if (
      mode === 'review' &&
      reviewReport &&
      !isReviewing &&
      !enginePreview &&
      reviewPly === reviewReport.plies.length - 1
    ) {
      const res = reviewReport.game.result;
      if (res === '1-0' || res === '0-1') {
        const isTimeout = Boolean(
          reviewReport.game.termination?.toLowerCase().includes('time')
        );
        return {
          winner: (res === '1-0' ? 'w' : 'b') as 'w' | 'b',
          isTimeout,
        };
      }
    }
    return null;
  }, [mode, reviewReport, isReviewing, enginePreview, reviewPly]);

  return (
    <div
      className={`w-screen h-screen overflow-hidden flex bg-[#302e2b] ${
        uiLightMode ? 'cc-light-ui' : ''
      }`}
    >
      {/* 1. Left Navigation Sidebar (170px expanded / 58px collapsed Chess.com menu) */}
      <Sidebar
        activeMode={mode}
        collapsed={sidebarCollapsed}
        onToggleCollapse={() => setSidebarCollapsed((c) => !c)}
        onSelectMode={(m) => {
          setRightGamesOpen(false);
          setIsAutoPlaying(false);
          if (m === 'review') {
            if (!reviewReport && !isReviewing) {
              launchGameReview(activeGameMeta);
            } else {
              setMode('review');
            }
            return;
          }
          if (m === 'play-aly') {
            setFlipped(alyColorChoice === 'b');
          } else if (m === 'local-2p') {
            setFlipped(false);
          }
          engineService.stop();
          setMode(m);
        }}
        onOpenImporter={() => setImportModalOpen(true)}
        onLoadBrilliancyPuzzle={() => {
          launchGameReview(SAMPLE_GAMES[1]);
        }}
        onOpenProfile={openPlayerProfile}
        username={username}
        userProfile={activeUserProfile}
        themeId={themeId}
        onCycleTheme={cycleTheme}
        uiLightMode={uiLightMode}
        onToggleUiLightMode={() => setUiLightMode((v) => !v)}
        muted={muted}
        onToggleMute={() => {
          const next = !muted;
          setMuted(next);
          soundManager.setMuted(next);
        }}
        onFlipBoard={() => setFlipped((f) => !f)}
      />

      {mode === 'home' ? (
        /* ================= CHESS.COM-STYLE HOME & ADD GAME LANDING PAGE ================= */
        <HomePage
          username={username}
          onUsernameChange={setUsername}
          themeId={themeId}
          onStartReview={(game) => launchGameReview(game)}
          onOpenAnalysis={(game) => {
            if (game) {
              loadGameIntoAnalysis(game);
            } else {
              setRightGamesOpen(false);
              setMode('analysis');
            }
          }}
          onStartPlayAly={(elo) => {
            if (elo) setAlyElo(elo);
            setRightGamesOpen(false);
            engineService.stop();
            setMode('play-aly');
          }}
          onOpenLocal2P={() => {
            setRightGamesOpen(false);
            engineService.stop();
            setMode('local-2p');
          }}
          onOpenProfile={openPlayerProfile}
        />
      ) : mode === 'profile' ? (
        /* ================= 1:1 CHESS.COM MEMBER PROFILE PAGE ================= */
        <ProfilePage
          username={viewedProfileUser}
          onSearchPlayer={(u) => setViewedProfileUser(u)}
          onSetActiveUser={(u) => {
            setUsername(u);
            setLocalWhiteName(u);
          }}
          activeAppUsername={username}
          onReviewGame={(game) => launchGameReview(game)}
          onAnalyzeGame={loadGameIntoAnalysis}
          onPlayCoachAtElo={(elo) => {
            setAlyElo(elo);
            setMode('play-aly');
          }}
        />
      ) : (
        <>
          {/* 2. Center Board Stage (`#302e2b` exact Chess.com surround & flush board layout) */}
          <main
            ref={stageRef}
            className="flex-1 h-full bg-[#302e2b] flex items-center justify-center overflow-hidden relative"
          >
            <div className="flex flex-col">
              {/* Top Player Row */}
              <div
                style={{ marginLeft: showEvalBar ? 40 : 0 }}
                className="mb-[10px] flex items-center relative"
              >
                <PlayerBanner
                  username={topPlayer.username}
                  rating={topPlayer.rating}
                  country={topPlayer.country}
                  avatarUrl={topPlayer.avatarUrl}
                  title={topPlayer.title}
                  isAly={topPlayer.isAly}
                  color={topColor}
                  capturedPieces={
                    topColor === 'w'
                      ? material.capturedByWhite
                      : material.capturedByBlack
                  }
                  materialDiff={
                    topColor === 'w'
                      ? material.whiteAdvantage
                      : material.blackAdvantage
                  }
                  clockText={topPlayer.clock}
                  isActiveTurn={topPlayer.active}
                  width={boardSize}
                  onClickPlayer={() => openPlayerProfile(topPlayer.username)}
                />

                {/* Outside Top-Right Board Utility Icons */}
                <div className="absolute -right-[28px] top-1 flex flex-col items-center gap-2">
                  <button
                    type="button"
                    onClick={cycleTheme}
                    title={`Board Theme: ${BOARD_THEMES[themeId].name}`}
                    className="w-5 h-5 flex items-center justify-center text-[#939291] hover:text-white transition-colors cursor-pointer"
                  >
                    <CcGlyphCogwheel className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setFlipped((f) => !f)}
                    title="Flip Board"
                    className="w-5 h-5 flex items-center justify-center text-[#939291] hover:text-white transition-colors cursor-pointer"
                  >
                    <CcGlyphFlipBoard className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* EvalBar (30px) + 10px gap + Interactive ChessBoard */}
              <div className="flex items-center gap-[10px]">
                {showEvalBar && (
                  <EvalBar
                    cpWhite={boardView.cpWhite}
                    mateWhite={boardView.mateWhite}
                    flipped={flipped}
                    height={boardSize}
                  />
                )}

                <ChessBoard
                  fen={boardView.fen}
                  size={boardSize}
                  flipped={flipped}
                  theme={BOARD_THEMES[themeId]}
                  interactive={boardView.interactive}
                  allowedTurn={boardView.allowedTurn}
                  lastMove={boardView.lastMove}
                  destinationBadge={boardView.destinationBadge}
                  kingOutcome={kingOutcome}
                  arrows={boardView.arrows}
                  onMove={handleBoardMove}
                />
              </div>

              {/* Bottom Player Row */}
              <div style={{ marginLeft: showEvalBar ? 40 : 0 }} className="mt-[10px]">
                <PlayerBanner
                  username={bottomPlayer.username}
                  rating={bottomPlayer.rating}
                  country={bottomPlayer.country}
                  avatarUrl={bottomPlayer.avatarUrl}
                  title={bottomPlayer.title}
                  isAly={bottomPlayer.isAly}
                  color={bottomColor}
                  capturedPieces={
                    bottomColor === 'w'
                      ? material.capturedByWhite
                      : material.capturedByBlack
                  }
                  materialDiff={
                    bottomColor === 'w'
                      ? material.whiteAdvantage
                      : material.blackAdvantage
                  }
                  clockText={bottomPlayer.clock}
                  isActiveTurn={bottomPlayer.active}
                  width={boardSize}
                  onClickPlayer={() => openPlayerProfile(bottomPlayer.username)}
                />
              </div>
            </div>
          </main>

          {/* 3. Floating Dark Right Sidebar (`#board-layout-sidebar`) */}
          {rightGamesOpen ? (
            <GamesTabPanel
              defaultUsername={username}
              onUsernameChange={setUsername}
              onLoadGameForReview={(game) => launchGameReview(game)}
              onLoadGameForAnalysis={loadGameIntoAnalysis}
              onSelectTab={handleRightTabSelect}
            />
          ) : mode === 'review' ? (
            <GameReviewPanel
              report={reviewReport}
              isReviewing={isReviewing}
              progress={reviewProgress}
              subView={reviewSubView}
              onChangeSubView={setReviewSubView}
              activePly={reviewPly}
              onSelectPly={handleSelectReviewPly}
              isAutoPlaying={isAutoPlaying}
              onToggleAutoPlay={() => setIsAutoPlaying((a) => !a)}
              enginePreview={enginePreview}
              onStartShowBest={handleStartShowBest}
              onStartExplain={handleStartExplain}
              onStepEnginePreview={handleStepEnginePreview}
              onExitEnginePreview={() => setEnginePreview(null)}
              onJumpNextKeyMove={handleJumpNextKeyMove}
              onOpenImporter={() => setImportModalOpen(true)}
              onSelectTab={handleRightTabSelect}
              onFlipBoard={() => setFlipped((f) => !f)}
              onOpenPlayerProfile={openPlayerProfile}
            />
          ) : mode === 'analysis' ? (
            <AnalysisPanel
              nodes={analysisNodes}
              branchNote={analysisBranchNote}
              activeIdx={analysisIdx}
              onSelectIdx={setAnalysisIdx}
              evaluation={analysisEval}
              engineEnabled={analysisEngineOn}
              onToggleEngine={() => {
                if (analysisEngineOn) engineService.stop();
                setAnalysisEngineOn((v) => !v);
              }}
              showThreatArrow={showThreatArrow}
              onToggleThreatArrow={() => setShowThreatArrow((v) => !v)}
              onHoverLine={setHoveredEngineLine}
              onPlayEngineMove={(uci) => {
                const parsed = uciToMoveObj(uci);
                if (parsed) handleAnalysisMove(parsed);
              }}
              onResetBoard={() => {
                setAnalysisNodes([{ ply: 0, fen: START_FEN }]);
                setAnalysisIdx(0);
                setAnalysisBranchNote(null);
              }}
              onOpenImporter={() => setImportModalOpen(true)}
              onSendToReview={() => {
                const meta = buildPgnFromNodes(
                  analysisNodes,
                  activeGameMeta.white.username || username,
                  activeGameMeta.black.username || 'Opponent'
                );
                launchGameReview(meta);
              }}
              onSelectTab={handleRightTabSelect}
              onFlipBoard={() => setFlipped((f) => !f)}
              whiteLabel={activeGameMeta.white.username || 'Player1'}
              blackLabel={activeGameMeta.black.username || 'Player2'}
              resultLabel={activeGameMeta.result}
              opening={analysisOpening}
            />
          ) : mode === 'play-aly' ? (
            <PlayAlyPanel
              gameActive={alyMatchActive}
              gameOverInfo={alyGameOver}
              selectedElo={alyElo}
              onSelectElo={setAlyElo}
              colorChoice={alyColorChoice}
              onSelectColor={setAlyColorChoice}
              timeOption={alyTimeOption}
              onSelectTime={setAlyTimeOption}
              onStartMatch={handleStartAlyMatch}
              onResign={() =>
                finalizeAlyMatch(
                  'You Resigned',
                  `Aly (${alyElo} Elo) wins by resignation.`,
                  alyUserColor === 'w' ? '0-1' : '1-0',
                  'thinking'
                )
              }
              onNewSetup={() => {
                engineService.stop();
                setAlyMatchActive(false);
                setAlyGameOver(null);
                setAlyThinking(false);
              }}
              onTakeback={handleAlyTakeback}
              onRequestHint={handleRequestAlyHint}
              onReviewFinishedGame={handleReviewAlyFinishedGame}
              coachSpeech={alySpeech}
              sanHistory={alySanHistory}
              alyThinking={alyThinking}
              onSelectTab={handleRightTabSelect}
              onSwitchToLocal2P={() => {
                engineService.stop();
                setMode('local-2p');
              }}
            />
          ) : (
            <LocalPlayPanel
              whiteName={localWhiteName}
              onWhiteNameChange={setLocalWhiteName}
              blackName={localBlackName}
              onBlackNameChange={setLocalBlackName}
              timeOption={localTimeOption}
              onSelectTime={(t) => {
                setLocalTimeOption(t);
                if (!localStarted) resetLocalGame(t);
              }}
              autoFlip={localAutoFlip}
              onToggleAutoFlip={() => setLocalAutoFlip((v) => !v)}
              matchStarted={localStarted}
              clockPaused={localPaused}
              onTogglePause={() => setLocalPaused((p) => !p)}
              gameOverInfo={localGameOver}
              sanHistory={localSanHistory}
              onStartOrReset={() => resetLocalGame()}
              onResignCurrent={() => {
                const turn = localChessRef.current.turn();
                const winner = turn === 'w' ? localBlackName : localWhiteName;
                setLocalGameOver({
                  title: `${winner} Won by Resignation`,
                  subtitle: `${
                    turn === 'w' ? localWhiteName : localBlackName
                  } resigned.`,
                  result: turn === 'w' ? '0-1' : '1-0',
                });
                soundManager.play('game-end');
              }}
              onReviewGame={handleReviewLocalGame}
              onSelectTab={handleRightTabSelect}
              onSwitchToCoachAly={() => setMode('play-aly')}
            />
          )}
        </>
      )}

      {/* Dark-Mode Chess.com Game Importer Modal */}
      <ImportModal
        isOpen={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        defaultUsername={username}
        onUsernameChange={setUsername}
        onLoadGameForReview={(game) => launchGameReview(game)}
        onLoadGameForAnalysis={loadGameIntoAnalysis}
      />
    </div>
  );
};

export default App;
