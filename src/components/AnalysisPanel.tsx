import React, { useState } from 'react';
import { Pencil } from 'lucide-react';
import { AppMode, EngineLine, PositionEvaluation } from '../types/chess';
import { formatEvalBadge } from '../utils/chessHelpers';
import { OpeningEntry } from '../utils/ecoBook';
import {
  CcGlyphBookSmall,
  CcGlyphCogwheel,
  CcGlyphEllipsis,
  CcGlyphMagnifierChecker,
} from './ChessComIcons';
import { GameControlsFooter } from './GameControlsFooter';
import { SanFigurine } from './NeoPieces';
import { RightPanelShell } from './RightPanelShell';

export interface AnalysisNode {
  ply: number;
  fen: string;
  san?: string;
  uci?: string;
  from?: string;
  to?: string;
  color?: 'w' | 'b';
}

interface AnalysisPanelProps {
  nodes: AnalysisNode[];
  branchNote: string | null;
  activeIdx: number;
  onSelectIdx: (idx: number) => void;
  evaluation: PositionEvaluation | null;
  engineEnabled: boolean;
  onToggleEngine: () => void;
  showThreatArrow: boolean;
  onToggleThreatArrow: () => void;
  onHoverLine: (line: EngineLine | null) => void;
  onPlayEngineMove: (uci: string) => void;
  onResetBoard: () => void;
  onOpenImporter: () => void;
  onSendToReview: () => void;
  onSelectTab: (tab: AppMode | 'games') => void;
  onFlipBoard: () => void;
  whiteLabel: string;
  blackLabel: string;
  resultLabel: string;
  opening?: OpeningEntry;
}

/**
 * Format Stockfish SAN PV array (`['e4', 'e5', 'Nf3', 'Nc6']`) into Chess.com's exact
 * numbered string: `1. e4 e5 2. Nf3 Nc6 ...`
 */
function formatNumberedPv(fen: string, pvSan: string[]): string {
  if (pvSan.length === 0) return '';
  const parts = fen.split(' ');
  const startTurn = parts[1] === 'b' ? 'b' : 'w';
  let moveNum = parseInt(parts[5] || '1', 10) || 1;

  const out: string[] = [];
  let turn: 'w' | 'b' = startTurn;

  pvSan.forEach((san, idx) => {
    if (turn === 'w') {
      out.push(`${moveNum}. ${san}`);
      turn = 'b';
    } else {
      if (idx === 0) {
        out.push(`${moveNum}... ${san}`);
      } else {
        out.push(san);
      }
      turn = 'w';
      moveNum++;
    }
  });

  return out.join(' ');
}

/**
 * 1:1 Pixel Clone of Chess.com's `Analysis` View (`step_12_shot_1.png`):
 * - `.analysis-options-component` (green switch + `Analysis` + `...` | `depth=18 | Stockfish 19 Lite` + cogwheel)
 * - 3 MultiPV rows (`+0.32` white/dark score box + numbered PV + expand chevron)
 * - Opening bar (`Starting Position` + book icon)
 * - Match title bar (`IceChoker - ViktorK_99 0-1` + edit pencil)
 * - Alternating `#2a2926` / `#262522` 2-column move table
 * - Verbatim 4-button transport + `New | Save | Review | ...` footer
 */
