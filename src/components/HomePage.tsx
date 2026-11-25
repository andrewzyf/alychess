import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chess } from 'chess.js';
import {
  Clock,
  Compass,
  ExternalLink,
  FileText,
  Flame,
  Link2,
  Loader2,
  Search,
  Sparkles,
  Swords,
  Users,
} from 'lucide-react';
import {
  BOARD_THEMES,
  BoardArrow,
  BoardThemeId,
  ChessComArchiveGame,
  GameMetadata,
  MoveClassification,
} from '../types/chess';
import {
  archiveGameToMetadata,
  fetchChessComGameByUrl,
  fetchRecentChessComGames,
  parsePgnOrFenInput,
} from '../utils/chessHelpers';
import { SAMPLE_GAMES } from '../utils/sampleGames';
import { AlyMascot } from './AlyMascot';
import { ChessBoard } from './ChessBoard';
import {
  CcColorIconCommunity,
  CcColorIconLearn,
  CcColorIconPlay,
  CcColorIconPuzzle,
  CcColorIconTrain,
} from './ChessComIcons';
import { ClassificationBadge } from './ClassificationBadge';
import { AlyEloTier } from './PlayAlyPanel';

interface HomePageProps {
  username: string;
  onUsernameChange: (name: string) => void;
  themeId: BoardThemeId;
  onStartReview: (game: GameMetadata) => void;
  onOpenAnalysis: (game?: GameMetadata) => void;
  onStartPlayAly: (elo?: AlyEloTier) => void;
  onOpenLocal2P: () => void;
  onOpenProfile: (targetUser: string) => void;
}

// Animated Morphy Opera Brilliancy frames for the 424x424 Hero Showcase Board
const HERO_DEMO_MOVES = [
  'e4',
  'e5',
  'Nf3',
  'd6',
  'd4',
  'Bg4',
  'dxe5',
  'Bxf3',
  'Qxf3',
  'dxe5',
  'Bc4',
  'Nf6',
  'Qb3',
  'Qe7',
  'Nc3',
  'c6',
  'Bg5',
  'b5',
  'Nxb5',
  'cxb5',
  'Bxb5+',
  'Nbd7',
  'O-O-O',
  'Rd8',
  'Rxd7',
  'Rxd7',
  'Rd1',
  'Qe6',
  'Bxd7+',
  'Nxd7',
  'Qb8+',
  'Nxb8',
  'Rd8#',
];

const HERO_BADGE_MAP: Record<number, MoveClassification> = {
  1: 'book',
  2: 'book',
  18: 'blunder',
  19: 'brilliant',
  21: 'best',
  25: 'brilliant',
  31: 'brilliant',
  33: 'best',
};

const BOT_CARDS: Array<{
  elo: AlyEloTier;
  name: string;
  tag: string;
  accent: string;
  mood: 'happy' | 'neutral' | 'excited' | 'thinking' | 'concerned';
  col: 0 | 1 | 2;
  featured?: boolean;
}> = [
  { elo: 400, name: 'Aly Casual', tag: '400', accent: '#5c8bb0', mood: 'happy', col: 0 },
  { elo: 800, name: 'Aly Club', tag: '800', accent: '#e58f2a', mood: 'neutral', col: 0 },
  { elo: 1600, name: 'Aly Sharp', tag: '1600', accent: '#1baca6', mood: 'thinking', col: 1 },
  {
    elo: 1200,
    name: 'Coach Aly',
    tag: '1200',
    accent: '#81b64c',
    mood: 'excited',
    col: 1,
    featured: true,
  },
  { elo: 2000, name: 'Aly Master', tag: '2000', accent: '#9b59b6', mood: 'thinking', col: 1 },
  { elo: 2400, name: 'Aly GM', tag: '2400', accent: '#ca3431', mood: 'excited', col: 2 },
  { elo: 1200, name: 'Aly Blitz', tag: '3+0', accent: '#f7c045', mood: 'happy', col: 2 },
];

