import React, { useEffect, useState } from 'react';
import {
  Award,
  Calendar,
  Clock,
  ExternalLink,
  Flame,
  Loader2,
  Puzzle,
  Search,
  Sparkles,
  Sun,
  Swords,
  Users,
  Zap,
} from 'lucide-react';
import {
  ChessComArchiveGame,
  ChessComPlayerProfile,
  GameMetadata,
} from '../types/chess';
import {
  countryCodeToFlag,
  fetchChessComProfile,
} from '../services/profileService';
import {
  archiveGameToMetadata,
  fetchRecentChessComGames,
} from '../utils/chessHelpers';
import { PlayerAvatar } from './AlyMascot';
import { AlyEloTier } from './PlayAlyPanel';

interface ProfilePageProps {
  username: string;
  onSearchPlayer: (newUsername: string) => void;
  onSetActiveUser: (newUsername: string) => void;
  activeAppUsername: string;
  onReviewGame: (game: GameMetadata) => void;
  onAnalyzeGame: (game: GameMetadata) => void;
  onPlayCoachAtElo: (elo: AlyEloTier) => void;
}

function formatEpochDate(ts?: number): string {
  if (!ts) return '—';
  return new Date(ts * 1000).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatRelativeTime(ts?: number): string {
  if (!ts) return '—';
  const diffSec = Math.max(0, Math.floor(Date.now() / 1000 - ts));
  if (diffSec < 300) return 'Online Now';
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  return `${Math.floor(diffSec / 86400)}d ago`;
}

function nearestAlyElo(rating: number): AlyEloTier {
  const tiers: AlyEloTier[] = [400, 800, 1200, 1600, 2000, 2400];
  let best: AlyEloTier = 1200;
  let minDiff = Infinity;
  for (const t of tiers) {
    const d = Math.abs(t - rating);
    if (d < minDiff) {
      minDiff = d;
      best = t;
    }
  }
  return best;
}

/**
 * 1:1 Chess.com Dark-Mode Member Profile Page (`/member/{username}`)
 */
export const ProfilePage: React.FC<ProfilePageProps> = ({
  username,
  onSearchPlayer,
  onSetActiveUser,
  activeAppUsername,
  onReviewGame,
  onAnalyzeGame,
  onPlayCoachAtElo,
}) => {
  const [searchInput, setSearchInput] = useState(username);
  const [profile, setProfile] = useState<ChessComPlayerProfile | null>(null);
  const [recentGames, setRecentGames] = useState<ChessComArchiveGame[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSearchInput(username);
    let cancelled = false;
    setLoading(true);
    setError(null);

    Promise.all([
      fetchChessComProfile(username),
      fetchRecentChessComGames(username, 15).catch(() => []),
    ]).then(([prof, games]) => {
      if (cancelled) return;
      if (!prof) {
        setProfile(null);
        setRecentGames([]);
        setError(`Chess.com member "${username}" was not found.`);
      } else {
        setProfile(prof);
        setRecentGames(games);
      }
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [username]);

  const handleLookupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = searchInput.trim();
    if (clean) {
      onSearchPlayer(clean);
    }
  };

  // Compute aggregate career W/D/L stats across Rapid, Blitz, Bullet, Daily
  const statGroups = [
    {
      key: 'rapid',
      label: 'Rapid',
      icon: <Clock className="w-5 h-5 text-[#81b64c]" />,
      data: profile?.stats.rapid,
    },
    {
      key: 'blitz',
      label: 'Blitz',
      icon: <Zap className="w-5 h-5 text-[#f7c045] fill-[#f7c045]" />,
      data: profile?.stats.blitz,
    },
    {
      key: 'bullet',
      label: 'Bullet',
      icon: <Flame className="w-5 h-5 text-[#e58f2a] fill-[#e58f2a]" />,
      data: profile?.stats.bullet,
    },
    {
      key: 'daily',
      label: 'Daily',
      icon: <Sun className="w-5 h-5 text-[#d4a359]" />,
      data: profile?.stats.daily,
    },
  ];

  const totalW = statGroups.reduce((s, g) => s + (g.data?.win || 0), 0);
  const totalL = statGroups.reduce((s, g) => s + (g.data?.loss || 0), 0);
  const totalD = statGroups.reduce((s, g) => s + (g.data?.draw || 0), 0);
  const totalGames = totalW + totalL + totalD;
  const winPct = totalGames > 0 ? Math.round((totalW / totalGames) * 100) : 0;
  const drawPct = totalGames > 0 ? Math.round((totalD / totalGames) * 100) : 0;
  const lossPct = Math.max(0, 100 - winPct - drawPct);

  const primaryRating =
    profile?.stats.blitz?.rating ||
    profile?.stats.rapid?.rating ||
    profile?.stats.daily?.rating ||
    800;

  return (
    <main className="flex-1 h-full bg-[#302e2b] overflow-y-auto select-none">
      <div className="max-w-[1040px] mx-auto px-6 py-6 space-y-5">
        {/* Top Member Lookup Search Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <form onSubmit={handleLookupSubmit} className="flex items-center gap-2 flex-1 max-w-[440px]">
            <div className="flex items-center flex-1 h-10 px-3 rounded-[7px] bg-[#262522] border border-[#3d3b38] focus-within:border-[#81b64c]">
              <Search className="w-4 h-4 text-[#939291] mr-2 shrink-0" />
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="View any Chess.com member (e.g. IceChoker, tomasg28, Hikaru)"
                className="flex-1 bg-transparent text-white text-[13px] font-semibold placeholder-[#787673] focus:outline-none select-text"
              />
            </div>
            <button
              type="submit"
              className="h-10 px-4 rounded-[7px] bg-[#373634] hover:bg-[#44423f] text-white font-bold text-[13px] cursor-pointer"
            >
              View Profile
            </button>
          </form>

          {/* Quick Famous & Recent Switcher Chips */}
          <div className="flex items-center gap-1.5 text-[12px]">
            {['IceChoker', 'tomasg28', 'Hikaru', 'MagnusCarlsen'].map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => onSearchPlayer(u)}
                className={`px-2.5 py-1 rounded-[5px] font-bold transition-colors cursor-pointer ${
                  username.toLowerCase() === u.toLowerCase()
                    ? 'bg-[#81b64c] text-white'
                    : 'bg-[#262522] hover:bg-[#373634] text-[#c5c4c2]'
                }`}
              >
                {u}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3 text-[#9e9c99]">
            <Loader2 className="w-8 h-8 animate-spin text-[#81b64c]" />
            <span className="text-[14px] font-bold">
              Loading Chess.com profile for {username}...
            </span>
          </div>
        ) : error || !profile ? (
          <div className="p-8 rounded-[8px] bg-[#262522] border border-white/8 text-center space-y-2">
            <div className="text-[16px] font-extrabold text-white">
              {error || 'Profile unavailable'}
            </div>
            <p className="text-[13px] text-[#9e9c99]">
              Try searching for another valid Chess.com username above.
            </p>
          </div>
        ) : (
          <>
            {/* ================= 1. CHESS.COM MEMBER HEADER CARD ================= */}
            <section className="bg-[#262522] rounded-[8px] border border-white/6 p-5 shadow-[0_6px_22px_rgba(0,0,0,0.28)]">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <PlayerAvatar
                    username={profile.displayUsername}
                    avatarUrl={profile.avatar}
                    color="w"
                    size={104}
                  />
                  <div className="space-y-1.5">
                    <div className="flex items-center flex-wrap gap-2">
                      {profile.title && (
                        <span className="px-1.5 py-0.5 rounded-[4px] bg-[#b33430] text-white font-black text-[12px] leading-none">
                          {profile.title}
                        </span>
                      )}
                      <h1 className="font-['Montserrat'] font-black text-[26px] text-white leading-none">
                        {profile.displayUsername}
                      </h1>
                      {profile.countryCode && (
                        <span
                          title={`Country: ${profile.countryCode}`}
                          className="text-[20px] leading-none"
                        >
                          {countryCodeToFlag(profile.countryCode)}
                        </span>
                      )}
                      {profile.league && (
                        <span className="px-2 py-0.5 rounded-[4px] bg-[#373634] border border-white/10 text-[#63cdda] font-extrabold text-[11px] inline-flex items-center gap-1">
                          <Award className="w-3 h-3" />
                          <span>{profile.league} League</span>
                        </span>
                      )}
                    </div>

                    {profile.name && (
                      <div className="text-[14px] font-semibold text-[#c5c4c2]">
                        {profile.name}
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12.5px] text-[#9e9c99] pt-1">
                      <span className="inline-flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Joined {formatEpochDate(profile.joined)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            formatRelativeTime(profile.lastOnline) === 'Online Now'
                              ? 'bg-[#81b64c]'
                              : 'bg-[#7d7b78]'
                          }`}
                        />
                        <span>{formatRelativeTime(profile.lastOnline)}</span>
                      </span>
                      <span className="inline-flex items-center gap-1.5 tabular-nums">
                        <Users className="w-3.5 h-3.5" />
                        <span>{profile.followers.toLocaleString()} Followers</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Right Profile Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  {activeAppUsername.toLowerCase() !== profile.username && (
                    <button
                      type="button"
                      onClick={() => onSetActiveUser(profile.displayUsername)}
                      style={{
                        background: 'linear-gradient(180deg, #89b559 0%, #6f9844 100%)',
                        boxShadow: '0 3px 0 #4d6e2c',
                      }}
                      className="h-9 px-3.5 rounded-[6px] text-white font-extrabold text-[12.5px] cursor-pointer"
                    >
                      Set as Active Player
                    </button>
                  )}
                  {profile.url && (
                    <a
                      href={profile.url}
                      target="_blank"
                      rel="noreferrer"
                      className="h-9 px-3 rounded-[6px] bg-[#373634] hover:bg-[#44423f] text-[#dad9d7] font-bold text-[12.5px] inline-flex items-center gap-1.5"
                    >
                      <span>Chess.com</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </section>

            {/* ================= 2. TWO-COLUMN PROFILE STATS & COMPLETED GAMES ================= */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] gap-5 items-start">
              {/* Left Column: Rating Cards + Completed Games Table */}
              <div className="space-y-5 min-w-0">
                {/* Chess.com Rating Overview Tiles */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                  {statGroups.map((g) => (
                    <div
                      key={g.key}
                      className="bg-[#262522] border border-white/6 rounded-[8px] p-3 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[12px] font-bold text-[#9e9c99]">
                          {g.label}
                        </span>
                        {g.icon}
                      </div>
                      <div className="font-['Montserrat'] font-black text-[22px] text-white leading-none tabular-nums">
                        {g.data ? g.data.rating : '—'}
                      </div>
                      <div className="text-[11px] font-semibold text-[#8b8987] mt-1 tabular-nums">
                        {g.data?.bestRating ? `Best ${g.data.bestRating}` : 'Unrated'}
                      </div>
                    </div>
                  ))}

                  {/* Puzzles Tile */}
                  <div className="bg-[#262522] border border-white/6 rounded-[8px] p-3 flex flex-col justify-between">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[12px] font-bold text-[#9e9c99]">
                        Puzzles
                      </span>
                      <Puzzle className="w-5 h-5 text-[#eb8b38]" />
                    </div>
                    <div className="font-['Montserrat'] font-black text-[22px] text-white leading-none tabular-nums">
                      {profile.stats.tacticsHighest || '—'}
                    </div>
                    <div className="text-[11px] font-semibold text-[#8b8987] mt-1 tabular-nums">
                      {profile.stats.puzzleRushBest
                        ? `Rush Best ${profile.stats.puzzleRushBest}`
                        : 'Peak Tactics'}
                    </div>
                  </div>
                </div>

                {/* Completed Games Table (1:1 Chess.com Dark Table) */}
                <section className="bg-[#262522] border border-white/6 rounded-[8px] overflow-hidden">
                  <div className="h-[46px] px-4 bg-[#21201e] border-b border-[#33322f] flex items-center justify-between">
                    <h2 className="font-extrabold text-[15px] text-white">
                      Completed Games ({recentGames.length})
                    </h2>
                    <span className="text-[11.5px] font-semibold text-[#939291]">
                      Click any game for instant parallel Stockfish 19 Review
                    </span>
                  </div>

                  {recentGames.length === 0 ? (
                    <div className="py-10 text-center text-[13px] text-[#8b8987]">
                      No recent standard games found in this player&apos;s archive.
                    </div>
                  ) : (
                    <div className="divide-y divide-[#31302d]">
                      {recentGames.map((g, idx) => {
                        const isWhite =
                          g.white.username.toLowerCase() === profile.username;
                        const mySide = isWhite ? g.white : g.black;
                        const won = mySide.result === 'win';
                        const draw = [
                          'agreed',
                          'repetition',
                          'stalemate',
                          'insufficient',
                          '50move',
                          'timevsinsufficient',
                        ].includes(mySide.result);

                        const dateStr = new Date(g.end_time * 1000).toLocaleDateString(
                          undefined,
                          { month: 'short', day: 'numeric', year: 'numeric' }
                        );

                        return (
                          <div
                            key={g.id}
                            className={`px-4 py-2.5 flex items-center justify-between gap-3 ${
                              idx % 2 === 0 ? 'bg-[#2a2926]' : 'bg-[#262522]'
                            } hover:bg-[#33322e] transition-colors`}
                          >
                            {/* Time class icon + Players stack */}
                            <div className="flex items-center gap-3 min-w-0 flex-1">
                              <div
                                title={g.time_class}
                                className="w-7 flex flex-col items-center shrink-0"
                              >
                                {g.time_class === 'blitz' ? (
                                  <Zap className="w-4 h-4 text-[#f7c045] fill-[#f7c045]" />
                                ) : g.time_class === 'bullet' ? (
                                  <Flame className="w-4 h-4 text-[#e58f2a] fill-[#e58f2a]" />
                                ) : g.time_class === 'daily' ? (
                                  <Sun className="w-4 h-4 text-[#d4a359]" />
                                ) : (
                                  <Clock className="w-4 h-4 text-[#81b64c]" />
                                )}
                                <span className="text-[9.5px] font-bold text-[#8b8987] capitalize mt-0.5">
                                  {g.time_class}
                                </span>
                              </div>

                              <div className="min-w-0 space-y-0.5">
                                <div className="flex items-center gap-1.5 text-[13px]">
                                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#ebecd0] border border-black/30 shrink-0" />
                                  <button
                                    type="button"
                                    onClick={() => onSearchPlayer(g.white.username)}
                                    className="font-bold text-white hover:underline truncate cursor-pointer"
                                  >
                                    {g.white.username}
                                  </button>
                                  <span className="text-[#939291] text-[12px] tabular-nums">
                                    ({g.white.rating})
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[13px]">
                                  <span className="w-2.5 h-2.5 rounded-[2px] bg-[#403d3a] border border-white/25 shrink-0" />
                                  <button
                                    type="button"
                                    onClick={() => onSearchPlayer(g.black.username)}
                                    className="font-bold text-[#dad9d7] hover:underline truncate cursor-pointer"
                                  >
                                    {g.black.username}
                                  </button>
                                  <span className="text-[#939291] text-[12px] tabular-nums">
                                    ({g.black.rating})
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Result Box */}
                            <div className="flex items-center gap-3 shrink-0">
                              <span
                                className={`w-6 h-6 rounded-[4px] flex items-center justify-center font-black text-[13px] ${
                                  won
                                    ? 'bg-[#81b64c] text-white'
                                    : draw
                                    ? 'bg-[#7d7b78] text-white'
                                    : 'bg-[#ca3431] text-white'
                                }`}
                              >
                                {won ? '+' : draw ? '=' : '−'}
                              </span>
                              <span className="hidden md:inline text-[11.5px] text-[#8b8987] w-[86px] text-right tabular-nums">
                                {dateStr}
                              </span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1.5 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  onReviewGame(
                                    archiveGameToMetadata(g, profile.displayUsername)
                                  )
                                }
                                style={{
                                  background:
                                    'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
                                  boxShadow: '0 2px 0 #537133',
                                }}
                                className="h-8 px-3 rounded-[5px] text-white font-extrabold text-[12px] flex items-center gap-1 cursor-pointer"
                              >
                                <Sparkles className="w-3.5 h-3.5" />
                                <span>Review</span>
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  onAnalyzeGame(
                                    archiveGameToMetadata(g, profile.displayUsername)
                                  )
                                }
                                className="h-8 px-2.5 rounded-[5px] bg-[#373634] hover:bg-[#454340] text-[#c5c4c2] hover:text-white font-bold text-[11.5px] cursor-pointer"
                              >
                                Analyze
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </section>
              </div>

              {/* Right Column: Stats Breakdown & Quick Train */}
              <aside className="space-y-4">
                <div className="bg-[#262522] border border-white/6 rounded-[8px] overflow-hidden">
                  <div className="h-[44px] px-4 bg-[#21201e] border-b border-[#33322f] flex items-center justify-between">
                    <h2 className="font-extrabold text-[14.5px] text-white">
                      Stats Summary
                    </h2>
                    <span className="text-[12px] font-bold text-[#9cd062] tabular-nums">
                      {totalGames.toLocaleString()} Games
                    </span>
                  </div>

                  <div className="p-4 space-y-4">
                    {/* Win / Draw / Loss Segmented Bar */}
                    <div>
                      <div className="flex items-center justify-between text-[11.5px] font-bold mb-1.5 tabular-nums">
                        <span className="text-[#9cd062]">{winPct}% Won</span>
                        <span className="text-[#9e9c99]">{drawPct}% Draw</span>
                        <span className="text-[#ff7a6b]">{lossPct}% Lost</span>
                      </div>
                      <div className="w-full h-3 rounded-full overflow-hidden flex bg-[#1b1a18]">
                        <div
                          style={{ width: `${winPct}%` }}
                          className="h-full bg-[#81b64c]"
                        />
                        <div
                          style={{ width: `${drawPct}%` }}
                          className="h-full bg-[#8b8987]"
                        />
                        <div
                          style={{ width: `${lossPct}%` }}
                          className="h-full bg-[#ca3431]"
                        />
                      </div>
                      <div className="grid grid-cols-3 text-center mt-2 text-[12px] font-extrabold tabular-nums">
                        <div className="text-white">{totalW.toLocaleString()} W</div>
                        <div className="text-[#9e9c99]">{totalD.toLocaleString()} D</div>
                        <div className="text-[#dad9d7]">{totalL.toLocaleString()} L</div>
                      </div>
                    </div>

                    {/* Per-mode W/L breakdown */}
                    <div className="border-t border-[#33322f] pt-3 space-y-2">
                      {statGroups.map((g) => {
                        if (!g.data) return null;
                        const subTotal = g.data.win + g.data.loss + g.data.draw;
                        return (
                          <div
                            key={g.key}
                            className="flex items-center justify-between text-[12.5px]"
                          >
                            <span className="flex items-center gap-2 font-bold text-[#dad9d7]">
                              {g.icon}
                              <span>{g.label}</span>
                            </span>
                            <span className="font-mono text-[11.5px] text-[#9e9c99] tabular-nums">
                              {g.data.win}W · {g.data.loss}L · {g.data.draw}D ({subTotal})
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Calibrated Training CTA */}
                    <button
                      type="button"
                      onClick={() => onPlayCoachAtElo(nearestAlyElo(primaryRating))}
                      style={{
                        background: 'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
                        boxShadow: '0 3px 0 #537133',
                      }}
                      className="w-full h-[40px] rounded-[6px] text-white font-extrabold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Swords className="w-4 h-4" />
                      <span>
                        Train vs Aly ({nearestAlyElo(primaryRating)} Elo)
                      </span>
                    </button>
                  </div>
                </div>
              </aside>
            </div>
          </>
        )}
      </div>
    </main>
  );
};
