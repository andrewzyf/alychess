import React from 'react';
import { Flag, Pause, Play, RefreshCw, RotateCcw, Sparkles } from 'lucide-react';
import { AppMode } from '../types/chess';
import { CcColorIconCommunity } from './ChessComIcons';
import { RightPanelShell } from './RightPanelShell';

export type LocalTimeOption = '60' | '180' | '300' | '600' | 'unlimited';

interface LocalPlayPanelProps {
  whiteName: string;
  onWhiteNameChange: (v: string) => void;
  blackName: string;
  onBlackNameChange: (v: string) => void;
  timeOption: LocalTimeOption;
  onSelectTime: (t: LocalTimeOption) => void;
  autoFlip: boolean;
  onToggleAutoFlip: () => void;
  matchStarted: boolean;
  clockPaused: boolean;
  onTogglePause: () => void;
  gameOverInfo: { title: string; subtitle: string } | null;
  sanHistory: string[];
  onStartOrReset: () => void;
  onResignCurrent: () => void;
  onReviewGame: () => void;
  onSelectTab: (tab: AppMode | 'games') => void;
  onSwitchToCoachAly: () => void;
}

export const LocalPlayPanel: React.FC<LocalPlayPanelProps> = ({
  whiteName,
  onWhiteNameChange,
  blackName,
  onBlackNameChange,
  timeOption,
  onSelectTime,
  autoFlip,
  onToggleAutoFlip,
  matchStarted,
  clockPaused,
  onTogglePause,
  gameOverInfo,
  sanHistory,
  onStartOrReset,
  onResignCurrent,
  onReviewGame,
  onSelectTab,
  onSwitchToCoachAly,
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
      title="2-Player Local"
      headerIcon={<CcColorIconCommunity />}
      activeTab="local-2p"
      onSelectTab={onSelectTab}
    >
      {/* Mode Sub-Switch */}
      <div className="px-3.5 py-2 bg-[#21201e] border-b border-[#33322f] grid grid-cols-2 gap-1.5 shrink-0">
        <button
          type="button"
          onClick={onSwitchToCoachAly}
          className="h-8 rounded-[5px] bg-transparent hover:bg-[#2d2c29] text-[#9e9c99] hover:text-white font-bold text-[12px] cursor-pointer transition-colors"
        >
          vs. Coach Aly
        </button>
        <button
          type="button"
          className="h-8 rounded-[5px] bg-[#373634] text-white font-bold text-[12px] cursor-pointer"
        >
          2-Player Local
        </button>
      </div>

      {/* Player Names & Time Controls */}
      <div className="p-3.5 border-b border-[#33322f] space-y-2.5 shrink-0">
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-[11px] font-bold text-[#9e9c99] mb-1">
              White Player
            </label>
            <input
              type="text"
              value={whiteName}
              onChange={(e) => onWhiteNameChange(e.target.value)}
              className="w-full h-8 px-2.5 rounded-[5px] border border-[#3d3b38] bg-[#1e1d1b] text-[12.5px] font-semibold text-white focus:border-[#81b64c] focus:outline-none select-text"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-[#9e9c99] mb-1">
              Black Player
            </label>
            <input
              type="text"
              value={blackName}
              onChange={(e) => onBlackNameChange(e.target.value)}
              className="w-full h-8 px-2.5 rounded-[5px] border border-[#3d3b38] bg-[#1e1d1b] text-[12.5px] font-semibold text-white focus:border-[#81b64c] focus:outline-none select-text"
            />
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <div className="grid grid-cols-5 gap-1 flex-1">
            {(
              [
                { id: '60', label: '1m' },
                { id: '180', label: '3m' },
                { id: '300', label: '5m' },
                { id: '600', label: '10m' },
                { id: 'unlimited', label: '∞' },
              ] as const
            ).map((tc) => (
              <button
                key={tc.id}
                type="button"
                onClick={() => onSelectTime(tc.id)}
                className={`h-8 rounded-[5px] border text-[12px] font-bold tabular-nums cursor-pointer ${
                  timeOption === tc.id
                    ? 'border-[#81b64c] bg-[#33382b] text-white'
                    : 'border-[#3a3835] bg-[#2f2e2b] text-[#9e9c99]'
                }`}
              >
                {tc.label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onToggleAutoFlip}
            className={`h-8 px-2.5 rounded-[5px] border text-[11.5px] font-bold flex items-center gap-1 cursor-pointer shrink-0 ${
              autoFlip
                ? 'border-[#81b64c] bg-[#33382b] text-[#9cd062]'
                : 'border-[#3a3835] bg-[#2f2e2b] text-[#9e9c99]'
            }`}
          >
            <RefreshCw className="w-3 h-3" />
            <span>Auto-Flip</span>
          </button>
        </div>
      </div>

      {/* Game Over Banner */}
      {gameOverInfo && (
        <div className="m-3.5 p-3.5 rounded-[8px] bg-[#1e1d1b] border border-[#3a3835] text-white space-y-2.5 shrink-0">
          <div>
            <div className="font-black text-[15px]">{gameOverInfo.title}</div>
            <div className="text-[12px] text-[#9e9c99]">{gameOverInfo.subtitle}</div>
          </div>
          <button
            type="button"
            onClick={onReviewGame}
            style={{
              background: 'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
              boxShadow: '0 3px 0 #537133',
            }}
            className="w-full h-[38px] rounded-[6px] text-white font-extrabold text-[13px] flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Game Review</span>
          </button>
        </div>
      )}

      {/* Move History */}
      <div className="flex-1 overflow-y-auto">
        {pairs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[12.5px] text-[#8b8987] px-6 text-center">
            White moves first—countdown clocks start automatically after the opening move!
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

      {/* Footer Controls */}
      <div className="p-3 bg-[#21201e] border-t border-[#31302d] flex items-center gap-2 shrink-0">
        {timeOption !== 'unlimited' && matchStarted && !gameOverInfo && (
          <button
            type="button"
            onClick={onTogglePause}
            className="h-9 px-3 rounded-[6px] bg-[#373634] hover:bg-[#43423f] text-[#dad9d7] font-bold text-[12.5px] flex items-center gap-1.5 cursor-pointer"
          >
            {clockPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
            <span>{clockPaused ? 'Resume' : 'Pause'}</span>
          </button>
        )}

        {matchStarted && !gameOverInfo && (
          <button
            type="button"
            onClick={onResignCurrent}
            className="h-9 px-3 rounded-[6px] bg-[#373634] hover:bg-[#4a2c29] text-[#fa412d] font-bold text-[12.5px] flex items-center gap-1.5 cursor-pointer"
          >
            <Flag className="w-3.5 h-3.5" />
            <span>Resign</span>
          </button>
        )}

        <button
          type="button"
          onClick={onStartOrReset}
          className="h-9 px-3 rounded-[6px] bg-[#373634] hover:bg-[#43423f] text-[#dad9d7] font-bold text-[12.5px] flex items-center gap-1.5 cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>New</span>
        </button>

        {sanHistory.length >= 2 && !gameOverInfo && (
          <button
            type="button"
            onClick={onReviewGame}
            style={{
              background: 'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
              boxShadow: '0 2px 0 #537133',
            }}
            className="flex-1 h-9 px-3 rounded-[6px] text-white font-extrabold text-[12.5px] flex items-center justify-center gap-1 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Review</span>
          </button>
        )}
      </div>
    </RightPanelShell>
  );
};
