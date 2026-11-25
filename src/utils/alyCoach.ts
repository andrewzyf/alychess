import { Chess, Square } from 'chess.js';
import {
  AlyMood,
  CLASSIFICATION_META,
  GameMetadata,
  MoveClassification,
  ReviewedPly,
} from '../types/chess';
import { PIECE_VALUES, uciToMoveObj } from './chessHelpers';

const PIECE_NAMES: Record<string, string> = {
  p: 'pawn',
  n: 'knight',
  b: 'bishop',
  r: 'rook',
  q: 'queen',
  k: 'king',
};

const ALL_SQUARES: Square[] = [];
for (const f of ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h']) {
  for (const r of ['1', '2', '3', '4', '5', '6', '7', '8']) {
    ALL_SQUARES.push(`${f}${r}` as Square);
  }
}

interface HangingInfo {
  square: Square;
  pieceType: string;
  pieceName: string;
  value: number;
}

function findHangingPieces(fen: string, friendlyColor: 'w' | 'b'): HangingInfo[] {
  let chess: Chess;
  try {
    chess = new Chess(fen);
  } catch {
    return [];
  }
  const enemyColor = friendlyColor === 'w' ? 'b' : 'w';
  const hanging: HangingInfo[] = [];

  for (const sq of ALL_SQUARES) {
    const piece = chess.get(sq);
    if (!piece || piece.color !== friendlyColor || piece.type === 'k' || piece.type === 'p') {
      continue;
    }
    const attackers = chess.attackers(sq, enemyColor);
    if (attackers.length === 0) continue;

    const defenders = chess.attackers(sq, friendlyColor);
    const val = PIECE_VALUES[piece.type] || 0;

    let minAttackerVal = 99;
    for (const attSq of attackers) {
      const attPiece = chess.get(attSq);
      if (attPiece) {
        const attVal = attPiece.type === 'k' ? 1 : PIECE_VALUES[attPiece.type] || 1;
        if (attVal < minAttackerVal) minAttackerVal = attVal;
      }
    }

    if (defenders.length === 0 || minAttackerVal < val) {
      hanging.push({
        square: sq,
        pieceType: piece.type,
        pieceName: PIECE_NAMES[piece.type] || 'piece',
        value: val,
      });
    }
  }

  hanging.sort((a, b) => b.value - a.value);
  return hanging;
}

function detectForkTargets(fenAfter: string, toSquare: string, moverColor: 'w' | 'b'): string[] {
  let chess: Chess;
  try {
    chess = new Chess(fenAfter);
  } catch {
    return [];
  }
  const enemyColor = moverColor === 'w' ? 'b' : 'w';
  const movedPiece = chess.get(toSquare as Square);
  if (!movedPiece) return [];

  const movedVal = PIECE_VALUES[movedPiece.type] || 1;
  const targets: string[] = [];

  for (const sq of ALL_SQUARES) {
    const target = chess.get(sq);
    if (!target || target.color !== enemyColor || target.type === 'p') continue;

    const attackers = chess.attackers(sq, moverColor);
    if (!attackers.includes(toSquare as Square)) continue;

    const targetVal = target.type === 'k' ? 10 : PIECE_VALUES[target.type] || 3;
    const defenders = chess.attackers(sq, enemyColor);
    if (target.type === 'k' || defenders.length === 0 || targetVal > movedVal) {
      targets.push(`${PIECE_NAMES[target.type]} on ${sq}`);
    }
  }

  return targets;
}

/**
 * Detect if the moved sliding piece (Bishop, Rook, Queen) pins an enemy piece to the enemy King or Queen
 */
