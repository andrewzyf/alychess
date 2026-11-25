import React, { useEffect, useState } from 'react';
import {
  Clock,
  ExternalLink,
  FileText,
  Link2,
  Loader2,
  Search,
  Trophy,
  X,
} from 'lucide-react';
import { AppMode, ChessComArchiveGame, GameMetadata } from '../types/chess';
import {
  archiveGameToMetadata,
  fetchChessComGameByUrl,
  fetchRecentChessComGames,
  parsePgnOrFenInput,
} from '../utils/chessHelpers';
import { SAMPLE_GAMES } from '../utils/sampleGames';
import { CcGlyphFolderBoard } from './ChessComIcons';
import { RightPanelShell } from './RightPanelShell';

interface ImporterBodyProps {
  defaultUsername: string;
  onUsernameChange: (name: string) => void;
  onLoadGameForReview: (game: GameMetadata) => void;
  onLoadGameForAnalysis: (game: GameMetadata) => void;
  onDone?: () => void;
  compact?: boolean;
}

export const ImporterBody: React.FC<ImporterBodyProps> = ({
  defaultUsername,
  onUsernameChange,
  onLoadGameForReview,
  onLoadGameForAnalysis,
  onDone,
  compact = false,
}) => {
  const [tab, setTab] = useState<'chesscom' | 'pgn' | 'samples'>('chesscom');
  const [urlInput, setUrlInput] = useState('');
  const [username, setUsername] = useState(defaultUsername || 'IceChoker');
  const [pgnInput, setPgnInput] = useState('');

  const [recentGames, setRecentGames] = useState<ChessComArchiveGame[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);
  const [loadingUrl, setLoadingUrl] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setUsername(defaultUsername || 'IceChoker');
  }, [defaultUsername]);

  const loadRecentForUser = async (targetUser: string) => {
    if (!targetUser.trim()) return;
    setLoadingRecent(true);
    setErrorMsg(null);
    try {
      const list = await fetchRecentChessComGames(targetUser, 10);
      setRecentGames(list);
      onUsernameChange(targetUser.trim());
    } catch (err) {
      setRecentGames([]);
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingRecent(false);
    }
  };

  useEffect(() => {
    if (tab === 'chesscom' && recentGames.length === 0) {
      loadRecentForUser(username);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  const handleImportByUrl = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) {
      setErrorMsg('Paste a Chess.com game URL first.');
      return;
    }
    setLoadingUrl(true);
    setErrorMsg(null);
    try {
      const meta = await fetchChessComGameByUrl(urlInput, username);
      onUsernameChange(username.trim());
      onLoadGameForReview(meta);
      onDone?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    } finally {
      setLoadingUrl(false);
    }
  };

  const handlePgnSubmit = (targetMode: 'review' | 'analysis') => {
    setErrorMsg(null);
    try {
      const meta = parsePgnOrFenInput(pgnInput, username);
      if (targetMode === 'review') {
        onLoadGameForReview(meta);
      } else {
        onLoadGameForAnalysis(meta);
      }
      onDone?.();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : String(err));
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden text-[#dad9d7]">
      {/* Sub-Tabs */}
      <div className="px-3.5 pt-2 border-b border-[#33322f] flex items-center gap-1 bg-[#21201e] shrink-0">
        <button
          type="button"
          onClick={() => {
            setErrorMsg(null);
            setTab('chesscom');
          }}
          className={`px-3 py-2 text-[12px] font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            tab === 'chesscom'
              ? 'border-[#81b64c] text-white'
              : 'border-transparent text-[#939291] hover:text-white'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Chess.com</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setErrorMsg(null);
            setTab('pgn');
          }}
          className={`px-3 py-2 text-[12px] font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            tab === 'pgn'
              ? 'border-[#81b64c] text-white'
              : 'border-transparent text-[#939291] hover:text-white'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>PGN / FEN</span>
        </button>
        <button
          type="button"
          onClick={() => {
            setErrorMsg(null);
            setTab('samples');
          }}
          className={`px-3 py-2 text-[12px] font-bold border-b-2 transition-colors cursor-pointer flex items-center gap-1.5 ${
            tab === 'samples'
              ? 'border-[#81b64c] text-white'
              : 'border-transparent text-[#939291] hover:text-white'
          }`}
        >
          <Trophy className="w-3.5 h-3.5" />
          <span>Samples</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mx-3.5 mt-3 px-3 py-2 rounded-[6px] bg-[#fa412d]/15 border border-[#fa412d]/40 text-[#ff7a6b] text-[12px] font-semibold">
          {errorMsg}
        </div>
      )}

      <div className="p-3.5 overflow-y-auto flex-1 space-y-3.5">
        {tab === 'chesscom' && (
          <>
            <form onSubmit={handleImportByUrl} className="space-y-2">
              <label className="block text-[11.5px] font-bold text-[#9e9c99]">
                Chess.com Game URL + Player Username
              </label>
              <input
                type="text"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="https://www.chess.com/game/live/187960315194"
                className="w-full h-9 px-3 rounded-[6px] border border-[#3d3b38] bg-[#1e1d1b] focus:border-[#81b64c] focus:outline-none text-[12.5px] text-white placeholder-[#6e6b68] select-text"
              />
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="IceChoker"
                  className="flex-1 h-9 px-3 rounded-[6px] border border-[#3d3b38] bg-[#1e1d1b] focus:border-[#81b64c] focus:outline-none text-[12.5px] font-semibold text-white select-text"
                />
                <button
                  type="submit"
                  disabled={loadingUrl}
                  style={{
                    background: 'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
                    boxShadow: '0 3px 0 #537133',
                  }}
                  className="h-9 px-3.5 rounded-[6px] disabled:opacity-50 text-white font-extrabold text-[12.5px] flex items-center gap-1.5 cursor-pointer shrink-0"
                >
                  {loadingUrl ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ExternalLink className="w-3.5 h-3.5" />
                  )}
                  <span>Review URL</span>
                </button>
              </div>
            </form>

            <div className="border-t border-[#33322f] pt-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[12px] font-extrabold text-white">
                  Recent Games ({username || 'IceChoker'})
                </span>
                <button
                  type="button"
                  disabled={loadingRecent}
                  onClick={() => loadRecentForUser(username)}
                  className="px-2.5 py-1 rounded-[5px] bg-[#373634] hover:bg-[#43423f] text-[11.5px] font-bold text-[#dad9d7] flex items-center gap-1 cursor-pointer"
                >
                  {loadingRecent ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <Search className="w-3 h-3" />
                  )}
                  <span>Load Archive</span>
                </button>
              </div>

              {loadingRecent ? (
                <div className="py-8 flex flex-col items-center justify-center text-[#9e9c99] gap-2">
                  <Loader2 className="w-5 h-5 animate-spin text-[#81b64c]" />
                  <span className="text-[12px]">Fetching Chess.com PubAPI...</span>
                </div>
              ) : recentGames.length === 0 ? (
                <div className="py-6 text-center bg-[#1e1d1b] rounded-[6px] border border-[#33322f] text-[12px] text-[#8b8987] px-3">
                  Enter any Chess.com username above and click <b>Load Archive</b>.
                </div>
              ) : (
                <div className="space-y-1.5">
                  {recentGames.map((g) => {
                    const uLower = username.trim().toLowerCase();
                    const isWhite = g.white.username.toLowerCase() === uLower;
                    const playerSide = isWhite ? g.white : g.black;
                    const won = playerSide.result === 'win';
                    const draw = [
                      'agreed',
                      'repetition',
                      'stalemate',
                      'insufficient',
                      '50move',
                      'timevsinsufficient',
                    ].includes(playerSide.result);

                    return (
                      <div
                        key={g.id}
                        className="flex items-center justify-between px-2.5 py-2 rounded-[6px] bg-[#2f2e2b] hover:bg-[#383633] border border-[#3a3835] transition-colors"
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={`w-10 py-0.5 rounded text-center font-extrabold text-[10px] uppercase shrink-0 ${
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
                              {g.white.username} vs {g.black.username}
                            </div>
                            <div className="flex items-center gap-1.5 text-[10.5px] text-[#9e9c99] capitalize">
                              <Clock className="w-3 h-3" />
                              <span>{g.time_class}</span>
                              <span>·</span>
                              <span className="tabular-nums">
                                ({playerSide.rating})
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            const meta = archiveGameToMetadata(g, username);
                            onLoadGameForReview(meta);
                            onDone?.();
                          }}
                          className="px-2.5 py-1 rounded-[5px] bg-[#81b64c] hover:bg-[#739b49] text-white font-bold text-[11.5px] cursor-pointer shrink-0 ml-2"
                        >
                          Review
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {tab === 'pgn' && (
          <div className="space-y-3">
            <label className="block text-[12px] font-bold text-[#9e9c99]">
              Paste PGN or FEN
            </label>
            <textarea
              rows={compact ? 8 : 9}
              value={pgnInput}
              onChange={(e) => setPgnInput(e.target.value)}
              placeholder={`[White "IceChoker"]\n[Black "Opponent"]\n\n1. e4 e5 2. Nf3 Nc6 3. Bb5 a6 ...`}
              className="w-full p-3 rounded-[6px] border border-[#3d3b38] bg-[#1e1d1b] focus:border-[#81b64c] focus:outline-none font-mono text-[12px] text-white placeholder-[#666462] select-text resize-none"
            />
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePgnSubmit('analysis')}
                className="flex-1 h-9 rounded-[6px] bg-[#373634] hover:bg-[#43423f] text-white font-bold text-[12.5px] cursor-pointer"
              >
                Self-Analysis
              </button>
              <button
                type="button"
                onClick={() => handlePgnSubmit('review')}
                style={{
                  background: 'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
                  boxShadow: '0 3px 0 #537133',
                }}
                className="flex-1 h-9 rounded-[6px] text-white font-extrabold text-[12.5px] cursor-pointer"
              >
                Game Review
              </button>
            </div>
          </div>
        )}

        {tab === 'samples' && (
          <div className="space-y-2">
            {SAMPLE_GAMES.map((sample) => (
              <div
                key={sample.id}
                className="flex items-center justify-between p-2.5 rounded-[6px] bg-[#2f2e2b] hover:bg-[#383633] border border-[#3a3835] transition-colors"
              >
                <div className="min-w-0 pr-2">
                  <div className="font-bold text-[12.5px] text-white truncate">
                    {sample.white.username} vs {sample.black.username}
                  </div>
                  <div className="text-[11px] text-[#9e9c99] truncate">
                    {sample.eco} {sample.openingName} ({sample.result})
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    onLoadGameForReview(sample);
                    onDone?.();
                  }}
                  className="px-3 py-1.5 rounded-[5px] bg-[#81b64c] hover:bg-[#739b49] text-white font-extrabold text-[11.5px] cursor-pointer shrink-0"
                >
                  Review
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface GamesTabPanelProps {
  defaultUsername: string;
  onUsernameChange: (name: string) => void;
  onLoadGameForReview: (game: GameMetadata) => void;
  onLoadGameForAnalysis: (game: GameMetadata) => void;
  onSelectTab: (tab: AppMode | 'games') => void;
}

export const GamesTabPanel: React.FC<GamesTabPanelProps> = ({
  defaultUsername,
  onUsernameChange,
  onLoadGameForReview,
  onLoadGameForAnalysis,
  onSelectTab,
}) => (
  <RightPanelShell
    title="Games"
    headerIcon={<CcGlyphFolderBoard className="w-[22px] h-[22px] text-[#c5c4c2]" />}
    activeTab="games"
    onSelectTab={onSelectTab}
  >
    <ImporterBody
      defaultUsername={defaultUsername}
      onUsernameChange={onUsernameChange}
      onLoadGameForReview={onLoadGameForReview}
      onLoadGameForAnalysis={onLoadGameForAnalysis}
      compact
    />
  </RightPanelShell>
);

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultUsername: string;
  onUsernameChange: (name: string) => void;
  onLoadGameForReview: (game: GameMetadata) => void;
  onLoadGameForAnalysis: (game: GameMetadata) => void;
}

export const ImportModal: React.FC<ImportModalProps> = ({
  isOpen,
  onClose,
  defaultUsername,
  onUsernameChange,
  onLoadGameForReview,
  onLoadGameForAnalysis,
}) => {
  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/65 backdrop-blur-[2px] z-50 flex items-center justify-center p-4 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[560px] bg-[#262522] rounded-[8px] shadow-2xl border border-[#3a3835] overflow-hidden flex flex-col max-h-[84vh]"
      >
        <div className="h-[48px] px-4 bg-[#21201e] border-b border-[#33322f] flex items-center justify-between">
          <div className="flex items-center gap-2 text-white">
            <CcGlyphFolderBoard className="w-5 h-5 text-[#81b64c]" />
            <h2 className="font-extrabold text-[15.5px]">Load Game / PGN</h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-[5px] flex items-center justify-center text-[#939291] hover:bg-[#31302d] hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <ImporterBody
          defaultUsername={defaultUsername}
          onUsernameChange={onUsernameChange}
          onLoadGameForReview={onLoadGameForReview}
          onLoadGameForAnalysis={onLoadGameForAnalysis}
          onDone={onClose}
        />
      </div>
    </div>
  );
};