export const HomePage: React.FC<HomePageProps> = ({
  username,
  onUsernameChange,
  themeId,
  onStartReview,
  onOpenAnalysis,
  onStartPlayAly,
  onOpenLocal2P,
  onOpenProfile,
}) => {
  const urlInputRef = useRef<HTMLInputElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  const [addTab, setAddTab] = useState<'url' | 'recent' | 'pgn'>('url');
  const [urlInput, setUrlInput] = useState<string>('');
  const [localUser, setLocalUser] = useState<string>(username || 'IceChoker');
  const [pgnInput, setPgnInput] = useState<string>('');

  const [loadingUrl, setLoadingUrl] = useState<boolean>(false);
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [recentGames, setRecentGames] = useState<ChessComArchiveGame[]>([]);
  const [loadingRecent, setLoadingRecent] = useState<boolean>(false);

  // Live hero animated chessboard state
  const heroFrames = useMemo(() => {
    const c = new Chess();
    const list: Array<{
      fen: string;
      lastMove: { from: string; to: string } | null;
      badge: { square: string; classification: MoveClassification } | null;
      arrow: BoardArrow | null;
    }> = [{ fen: c.fen(), lastMove: null, badge: null, arrow: null }];

    HERO_DEMO_MOVES.forEach((san, i) => {
      const m = c.move(san);
      if (m) {
        const ply = i + 1;
        const cls = HERO_BADGE_MAP[ply];
        list.push({
          fen: c.fen(),
          lastMove: { from: m.from, to: m.to },
          badge: cls ? { square: m.to, classification: cls } : null,
          arrow:
            ply === 18
              ? { from: 'c3', to: 'b5', color: '#81b64c', opacity: 0.85 }
              : ply === 30
              ? { from: 'b3', to: 'b8', color: '#81b64c', opacity: 0.88 }
              : null,
        });
      }
    });
    return list;
  }, []);

  const [heroPly, setHeroPly] = useState<number>(19); // Start on Morphy's 10. Nxb5!! brilliance!

  useEffect(() => {
    const timer = window.setInterval(() => {
      setHeroPly((p) => (p >= heroFrames.length - 1 ? 10 : p + 1));
    }, 1550);
    return () => window.clearInterval(timer);
  }, [heroFrames.length]);

  const fetchArchiveForUser = async (target: string) => {
    const clean = target.trim();
    if (!clean) return;
    setLoadingRecent(true);
    setErrorMsg(null);
    try {
      const games = await fetchRecentChessComGames(clean, 10);
      setRecentGames(games);
      onUsernameChange(clean);
    } catch (err) {
      setRecentGames([]);
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    fetchArchiveForUser(localUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmitUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    const raw = urlInput.trim();
    if (!raw) {
      setErrorMsg('Paste a Chess.com game URL (e.g. chess.com/game/live/187960315194)');
      urlInputRef.current?.focus();
      return;
    }

    setLoadingUrl(true);
    setErrorMsg(null);
    setStatusNote(`Searching ${localUser || 'IceChoker'}'s Chess.com archive...`);
    try {
      const game = await fetchChessComGameByUrl(raw, localUser || 'IceChoker');
      onUsernameChange((localUser || 'IceChoker').trim());
      setStatusNote(null);
      onStartReview(game);
    } catch (err) {
      setStatusNote(null);
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingUrl(false);
    }
  };

  const handleSubmitPgn = (mode: 'review' | 'analysis') => {
    setErrorMsg(null);
    try {
      const game = parsePgnOrFenInput(pgnInput, localUser || 'IceChoker');
      if (mode === 'review') onStartReview(game);
      else onOpenAnalysis(game);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  const scrollToAddGame = () => {
    scrollContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => urlInputRef.current?.focus(), 350);
  };

  const currentHero = heroFrames[heroPly] || heroFrames[0];

  return (
    <main
      ref={scrollContainerRef}
      className="flex-1 h-full bg-[#302e2b] overflow-y-auto select-none"
    >
      <div className="max-w-[960px] mx-auto px-6 pt-8 pb-16">
        {/* ================= 1. CHESS.COM HERO + ADD GAME HUB ================= */}
        <section className="grid grid-cols-1 lg:grid-cols-[424px_1fr] gap-8 items-center pb-16">
          {/* Left: 424x424 Live Animated Showcase Chessboard (exact Chess.com hero proportion) */}
          <div className="flex flex-col items-center">
            <div
              onClick={() => onStartReview(SAMPLE_GAMES[1])}
              title="Click to run full Game Review on Morphy's Opera Brilliancy"
              className="relative rounded-[8px] overflow-hidden shadow-[0_14px_40px_rgba(0,0,0,0.48)] cursor-pointer group"
            >
              <ChessBoard
                fen={currentHero.fen}
                size={424}
                flipped={false}
                theme={BOARD_THEMES[themeId]}
                interactive={false}
                lastMove={currentHero.lastMove}
                destinationBadge={currentHero.badge}
                arrows={currentHero.arrow ? [currentHero.arrow] : []}
              />
              {/* Subtle Hover Caption Overlay */}
              <div className="absolute bottom-2.5 left-2.5 right-2.5 px-3 py-1.5 rounded-[6px] bg-[#21201e]/90 backdrop-blur-xs border border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-[12px] font-bold text-white flex items-center gap-1.5">
                  <ClassificationBadge type="brilliant" size="xs" />
                  <span>Morphy&apos;s Opera Brilliancy · Review Now</span>
                </span>
                <span className="text-[11px] font-extrabold text-[#9cd062]">
                  Open →
                </span>
              </div>
            </div>
          </div>

          {/* Right: Chess.com Display Heading + Add Game Primary Card */}
          <div className="flex flex-col">
            <h1 className="font-['Montserrat'] font-black text-[38px] leading-[1.12] tracking-tight text-white text-center lg:text-left">
              Review Chess Games on the #1 Coach!
            </h1>
            <p className="mt-2.5 text-[15.5px] text-[#c3c2bf] leading-snug text-center lg:text-left">
              Paste any Chess.com link, pick a recent match, or drop in a PGN for unlimited Stockfish 19 CAPS2 Game Review.
            </p>

            {/* Elevated Dark Add-Game Card (`#262522`) */}
            <div className="mt-5 bg-[#262522] border border-white/8 rounded-[10px] overflow-hidden shadow-[0_12px_32px_rgba(0,0,0,0.38)]">
              {/* Card Tabs */}
              <div className="grid grid-cols-3 bg-[#21201e] border-b border-[#33322f]">
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setAddTab('url');
                  }}
                  className={`h-[42px] text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    addTab === 'url'
                      ? 'bg-[#262522] text-white border-t-2 border-t-[#81b64c]'
                      : 'text-[#939291] hover:text-white'
                  }`}
                >
                  <Link2 className="w-3.5 h-3.5" />
                  <span>Chess.com Link</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setAddTab('recent');
                  }}
                  className={`h-[42px] text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    addTab === 'recent'
                      ? 'bg-[#262522] text-white border-t-2 border-t-[#81b64c]'
                      : 'text-[#939291] hover:text-white'
                  }`}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>Recent ({recentGames.length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setErrorMsg(null);
                    setAddTab('pgn');
                  }}
                  className={`h-[42px] text-[12.5px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${
                    addTab === 'pgn'
                      ? 'bg-[#262522] text-white border-t-2 border-t-[#81b64c]'
                      : 'text-[#939291] hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Paste PGN / FEN</span>
                </button>
              </div>

              <div className="p-4">
                {errorMsg && (
                  <div className="mb-3 px-3 py-2 rounded-[6px] bg-[#fa412d]/15 border border-[#fa412d]/40 text-[#ff8678] text-[12px] font-semibold">
                    {errorMsg}
                  </div>
                )}

                {addTab === 'url' && (
                  <form onSubmit={handleSubmitUrl} className="space-y-2.5">
                    <div className="relative">
                      <input
                        ref={urlInputRef}
                        type="text"
                        value={urlInput}
                        onChange={(e) => {
                          setUrlInput(e.target.value);
                          if (errorMsg) setErrorMsg(null);
                        }}
                        placeholder="Paste Chess.com URL (e.g. chess.com/game/live/187960315194)"
                        className="w-full h-[44px] px-3.5 pr-[118px] rounded-[7px] bg-[#1b1a18] border border-[#3d3b38] focus:border-[#81b64c] focus:outline-none text-[13.5px] text-white placeholder-[#787673] select-text"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setUrlInput('https://www.chess.com/game/live/187960315194');
                          setErrorMsg(null);
                        }}
                        className="absolute right-1.5 top-1.5 h-[32px] px-2.5 rounded-[5px] bg-[#31302d] hover:bg-[#3d3b38] text-[#c3c2bf] hover:text-white text-[11px] font-bold cursor-pointer transition-colors"
                      >
                        Try Example
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center flex-1 h-[38px] px-3 rounded-[7px] bg-[#1b1a18] border border-[#3d3b38] focus-within:border-[#81b64c]">
                        <span className="text-[11.5px] font-bold text-[#8b8987] mr-2 shrink-0">
                          Player:
                        </span>
                        <input
                          type="text"
                          value={localUser}
                          onChange={(e) => setLocalUser(e.target.value)}
                          placeholder="IceChoker"
                          className="flex-1 bg-transparent text-white text-[13px] font-bold focus:outline-none select-text min-w-0"
                        />
                      </div>
                      <button
                        type="button"
                        disabled={loadingRecent}
                        onClick={() => fetchArchiveForUser(localUser)}
                        className="h-[38px] px-3 rounded-[7px] bg-[#373634] hover:bg-[#43423f] text-[#dad9d7] font-bold text-[12px] flex items-center gap-1.5 cursor-pointer shrink-0"
                      >
                        {loadingRecent ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Search className="w-3.5 h-3.5" />
                        )}
                        <span>Sync Games</span>
                      </button>
                    </div>

                    {/* Chess.com Iconic 56px Green 3D Primary CTA */}
                    <button
                      type="submit"
                      disabled={loadingUrl}
                      style={{
                        background: 'linear-gradient(180deg, #89b559 0%, #6f9844 100%)',
                        boxShadow: '0 5px 0 #4d6e2c',
                      }}
                      className="w-full h-[54px] mt-1 rounded-[9px] hover:brightness-105 active:translate-y-[1px] disabled:opacity-65 text-white font-['Montserrat'] font-black text-[18px] tracking-tight flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                      {loadingUrl ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span className="text-[15px]">
                            {statusNote || 'Loading Game...'}
                          </span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Review Game with Aly</span>
                        </>
                      )}
                    </button>

                    {/* Live 1-Click Recent Games Quick-Strip */}
                    {recentGames.length > 0 && (
                      <div className="pt-2.5 mt-2 border-t border-[#33322f]">
                        <div className="flex items-center justify-between mb-1.5">
                          <button
                            type="button"
                            onClick={() => onOpenProfile(localUser)}
                            className="text-[11px] font-extrabold uppercase tracking-wider text-[#939291] hover:text-white hover:underline cursor-pointer"
                          >
                            Latest {localUser} Games · View Profile
                          </button>
                          <button
                            type="button"
                            onClick={() => setAddTab('recent')}
                            className="text-[11px] font-bold text-[#9cd062] hover:underline cursor-pointer"
                          >
                            View all {recentGames.length} →
                          </button>
                        </div>
                        <div className="space-y-1">
                          {recentGames.slice(0, 3).map((g) => {
                            const uLower = localUser.trim().toLowerCase();
                            const isWhite = g.white.username.toLowerCase() === uLower;
                            const mySide = isWhite ? g.white : g.black;
                            const oppSide = isWhite ? g.black : g.white;
                            const won = mySide.result === 'win';
                            const draw = [
                              'agreed',
                              'repetition',
                              'stalemate',
                              'insufficient',
                              '50move',
                              'timevsinsufficient',
                            ].includes(mySide.result);
                            return (
                              <div
                                key={g.id}
                                className="flex items-center justify-between px-2.5 py-1.5 rounded-[6px] bg-[#2e2d2a] hover:bg-[#383633] transition-colors"
                              >
                                <div className="flex items-center gap-2 min-w-0">
                                  <span
                                    className={`w-9 py-0.5 rounded text-center font-black text-[9.5px] uppercase shrink-0 ${
                                      won
                                        ? 'bg-[#81b64c]/25 text-[#9cd062]'
                                        : draw
                                        ? 'bg-[#454340] text-[#c5c4c2]'
                                        : 'bg-[#fa412d]/20 text-[#ff7a6b]'
                                    }`}
                                  >
                                    {won ? 'WIN' : draw ? 'DRAW' : 'LOSS'}
                                  </span>
                                  <span className="text-[12px] font-bold text-white truncate">
                                    vs {oppSide.username}{' '}
                                    <span className="text-[#939291] font-normal tabular-nums">
                                      ({oppSide.rating})
                                    </span>
                                  </span>
                                  <span className="text-[10.5px] text-[#8b8987] capitalize hidden sm:inline">
                                    · {g.time_class}
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  onClick={() =>
                                    onStartReview(archiveGameToMetadata(g, localUser))
                                  }
                                  className="px-2.5 py-1 rounded-[5px] bg-[#81b64c] hover:bg-[#739b49] text-white font-extrabold text-[11px] cursor-pointer shrink-0 ml-2"
                                >
                                  Review
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </form>
                )}

                {addTab === 'recent' && (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={localUser}
                        onChange={(e) => setLocalUser(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') fetchArchiveForUser(localUser);
                        }}
                        placeholder="Enter Chess.com username"
                        className="flex-1 h-9 px-3 rounded-[6px] bg-[#1b1a18] border border-[#3d3b38] focus:border-[#81b64c] focus:outline-none text-[13px] font-bold text-white select-text"
                      />
                      <button
                        type="button"
                        disabled={loadingRecent}
                        onClick={() => fetchArchiveForUser(localUser)}
                        className="h-9 px-3.5 rounded-[6px] bg-[#81b64c] hover:bg-[#739b49] text-white font-extrabold text-[12px] flex items-center gap-1.5 cursor-pointer"
                      >
                        {loadingRecent ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Search className="w-3.5 h-3.5" />
                        )}
                        <span>Fetch</span>
                      </button>
                    </div>

                    <div className="max-h-[224px] overflow-y-auto space-y-1.5 pr-1">
                      {loadingRecent ? (
                        <div className="py-10 flex items-center justify-center gap-2 text-[#9e9c99] text-[12.5px]">
                          <Loader2 className="w-4 h-4 animate-spin text-[#81b64c]" />
                          <span>Loading Chess.com archives...</span>
                        </div>
                      ) : recentGames.length === 0 ? (
                        <div className="py-8 text-center text-[12.5px] text-[#8b8987]">
                          No recent standard games found for &ldquo;{localUser}&rdquo;.
                        </div>
                      ) : (
                        recentGames.map((g) => {
                          const uLower = localUser.trim().toLowerCase();
                          const isWhite = g.white.username.toLowerCase() === uLower;
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
                          return (
                            <div
                              key={g.id}
                              className="flex items-center justify-between px-2.5 py-2 rounded-[6px] bg-[#2e2d2a] hover:bg-[#383633] border border-white/5"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <span
                                  className={`w-10 py-0.5 rounded text-center font-black text-[9.5px] uppercase shrink-0 ${
                                    won
                                      ? 'bg-[#81b64c]/25 text-[#9cd062]'
                                      : draw
                                      ? 'bg-[#454340] text-[#c5c4c2]'
                                      : 'bg-[#fa412d]/20 text-[#ff7a6b]'
                                  }`}
                                >
                                  {won ? 'WIN' : draw ? 'DRAW' : 'LOSS'}
                                </span>
                                <div className="min-w-0">
                                  <div className="text-[12px] font-bold text-white truncate">
                                    {g.white.username} ({g.white.rating}) vs{' '}
                                    {g.black.username} ({g.black.rating})
                                  </div>
                                  <div className="text-[10.5px] text-[#939291] capitalize">
                                    {g.time_class} · #{g.id}
                                  </div>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() =>
                                  onStartReview(archiveGameToMetadata(g, localUser))
                                }
                                className="px-2.5 py-1 rounded-[5px] bg-[#81b64c] hover:bg-[#739b49] text-white font-extrabold text-[11px] cursor-pointer shrink-0 ml-2"
                              >
                                Review
                              </button>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                )}

                {addTab === 'pgn' && (
                  <div className="space-y-2.5">
                    <textarea
                      rows={5}
                      value={pgnInput}
                      onChange={(e) => setPgnInput(e.target.value)}
                      placeholder={`[White "IceChoker"]\n[Black "Opponent"]\n\n1. d4 d5 2. Bf4 Nf6 3. e3 c5 ...`}
                      className="w-full p-2.5 rounded-[7px] bg-[#1b1a18] border border-[#3d3b38] focus:border-[#81b64c] focus:outline-none font-mono text-[12px] text-white placeholder-[#6d6b68] select-text resize-none"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => handleSubmitPgn('analysis')}
                        className="h-[42px] rounded-[7px] bg-[#373634] hover:bg-[#44423f] shadow-[0_3px_0_#1e1d1b] text-white font-bold text-[13px] cursor-pointer"
                      >
                        Open in Analysis
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSubmitPgn('review')}
                        style={{
                          background: 'linear-gradient(180deg, #89b559 0%, #6f9844 100%)',
                          boxShadow: '0 3px 0 #4d6e2c',
                        }}
                        className="h-[42px] rounded-[7px] text-white font-extrabold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Run Game Review</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 2. FEATURE 1: GAME REVIEW WITH COACH ALY (image-right) ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-14 border-t border-white/6">
          <div className="space-y-4">
            <h2 className="font-['Montserrat'] font-black text-[34px] leading-[1.15] text-white">
              Improve Your Game with Coach Aly
            </h2>
            <p className="text-[16px] text-[#c3c2bf] leading-relaxed">
              Get instant depth-16 Stockfish 19 MultiPV 3 analysis on every move—complete with CAPS2 accuracy scores, Brilliant (!!) sacrifice detection, and natural move explanations.
            </p>
            <div className="pt-1 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => onStartReview(SAMPLE_GAMES[1])}
                className="h-[48px] px-6 rounded-[8px] bg-[#403e3b] hover:bg-[#4d4b47] shadow-[0_4px_0_#242321] text-white font-bold text-[15.5px] inline-flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <CcColorIconLearn />
                <span>Try Opera Brilliancy Review</span>
              </button>
            </div>
          </div>

          {/* Floating Dark Chess.com Game Review Illustration Card */}
          <div className="relative flex items-center justify-center">
            <div className="absolute w-64 h-64 rounded-full bg-[#1baca6]/18 blur-3xl pointer-events-none" />
            <div className="relative w-full max-w-[400px] bg-[#262522] border border-white/10 rounded-[12px] p-4 shadow-[0_18px_44px_rgba(0,0,0,0.48)] space-y-3.5">
              {/* Coach Bubble */}
              <div className="flex items-start gap-3">
                <AlyMascot mood="excited" size={54} />
                <div className="relative flex-1 bg-white text-[#262522] rounded-[10px] px-3 py-2 shadow">
                  <div className="absolute -left-[6px] top-4 w-0 h-0 border-y-[6px] border-y-transparent border-r-[6px] border-r-white" />
                  <div className="flex items-center justify-between gap-1.5 mb-0.5">
                    <span className="flex items-center gap-1.5 font-extrabold text-[12.5px]">
                      <ClassificationBadge type="brilliant" size="xs" />
                      <span>Nxb5 is brilliant!!</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#e8e7e3] font-mono font-bold text-[10.5px]">
                      +4.80
                    </span>
                  </div>
                  <p className="text-[11.5px] text-[#3d3b38] leading-snug">
                    Incredible sacrifice! Ripping open the d-file leads to a decisive attack.
                  </p>
                </div>
              </div>

              {/* Accuracy Boxes Preview */}
              <div className="grid grid-cols-3 items-center gap-2 bg-[#21201e] rounded-[8px] p-3">
                <div className="flex flex-col items-center">
                  <span className="px-3 py-1 rounded-[5px] bg-white text-[#21201e] font-black text-[18px] ring-2 ring-[#81b64c] tabular-nums">
                    94.2
                  </span>
                  <span className="text-[11px] font-bold text-[#c5c4c2] mt-1">
                    IceChoker
                  </span>
                </div>
                <div className="text-center text-[11.5px] font-bold text-[#939291]">
                  CAPS2
                  <br />
                  Accuracy
                </div>
                <div className="flex flex-col items-center">
                  <span className="px-3 py-1 rounded-[5px] bg-[#191816] text-white border border-[#3d3b38] font-black text-[18px] tabular-nums">
                    72.6
                  </span>
                  <span className="text-[11px] font-bold text-[#c5c4c2] mt-1">
                    Opponent
                  </span>
                </div>
              </div>

              {/* Classification Pills Row */}
              <div className="flex items-center justify-around pt-1">
                {(
                  [
                    ['brilliant', '2'],
                    ['great', '3'],
                    ['best', '14'],
                    ['mistake', '1'],
                    ['blunder', '0'],
                  ] as const
                ).map(([cls, count]) => (
                  <div key={cls} className="flex items-center gap-1.5">
                    <ClassificationBadge type={cls} size="sm" />
                    <span className="font-extrabold text-[13px] text-white tabular-nums">
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ================= 3. FEATURE 2: PLAY COACH ALY BOTS (image-left staggered grid from step_4_shot_2.png!) ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-14 border-t border-white/6">
          {/* Left: Staggered 3-Column Chess.com Bot Avatar Grid */}
          <div className="flex items-center justify-center gap-3.5">
            {([0, 1, 2] as const).map((colIdx) => (
              <div
                key={colIdx}
                className={`flex flex-col gap-3.5 ${colIdx === 1 ? '-mt-4' : 'mt-4'}`}
              >
                {BOT_CARDS.filter((b) => b.col === colIdx).map((bot) => (
                  <button
                    key={`${bot.name}-${bot.tag}`}
                    type="button"
                    onClick={() => onStartPlayAly(bot.elo)}
                    className={`relative w-[96px] h-[96px] rounded-[12px] bg-[#3a3835] hover:scale-105 transition-all flex flex-col items-center justify-center p-2 cursor-pointer ${
                      bot.featured
                        ? 'ring-[3px] ring-[#81b64c] shadow-[0_0_24px_rgba(129,182,76,0.45)] bg-[#353d2d]'
                        : 'border border-white/8 shadow-md'
                    }`}
                  >
                    <AlyMascot mood={bot.mood} size={56} />
                    <span className="mt-1 text-[10.5px] font-extrabold text-white truncate max-w-full">
                      {bot.name}
                    </span>
                    <span className="absolute top-1.5 right-1.5 px-1 py-0.2 rounded bg-black/55 text-[9px] font-bold text-[#c5c4c2] tabular-nums">
                      {bot.tag}
                    </span>
                    {bot.featured && (
                      <div className="absolute -bottom-2.5 flex items-center gap-0.5 text-[#f7c045] text-[13px] drop-shadow">
                        <span>★</span>
                        <span>★</span>
                        <span>★</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Right: Play Bots Copy & CTA */}
          <div className="space-y-4">
            <h2 className="font-['Montserrat'] font-black text-[34px] leading-[1.15] text-white">
              Play Coach Aly Bots
            </h2>
            <p className="text-[16px] text-[#c3c2bf] leading-relaxed">
              Challenge Stockfish 19 tuned across 6 realistic Elo tiers from 400 Beginner to 2400 Grandmaster—with live blunder reactions, hints, and one-click post-game review.
            </p>
            <div className="pt-1">
              <button
                type="button"
                onClick={() => onStartPlayAly(1200)}
                className="h-[48px] px-6 rounded-[8px] bg-[#403e3b] hover:bg-[#4d4b47] shadow-[0_4px_0_#242321] text-white font-bold text-[15.5px] inline-flex items-center gap-2.5 transition-colors cursor-pointer"
              >
                <Swords className="w-5 h-5 text-[#81b64c]" />
                <span>Challenge Coach Aly</span>
              </button>
            </div>
          </div>
        </section>

        {/* ================= 4. FEATURE 3: SELF-ANALYSIS & 2-PLAYER LOCAL (image-right) ================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center py-14 border-t border-white/6">
          <div className="space-y-4">
            <h2 className="font-['Montserrat'] font-black text-[34px] leading-[1.15] text-white">
              Level Up With Live Analysis &amp; OTB Play
            </h2>
            <p className="text-[16px] text-[#c3c2bf] leading-relaxed">
              Branch any variation with live Top-3 Stockfish MultiPV continuations, opponent threat arrows, and 871 ECO openings—or pass-and-play locally with working countdown clocks.
            </p>
            <div className="pt-1 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => onOpenAnalysis()}
                className="h-[48px] px-5 rounded-[8px] bg-[#403e3b] hover:bg-[#4d4b47] shadow-[0_4px_0_#242321] text-white font-bold text-[15px] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Compass className="w-5 h-5 text-[#1baca6]" />
                <span>Self-Analysis Board</span>
              </button>
              <button
                type="button"
                onClick={onOpenLocal2P}
                className="h-[48px] px-5 rounded-[8px] bg-[#403e3b] hover:bg-[#4d4b47] shadow-[0_4px_0_#242321] text-white font-bold text-[15px] inline-flex items-center gap-2 transition-colors cursor-pointer"
              >
                <Users className="w-5 h-5 text-[#e58f2a]" />
                <span>2-Player Local</span>
              </button>
            </div>
          </div>

          {/* Right: Chess.com-style Engine MultiPV + Streak Bar Card */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-[390px] space-y-2.5">
              {/* Streak / Engine Bar matching step_4_shot_2.png */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="font-black text-[18px] text-white tabular-nums">
                    Stockfish 19
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#f7c045] font-extrabold text-[13px]">
                    <Flame className="w-4 h-4 fill-[#f7c045]" />
                    <span>Depth 18</span>
                  </span>
                </div>
                <span className="text-[11.5px] font-bold text-[#9cd062]">
                  MultiPV 3 · WASM
                </span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-[#21201e] overflow-hidden">
                <div className="w-[78%] h-full rounded-full bg-gradient-to-r from-[#f7c045] to-[#81b64c]" />
              </div>

              {/* Live MultiPV Card */}
              <div className="bg-[#262522] border border-white/10 rounded-[10px] p-3 shadow-xl space-y-1.5">
                {[
                  ['+2.85', '1. Nxf7! Kxf7 2. Qf3+ Ke6 3. Nc3'],
                  ['+0.64', '1. d4 exd4 2. O-O Be7 3. Nxd4'],
                  ['+0.42', '1. O-O Bc5 2. c3 d6 3. d4 Bb6'],
                ].map(([score, line]) => (
                  <div
                    key={score}
                    className="flex items-center gap-2 px-2 py-1.5 rounded bg-[#2e2d2a] text-[12px]"
                  >
                    <span className="px-1.5 py-0.5 rounded bg-white text-[#21201e] font-bold font-mono text-[11px] tabular-nums">
                      {score}
                    </span>
                    <span className="font-mono text-[#dad9d7] truncate">{line}</span>
                  </div>
                ))}
              </div>

              {/* Quick Feature Icons Row */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => onStartPlayAly(1200)}
                  className="p-2.5 rounded-[8px] bg-[#262522] hover:bg-[#31302d] border border-white/5 flex flex-col items-center gap-1 cursor-pointer"
                >
                  <CcColorIconPlay />
                  <span className="text-[11px] font-bold text-[#c5c4c2]">Play</span>
                </button>
                <button
                  type="button"
                  onClick={() => onStartReview(SAMPLE_GAMES[2])}
                  className="p-2.5 rounded-[8px] bg-[#262522] hover:bg-[#31302d] border border-white/5 flex flex-col items-center gap-1 cursor-pointer"
                >
                  <CcColorIconPuzzle />
                  <span className="text-[11px] font-bold text-[#c5c4c2]">Tactics</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAnalysis()}
                  className="p-2.5 rounded-[8px] bg-[#262522] hover:bg-[#31302d] border border-white/5 flex flex-col items-center gap-1 cursor-pointer"
                >
                  <CcColorIconTrain />
                  <span className="text-[11px] font-bold text-[#c5c4c2]">Analysis</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenLocal2P}
                  className="p-2.5 rounded-[8px] bg-[#262522] hover:bg-[#31302d] border border-white/5 flex flex-col items-center gap-1 cursor-pointer"
                >
                  <CcColorIconCommunity />
                  <span className="text-[11px] font-bold text-[#c5c4c2]">Local 2P</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* ================= 5. BOTTOM CENTERED CTA & FOOTER ================= */}
        <section className="pt-12 pb-6 text-center border-t border-white/6 space-y-5">
          <h2 className="font-['Montserrat'] font-black text-[34px] text-white">
            Review, Learn, and Have Fun!
          </h2>
          <button
            type="button"
            onClick={scrollToAddGame}
            style={{
              background: 'linear-gradient(180deg, #89b559 0%, #6f9844 100%)',
              boxShadow: '0 5px 0 #4d6e2c',
            }}
            className="h-[58px] px-12 rounded-[9px] hover:brightness-105 active:translate-y-[1px] text-white font-['Montserrat'] font-black text-[19px] cursor-pointer transition-all"
          >
            Add a Game Now
          </button>

          <footer className="pt-8 text-[12px] text-[#8b8987] flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
            <span>Stockfish 19 WASM</span>
            <span>·</span>
            <span>CAPS2 Accuracy Engine</span>
            <span>·</span>
            <span>871 ECO Openings</span>
            <span>·</span>
            <span>Chess.com PubAPI Sync</span>
            <span>·</span>
            <span>AlyChess © 2026</span>
          </footer>
        </section>
      </div>
    </main>
  );
};