function detectPinCreated(
  fenAfter: string,
  toSquare: string,
  moverColor: 'w' | 'b'
): { pinnedPiece: string; behindPiece: string } | null {
  let chess: Chess;
  try {
    chess = new Chess(fenAfter);
  } catch {
    return null;
  }
  const moved = chess.get(toSquare as Square);
  if (!moved || !['b', 'r', 'q'].includes(moved.type)) return null;

  const enemyColor = moverColor === 'w' ? 'b' : 'w';
  const f0 = toSquare.charCodeAt(0) - 97;
  const r0 = parseInt(toSquare[1], 10) - 1;

  const dirs: Array<[number, number]> = [];
  if (moved.type === 'b' || moved.type === 'q') {
    dirs.push([1, 1], [1, -1], [-1, 1], [-1, -1]);
  }
  if (moved.type === 'r' || moved.type === 'q') {
    dirs.push([1, 0], [-1, 0], [0, 1], [0, -1]);
  }

  for (const [df, dr] of dirs) {
    let firstEnemy: { type: string; sq: string; val: number } | null = null;
    for (let step = 1; step < 8; step++) {
      const nf = f0 + df * step;
      const nr = r0 + dr * step;
      if (nf < 0 || nf > 7 || nr < 0 || nr > 7) break;
      const sq = `${String.fromCharCode(97 + nf)}${nr + 1}` as Square;
      const occ = chess.get(sq);
      if (!occ) continue;

      if (occ.color === moverColor) break;
      if (!firstEnemy) {
        if (occ.type === 'p' || occ.type === 'k') break;
        firstEnemy = { type: occ.type, sq, val: PIECE_VALUES[occ.type] || 3 };
      } else {
        const behindVal = occ.type === 'k' ? 10 : PIECE_VALUES[occ.type] || 0;
        if (behindVal > firstEnemy.val && (occ.type === 'k' || occ.type === 'q')) {
          return {
            pinnedPiece: `${PIECE_NAMES[firstEnemy.type]} on ${firstEnemy.sq}`,
            behindPiece: `${PIECE_NAMES[occ.type]} on ${sq}`,
          };
        }
        break;
      }
    }
  }
  return null;
}

function detectOpenFileRook(fenAfter: string, toSquare: string, piece: string): boolean {
  if (piece !== 'r') return false;
  let chess: Chess;
  try {
    chess = new Chess(fenAfter);
  } catch {
    return false;
  }
  const file = toSquare[0];
  let pawnCount = 0;
  for (let r = 2; r <= 7; r++) {
    const occ = chess.get(`${file}${r}` as Square);
    if (occ && occ.type === 'p') pawnCount++;
  }
  return pawnCount === 0;
}

function checkPassedPawn(fenAfter: string, toSquare: string, moverColor: 'w' | 'b'): boolean {
  let chess: Chess;
  try {
    chess = new Chess(fenAfter);
  } catch {
    return false;
  }
  const p = chess.get(toSquare as Square);
  if (!p || p.type !== 'p') return false;

  const fileIdx = toSquare.charCodeAt(0) - 97;
  const rank = parseInt(toSquare[1], 10);
  if (moverColor === 'w' && rank < 5) return false;
  if (moverColor === 'b' && rank > 4) return false;

  const enemyColor = moverColor === 'w' ? 'b' : 'w';
  for (let df = -1; df <= 1; df++) {
    const fCode = fileIdx + df;
    if (fCode < 0 || fCode > 7) continue;
    const fileChar = String.fromCharCode(97 + fCode);
    if (moverColor === 'w') {
      for (let r = rank + 1; r <= 7; r++) {
        const occ = chess.get(`${fileChar}${r}` as Square);
        if (occ && occ.color === enemyColor && occ.type === 'p') return false;
      }
    } else {
      for (let r = rank - 1; r >= 2; r--) {
        const occ = chess.get(`${fileChar}${r}` as Square);
        if (occ && occ.color === enemyColor && occ.type === 'p') return false;
      }
    }
  }
  return true;
}

function simulateMaterialGain(
  fenBefore: string,
  uciLine: string[],
  moverColor: 'w' | 'b'
): number {
  if (uciLine.length === 0) return 0;
  let chess: Chess;
  try {
    chess = new Chess(fenBefore);
  } catch {
    return 0;
  }

  const netForMover = (c: Chess) => {
    let w = 0;
    let b = 0;
    for (const row of c.board()) {
      for (const sq of row) {
        if (!sq) continue;
        const v = PIECE_VALUES[sq.type] || 0;
        if (sq.color === 'w') w += v;
        else b += v;
      }
    }
    return moverColor === 'w' ? w - b : b - w;
  };

  const startDiff = netForMover(chess);
  const steps = Math.min(4, uciLine.length);
  for (let i = 0; i < steps; i++) {
    const parsed = uciToMoveObj(uciLine[i]);
    if (!parsed) break;
    try {
      const m = chess.move(parsed);
      if (!m) break;
    } catch {
      break;
    }
  }
  return netForMover(chess) - startDiff;
}

