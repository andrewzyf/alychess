import { Chess, Square } from 'chess.js';
import {
  CLASSIFICATION_ORDER,
  GameMetadata,
  GameReviewReport,
  MoveClassification,
  PositionEvaluation,
  ReviewedPly,
} from '../types/chess';
import { generateAlyExplanation, generateSummaryReaction } from './alyCoach';
import {
  computeMaterial,
  extractClocksFromPgn,
  PIECE_VALUES,
  uciToMoveObj,
} from './chessHelpers';
import { lookupOpeningByFen } from './ecoBook';

export function mateToCpWhite(mateWhite: number): number {
  if (mateWhite === 0) return 0;
  const sign = mateWhite > 0 ? 1 : -1;
  const distance = Math.min(50, Math.abs(mateWhite));
  return sign * (10000 - distance * 10);
}

/**
 * Exact Chess.com / Lichess centipawn -> Expected Win% sigmoid curve (0..100)
 */
export function cpToWinPct(cp: number): number {
  const clamped = Math.max(-10000, Math.min(10000, cp));
  const win = 50 + 50 * (2 / (1 + Math.exp(-0.00368208 * clamped)) - 1);
  return Math.max(0, Math.min(100, win));
}

/**
 * Individual Move Accuracy formula (0..100)
 */
export function computeMoveAccuracy(winProbLoss: number): number {
  const delta = Math.max(0, winProbLoss);
  const raw = 103.1668 * Math.exp(-0.04354 * delta) - 3.1669;
  return Math.max(0, Math.min(100, raw));
}

/**
 * Volatility-weighted Player Accuracy % across non-book moves (CAPS2 / Lichess style)
 */
export function computePlayerAccuracy(
  plies: ReviewedPly[],
  color: 'w' | 'b'
): number {
  const playerPlies = plies.filter((p) => p.ply >= 1 && p.color === color);
  if (playerPlies.length === 0) return 100;

  const nonBook = playerPlies.filter((p) => p.classification !== 'book');
  const targetPlies = nonBook.length > 0 ? nonBook : playerPlies;

  let weightedSum = 0;
  let totalWeight = 0;

  for (const p of targetPlies) {
    const acc = p.moveAccuracy ?? 100;
    const startIdx = Math.max(0, p.ply - 2);
    const endIdx = Math.min(plies.length - 1, p.ply + 2);
    const windowVals: number[] = [];
    for (let idx = startIdx; idx <= endIdx; idx++) {
      windowVals.push(plies[idx].winPctWhite);
    }
    const mean = windowVals.reduce((s, v) => s + v, 0) / windowVals.length;
    const variance =
      windowVals.reduce((s, v) => s + (v - mean) * (v - mean), 0) / windowVals.length;
    const stdDev = Math.sqrt(variance);

    const contestedBoost = p.winPctWhite >= 15 && p.winPctWhite <= 85 ? 1.25 : 0.85;
    const weight = Math.max(0.6, Math.min(12, 0.6 + stdDev)) * contestedBoost;

    weightedSum += acc * weight;
    totalWeight += weight;
  }

  const weightedMean = totalWeight > 0 ? weightedSum / totalWeight : 100;
  return Math.round(Math.max(0, Math.min(100, weightedMean)) * 10) / 10;
}

export function computeEstimatedRating(playerRating: number, accuracy: number): number {
  const base = playerRating > 0 ? playerRating : 1000;
  const est = Math.round(base + (accuracy - 75) * 12);
  return Math.max(100, Math.min(3200, est));
}

/**
 * Strict Chess.com Brilliant (!!) sacrifice detector:
 * - Excludes ALL equal or winning captures (e.g. Bxf5 taking a Bishop, Nxc6 taking a Knight)
 * - Requires genuine net material loss >= 2 points after opponent's best reply (or leaving a piece
 *   strictly worth >= 2 pts more than anything captured en prise to a cheaper attacker)
 * - Excludes garbage-time sacrifices when mover is already up >= +5 material
 */
