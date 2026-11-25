import React from 'react';
import { Pause, Play } from 'lucide-react';
import {
  CcGlyphChevronEnd,
  CcGlyphChevronLeft,
  CcGlyphChevronRight,
  CcGlyphChevronStart,
  CcGlyphCircleFillStar,
  CcGlyphEllipsis,
  CcGlyphFlipBoard,
  CcGlyphPlusNew,
} from './ChessComIcons';

interface GameControlsFooterProps {
  canBack: boolean;
  canForward: boolean;
  onFirst: () => void;
  onPrev: () => void;
  onNext: () => void;
  onLast: () => void;
  onNewGame: () => void;
  onReviewAction: () => void;
  reviewLabel?: string;
  isAutoPlaying?: boolean;
  onToggleAutoPlay?: () => void;
  onCopyPgn?: () => void;
  copiedPgn?: boolean;
  onFlipBoard: () => void;
}

/**
 * Verbatim Chess.com `.game-controls-component` bottom bar:
 * - Row 1: 4 equal 48px `#31302e` buttons (`First`, `Previous`, `Next`, `Last`)
 * - Row 2: 40px ghost buttons (`New`, `Play/Save`, `Review`, `Flip / More`)
 */
export const GameControlsFooter: React.FC<GameControlsFooterProps> = ({
  canBack,
  canForward,
  onFirst,
  onPrev,
  onNext,
  onLast,
  onNewGame,
  onReviewAction,
  reviewLabel = 'Review',
  isAutoPlaying,
  onToggleAutoPlay,
  onCopyPgn,
  copiedPgn,
  onFlipBoard,
}) => {
  return (
    <div className="bg-[#21201e] px-3 pt-2.5 pb-1.5 border-t border-[#31302d] shrink-0 select-none">
      {/* Primary 4-Button Transport Row (height: 48px) */}
      <div className="grid grid-cols-4 gap-2">
        <button
          type="button"
          onClick={onFirst}
          disabled={!canBack}
          aria-label="First Move"
          className="h-[46px] rounded-[6px] bg-[#31302e] hover:bg-[#3c3b38] disabled:bg-[#2a2826] disabled:text-[#575553] text-[#c5c4c2] hover:text-white shadow-[0_3px_0_#181715] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <CcGlyphChevronStart className="w-[22px] h-[22px]" />
        </button>

        <button
          type="button"
          onClick={onPrev}
          disabled={!canBack}
          aria-label="Previous Move"
          className="h-[46px] rounded-[6px] bg-[#31302e] hover:bg-[#3c3b38] disabled:bg-[#2a2826] disabled:text-[#575553] text-[#c5c4c2] hover:text-white shadow-[0_3px_0_#181715] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <CcGlyphChevronLeft className="w-[22px] h-[22px]" />
        </button>

        <button
          type="button"
          onClick={onNext}
          disabled={!canForward}
          aria-label="Next Move"
          className="h-[46px] rounded-[6px] bg-[#31302e] hover:bg-[#3c3b38] disabled:bg-[#2a2826] disabled:text-[#575553] text-[#c5c4c2] hover:text-white shadow-[0_3px_0_#181715] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <CcGlyphChevronRight className="w-[22px] h-[22px]" />
        </button>

        <button
          type="button"
          onClick={onLast}
          disabled={!canForward}
          aria-label="Last Move"
          className="h-[46px] rounded-[6px] bg-[#31302e] hover:bg-[#3c3b38] disabled:bg-[#2a2826] disabled:text-[#575553] text-[#c5c4c2] hover:text-white shadow-[0_3px_0_#181715] flex items-center justify-center transition-colors cursor-pointer disabled:cursor-not-allowed"
        >
          <CcGlyphChevronEnd className="w-[22px] h-[22px]" />
        </button>
      </div>

      {/* Secondary Ghost Toolbar Row (height: 38px) */}
      <div className="h-[38px] mt-1 flex items-center justify-center gap-2 text-[#9e9c99]">
        <button
          type="button"
          onClick={onNewGame}
          className="h-[34px] px-2.5 rounded-[5px] hover:bg-[#31302d] hover:text-white flex items-center gap-1.5 text-[12.5px] font-bold transition-colors cursor-pointer"
        >
          <CcGlyphPlusNew className="w-[18px] h-[18px]" />
          <span>New</span>
        </button>

        {onToggleAutoPlay ? (
          <button
            type="button"
            onClick={onToggleAutoPlay}
            className={`h-[34px] px-2.5 rounded-[5px] flex items-center gap-1.5 text-[12.5px] font-bold transition-colors cursor-pointer ${
              isAutoPlaying
                ? 'bg-[#81b64c]/20 text-[#9cd062]'
                : 'hover:bg-[#31302d] hover:text-white'
            }`}
          >
            {isAutoPlaying ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
            <span>{isAutoPlaying ? 'Pause' : 'Play'}</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onCopyPgn}
            className="h-[34px] px-2.5 rounded-[5px] hover:bg-[#31302d] hover:text-white flex items-center gap-1.5 text-[12.5px] font-bold transition-colors cursor-pointer"
          >
            <span>{copiedPgn ? 'Copied!' : 'Save'}</span>
          </button>
        )}

        <button
          type="button"
          onClick={onReviewAction}
          className="h-[34px] px-2.5 rounded-[5px] hover:bg-[#31302d] hover:text-white flex items-center gap-1.5 text-[12.5px] font-bold transition-colors cursor-pointer"
        >
          <CcGlyphCircleFillStar className="w-[18px] h-[18px]" />
          <span>{reviewLabel}</span>
        </button>

        <button
          type="button"
          onClick={onFlipBoard}
          title="Flip Board"
          className="w-[34px] h-[34px] rounded-[5px] hover:bg-[#31302d] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <CcGlyphFlipBoard className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onNewGame}
          title="More Options / Import"
          className="w-[34px] h-[34px] rounded-[5px] hover:bg-[#31302d] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <CcGlyphEllipsis className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