function describeMaterialSwing(points: number): string {
  if (points >= 8) return 'a queen';
  if (points >= 5) return 'a rook';
  if (points >= 3) return 'a minor piece';
  if (points >= 2) return 'the exchange or multiple pawns';
  return 'a pawn';
}

function describeMovePurpose(fenBefore: string, bestUci?: string, bestSan?: string): string {
  if (!bestUci || !bestSan) return 'maintaining a solid position';
  const parsed = uciToMoveObj(bestUci);
  if (!parsed) return 'improving piece coordination';

  let chess: Chess;
  try {
    chess = new Chess(fenBefore);
  } catch {
    return 'keeping the balance';
  }

  const mover = chess.turn();
  let moveRes;
  try {
    moveRes = chess.move(parsed);
  } catch {
    return 'improving piece activity';
  }
  if (!moveRes) return 'keeping control';

  if (moveRes.san.includes('#')) return 'delivering immediate checkmate';
  if (moveRes.san === 'O-O' || moveRes.san === 'O-O-O') return 'tucking your king to safety';
  if (moveRes.captured) {
    const capName = PIECE_NAMES[moveRes.captured] || 'material';
    return `capturing the ${capName} on ${moveRes.to}`;
  }

  const forks = detectForkTargets(chess.fen(), moveRes.to, mover);
  if (forks.length >= 2) {
    return `forking the ${forks[0]} and ${forks[1]}`;
  }

  const pin = detectPinCreated(chess.fen(), moveRes.to, mover);
  if (pin) {
    return `pinning the ${pin.pinnedPiece} to the ${pin.behindPiece}`;
  }

  if (moveRes.san.includes('+')) return 'seizing the initiative with check';
  if (
    (moveRes.piece === 'n' || moveRes.piece === 'b') &&
    ['1', '8'].includes(moveRes.from[1])
  ) {
    return `developing your ${PIECE_NAMES[moveRes.piece]} toward active squares`;
  }
  if (['d4', 'e4', 'd5', 'e5'].includes(moveRes.to)) {
    return 'fighting for control of the center';
  }
  if (moveRes.piece === 'r' && detectOpenFileRook(chess.fen(), moveRes.to, 'r')) {
    return `seizing the open ${moveRes.to[0]}-file with your rook`;
  }
  if (moveRes.piece === 'r') {
    return 'activating your rook into the game';
  }
  return 'improving your piece coordination';
}

export function getMoodForClassification(cls: MoveClassification): AlyMood {
  switch (cls) {
    case 'brilliant':
    case 'great':
      return 'excited';
    case 'best':
    case 'excellent':
      return 'happy';
    case 'good':
      return 'neutral';
    case 'book':
      return 'book';
    case 'inaccuracy':
      return 'thinking';
    case 'mistake':
    case 'miss':
      return 'concerned';
    case 'blunder':
      return 'shocked';
  }
}

export function generateCoachTitle(san: string, classification: MoveClassification): string {
  switch (classification) {
    case 'brilliant':
      return `${san} is brilliant!!`;
    case 'great':
      return `${san} is a great move!`;
    case 'best':
      return `${san} is the best move`;
    case 'excellent':
      return `${san} is excellent`;
    case 'good':
      return `${san} is a good move`;
    case 'book':
      return `${san} is a book move`;
    case 'inaccuracy':
      return `${san} is an inaccuracy`;
    case 'mistake':
      return `${san} is a mistake`;
    case 'miss':
      return `${san} is a missed win`;
    case 'blunder':
      return `${san} is a blunder`;
  }
}

export interface CoachExplanationInput {
  ply: number;
  fenBefore: string;
  fenAfter: string;
  san: string;
  uci: string;
  from: string;
  to: string;
  color: 'w' | 'b';
  piece: string;
  captured?: string;
  promotion?: string;
  isCheck?: boolean;
  isCheckmate?: boolean;
  isCastle?: boolean;
  classification: MoveClassification;
  mateWhiteBefore: number | null;
  mateWhiteAfter: number | null;
  bestMoveUci?: string;
  bestMoveSan?: string;
  bestLineUci?: string[];
  bestLineSan?: string[];
  continuationUci?: string[];
  continuationSan?: string[];
  opening?: { eco: string; name: string };
}