export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  nodes,
  branchNote,
  activeIdx,
  onSelectIdx,
  evaluation,
  engineEnabled,
  onToggleEngine,
  showThreatArrow,
  onToggleThreatArrow,
  onHoverLine,
  onPlayEngineMove,
  onResetBoard,
  onOpenImporter,
  onSendToReview,
  onSelectTab,
  onFlipBoard,
  whiteLabel,
  blackLabel,
  resultLabel,
  opening,
}) => {
  const [expandedMpvs, setExpandedMpvs] = useState<Record<number, boolean>>({});
  const [copiedPgn, setCopiedPgn] = useState(false);

  const currentFen = nodes[activeIdx]?.fen || nodes[0]?.fen || '';

  const movePairs: Array<{
    moveNumber: number;
    white?: AnalysisNode;
    black?: AnalysisNode;
  }> = [];

  for (let i = 1; i < nodes.length; i += 2) {
    movePairs.push({
      moveNumber: Math.ceil(i / 2),
      white: nodes[i],
      black: nodes[i + 1],
    });
  }

  return (
    <RightPanelShell
      title="Analysis"
      headerIcon={<CcGlyphMagnifierChecker className="w-[22px] h-[22px] text-[#c5c4c2]" />}
      activeTab="analysis"
      onSelectTab={onSelectTab}
    >
      {/* `.analysis-options-component` (height: 49px) */}
      <div className="h-[48px] px-3.5 border-b border-[#33322f] flex items-center justify-between shrink-0 bg-[#262522]">
        {/* Left: Chess.com Switch + `Analysis` + `...` */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            role="switch"
            aria-checked={engineEnabled}
            onClick={onToggleEngine}
            className={`w-[32px] h-[18px] rounded-full p-[2px] transition-colors flex items-center cursor-pointer ${
              engineEnabled ? 'bg-[#81b64c] justify-end' : 'bg-[#4b4946] justify-start'
            }`}
          >
            <span className="w-[14px] h-[14px] rounded-full bg-white shadow-xs" />
          </button>
          <span className="text-[12.5px] font-semibold text-[#c5c4c2]">Analysis</span>
          <button
            type="button"
            onClick={onToggleThreatArrow}
            title={showThreatArrow ? 'Hide Threat Arrow' : 'Show Opponent Threat Arrow'}
            className={`w-6 h-6 rounded flex items-center justify-center transition-colors cursor-pointer ${
              showThreatArrow
                ? 'bg-[#e58f2a]/20 text-[#e58f2a]'
                : 'text-[#939291] hover:bg-[#33322f] hover:text-white'
            }`}
          >
            <CcGlyphEllipsis className="w-4 h-4" />
          </button>
        </div>

        {/* Right: `depth=18 | Stockfish 19 Lite` + Settings Cogwheel */}
        <div className="flex items-center gap-2 text-[11.5px] text-[#939291]">
          <span className="tabular-nums">
            depth={engineEnabled ? evaluation?.depth || 0 : 0} | Stockfish 19 Lite
          </span>
          <button
            type="button"
            onClick={onResetBoard}
            title="Reset Analysis Board"
            className="w-6 h-6 rounded flex items-center justify-center text-[#939291] hover:bg-[#33322f] hover:text-white transition-colors cursor-pointer"
          >
            <CcGlyphCogwheel className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3 MultiPV Engine Line Rows */}
      {engineEnabled && (
        <div className="py-1.5 px-3 border-b border-[#33322f] space-y-1 bg-[#262522] shrink-0">
          {(evaluation?.lines && evaluation.lines.length > 0
            ? evaluation.lines
            : [1, 2, 3].map((n) => ({
                multipv: n,
                depth: 0,
                cpWhite: 0,
                mateWhite: null,
                pvUci: [],
                pvSan: [],
              }))
          ).map((line) => {
            const isExpanded = Boolean(expandedMpvs[line.multipv]);
            const pvText = formatNumberedPv(currentFen, line.pvSan);
            return (
              <div
                key={line.multipv}
                onMouseEnter={() => (line.pvUci.length > 0 ? onHoverLine(line) : undefined)}
                onMouseLeave={() => onHoverLine(null)}
                className="flex items-start gap-2 px-1 py-0.5 rounded hover:bg-[#31302d] transition-colors text-[12.5px]"
              >
                <button
                  type="button"
                  onClick={() => {
                    if (line.pvUci[0]) onPlayEngineMove(line.pvUci[0]);
                  }}
                  className={`min-w-[44px] px-1.5 py-[1px] rounded-[3px] font-bold text-[12px] tabular-nums text-center cursor-pointer shrink-0 ${
                    line.cpWhite >= 0
                      ? 'bg-[#ffffff] text-[#21201e]'
                      : 'bg-[#403d3a] text-[#ffffff]'
                  }`}
                >
                  {line.pvSan.length > 0
                    ? formatEvalBadge(line.cpWhite, line.mateWhite)
                    : '...'}
                </button>

                <div
                  onClick={() => {
                    if (line.pvUci[0]) onPlayEngineMove(line.pvUci[0]);
                  }}
                  className={`flex-1 text-[#dad9d7] font-medium cursor-pointer ${
                    isExpanded ? 'whitespace-normal leading-snug' : 'truncate'
                  }`}
                >
                  {pvText || <span className="text-[#7d7b78]">Calculating...</span>}
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setExpandedMpvs((prev) => ({
                      ...prev,
                      [line.multipv]: !prev[line.multipv],
                    }))
                  }
                  className="text-[#8b8987] hover:text-white text-[10px] px-1 cursor-pointer shrink-0"
                >
                  {isExpanded ? '▴' : '▾'}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Opening Bar (`Starting Position` + book icon) */}
      <div className="h-[36px] px-3.5 border-b border-[#33322f] flex items-center justify-between text-[12px] text-[#c3c2c0] shrink-0">
        <span className="truncate">
          {opening ? `${opening.eco} ${opening.name}` : 'Starting Position'}
          {branchNote ? ` · ${branchNote}` : ''}
        </span>
        <CcGlyphBookSmall className="w-4 h-4 text-[#939291] shrink-0 ml-2" />
      </div>

      {/* Match Header Row (`Player1 - Player2 1-0` + edit icon) */}
      <div className="h-[38px] px-3.5 border-b border-[#33322f] flex items-center justify-between shrink-0">
        <div className="text-[13px] font-bold text-white truncate">
          {whiteLabel} <span className="text-[#939291] font-normal mx-0.5">-</span>{' '}
          {blackLabel}{' '}
          <span className="text-[#9e9c99] font-semibold ml-1 tabular-nums">
            {resultLabel}
          </span>
        </div>
        <button
          type="button"
          onClick={onOpenImporter}
          title="Load PGN / FEN"
          className="w-6 h-6 rounded flex items-center justify-center text-[#939291] hover:bg-[#33322f] hover:text-white cursor-pointer"
        >
          <Pencil className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Alternating `#2a2926` / `#262522` 2-Column Move Table */}
      <div className="flex-1 overflow-y-auto">
        {movePairs.length === 0 ? (
          <div className="h-full flex items-center justify-center text-[12.5px] text-[#8b8987] px-6 text-center">
            Play any legal move on the board or load a PGN to explore variations.
          </div>
        ) : (
          movePairs.map((pair, idx) => (
            <div
              key={pair.moveNumber}
              className={`grid grid-cols-[44px_1fr_1fr] items-center text-[13px] h-[30px] ${
                idx % 2 === 0 ? 'bg-[#2a2926]' : 'bg-[#262522]'
              }`}
            >
              <div className="pl-3.5 text-[#8b8987] font-semibold text-[12px] tabular-nums">
                {pair.moveNumber}.
              </div>
              {pair.white ? (
                <button
                  type="button"
                  onClick={() => onSelectIdx(pair.white!.ply)}
                  className={`h-full px-2.5 text-left cursor-pointer rounded-[3px] ${
                    activeIdx === pair.white.ply
                      ? 'bg-[#48452a] text-[#ffff7a] font-extrabold'
                      : 'hover:bg-[#363531] font-bold text-[#dad9d7]'
                  }`}
                >
                  <SanFigurine san={pair.white.san || ''} color="w" />
                </button>
              ) : (
                <div />
              )}
              {pair.black ? (
                <button
                  type="button"
                  onClick={() => onSelectIdx(pair.black!.ply)}
                  className={`h-full px-2.5 text-left cursor-pointer rounded-[3px] ${
                    activeIdx === pair.black.ply
                      ? 'bg-[#48452a] text-[#ffff7a] font-extrabold'
                      : 'hover:bg-[#363531] font-bold text-[#dad9d7]'
                  }`}
                >
                  <SanFigurine san={pair.black.san || ''} color="b" />
                </button>
              ) : (
                <div />
              )}
            </div>
          ))
        )}
      </div>

      {/* Verbatim Chess.com Transport & Secondary Footer */}
      <GameControlsFooter
        canBack={activeIdx > 0}
        canForward={activeIdx < nodes.length - 1}
        onFirst={() => onSelectIdx(0)}
        onPrev={() => onSelectIdx(Math.max(0, activeIdx - 1))}
        onNext={() => onSelectIdx(Math.min(nodes.length - 1, activeIdx + 1))}
        onLast={() => onSelectIdx(nodes.length - 1)}
        onNewGame={onOpenImporter}
        onReviewAction={onSendToReview}
        reviewLabel="Review"
        copiedPgn={copiedPgn}
        onCopyPgn={() => {
          const movesStr = nodes
            .slice(1)
            .map((n, idx) =>
              idx % 2 === 0 ? `${Math.floor(idx / 2) + 1}. ${n.san}` : n.san
            )
            .join(' ');
          navigator.clipboard?.writeText(movesStr).catch(() => {});
          setCopiedPgn(true);
          setTimeout(() => setCopiedPgn(false), 1500);
        }}
        onFlipBoard={onFlipBoard}
      />
    </RightPanelShell>
  );
};
