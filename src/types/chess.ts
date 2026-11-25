export type AppMode = 'home' | 'review' | 'analysis' | 'play-aly' | 'local-2p' | 'profile';

export type BoardThemeId = 'green' | 'brown' | 'icy' | 'slate';

export interface BoardTheme {
  id: BoardThemeId;
  name: string;
  light: string;
  dark: string;
  highlightLight: string;
  highlightDark: string;
}

export const BOARD_THEMES: Record<BoardThemeId, BoardTheme> = {
  green: {
    id: 'green',
    name: 'Classic Green',
    light: '#ebecd0',
    dark: '#739552',
    highlightLight: '#f5f682',
    highlightDark: '#b9ca43',
  },
  brown: {
    id: 'brown',
    name: 'Wood Walnut',
    light: '#f0d9b5',
    dark: '#b58863',
    highlightLight: '#f7ec6e',
    highlightDark: '#dac34b',
  },
  icy: {
    id: 'icy',
    name: 'Icy Sea',
    light: '#dee3e6',
    dark: '#788a94',
    highlightLight: '#e6ea83',
    highlightDark: '#a6b963',
  },
  slate: {
    id: 'slate',
    name: 'Tournament Slate',
    light: '#e8e9eb',
    dark: '#4b7399',
    highlightLight: '#f2f07e',
    highlightDark: '#87a86b',
  },
};

export type MoveClassification =
  | 'brilliant'
  | 'great'
  | 'best'
  | 'excellent'
  | 'good'
  | 'book'
  | 'inaccuracy'
  | 'mistake'
  | 'miss'
  | 'blunder';

export interface ClassificationMeta {
  key: MoveClassification;
  label: string;
  shortSymbol: string;
  color: string;
  bgTint: string;
  isKeyMove: boolean;
}

export const CLASSIFICATION_META: Record<MoveClassification, ClassificationMeta> = {
  brilliant: {
    key: 'brilliant',
    label: 'Brilliant',
    shortSymbol: '!!',
    color: '#1baca6',
    bgTint: 'rgba(27, 172, 166, 0.14)',
    isKeyMove: true,
  },
  great: {
    key: 'great',
    label: 'Great',
    shortSymbol: '!',
    color: '#5c8bb0',
    bgTint: 'rgba(92, 139, 176, 0.14)',
    isKeyMove: true,
  },
  best: {
    key: 'best',
    label: 'Best',
    shortSymbol: '★',
    color: '#96bc4b',
    bgTint: 'rgba(150, 188, 75, 0.14)',
    isKeyMove: false,
  },
  excellent: {
    key: 'excellent',
    label: 'Excellent',
    shortSymbol: '👍',
    color: '#96bc4b',
    bgTint: 'rgba(150, 188, 75, 0.12)',
    isKeyMove: false,
  },
  good: {
    key: 'good',
    label: 'Good',
    shortSymbol: '✓',
    color: '#95af8a',
    bgTint: 'rgba(149, 175, 138, 0.12)',
    isKeyMove: false,
  },
  book: {
    key: 'book',
    label: 'Book',
    shortSymbol: '📖',
    color: '#a88865',
    bgTint: 'rgba(168, 136, 101, 0.14)',
    isKeyMove: false,
  },
  inaccuracy: {
    key: 'inaccuracy',
    label: 'Inaccuracy',
    shortSymbol: '?!',
    color: '#f7c045',
    bgTint: 'rgba(247, 192, 69, 0.16)',
    isKeyMove: true,
  },
  mistake: {
    key: 'mistake',
    label: 'Mistake',
    shortSymbol: '?',
    color: '#e58f2a',
    bgTint: 'rgba(229, 143, 42, 0.16)',
    isKeyMove: true,
  },
  miss: {
    key: 'miss',
    label: 'Miss',
    shortSymbol: '✕',
    color: '#ca3431',
    bgTint: 'rgba(202, 52, 49, 0.16)',
    isKeyMove: true,
  },
  blunder: {
    key: 'blunder',
    label: 'Blunder',
    shortSymbol: '??',
    color: '#fa412d',
    bgTint: 'rgba(250, 65, 45, 0.16)',
    isKeyMove: true,
  },
};