export function generateAlyExplanation(input: CoachExplanationInput): {
  title: string;
  body: string;
  tip?: string;
  tags: string[];
  mood: AlyMood;
} {
  const {
    ply,
    fenBefore,
    fenAfter,
    san,
    to,
    color,
    piece,
    captured,
    promotion,
    isCheck,
    isCheckmate,
    isCastle,
    classification,
    mateWhiteBefore,
    mateWhiteAfter,
    bestMoveUci,
    bestMoveSan,
    bestLineUci = [],
    bestLineSan = [],
    continuationUci = [],
    continuationSan = [],
    opening,
  } = input;

  const title = generateCoachTitle(san, classification);
  const mood = getMoodForClassification(classification);
  const tags: string[] = [];

  const mateForMoverAfter =
    mateWhiteAfter === null ? null : color === 'w' ? mateWhiteAfter : -mateWhiteAfter;
  const mateForMoverBefore =
    mateWhiteBefore === null ? null : color === 'w' ? mateWhiteBefore : -mateWhiteBefore;

  // 1. Immediate Checkmate
  if (isCheckmate) {
    return {
      title,
      mood: 'excited',
      tags: ['Checkmate'],
      body: `Checkmate! ${san} takes away the enemy king's last escape square and seals the win.`,
    };
  }

  // 2. Promotion
  if (promotion && (classification === 'best' || classification === 'great' || classification === 'brilliant')) {
    tags.push('Promotion');
    return {
      title,
      mood: 'excited',
      tags,
      body: `Promoting on ${to} brings a powerful new ${PIECE_NAMES[promotion] || 'queen'} onto the board with overwhelming force!`,
      tip: continuationSan.length > 0 ? `Next: ${continuationSan.slice(0, 3).join(' ')}` : undefined,
    };
  }

  // 3. Book moves
  if (classification === 'book') {
    tags.push('Opening Theory');
    if (isCastle) tags.push('King Safety');
    if (['d4', 'e4', 'd5', 'e5'].includes(to)) tags.push('Center Control');

    if (opening) {
      if (ply <= 2) {
        return {
          title,
          mood,
          tags,
          body: `Standard opening theory in the ${opening.name} (${opening.eco})—claiming central space right from move one.`,
        };
      }
      if (isCastle) {
        return {
          title,
          mood,
          tags,
          body: `Following ${opening.name} theory—tucking your king away safely while bringing your rook toward the center.`,
        };
      }
      return {
        title,
        mood,
        tags,
        body: `You're right in ${opening.name} (${opening.eco}) theory—solid development keeping your pieces coordinated.`,
      };
    }
    return {
      title,
      mood,
      tags,
      body: 'Standard opening theory—developing smoothly and contesting key central squares.',
    };
  }

  // 4. Brilliant moves
  if (classification === 'brilliant') {
    tags.push('Sacrifice');
    const forkTargets = detectForkTargets(fenAfter, to, color);
    if (mateForMoverAfter !== null && mateForMoverAfter > 0) {
      tags.push('Forced Mate');
      return {
        title,
        mood,
        tags,
        body: `Stunning sacrifice! Giving up material with ${san} forces checkmate in ${mateForMoverAfter} moves.`,
        tip: continuationSan.length > 0 ? `Line: ${continuationSan.slice(0, 4).join(' ')}` : undefined,
      };
    }
    if (forkTargets.length >= 2) {
      tags.push('Fork');
      return {
        title,
        mood,
        tags,
        body: `Inspired tactical sacrifice! ${san} cracks open the defense while attacking both the ${forkTargets[0]} and ${forkTargets[1]}.`,
        tip: continuationSan.length > 0 ? `Line: ${continuationSan.slice(0, 3).join(' ')}` : undefined,
      };
    }
    return {
      title,
      mood,
      tags,
      body: `Brilliant resource! You sacrificed material with ${san} to seize a decisive initiative that cannot be refuted.`,
      tip: continuationSan.length > 0 ? `Continuation: ${continuationSan.slice(0, 3).join(' ')}` : undefined,
    };
  }

  // 5. Great moves
  if (classification === 'great') {
    tags.push('Only Move');
    if (mateForMoverAfter !== null && mateForMoverAfter > 0) {
      tags.push('Forced Mate');
      return {
        title,
        mood,
        tags,
        body: `Clutch calculation! ${san} was the only move to lock in forced checkmate in ${mateForMoverAfter}.`,
        tip: continuationSan.length > 0 ? `Line: ${continuationSan.slice(0, 3).join(' ')}` : undefined,
      };
    }
    const forks = detectForkTargets(fenAfter, to, color);
    if (forks.length >= 2) {
      tags.push('Fork');
      return {
        title,
        mood,
        tags,
        body: `Sharp tactical eye! ${san} finds the critical fork against the ${forks[0]} and ${forks[1]}.`,
      };
    }
    const pin = detectPinCreated(fenAfter, to, color);
    if (pin) {
      tags.push('Pin');
      return {
        title,
        mood,
        tags,
        body: `Great precision! ${san} pins the ${pin.pinnedPiece} to the ${pin.behindPiece}—the only move that keeps your edge.`,
      };
    }
    return {
      title,
      mood,
      tags,
      body: `Clinical accuracy! ${san} was the one critical move in a razor-sharp position—every alternative lost major ground.`,
    };
  }

  // 6. Positive moves (Best, Excellent, Good)
  if (classification === 'best' || classification === 'excellent' || classification === 'good') {
    const altTip =
      classification !== 'best' && bestMoveSan && bestMoveSan !== san
        ? `Even sharper: ${bestMoveSan} (${bestLineSan.slice(0, 3).join(' ')})`
        : undefined;

    if (mateForMoverAfter !== null && mateForMoverAfter > 0) {
      tags.push('Forced Mate');
      return {
        title,
        mood,
        tags,
        body: `Right on track! You maintain a forced checkmate in ${mateForMoverAfter} moves.`,
        tip: continuationSan.length > 0 ? `Line: ${continuationSan.slice(0, 3).join(' ')}` : undefined,
      };
    }

    if (isCastle) {
      tags.push('King Safety');
      return {
        title,
        mood,
        tags,
        body: 'Castling tucks your king into shelter and connects your rooks for the middlegame.',
        tip: altTip,
      };
    }

    const forks = detectForkTargets(fenAfter, to, color);
    if (forks.length >= 2) {
      tags.push('Fork');
      return {
        title,
        mood,
        tags,
        body: `Sharp tactical shot—${san} forks the ${forks[0]} and ${forks[1]} at once!`,
      };
    }

    const pin = detectPinCreated(fenAfter, to, color);
    if (pin) {
      tags.push('Pin');
      return {
        title,
        mood,
        tags,
        body: `Nice pin! ${san} ties down the ${pin.pinnedPiece} against the ${pin.behindPiece}.`,
        tip: altTip,
      };
    }

    if (checkPassedPawn(fenAfter, to, color)) {
      tags.push('Passed Pawn');
      return {
        title,
        mood,
        tags,
        body: `Pushing your passed ${to[0]}-pawn forces your opponent onto the defensive toward promotion.`,
        tip: altTip,
      };
    }

    if (detectOpenFileRook(fenAfter, to, piece)) {
      tags.push('Open File');
      return {
        title,
        mood,
        tags,
        body: `Strong positional play—claiming the open ${to[0]}-file activates your rook nicely.`,
        tip: altTip,
      };
    }

    if (captured) {
      const capName = PIECE_NAMES[captured] || 'piece';
      return {
        title,
        mood,
        tags: ['Capture'],
        body: `Capturing the ${capName} on ${to} keeps your position healthy and active.`,
        tip: altTip,
      };
    }

    if (isCheck) {
      return {
        title,
        mood,
        tags: ['Check'],
        body: `${san} delivers an accurate check, forcing the enemy king onto a more passive square.`,
        tip: altTip,
      };
    }

    if (ply <= 14 && (piece === 'n' || piece === 'b')) {
      return {
        title,
        mood,
        tags: ['Development'],
        body: `Solid development—bringing your ${PIECE_NAMES[piece]} into the battle for central squares.`,
        tip: altTip,
      };
    }

    if (classification === 'best') {
      return {
        title,
        mood,
        tags: ['Top Choice'],
        body: `Engine's #1 choice! ${san} maximizes your piece harmony and keeps pressure on the board.`,
      };
    }

    return {
      title,
      mood,
      tags: ['Solid'],
      body: `A practical, solid move that keeps your structure intact.`,
      tip: altTip,
    };
  }

  // 7. Negative moves (Inaccuracy, Mistake, Miss, Blunder)
  const bestReason = describeMovePurpose(fenBefore, bestMoveUci, bestMoveSan);
  const bestSeqTip =
    bestMoveSan && bestMoveSan !== san
      ? `Better: ${bestMoveSan}${bestLineSan.length > 1 ? ` (${bestLineSan.slice(0, 3).join(' ')})` : ''} — ${bestReason}`
      : undefined;

  // Allowed forced checkmate!
  if (
    mateForMoverAfter !== null &&
    mateForMoverAfter < 0 &&
    (mateForMoverBefore === null || mateForMoverBefore >= 0)
  ) {
    tags.push('Allowed Mate');
    const oppFirst = continuationSan[0] ? ` starting with ${continuationSan[0]}` : '';
    return {
      title,
      mood,
      tags,
      body: `Critical oversight—this allows a forced checkmate in ${Math.abs(
        mateForMoverAfter
      )} moves${oppFirst}.`,
      tip: bestSeqTip,
    };
  }

  // Missed forced checkmate!
  if (
    mateForMoverBefore !== null &&
    mateForMoverBefore > 0 &&
    (mateForMoverAfter === null || mateForMoverAfter <= 0)
  ) {
    tags.push('Missed Mate');
    return {
      title,
      mood,
      tags,
      body: `You had a forced checkmate in ${mateForMoverBefore} moves! ${san} lets your opponent escape.`,
      tip: bestSeqTip,
    };
  }

  // Missed Win after opponent's blunder
  if (classification === 'miss') {
    tags.push('Missed Tactic');
    const missedGain = simulateMaterialGain(fenBefore, bestLineUci, color);
    if (missedGain >= 2 && bestMoveSan) {
      return {
        title,
        mood,
        tags,
        body: `Your opponent left a big opening! You missed ${bestMoveSan}, which wins ${describeMaterialSwing(
          missedGain
        )}.`,
        tip: bestSeqTip,
      };
    }
    return {
      title,
      mood,
      tags,
      body: `Missed opportunity to punish your opponent's slip on the previous turn.`,
      tip: bestSeqTip,
    };
  }

  // Newly hanging friendly piece
  const hangingBefore = new Set(
    findHangingPieces(fenBefore, color).map((h) => `${h.pieceType}@${h.square}`)
  );
  const hangingAfter = findHangingPieces(fenAfter, color);
  const newlyHanging = hangingAfter.find((h) => !hangingBefore.has(`${h.pieceType}@${h.square}`));

  const oppCaptureMove = continuationUci[0] ? uciToMoveObj(continuationUci[0]) : null;
  if (newlyHanging) {
    tags.push('Hanging Piece');
    const punishedImmediately = oppCaptureMove && oppCaptureMove.to === newlyHanging.square;
    const punishText =
      punishedImmediately && continuationSan[0]
        ? `, allowing ${continuationSan[0]}`
        : '';
    return {
      title,
      mood,
      tags,
      body: `Watch out—this leaves your ${newlyHanging.pieceName} on ${newlyHanging.square} undefended${punishText}.`,
      tip: bestSeqTip,
    };
  }

  // Opponent's continuation wins material tactically
  if (continuationUci.length > 0 && continuationSan.length > 0) {
    const enemyColor = color === 'w' ? 'b' : 'w';
    const oppGain = simulateMaterialGain(fenAfter, continuationUci, enemyColor);
    if (oppGain >= 2) {
      tags.push('Drops Material');
      const oppLine = continuationSan.slice(0, 3).join(' ');
      return {
        title,
        mood,
        tags,
        body: `This walks into ${oppLine}, losing ${describeMaterialSwing(oppGain)}.`,
        tip: bestSeqTip,
      };
    }
  }

  // Missed a strong tactical sequence
  const missedTacticGain = simulateMaterialGain(fenBefore, bestLineUci, color);
  if (missedTacticGain >= 2 && bestMoveSan) {
    tags.push('Missed Tactic');
    return {
      title,
      mood,
      tags,
      body: `You overlooked a tactical sequence starting with ${bestMoveSan} that wins ${describeMaterialSwing(
        missedTacticGain
      )}.`,
      tip: bestSeqTip,
    };
  }

  if (isCastle && (classification === 'mistake' || classification === 'blunder')) {
    tags.push('King Safety');
    const oppReply = continuationSan[0] ? ` ${continuationSan[0]} puts immediate pressure on your king.` : '';
    return {
      title,
      mood,
      tags,
      body: `Castling into danger here gives your opponent a dangerous attack.${oppReply}`,
      tip: bestSeqTip,
    };
  }

  if (classification === 'blunder') {
    tags.push('Eval Swing');
    const punish = continuationSan[0]
      ? ` Your opponent can punish this immediately with ${continuationSan[0]}.`
      : '';
    return {
      title,
      mood,
      tags,
      body: `A costly slip that swings the evaluation heavily against you.${punish}`,
      tip: bestSeqTip,
    };
  }

  if (classification === 'mistake') {
    tags.push('Positional Slip');
    const punish = continuationSan[0]
      ? ` ${continuationSan[0]} gives your opponent strong counterplay.`
      : '';
    return {
      title,
      mood,
      tags,
      body: `This surrenders key control of the position.${punish}`,
      tip: bestSeqTip,
    };
  }

  tags.push('Inaccuracy');
  return {
    title,
    mood,
    tags,
    body: `A slightly passive move that makes your opponent's defense easier.`,
    tip: bestSeqTip,
  };
}

