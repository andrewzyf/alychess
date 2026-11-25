import React from 'react';
import { Flag, Lightbulb, PlusCircle, Sparkles, Undo2 } from 'lucide-react';
import { AlyMood, AppMode } from '../types/chess';
import { AlyMascot } from './AlyMascot';
import { CcGlyphExplorerCompass } from './ChessComIcons';
import { RightPanelShell } from './RightPanelShell';

export type AlyEloTier = 400 | 800 | 1200 | 1600 | 2000 | 2400;
export type PlayTimeOption = '180' | '300' | '600' | 'unlimited';
export type ColorChoice = 'w' | 'random' | 'b';

const ELO_TIERS: Array<{ elo: AlyEloTier; title: string; desc: string }> = [
  { elo: 400, title: 'Beginner', desc: 'Friendly warm-up, leaves tactical chances' },
  { elo: 800, title: 'Novice', desc: 'Develops pieces, occasional oversights' },
  { elo: 1200, title: 'Intermediate', desc: 'Spots basic forks, pins, and hanging pieces' },
  { elo: 1600, title: 'Club Strong', desc: 'Sharp tactical calculation & solid openings' },
  { elo: 2000, title: 'Master Coach', desc: 'Positional squeeze & deep calculation' },
  { elo: 2400, title: 'Grandmaster', desc: 'Near-flawless Stockfish precision' },
];

interface PlayAlyPanelProps {
  gameActive: boolean;
  gameOverInfo: { title: string; subtitle: string } | null;
  selectedElo: AlyEloTier;
  onSelectElo: (elo: AlyEloTier) => void;
  colorChoice: ColorChoice;
  onSelectColor: (c: ColorChoice) => void;
  timeOption: PlayTimeOption;
  onSelectTime: (t: PlayTimeOption) => void;
  onStartMatch: () => void;
  onResign: () => void;
  onNewSetup: () => void;
  onTakeback: () => void;
  onRequestHint: () => void;
  onReviewFinishedGame: () => void;
  coachSpeech: { title: string; body: string; mood: AlyMood };
  sanHistory: string[];
  alyThinking: boolean;
  onSelectTab: (tab: AppMode | 'games') => void;
  onSwitchToLocal2P: () => void;
}

