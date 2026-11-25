import { Chess } from 'chess.js';
import { ChessComArchiveGame, GameMetadata } from '../types/chess';
import { lookupOpeningByFen } from './ecoBook';

export const PIECE_VALUES: Record<string, number> = {
  p: 1,
  n: 3,
  b: 3,
  r: 5,
  q: 9,
  k: 0,
};

export interface MaterialBreakdown {
  whitePoints: number;
  blackPoints: number;
  whiteAdvantage: number; // >0 if White is ahead
  blackAdvantage: number; // >0 if Black is ahead
  capturedByWhite: ('q' | 'r' | 'b' | 'n' | 'p')[]; // Black pieces captured by White
  capturedByBlack: ('q' | 'r' | 'b' | 'n' | 'p')[]; // White pieces captured by Black
}

const STARTING_COUNTS: Record<'q' | 'r' | 'b' | 'n' | 'p', number> = {
  q: 1,
  r: 2,
  b: 2,
  n: 2,
  p: 8,
};

export function computeMaterial(fen: string): MaterialBreakdown {
  const boardPart = fen.split(' ')[0] || '';
  const whiteCounts: Record<'q' | 'r' | 'b' | 'n' | 'p', number> = { q: 0, r: 0, b: 0, n: 0, p: 0 };
  const blackCounts: Record<'q' | 'r' | 'b' | 'n' | 'p', number> = { q: 0, r: 0, b: 0, n: 0, p: 0 };

  for (const ch of boardPart) {
    const lower = ch.toLowerCase();
    if (lower === 'q' || lower === 'r' || lower === 'b' || lower === 'n' || lower === 'p') {
      if (ch === lower) {
        blackCounts[lower]++;
      } else {
        whiteCounts[lower]++;
      }
    }
  }

  const whitePoints =
    whiteCounts.q * 9 + whiteCounts.r * 5 + whiteCounts.b * 3 + whiteCounts.n * 3 + whiteCounts.p * 1;
  const blackPoints =
    blackCounts.q * 9 + blackCounts.r * 5 + blackCounts.b * 3 + blackCounts.n * 3 + blackCounts.p * 1;

  const capturedByWhite: ('q' | 'r' | 'b' | 'n' | 'p')[] = [];
  const capturedByBlack: ('q' | 'r' | 'b' | 'n' | 'p')[] = [];

  (['q', 'r', 'b', 'n', 'p'] as const).forEach((piece) => {
    const missingBlack = Math.max(0, STARTING_COUNTS[piece] - blackCounts[piece]);
    for (let i = 0; i < missingBlack; i++) capturedByWhite.push(piece);

    const missingWhite = Math.max(0, STARTING_COUNTS[piece] - whiteCounts[piece]);
    for (let i = 0; i < missingWhite; i++) capturedByBlack.push(piece);
  });

  return {
    whitePoints,
    blackPoints,
    whiteAdvantage: Math.max(0, whitePoints - blackPoints),
    blackAdvantage: Math.max(0, blackPoints - whitePoints),
    capturedByWhite,
    capturedByBlack,
  };
}