export const CLASSIFICATION_ORDER: MoveClassification[] = [
  'brilliant',
  'great',
  'best',
  'excellent',
  'good',
  'book',
  'inaccuracy',
  'mistake',
  'miss',
  'blunder',
];

export type AlyMood =
  | 'happy'
  | 'excited'
  | 'neutral'
  | 'thinking'
  | 'concerned'
  | 'shocked'
  | 'book';

export interface EngineLine {
  multipv: number;
  depth: number;
  /** Centipawns strictly from White's perspective (mate mapped to ±(10000 - |N|*10)) */
  cpWhite: number;
  /** Mate in N strictly from White's perspective (+N = White mates, -N = Black mates) */
  mateWhite: number | null;
  pvUci: string[];
  pvSan: string[];
}

export interface PositionEvaluation {
  fen: string;
  depth: number;
  cpWhite: number;
  mateWhite: number | null;
  winPctWhite: number;
  lines: EngineLine[];
}

export interface ReviewedPly {
  ply: number; // 0 = initial setup, 1..N = moves
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

  // Engine evaluation after this ply
  cpWhite: number;
  mateWhite: number | null;
  winPctWhite: number;
  lines: EngineLine[];

  // Classification & accuracy (present for ply >= 1)
  classification?: MoveClassification;
  moveAccuracy?: number;
  winProbBefore?: number;
  winProbAfter?: number;
  winProbLoss?: number;
  bestMoveUci?: string;
  bestMoveSan?: string;
  bestLineUci?: string[];
  bestLineSan?: string[];
  continuationUci?: string[];
  continuationSan?: string[];
  threatUci?: string;
  opening?: { eco: string; name: string };
  coachTitle?: string;
  coachBody?: string;
  coachTip?: string;
  coachTags?: string[];
  alyMood?: AlyMood;
}

export interface PlayerMetadata {
  username: string;
  rating: number;
  country?: string;
  avatarUrl?: string;
  title?: string;
  league?: string;
  isBot?: boolean;
}

export interface ChessComRatingStat {
  rating: number;
  bestRating?: number;
  bestGameUrl?: string;
  win: number;
  loss: number;
  draw: number;
}

export interface ChessComPlayerProfile {
  username: string;
  displayUsername: string;
  name?: string;
  title?: string;
  avatar?: string;
  countryCode?: string;
  followers: number;
  joined?: number;
  lastOnline?: number;
  status?: string;
  league?: string;
  url?: string;
  stats: {
    rapid?: ChessComRatingStat;
    blitz?: ChessComRatingStat;
    bullet?: ChessComRatingStat;
    daily?: ChessComRatingStat;
    tacticsHighest?: number;
    puzzleRushBest?: number;
  };
}

export interface GameMetadata {
  id: string;
  url?: string;
  white: PlayerMetadata;
  black: PlayerMetadata;
  result: '1-0' | '0-1' | '1/2-1/2' | '*';
  termination?: string;
  timeControl: string;
  date?: string;
  eco?: string;
  openingName?: string;
  pgn: string;
  perspective: 'w' | 'b';
}

export interface GameReviewReport {
  game: GameMetadata;
  plies: ReviewedPly[];
  whiteAccuracy: number;
  blackAccuracy: number;
  whiteEstimatedElo: number;
  blackEstimatedElo: number;
  whiteCounts: Record<MoveClassification, number>;
  blackCounts: Record<MoveClassification, number>;
  opening: { eco: string; name: string };
  summaryQuote: string;
  summaryMood: AlyMood;
}

export interface BoardArrow {
  from: string;
  to: string;
  color: string;
  opacity?: number;
}

export interface ChessComArchiveGame {
  id: string;
  url: string;
  pgn: string;
  time_control: string;
  time_class: string;
  end_time: number;
  rated: boolean;
  white: {
    username: string;
    rating: number;
    result: string;
  };
  black: {
    username: string;
    rating: number;
    result: string;
  };
}