function detectGenuineMaterialSacrifice(
  fenBefore: string,
  fenAfter: string,
  moverColor: 'w' | 'b',
  movedTo: string,
  movedPiece: string,
  capturedPiece?: string,
  opponentBestUci?: string
): boolean {
  // Never mark pawns or kings as sacrifices
  if (movedPiece === 'p' || movedPiece === 'k') return false;

  const movedVal = PIECE_VALUES[movedPiece] || 0;
  const capturedVal = capturedPiece ? PIECE_VALUES[capturedPiece] || 0 : 0;

  // An equal trade (Bxf5 taking B, Nxc6 taking N, Qxf5 taking Q) or winning capture is NOT a sacrifice!
  if (capturedVal >= movedVal - 1) {
    return false;
  }

  const matBefore = computeMaterial(fenBefore);
  const beforeNet =
    moverColor === 'w'
      ? matBefore.whitePoints - matBefore.blackPoints
      : matBefore.blackPoints - matBefore.whitePoints;

  // Exclude garbage-time sacrifices when mover is already up a Rook or more
  if (beforeNet >= 5) return false;

  // Simulate opponent's #1 best reply (e.g. accepting the sacrifice like cxb5 or Nxb8)
  if (opponentBestUci) {
    const parsed = uciToMoveObj(opponentBestUci);
    if (parsed) {
      try {
        const sim = new Chess(fenAfter);
        const m = sim.move(parsed);
        if (m) {
          const matReply = computeMaterial(sim.fen());
          const afterOppReplyNet =
            moverColor === 'w'
              ? matReply.whitePoints - matReply.blackPoints
              : matReply.blackPoints - matReply.whitePoints;

          // Genuine material drop of >= 2 points compared to before our move!
          if (afterOppReplyNet <= beforeNet - 2) {
            return true;
          }
        }
      } catch {
        // ignore
      }
    }
  }

  // Case B (Declined sacrifice): Moved piece landed on a square where enemy can capture it
  // for a net gain of >= 2 points (and we did NOT capture an equal/near-equal piece!)
  try {
    const cAfter = new Chess(fenAfter);
    const enemyColor = moverColor === 'w' ? 'b' : 'w';
    const attackers = cAfter.attackers(movedTo as Square, enemyColor);
    if (attackers.length > 0) {
      const defenders = cAfter.attackers(movedTo as Square, moverColor);
      let cheapestAttacker = 99;
      for (const sq of attackers) {
        const att = cAfter.get(sq);
        if (att) {
          const v = att.type === 'k' ? 1 : PIECE_VALUES[att.type] || 1;
          if (v < cheapestAttacker) cheapestAttacker = v;
        }
      }
      // If opponent captures our piece, what is their net gain accounting for what we captured?
      const lossIfTaken =
        defenders.length === 0
          ? movedVal - capturedVal
          : movedVal - cheapestAttacker - capturedVal;
      if (lossIfTaken >= 2) {
        return true;
      }
    }
  } catch {
    // ignore
  }

  return false;
}

export interface ParsedPlyMove {
  ply: number;
  fen: string;
  san?: string;
  uci?: string;
  from?: string;
  to?: string;
  color?: 'w' | 'b';
  piece?: string;
  captured?: string;
  promotion?: string;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isCastle?: boolean;
  clock?: string;
}