export function formatInitialClock(timeControl?: string): string {
  if (!timeControl || timeControl === '-') return '3:00';
  if (timeControl.includes('/')) {
    return 'Daily';
  }
  const baseSec = parseInt(timeControl.split('+')[0], 10);
  if (Number.isNaN(baseSec) || baseSec <= 0) return '3:00';
  const mins = Math.floor(baseSec / 60);
  const secs = baseSec % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function formatPgnClock(rawClk?: string, fallback = '3:00'): string {
  if (!rawClk) return fallback;
  // Format examples: "0:02:58.9", "0:10:00", "1:05:12"
  const parts = rawClk.trim().split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0], 10) || 0;
    const mins = parseInt(parts[1], 10) || 0;
    const secFloat = parseFloat(parts[2]) || 0;
    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, '0')}:${Math.floor(secFloat).toString().padStart(2, '0')}`;
    }
    if (mins === 0 && secFloat < 10) {
      return `0:0${secFloat.toFixed(1)}`;
    }
    if (mins === 0 && secFloat < 20 && rawClk.includes('.')) {
      return `0:${secFloat.toFixed(1).padStart(4, '0')}`;
    }
    return `${mins}:${Math.floor(secFloat).toString().padStart(2, '0')}`;
  }
  return rawClk;
}

export function formatCountdownMs(ms: number): string {
  const clamped = Math.max(0, ms);
  const totalSec = clamped / 1000;
  if (totalSec < 10) {
    return `0:0${totalSec.toFixed(1)}`;
  }
  const mins = Math.floor(totalSec / 60);
  const secs = Math.floor(totalSec % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export function extractClocksFromPgn(pgn: string): string[] {
  const clocks: string[] = [];
  const regex = /\[%clk\s+([0-9:.]+)\]/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(pgn)) !== null) {
    clocks.push(match[1]);
  }
  return clocks;
}

export function uciToMoveObj(uci: string): { from: string; to: string; promotion?: string } | null {
  if (!uci || uci.length < 4 || uci === '(none)') return null;
  const from = uci.slice(0, 2);
  const to = uci.slice(2, 4);
  const promotion = uci.length > 4 ? uci[4].toLowerCase() : undefined;
  return { from, to, promotion };
}

export function uciLineToSan(fen: string, uciMoves: string[], maxPlies = 8): string[] {
  const sanList: string[] = [];
  let chess: Chess;
  try {
    chess = new Chess(fen);
  } catch {
    return sanList;
  }

  for (let i = 0; i < Math.min(uciMoves.length, maxPlies); i++) {
    const parsed = uciToMoveObj(uciMoves[i]);
    if (!parsed) break;
    try {
      const m = chess.move(parsed);
      if (!m) break;
      sanList.push(m.san);
    } catch {
      break;
    }
  }
  return sanList;
}

export function formatEvalBadge(cpWhite: number, mateWhite: number | null): string {
  if (mateWhite === 0) {
    return cpWhite >= 0 ? '1-0' : '0-1';
  }
  if (mateWhite !== null) {
    const sign = mateWhite > 0 ? '+' : '-';
    return `${sign}M${Math.abs(mateWhite)}`;
  }
  const pawns = cpWhite / 100;
  if (Math.abs(pawns) < 0.05) return '0.00';
  return `${pawns > 0 ? '+' : ''}${pawns.toFixed(2)}`;
}

export function formatEvalBarLabel(cpWhite: number, mateWhite: number | null): string {
  if (mateWhite === 0) {
    return cpWhite >= 0 ? '1-0' : '0-1';
  }
  if (mateWhite !== null) {
    return `M${Math.abs(mateWhite)}`;
  }
  const absPawns = Math.abs(cpWhite) / 100;
  if (absPawns < 0.05) return '0.0';
  if (absPawns >= 10) return absPawns.toFixed(0);
  return absPawns.toFixed(1);
}

export function parsePgnOrFenInput(
  rawInput: string,
  preferredUsername = 'IceChoker'
): GameMetadata {
  const trimmed = rawInput.trim();
  if (!trimmed) {
    throw new Error('Please enter a valid PGN or FEN string.');
  }

  // Check if input is a bare FEN string (6 space-separated fields with slashes in field 0)
  const fenCandidateParts = trimmed.split(/\s+/);
  if (
    !trimmed.includes('[') &&
    fenCandidateParts.length >= 4 &&
    fenCandidateParts.length <= 6 &&
    (fenCandidateParts[0].match(/\//g) || []).length === 7
  ) {
    const chess = new Chess(trimmed);
    const pgn = `[SetUp "1"]\n[FEN "${chess.fen()}"]\n\n*`;
    return {
      id: `fen-${Date.now()}`,
      white: { username: preferredUsername || 'White', rating: 1200 },
      black: { username: 'Opponent', rating: 1200 },
      result: '*',
      timeControl: '600',
      pgn,
      perspective: chess.turn(),
    };
  }

  const chess = new Chess();
  chess.loadPgn(trimmed);
  const headers = chess.getHeaders();

  const whiteName = headers.White || 'White';
  const blackName = headers.Black || 'Black';
  const whiteRating = parseInt(headers.WhiteElo || '1200', 10) || 1200;
  const blackRating = parseInt(headers.BlackElo || '1200', 10) || 1200;
  const rawResult = headers.Result;
  const result: GameMetadata['result'] =
    rawResult === '1-0' || rawResult === '0-1' || rawResult === '1/2-1/2' ? rawResult : '*';

  // Detect opening by walking moves
  const replay = new Chess();
  let lastOpening = lookupOpeningByFen(replay.fen());
  for (const move of chess.history()) {
    replay.move(move);
    const found = lookupOpeningByFen(replay.fen());
    if (found) lastOpening = found;
  }

  const prefLower = preferredUsername.trim().toLowerCase();
  const perspective: 'w' | 'b' =
    blackName.toLowerCase() === prefLower && whiteName.toLowerCase() !== prefLower ? 'b' : 'w';

  return {
    id: `pgn-${Date.now()}`,
    url: headers.Link || (headers.Site?.startsWith('http') ? headers.Site : undefined),
    white: {
      username: whiteName,
      rating: whiteRating,
    },
    black: {
      username: blackName,
      rating: blackRating,
    },
    result,
    termination: headers.Termination || undefined,
    timeControl: headers.TimeControl || '180',
    date: headers.Date || undefined,
    eco: lastOpening?.eco || headers.ECO || undefined,
    openingName: lastOpening?.name || headers.Opening || undefined,
    pgn: trimmed,
    perspective,
  };
}

export function parseChessComGameId(input: string): string | null {
  const trimmed = input.trim();
  if (/^\d{7,15}$/.test(trimmed)) {
    return trimmed;
  }
  // Matches chess.com/game/live/187960315194?, /analysis/game/live/..., /live/game/..., /game/daily/...
  const match = trimmed.match(/(?:\/(?:game\/(?:live|daily)|(?:live|daily)\/game)\/)(\d+)/i);
  if (match) return match[1];
  // Fallback: last long numeric segment before query/hash
  const fallback = trimmed.match(/\/(\d{7,15})(?:[/?#]|$)/);
  return fallback ? fallback[1] : null;
}

export async function fetchRecentChessComGames(
  username: string,
  limit = 10
): Promise<ChessComArchiveGame[]> {
  const cleanUser = username.trim().toLowerCase();
  if (!cleanUser) {
    throw new Error('Please enter a Chess.com username.');
  }

  const archRes = await fetch(`https://api.chess.com/pub/player/${encodeURIComponent(cleanUser)}/games/archives`);
  if (!archRes.ok) {
    if (archRes.status === 404) {
      throw new Error(`Chess.com player "${username}" was not found.`);
    }
    throw new Error(`Chess.com API returned status ${archRes.status}.`);
  }

  const archJson = (await archRes.json()) as { archives?: string[] };
  const archives = archJson.archives || [];
  if (archives.length === 0) {
    return [];
  }

  const collected: ChessComArchiveGame[] = [];
  // Iterate from newest monthly archive backwards until we have `limit` games
  for (let i = archives.length - 1; i >= Math.max(0, archives.length - 4); i--) {
    const monthRes = await fetch(archives[i]);
    if (!monthRes.ok) continue;
    const monthJson = (await monthRes.json()) as {
      games?: Array<{
        url: string;
        pgn?: string;
        time_control: string;
        time_class: string;
        end_time: number;
        rated: boolean;
        rules?: string;
        white: { username: string; rating: number; result: string };
        black: { username: string; rating: number; result: string };
      }>;
    };

    const games = (monthJson.games || []).filter(
      (g) => g.pgn && (!g.rules || g.rules === 'chess')
    );

    for (let gIdx = games.length - 1; gIdx >= 0; gIdx--) {
      const g = games[gIdx];
      const idMatch = g.url.match(/\/(\d+)$/);
      collected.push({
        id: idMatch ? idMatch[1] : `${g.end_time}`,
        url: g.url,
        pgn: g.pgn!,
        time_control: g.time_control,
        time_class: g.time_class,
        end_time: g.end_time,
        rated: g.rated,
        white: g.white,
        black: g.black,
      });
      if (collected.length >= limit) {
        return collected;
      }
    }
  }

  return collected;
}