export const PlayAlyPanel: React.FC<PlayAlyPanelProps> = ({
  gameActive,
  gameOverInfo,
  selectedElo,
  onSelectElo,
  colorChoice,
  onSelectColor,
  timeOption,
  onSelectTime,
  onStartMatch,
  onResign,
  onNewSetup,
  onTakeback,
  onRequestHint,
  onReviewFinishedGame,
  coachSpeech,
  sanHistory,
  alyThinking,
  onSelectTab,
  onSwitchToLocal2P,
}) => {
  const pairs: Array<{ num: number; w?: string; b?: string }> = [];
  for (let i = 0; i < sanHistory.length; i += 2) {
    pairs.push({
      num: Math.floor(i / 2) + 1,
      w: sanHistory[i],
      b: sanHistory[i + 1],
    });
  }

  return (
    <RightPanelShell
      title="Play Coach"
      headerIcon={<CcGlyphExplorerCompass className="w-[22px] h-[22px] text-[#81b64c]" />}
      activeTab="play-aly"
      onSelectTab={onSelectTab}
    >
      {/* Mode Sub-Switch (`vs Coach Aly` | `2-Player Local`) */}
      <div className="px-3.5 py-2 bg-[#21201e] border-b border-[#33322f] grid grid-cols-2 gap-1.5 shrink-0">
        <button
          type="button"
          className="h-8 rounded-[5px] bg-[#373634] text-white font-bold text-[12px] cursor-pointer"
        >
          vs. Coach Aly
        </button>
        <button
          type="button"
          onClick={onSwitchToLocal2P}
          className="h-8 rounded-[5px] bg-transparent hover:bg-[#2d2c29] text-[#9e9c99] hover:text-white font-bold text-[12px] cursor-pointer transition-colors"
        >
          2-Player Local
        </button>
      </div>

      {/* Coach Row with Crisp White Speech Bubble */}
      <div className="px-3.5 py-3 border-b border-[#33322f] shrink-0">
        <div className="flex items-start gap-3">
          <AlyMascot mood={alyThinking ? 'thinking' : coachSpeech.mood} size={56} />
          <div className="relative flex-1 bg-white text-[#262522] rounded-[10px] px-3 py-2.5 min-h-[66px] shadow-md">
            <div className="absolute -left-[7px] top-4 w-0 h-0 border-y-[7px] border-y-transparent border-r-[7px] border-r-white" />
            <div className="font-extrabold text-[13px] text-[#262522] mb-0.5">
              {alyThinking ? 'Aly is thinking...' : coachSpeech.title}
            </div>
            <p className="text-[12px] text-[#3d3b38] leading-snug">
              {alyThinking
                ? 'Calculating tactical lines on the board...'
                : coachSpeech.body}
            </p>
          </div>
        </div>
      </div>

      {!gameActive && !gameOverInfo ? (
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {/* Elo Selector */}
            <div>
              <label className="block text-[11.5px] font-extrabold uppercase tracking-wider text-[#9e9c99] mb-2">
                Coach Strength ({selectedElo} Elo)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {ELO_TIERS.map((tier) => {
                  const active = selectedElo === tier.elo;
                  return (
                    <button
                      key={tier.elo}
                      type="button"
                      onClick={() => onSelectElo(tier.elo)}
                      className={`p-2.5 rounded-[6px] border text-left transition-all cursor-pointer ${
                        active
                          ? 'border-[#81b64c] bg-[#33382b] ring-1 ring-[#81b64c]'
                          : 'border-[#3a3835] hover:border-[#52504c] bg-[#2f2e2b]'
                      }`}
                    >
                      <div className="font-black text-[15px] text-white tabular-nums">
                        {tier.elo}
                      </div>
                      <div className="text-[11px] font-semibold text-[#9e9c99] truncate">
                        {tier.title}
                      </div>
                    </button>
                  );
                })}
              </div>
              <p className="mt-1.5 text-[11.5px] text-[#9e9c99]">
                {ELO_TIERS.find((t) => t.elo === selectedElo)?.desc}
              </p>
            </div>

            {/* Color Choice */}
            <div>
              <label className="block text-[11.5px] font-extrabold uppercase tracking-wider text-[#9e9c99] mb-2">
                I Play As
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { id: 'w', label: 'White', dot: 'bg-white' },
                    {
                      id: 'random',
                      label: 'Random',
                      dot: 'bg-gradient-to-r from-white to-[#403d3a] border border-white/30',
                    },
                    { id: 'b', label: 'Black', dot: 'bg-[#191816] border border-white/30' },
                  ] as const
                ).map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onSelectColor(item.id)}
                    className={`h-10 rounded-[6px] border flex items-center justify-center gap-2 font-bold text-[13px] cursor-pointer transition-all ${
                      colorChoice === item.id
                        ? 'border-[#81b64c] bg-[#33382b] text-white ring-1 ring-[#81b64c]'
                        : 'border-[#3a3835] bg-[#2f2e2b] text-[#c5c4c2] hover:bg-[#383633]'
                    }`}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full ${item.dot}`} />
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Time Control */}
            <div>
              <label className="block text-[11.5px] font-extrabold uppercase tracking-wider text-[#9e9c99] mb-2">
                Time Control
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(
                  [
                    { id: '180', label: '3 min' },
                    { id: '300', label: '5 min' },
                    { id: '600', label: '10 min' },
                    { id: 'unlimited', label: 'No Clock' },
                  ] as const
                ).map((tc) => (
                  <button
                    key={tc.id}
                    type="button"
                    onClick={() => onSelectTime(tc.id)}
                    className={`h-10 rounded-[6px] border font-bold text-[12px] tabular-nums cursor-pointer transition-all ${
                      timeOption === tc.id
                        ? 'border-[#81b64c] bg-[#33382b] text-white ring-1 ring-[#81b64c]'
                        : 'border-[#3a3835] bg-[#2f2e2b] text-[#c5c4c2] hover:bg-[#383633]'
                    }`}
                  >
                    {tc.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="p-3.5 bg-[#21201e] border-t border-[#31302d] shrink-0">
            <button
              type="button"
              onClick={onStartMatch}
              style={{
                background: 'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
                boxShadow: '0 4px 0 #537133',
              }}
              className="w-full h-[46px] rounded-[8px] hover:brightness-105 text-white font-extrabold text-[17px] cursor-pointer transition-all"
            >
              Play
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {gameOverInfo && (
            <div className="m-3.5 p-3.5 rounded-[8px] bg-[#1e1d1b] border border-[#3a3835] text-white space-y-2.5 shrink-0">
              <div>
                <div className="font-black text-[15.5px]">{gameOverInfo.title}</div>
                <div className="text-[12px] text-[#9e9c99] mt-0.5">
                  {gameOverInfo.subtitle}
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={onReviewFinishedGame}
                  style={{
                    background: 'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
                    boxShadow: '0 3px 0 #537133',
                  }}
                  className="flex-1 h-[38px] px-3 rounded-[6px] text-white font-extrabold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Game Review</span>
                </button>
                <button
                  type="button"
                  onClick={onNewSetup}
                  className="h-[38px] px-3 rounded-[6px] bg-[#373634] hover:bg-[#43423f] text-white font-bold text-[12.5px] cursor-pointer"
                >
                  Rematch
                </button>
              </div>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {pairs.length === 0 ? (
              <div className="h-full flex items-center justify-center text-[12.5px] text-[#8b8987]">
                Make your opening move on the board!
              </div>
            ) : (
              pairs.map((p, idx) => (
                <div
                  key={p.num}
                  className={`grid grid-cols-[44px_1fr_1fr] items-center text-[13px] h-[30px] ${
                    idx % 2 === 0 ? 'bg-[#2a2926]' : 'bg-[#262522]'
                  }`}
                >
                  <span className="pl-3.5 text-[#8b8987] font-semibold text-[12px] tabular-nums">
                    {p.num}.
                  </span>
                  <span className="px-2.5 font-bold text-[#dad9d7]">{p.w || ''}</span>
                  <span className="px-2.5 font-bold text-[#dad9d7]">{p.b || ''}</span>
                </div>
              ))
            )}
          </div>

          <div className="p-3 bg-[#21201e] border-t border-[#31302d] flex items-center gap-2 shrink-0">
            {gameActive ? (
              <>
                <button
                  type="button"
                  onClick={onRequestHint}
                  className="flex-1 h-9 rounded-[6px] bg-[#373634] hover:bg-[#43423f] text-[#9cd062] font-bold text-[12.5px] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Hint</span>
                </button>
                <button
                  type="button"
                  disabled={sanHistory.length < 2}
                  onClick={onTakeback}
                  className="h-9 px-3 rounded-[6px] bg-[#373634] hover:bg-[#43423f] disabled:opacity-40 text-[#dad9d7] font-bold text-[12.5px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Undo2 className="w-3.5 h-3.5" />
                  <span>Takeback</span>
                </button>
                <button
                  type="button"
                  onClick={onResign}
                  className="h-9 px-3 rounded-[6px] bg-[#373634] hover:bg-[#4a2c29] text-[#fa412d] font-bold text-[12.5px] flex items-center gap-1.5 cursor-pointer"
                >
                  <Flag className="w-3.5 h-3.5" />
                  <span>Resign</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={onNewSetup}
                className="w-full h-9 rounded-[6px] bg-[#373634] hover:bg-[#43423f] text-white font-bold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                <span>New Coach Match</span>
              </button>
            )}
          </div>
        </div>
      )}
    </RightPanelShell>
  );
};