export function extractGamePlies(pgn: string): ParsedPlyMove[] {
  const chess = new Chess();
  chess.loadPgn(pgn);
  const verboseMoves = chess.history({ verbose: true });
  const headers = chess.getHeaders();
  const clocks = extractClocksFromPgn(pgn);

  const startFen =
    headers.SetUp === '1' && headers.FEN
      ? headers.FEN
      : 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';

  const replay = new Chess(startFen);
  const plies: ParsedPlyMove[] = [
    {
      ply: 0,
      fen: replay.fen(),
    },
  ];

  verboseMoves.forEach((m, idx) => {
    replay.move(m);
    const uci = `${m.from}${m.to}${m.promotion ? m.promotion : ''}`;
    plies.push({
      ply: idx + 1,
      fen: replay.fen(),
      san: m.san,
      uci,
      from: m.from,
      to: m.to,
      color: m.color,
      piece: m.piece,
      captured: m.captured,
      promotion: m.promotion,
      isCheck: replay.inCheck(),
      isCheckmate: replay.isCheckmate(),
      isCastle: m.san === 'O-O' || m.san === 'O-O-O',
      clock: clocks[idx],
    });
  });

  return plies;
}

export function buildGameReviewReport(
  game: GameMetadata,
  parsedPlies: ParsedPlyMove[],
  evals: PositionEvaluation[]
): GameReviewReport {
  const reviewedPlies: ReviewedPly[] = [];
  let lastKnownOpening: { eco: string; name: string } = {
    eco: game.eco || 'A00',
    name: game.openingName || 'Starting Position',
  };
  let stillInBookWindow = true;

  const whiteCounts: Record<MoveClassification, number> = {
    brilliant: 0,
    great: 0,
    best: 0,
    excellent: 0,
    good: 0,
    book: 0,
    inaccuracy: 0,
    mistake: 0,
    miss: 0,
    blunder: 0,
  };
  const blackCounts: Record<MoveClassification, number> = {
    brilliant: 0,
    great: 0,
    best: 0,
    excellent: 0,
    good: 0,
    book: 0,
    inaccuracy: 0,
    mistake: 0,
    miss: 0,
    blunder: 0,
  };

  for (let i = 0; i < parsedPlies.length; i++) {
    const raw = parsedPlies[i];
    const ev = evals[i] || {
      fen: raw.fen,
      depth: 15,
      cpWhite: 0,
      mateWhite: null,
      winPctWhite: 50,
      lines: [],
    };

    if (i === 0) {
      const startOpening = lookupOpeningByFen(raw.fen);
      if (startOpening) lastKnownOpening = startOpening;
      reviewedPlies.push({
        ply: 0,
        fen: raw.fen,
        cpWhite: ev.cpWhite,
        mateWhite: ev.mateWhite,
        winPctWhite: ev.winPctWhite,
        lines: ev.lines,
        opening: lastKnownOpening,
        coachTitle: 'Game Ready for Review',
        coachBody: 'Step through each move or click Key ★ to explore critical turning points.',
        alyMood: 'happy',
      });
      continue;
    }

    const prevEv = evals[i - 1] || ev;
    const prevPly = reviewedPlies[i - 1];
    const moverColor = raw.color!;

    const bestLineObj = prevEv.lines[0];
    const secondLineObj = prevEv.lines[1];

    const bestMoveUci = bestLineObj?.pvUci[0];
    const bestMoveSan = bestLineObj?.pvSan[0];
    const secondMoveUci = secondLineObj?.pvUci[0];

    const winProbBefore =
      moverColor === 'w' ? prevEv.winPctWhite : 100 - prevEv.winPctWhite;
    const winProbAfter =
      moverColor === 'w' ? ev.winPctWhite : 100 - ev.winPctWhite;

    const playedExactBest = Boolean(bestMoveUci && raw.uci === bestMoveUci);
    const playedTopTwo =
      playedExactBest || Boolean(secondMoveUci && raw.uci === secondMoveUci);

    const winProbLoss = playedExactBest
      ? 0
      : Math.max(0, winProbBefore - winProbAfter);

    const moveAccuracy = computeMoveAccuracy(winProbLoss);

    // Check ECO opening book match (stop book once a non-book move leaves theory past ply 6)
    const bookHit = i <= 20 ? lookupOpeningByFen(raw.fen) : undefined;
    if (bookHit && stillInBookWindow) {
      lastKnownOpening = bookHit;
    } else if (i > 4 && !bookHit) {
      stillInBookWindow = false;
    }

    // Check MultiPV 2 drop for "Great (!)" ("only move" detector)
    let secondBestDrop = 0;
    if (bestLineObj && secondLineObj) {
      const win1 =
        moverColor === 'w'
          ? cpToWinPct(bestLineObj.cpWhite)
          : 100 - cpToWinPct(bestLineObj.cpWhite);
      const win2 =
        moverColor === 'w'
          ? cpToWinPct(secondLineObj.cpWhite)
          : 100 - cpToWinPct(secondLineObj.cpWhite);
      secondBestDrop = Math.max(0, win1 - win2);
    }

    // Detect trivial equal-trade recapture (e.g. 6. Bxf5 exf5 or 8. Nxc6 bxc6)
    // Chess.com NEVER awards Great (!) for obvious equal recaptures, though capturing a
    // blundered piece that wins material (e.g. 16... Bxe3+?? 17. fxe3!) IS eligible!
    const matAfter = computeMaterial(raw.fen);
    const matBeforePrev = i >= 2 ? computeMaterial(parsedPlies[i - 2].fen) : matAfter;
    const netAfterForMover =
      moverColor === 'w'
        ? matAfter.whitePoints - matAfter.blackPoints
        : matAfter.blackPoints - matAfter.whitePoints;
    const netBeforeTradeForMover =
      moverColor === 'w'
        ? matBeforePrev.whitePoints - matBeforePrev.blackPoints
        : matBeforePrev.blackPoints - matBeforePrev.whitePoints;

    const isTrivialEqualRecapture = Boolean(
      prevPly?.captured &&
        raw.captured &&
        raw.to === prevPly.to &&
        netAfterForMover <= netBeforeTradeForMover + 1
    );

    // Check if move allowed a new forced checkmate for the opponent
    const mateForMoverBefore =
      prevEv.mateWhite === null
        ? null
        : moverColor === 'w'
        ? prevEv.mateWhite
        : -prevEv.mateWhite;
    const mateForMoverAfter =
      ev.mateWhite === null
        ? null
        : moverColor === 'w'
        ? ev.mateWhite
        : -ev.mateWhite;

    const allowedForcedMate =
      (mateForMoverBefore === null || mateForMoverBefore >= 0) &&
      mateForMoverAfter !== null &&
      mateForMoverAfter < 0 &&
      winProbBefore >= 20;

    // Strict Brilliant (!!) sacrifice check
    const oppBestReplyUci = ev.lines[0]?.pvUci[0];
    const isGenuineSacrifice =
      raw.to && raw.piece && i >= 6
        ? detectGenuineMaterialSacrifice(
            parsedPlies[i - 1].fen,
            raw.fen,
            moverColor,
            raw.to,
            raw.piece,
            raw.captured,
            oppBestReplyUci
          )
        : false;

    const prevOppLoss = prevPly?.winProbLoss ?? 0;

    let classification: MoveClassification;

    // Exact Chess.com Expected Points Loss (ΔWin%) calibration:
    // Book | Brilliant | Great | Miss | Blunder (>20%) | Mistake (>10%) | Inaccuracy (>5.5%) | Good (>2.5%) | Excellent (>0.8%) | Best
    if (bookHit && stillInBookWindow && winProbLoss <= 4) {
      classification = 'book';
    } else if (
      isGenuineSacrifice &&
      playedTopTwo &&
      winProbLoss <= 1.5 &&
      winProbAfter >= 52 &&
      (winProbBefore < 90 || (mateForMoverAfter !== null && mateForMoverAfter > 0))
    ) {
      classification = 'brilliant';
    } else if (
      (playedExactBest || winProbLoss <= 0.8) &&
      secondBestDrop >= 18 &&
      winProbAfter >= 42 &&
      !isTrivialEqualRecapture &&
      !raw.isCheckmate
    ) {
      classification = 'great';
    } else if (
      prevOppLoss >= 18 &&
      winProbLoss >= 10 &&
      !playedExactBest &&
      !allowedForcedMate &&
      winProbBefore >= 55
    ) {
      classification = 'miss';
    } else if (winProbLoss > 20 || allowedForcedMate) {
      classification = 'blunder';
    } else if (winProbLoss > 10) {
      classification = 'mistake';
    } else if (winProbLoss > 5.5) {
      classification = 'inaccuracy';
    } else if (winProbLoss > 2.5) {
      classification = 'good';
    } else if (winProbLoss > 0.8 && !playedExactBest) {
      classification = 'excellent';
    } else {
      classification = 'best';
    }

    if (moverColor === 'w') {
      whiteCounts[classification]++;
    } else {
      blackCounts[classification]++;
    }

    const continuationLine = ev.lines[0];
    const coach = generateAlyExplanation({
      ply: i,
      fenBefore: parsedPlies[i - 1].fen,
      fenAfter: raw.fen,
      san: raw.san || '',
      uci: raw.uci || '',
      from: raw.from || '',
      to: raw.to || '',
      color: moverColor,
      piece: raw.piece || 'p',
      captured: raw.captured,
      promotion: raw.promotion,
      isCheck: raw.isCheck,
      isCheckmate: raw.isCheckmate,
      isCastle: raw.isCastle,
      classification,
      mateWhiteBefore: prevEv.mateWhite,
      mateWhiteAfter: ev.mateWhite,
      bestMoveUci,
      bestMoveSan,
      bestLineUci: bestLineObj?.pvUci || [],
      bestLineSan: bestLineObj?.pvSan || [],
      continuationUci: continuationLine?.pvUci || [],
      continuationSan: continuationLine?.pvSan || [],
      opening: bookHit || lastKnownOpening,
    });

    reviewedPlies.push({
      ...raw,
      cpWhite: ev.cpWhite,
      mateWhite: ev.mateWhite,
      winPctWhite: ev.winPctWhite,
      lines: ev.lines,
      classification,
      moveAccuracy: Math.round(moveAccuracy * 10) / 10,
      winProbBefore: Math.round(winProbBefore * 10) / 10,
      winProbAfter: Math.round(winProbAfter * 10) / 10,
      winProbLoss: Math.round(winProbLoss * 10) / 10,
      bestMoveUci,
      bestMoveSan,
      bestLineUci: bestLineObj?.pvUci || [],
      bestLineSan: bestLineObj?.pvSan || [],
      continuationUci: continuationLine?.pvUci || [],
      continuationSan: continuationLine?.pvSan || [],
      threatUci: continuationLine?.pvUci[0],
      opening: lastKnownOpening,
      coachTitle: coach.title,
      coachBody: coach.body,
      coachTip: coach.tip,
      coachTags: coach.tags,
      alyMood: coach.mood,
    });
  }

  const whiteAccuracy = computePlayerAccuracy(reviewedPlies, 'w');
  const blackAccuracy = computePlayerAccuracy(reviewedPlies, 'b');
  const whiteEstimatedElo = computeEstimatedRating(game.white.rating, whiteAccuracy);
  const blackEstimatedElo = computeEstimatedRating(game.black.rating, blackAccuracy);

  CLASSIFICATION_ORDER.forEach((k) => {
    whiteCounts[k] = whiteCounts[k] || 0;
    blackCounts[k] = blackCounts[k] || 0;
  });

  const summary = generateSummaryReaction(game, whiteAccuracy, blackAccuracy, reviewedPlies);

  return {
    game: {
      ...game,
      eco: lastKnownOpening.eco,
      openingName: lastKnownOpening.name,
    },
    plies: reviewedPlies,
    whiteAccuracy,
    blackAccuracy,
    whiteEstimatedElo,
    blackEstimatedElo,
    whiteCounts,
    blackCounts,
    opening: lastKnownOpening,
    summaryQuote: summary.quote,
    summaryMood: summary.mood,
  };
}