export async function fetchChessComGameByUrl(
  urlOrId: string,
  username: string
): Promise<GameMetadata> {
  const gameId = parseChessComGameId(urlOrId);
  if (!gameId) {
    throw new Error(
      'Invalid Chess.com game URL. Try pasting e.g. chess.com/game/live/187960315194'
    );
  }

  const effectiveUser = (username || 'IceChoker').trim();
  const cleanUser = effectiveUser.toLowerCase();

  const archRes = await fetch(
    `https://api.chess.com/pub/player/${encodeURIComponent(cleanUser)}/games/archives`
  );
  if (!archRes.ok) {
    if (archRes.status === 404) {
      throw new Error(`Chess.com player "${effectiveUser}" was not found.`);
    }
    throw new Error(`Chess.com API error (${archRes.status}).`);
  }

  const archJson = (await archRes.json()) as { archives?: string[] };
  const archives = (archJson.archives || []).slice().reverse();
  const idMatcher = new RegExp(`/${gameId}(?:[/?#]|$)`);

  // Scan archives in fast parallel batches of 3 (newest first) across full archive history
  for (let i = 0; i < archives.length; i += 3) {
    const batch = archives.slice(i, i + 3);
    const results = await Promise.all(
      batch.map(async (url) => {
        try {
          const r = await fetch(url);
          if (!r.ok) return null;
          return (await r.json()) as {
            games?: Array<{
              url: string;
              pgn?: string;
              time_control: string;
              white: { username: string; rating: number; result: string };
              black: { username: string; rating: number; result: string };
            }>;
          };
        } catch {
          return null;
        }
      })
    );

    for (const monthJson of results) {
      if (!monthJson?.games) continue;
      const found = monthJson.games.find(
        (g) => g.url && idMatcher.test(g.url) && Boolean(g.pgn)
      );
      if (found && found.pgn) {
        const meta = parsePgnOrFenInput(found.pgn, effectiveUser);
        meta.id = gameId;
        meta.url = found.url;
        meta.white.username = found.white.username;
        meta.white.rating = found.white.rating;
        meta.black.username = found.black.username;
        meta.black.rating = found.black.rating;
        meta.timeControl = found.time_control || meta.timeControl;
        return meta;
      }
    }
  }

  throw new Error(
    `Game #${gameId} was not found in ${effectiveUser}'s Chess.com archives. Verify the username belongs to one of the players in that game.`
  );
}

export function archiveGameToMetadata(
  item: ChessComArchiveGame,
  preferredUsername = 'IceChoker'
): GameMetadata {
  const meta = parsePgnOrFenInput(item.pgn, preferredUsername);
  meta.id = item.id;
  meta.url = item.url;
  meta.white.username = item.white.username;
  meta.white.rating = item.white.rating;
  meta.black.username = item.black.username;
  meta.black.rating = item.black.rating;
  meta.timeControl = item.time_control || meta.timeControl;
  return meta;
}
