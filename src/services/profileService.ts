import {
  ChessComPlayerProfile,
  ChessComRatingStat,
  GameMetadata,
} from '../types/chess';

const profileCache = new Map<string, Promise<ChessComPlayerProfile | null>>();
const resolvedProfiles = new Map<string, ChessComPlayerProfile>();

function parseStatBlock(raw?: {
  last?: { rating?: number };
  best?: { rating?: number; game?: string };
  record?: { win?: number; loss?: number; draw?: number };
}): ChessComRatingStat | undefined {
  if (!raw?.last?.rating) return undefined;
  return {
    rating: raw.last.rating,
    bestRating: raw.best?.rating,
    bestGameUrl: raw.best?.game,
    win: raw.record?.win ?? 0,
    loss: raw.record?.loss ?? 0,
    draw: raw.record?.draw ?? 0,
  };
}

function extractCountryCode(countryUrl?: string): string | undefined {
  if (!countryUrl) return undefined;
  const parts = countryUrl.split('/').filter(Boolean);
  const code = parts[parts.length - 1];
  if (code && code.length === 2) return code.toUpperCase();
  return undefined;
}

export function countryCodeToFlag(code?: string): string {
  if (!code || code.length !== 2) return '';
  const upper = code.toUpperCase();
  if (!/^[A-Z]{2}$/.test(upper)) return '';
  const cp1 = 0x1f1e6 + (upper.charCodeAt(0) - 65);
  const cp2 = 0x1f1e6 + (upper.charCodeAt(1) - 65);
  return String.fromCodePoint(cp1, cp2);
}

export function getCachedProfile(username: string): ChessComPlayerProfile | undefined {
  return resolvedProfiles.get(username.trim().toLowerCase());
}

export function fetchChessComProfile(
  username: string
): Promise<ChessComPlayerProfile | null> {
  const clean = username.trim().toLowerCase();
  if (!clean || clean === 'white' || clean === 'black' || clean === 'player 2' || clean.startsWith('aly')) {
    return Promise.resolve(null);
  }

  const existing = profileCache.get(clean);
  if (existing) return existing;

  const promise = (async (): Promise<ChessComPlayerProfile | null> => {
    try {
      const [profileRes, statsRes] = await Promise.all([
        fetch(`https://api.chess.com/pub/player/${encodeURIComponent(clean)}`),
        fetch(`https://api.chess.com/pub/player/${encodeURIComponent(clean)}/stats`),
      ]);

      if (!profileRes.ok) return null;
      const pJson = (await profileRes.json()) as {
        username?: string;
        name?: string;
        title?: string;
        avatar?: string;
        country?: string;
        followers?: number;
        joined?: number;
        last_online?: number;
        status?: string;
        league?: string;
        url?: string;
      };

      const sJson = statsRes.ok
        ? ((await statsRes.json()) as {
            chess_rapid?: Parameters<typeof parseStatBlock>[0];
            chess_blitz?: Parameters<typeof parseStatBlock>[0];
            chess_bullet?: Parameters<typeof parseStatBlock>[0];
            chess_daily?: Parameters<typeof parseStatBlock>[0];
            tactics?: { highest?: { rating?: number } };
            puzzle_rush?: { best?: { score?: number } };
          })
        : {};

      // Extract exact-cased display username from `url` (`https://www.chess.com/member/IceChoker`)
      const urlParts = (pJson.url || '').split('/').filter(Boolean);
      const displayUsername =
        urlParts[urlParts.length - 1] || pJson.username || username.trim();

      const profile: ChessComPlayerProfile = {
        username: clean,
        displayUsername,
        name: pJson.name,
        title: pJson.title,
        avatar: pJson.avatar,
        countryCode: extractCountryCode(pJson.country),
        followers: pJson.followers ?? 0,
        joined: pJson.joined,
        lastOnline: pJson.last_online,
        status: pJson.status,
        league: pJson.league,
        url: pJson.url,
        stats: {
          rapid: parseStatBlock(sJson.chess_rapid),
          blitz: parseStatBlock(sJson.chess_blitz),
          bullet: parseStatBlock(sJson.chess_bullet),
          daily: parseStatBlock(sJson.chess_daily),
          tacticsHighest: sJson.tactics?.highest?.rating,
          puzzleRushBest: sJson.puzzle_rush?.best?.score,
        },
      };

      resolvedProfiles.set(clean, profile);
      return profile;
    } catch {
      return null;
    }
  })();

  profileCache.set(clean, promise);
  return promise;
}

/**
 * Return the player's accurate real Chess.com rating matching the selected time control
 */
export function getAccurateRatingForTimeControl(
  profile: ChessComPlayerProfile | null | undefined,
  timeControl?: string
): number {
  if (!profile) return 805;
  const s = profile.stats;
  const baseSec =
    timeControl && timeControl !== 'unlimited'
      ? parseInt(timeControl.split('+')[0], 10)
      : NaN;

  if (!Number.isNaN(baseSec)) {
    if (baseSec <= 120 && s.bullet?.rating) return s.bullet.rating;
    if (baseSec <= 300 && s.blitz?.rating) return s.blitz.rating;
    if (baseSec >= 600 && s.rapid?.rating) return s.rapid.rating;
  }

  // Fallback priority: Blitz -> Rapid -> Daily -> Bullet
  return (
    s.rapid?.rating ||
    s.blitz?.rating ||
    s.daily?.rating ||
    s.bullet?.rating ||
    800
  );
}

/**
 * Enrich both players on a GameMetadata with live Chess.com avatars, country flags, titles & leagues
 */
export async function enrichGameWithProfiles(
  game: GameMetadata
): Promise<GameMetadata> {
  const [whiteProf, blackProf] = await Promise.all([
    fetchChessComProfile(game.white.username),
    fetchChessComProfile(game.black.username),
  ]);

  return {
    ...game,
    white: {
      ...game.white,
      username: whiteProf?.displayUsername || game.white.username,
      rating:
        game.white.rating > 0
          ? game.white.rating
          : getAccurateRatingForTimeControl(whiteProf, game.timeControl),
      avatarUrl: whiteProf?.avatar || game.white.avatarUrl,
      country: whiteProf?.countryCode || game.white.country,
      title: whiteProf?.title || game.white.title,
      league: whiteProf?.league || game.white.league,
    },
    black: {
      ...game.black,
      username: blackProf?.displayUsername || game.black.username,
      rating:
        game.black.rating > 0
          ? game.black.rating
          : getAccurateRatingForTimeControl(blackProf, game.timeControl),
      avatarUrl: blackProf?.avatar || game.black.avatarUrl,
      country: blackProf?.countryCode || game.black.country,
      title: blackProf?.title || game.black.title,
      league: blackProf?.league || game.black.league,
    },
  };
}