export function generateSummaryReaction(
  game: GameMetadata,
  whiteAccuracy: number,
  blackAccuracy: number,
  plies: ReviewedPly[]
): { quote: string; mood: AlyMood } {
  const userColor = game.perspective;
  const userAcc = userColor === 'w' ? whiteAccuracy : blackAccuracy;
  const userWon =
    (userColor === 'w' && game.result === '1-0') ||
    (userColor === 'b' && game.result === '0-1');
  const userLost =
    (userColor === 'w' && game.result === '0-1') ||
    (userColor === 'b' && game.result === '1-0');

  const userBrilliants = plies.filter(
    (p) => p.color === userColor && p.classification === 'brilliant'
  ).length;
  const userGreats = plies.filter(
    (p) => p.color === userColor && p.classification === 'great'
  ).length;
  const userBlunders = plies.filter(
    (p) => p.color === userColor && p.classification === 'blunder'
  ).length;

  if (userBrilliants > 0 && userWon) {
    return {
      quote: `Sensational game! You found ${userBrilliants} brilliant ${
        userBrilliants === 1 ? 'sacrifice' : 'sacrifices'
      } and finished with ${userAcc.toFixed(1)}% accuracy!`,
      mood: 'excited',
    };
  }

  if (userWon) {
    if (userAcc >= 85) {
      return {
        quote: `Clinical victory! At ${userAcc.toFixed(1)}% accuracy, you controlled the board like a machine.`,
        mood: 'excited',
      };
    }
    if (userGreats >= 2) {
      return {
        quote: `Great fighting win! You spotted ${userGreats} critical only-moves when the tension peaked.`,
        mood: 'happy',
      };
    }
    return {
      quote: `Nice win! There were a few wild swings along the way—let's check the key moments together.`,
      mood: 'happy',
    };
  }

  if (userLost) {
    if (userAcc >= 78) {
      return {
        quote: `Tough break! You played strong chess (${userAcc.toFixed(1)}%), and just one sharp turn swung the game.`,
        mood: 'thinking',
      };
    }
    if (userBlunders >= 2) {
      return {
        quote: `It didn't go your way, but no sweat! Let's review those crucial moves and spot the tactics you missed.`,
        mood: 'concerned',
      };
    }
    return {
      quote: `It didn't go your way, but no sweat! Let's review those crucial moves.`,
      mood: 'thinking',
    };
  }

  return {
    quote: `A hard-fought battle! Let's step through the critical turning points from both sides.`,
    mood: 'neutral',
  };
}

export function getClassificationLabel(cls: MoveClassification): string {
  return CLASSIFICATION_META[cls].label;
}
