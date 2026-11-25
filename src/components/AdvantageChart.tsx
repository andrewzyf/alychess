import React, { useState } from 'react';
import {
  CLASSIFICATION_META,
  MoveClassification,
  ReviewedPly,
} from '../types/chess';
import { formatEvalBadge } from '../utils/chessHelpers';

interface AdvantageChartProps {
  plies: ReviewedPly[];
  activePly: number;
  onSelectPly: (ply: number) => void;
  compact?: boolean;
}

const SCATTER_TYPES = new Set<MoveClassification>([
  'brilliant',
  'great',
  'mistake',
  'miss',
  'blunder',
]);

/**
 * 1:1 Chess.com Dark-Mode Advantage Area Graph
 * #403d3a Black upper fill, #ffffff White lower fill, dashed midline, scatter dots
 */
export const AdvantageChart: React.FC<AdvantageChartProps> = ({
  plies,
  activePly,
  onSelectPly,
  compact = false,
}) => {
  const [hoverPly, setHoverPly] = useState<number | null>(null);

  if (plies.length === 0) return null;

  const width = 380;
  const height = compact ? 34 : 88;
  const maxIdx = Math.max(1, plies.length - 1);

  const xFor = (idx: number) => (idx / maxIdx) * width;
  const yFor = (winPctWhite: number) => {
    const clamped = Math.max(3, Math.min(97, winPctWhite));
    return height - (clamped / 100) * height;
  };

  const linePoints = plies.map(
    (p, idx) => `${xFor(idx).toFixed(1)},${yFor(p.winPctWhite).toFixed(1)}`
  );
  const areaPath = `M 0,${height} L ${linePoints.join(' L ')} L ${width},${height} Z`;
  const strokePath = `M ${linePoints.join(' L ')}`;

  const handlePointer = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * maxIdx);
    setHoverPly(idx);
    if (e.buttons === 1) {
      onSelectPly(idx);
    }
  };

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const idx = Math.round(ratio * maxIdx);
    onSelectPly(idx);
  };

  const inspectedPly = hoverPly !== null ? plies[hoverPly] : null;

  return (
    <div className="relative w-full select-none">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        onMouseMove={handlePointer}
        onMouseLeave={() => setHoverPly(null)}
        onClick={handleClick}
        className="w-full h-auto rounded-[5px] bg-[#403d3a] border border-[#1d1c1a] cursor-pointer overflow-hidden block"
      >
        {/* White Advantage Area */}
        <path d={areaPath} fill="#ffffff" />

        {/* Subtle Curve Edge */}
        <path
          d={strokePath}
          fill="none"
          stroke="rgba(128,128,128,0.45)"
          strokeWidth={compact ? '1.1' : '1.4'}
        />

        {/* 50% Equal Midline */}
        <line
          x1={0}
          y1={height / 2}
          x2={width}
          y2={height / 2}
          stroke="#7e7c79"
          strokeOpacity="0.65"
          strokeDasharray="3 3"
          strokeWidth="1"
        />

        {/* Active Ply Playhead */}
        {activePly >= 0 && activePly < plies.length && (
          <line
            x1={xFor(activePly)}
            y1={0}
            x2={xFor(activePly)}
            y2={height}
            stroke="#81b64c"
            strokeWidth="2"
          />
        )}

        {/* Hover Cursor */}
        {hoverPly !== null && hoverPly !== activePly && (
          <line
            x1={xFor(hoverPly)}
            y1={0}
            x2={xFor(hoverPly)}
            y2={height}
            stroke="rgba(255,255,255,0.5)"
            strokeWidth="1.2"
          />
        )}

        {/* Colored Scatter Dots */}
        {!compact &&
          plies.map((p, idx) => {
            if (!p.classification || !SCATTER_TYPES.has(p.classification)) {
              return null;
            }
            const meta = CLASSIFICATION_META[p.classification];
            const cx = xFor(idx);
            const cy = yFor(p.winPctWhite);
            const isSelected = idx === activePly;
            return (
              <circle
                key={idx}
                cx={cx}
                cy={cy}
                r={isSelected ? 4.6 : 3.5}
                fill={meta.color}
                stroke="#1f1e1b"
                strokeWidth="1.1"
              />
            );
          })}
      </svg>

      {!compact && inspectedPly && inspectedPly.ply > 0 && (
        <div className="absolute top-1.5 right-2 px-2 py-0.5 rounded bg-[#1b1a18]/92 text-white text-[10.5px] font-semibold pointer-events-none flex items-center gap-1.5 shadow">
          <span className="text-[#9e9c99] tabular-nums">
            {Math.ceil(inspectedPly.ply / 2)}
            {inspectedPly.color === 'w' ? '.' : '...'}
          </span>
          <span className="font-bold">{inspectedPly.san}</span>
          <span className="font-mono text-[10px] text-[#9cd062] tabular-nums">
            {formatEvalBadge(inspectedPly.cpWhite, inspectedPly.mateWhite)}
          </span>
        </div>
      )}
    </div>
  );
};
