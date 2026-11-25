import React from 'react';
import { cpToWinPct } from '../utils/capsCalculator';
import { formatEvalBarLabel } from '../utils/chessHelpers';

interface EvalBarProps {
  cpWhite: number;
  mateWhite: number | null;
  flipped: boolean;
  height: number;
}

/**
 * 1:1 Chess.com `.evaluation-bar-bar` (30px width, 10px left of board)
 * #403d3a (Black) vs #ffffff (White), smooth 300ms ease-out split,
 * 11px bold score pinned to winning side's end.
 */
export const EvalBar: React.FC<EvalBarProps> = ({
  cpWhite,
  mateWhite,
  flipped,
  height,
}) => {
  let whitePct = cpToWinPct(cpWhite);
  if (mateWhite !== null) {
    if (mateWhite > 0) whitePct = 100;
    else if (mateWhite < 0) whitePct = 0;
    else whitePct = cpWhite >= 0 ? 100 : 0;
  } else {
    whitePct = Math.max(5, Math.min(95, whitePct));
  }

  const whiteWinning =
    mateWhite !== null ? mateWhite >= 0 && cpWhite >= 0 : cpWhite >= 0;

  const label = formatEvalBarLabel(cpWhite, mateWhite);
  const topIsWhite = flipped;
  const topFillPct = topIsWhite ? whitePct : 100 - whitePct;
  const labelAtTop = (whiteWinning && topIsWhite) || (!whiteWinning && !topIsWhite);

  return (
    <div
      style={{ height, width: 30 }}
      className="evaluation-bar-bar relative rounded-[3px] overflow-hidden bg-[#403d3a] select-none shrink-0"
    >
      <div
        style={{
          height: `${topFillPct}%`,
          backgroundColor: topIsWhite ? '#ffffff' : '#403d3a',
          transition: 'height 300ms ease-out',
        }}
        className="w-full"
      />
      <div
        style={{
          height: `${100 - topFillPct}%`,
          backgroundColor: topIsWhite ? '#403d3a' : '#ffffff',
          transition: 'height 300ms ease-out',
        }}
        className="w-full"
      />

      <span
        className={`absolute inset-x-0 flex justify-center pointer-events-none font-bold text-[11px] leading-none tracking-tight tabular-nums ${
          labelAtTop ? 'top-1.5' : 'bottom-1.5'
        } ${whiteWinning ? 'text-[#403d3a]' : 'text-[#ffffff]'}`}
      >
        {label}
      </span>
    </div>
  );
};
