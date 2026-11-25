import React, { useEffect, useRef } from 'react';
import { ChevronRight, Eye, Lightbulb, RotateCcw } from 'lucide-react';
import {
  AppMode,
  CLASSIFICATION_META,
  CLASSIFICATION_ORDER,
  GameReviewReport,
  MoveClassification,
  ReviewedPly,
} from '../types/chess';
import { ReviewProgressPayload } from '../services/engineService';
import { formatEvalBadge, formatPgnClock } from '../utils/chessHelpers';
import { AdvantageChart } from './AdvantageChart';
import { AlyMascot, PlayerAvatar } from './AlyMascot';
import { CcGlyphBookSmall, CcGlyphCircleFillStar } from './ChessComIcons';
import { ClassificationBadge } from './ClassificationBadge';
import { GameControlsFooter } from './GameControlsFooter';
import { SanFigurine } from './NeoPieces';
import { RightPanelShell } from './RightPanelShell';

export interface EngineLinePreviewState {
  mode: 'best' | 'explain';
  label: string;
  baseFen: string;
  uciMoves: string[];
  sanMoves: string[];
  stepIndex: number;
}

interface GameReviewPanelProps {
  report: GameReviewReport | null;
  isReviewing: boolean;
  progress: ReviewProgressPayload | null;
  subView: 'summary' | 'moves';
  onChangeSubView: (view: 'summary' | 'moves') => void;
  activePly: number;
  onSelectPly: (ply: number) => void;
  isAutoPlaying: boolean;
  onToggleAutoPlay: () => void;
  enginePreview: EngineLinePreviewState | null;
  onStartShowBest: () => void;
  onStartExplain: () => void;
  onStepEnginePreview: () => void;
  onExitEnginePreview: () => void;
  onJumpNextKeyMove: () => void;
  onOpenImporter: () => void;
  onSelectTab: (tab: AppMode | 'games') => void;
  onFlipBoard: () => void;
  onOpenPlayerProfile?: (username: string) => void;
}

/**
 * 1:1 Chess.com Dark-Mode Game Review Panel inside `#board-layout-sidebar`
 * - Aly Coach portrait + crisp White `#ffffff` Speech Bubble with left pointer tail
 * - State 1: Dark Summary Card (Advantage Graph, White/Black Accuracy cards, 10 classification rows, Game Rating, 3D green Start Review CTA)
 * - State 2: Move-by-Move Review (Show Best / Explain / Next / Key ★, Opening bar, #2a2926/#262522 alternating move list, Sparkline + Chess.com transport controls)
 */
export const GameReviewPanel: React.FC<GameReviewPanelProps> = ({
  report,
  isReviewing,
  progress,
  subView,
  onChangeSubView,
  activePly,
  onSelectPly,
  isAutoPlaying,
  onToggleAutoPlay,
  enginePreview,
  onStartShowBest,
  onStartExplain,
  onStepEnginePreview,
  onExitEnginePreview,
  onJumpNextKeyMove,
  onOpenImporter,
  onSelectTab,
  onFlipBoard,
  onOpenPlayerProfile,
}) => {
  const activeMoveBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (subView === 'moves' && activeMoveBtnRef.current) {
      activeMoveBtnRef.current.scrollIntoView({
        block: 'nearest',
        behavior: 'smooth',
      });
    }
  }, [activePly, subView]);

  const currentPlyData: ReviewedPly | undefined = report?.plies[activePly];

  const movePairs: Array<{
    moveNumber: number;
    white?: ReviewedPly;
    black?: ReviewedPly;
  }> = [];
  if (report) {
    for (let i = 1; i < report.plies.length; i += 2) {
      movePairs.push({
        moveNumber: Math.ceil(i / 2),
        white: report.plies[i],
        black: report.plies[i + 1],
      });
    }
  }

  const jumpToFirstClassification = (color: 'w' | 'b', cls: MoveClassification) => {
    if (!report) return;
    const target = report.plies.find(
      (p) => p.ply >= 1 && p.color === color && p.classification === cls
    );
    if (target) {
      onChangeSubView('moves');
      onSelectPly(target.ply);
    }
  };

  const canShowBest = Boolean(
    currentPlyData &&
      currentPlyData.ply >= 1 &&
      currentPlyData.bestMoveUci &&
      currentPlyData.bestMoveUci !== currentPlyData.uci
  );

  const canExplain = Boolean(
    currentPlyData &&
      currentPlyData.continuationUci &&
      currentPlyData.continuationUci.length > 0
  );

  return (
    <RightPanelShell
      title="Game Review"
      headerIcon={<CcGlyphCircleFillStar className="w-[22px] h-[22px] text-[#81b64c]" />}
      onBack={
        subView === 'moves' && !isReviewing
          ? () => {
              onExitEnginePreview();
              onChangeSubView('summary');
            }
          : undefined
      }
      activeTab="review"
      onSelectTab={onSelectTab}
    >
      {/* Coach Row: Aly Avatar + Crisp White `#ffffff` Speech Bubble */}
      <div className="px-3.5 py-3 border-b border-[#33322f] shrink-0 bg-[#262522]">
        <div className="flex items-start gap-3">
          <AlyMascot
            mood={
              isReviewing
                ? 'thinking'
                : subView === 'summary'
                ? report?.summaryMood || 'happy'
                : currentPlyData?.alyMood || 'happy'
            }
            size={58}
          />

          {/* Authentic Chess.com White Coach Speech Bubble (`#ffffff`) */}
          <div className="relative flex-1 bg-[#ffffff] text-[#262522] rounded-[10px] px-3 py-2.5 min-h-[70px] shadow-[0_2px_10px_rgba(0,0,0,0.28)]">
            {/* Left Pointer Tail */}
            <div className="absolute -left-[7px] top-4 w-0 h-0 border-y-[7px] border-y-transparent border-r-[7px] border-r-[#ffffff]" />

            {isReviewing ? (
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="font-extrabold text-[13px] text-[#262522]">
                    Reviewing Game... {progress?.percent ?? 0}%
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#262522] text-white font-mono font-bold text-[10.5px] tabular-nums">
                    {progress?.workersActive ? `${progress.workersActive}× Parallel` : 'Fast WASM'}
                  </span>
                </div>
                <div className="w-full h-2.5 bg-[#e5e4e2] rounded-full overflow-hidden mb-1.5">
                  <div
                    style={{ width: `${progress?.percent ?? 5}%` }}
                    className="h-full bg-[#81b64c] transition-all duration-150 rounded-full"
                  />
                </div>
                <p className="text-[11.5px] text-[#5c5956] leading-snug tabular-nums">
                  Stockfish 19 Lite Pool · Move {progress?.completedPlies ?? 0} of{' '}
                  {progress?.totalPlies ?? '--'}
                </p>
              </div>
            ) : enginePreview ? (
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-[#81b64c] text-white flex items-center justify-center text-[10px] font-bold">
                      ★
                    </span>
                    <span className="font-extrabold text-[12.5px] text-[#262522]">
                      {enginePreview.label}
                    </span>
                  </div>
                  <span className="text-[10.5px] font-bold text-[#537133] tabular-nums">
                    {enginePreview.stepIndex + 1}/{enginePreview.sanMoves.length}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-1 mt-1">
                  {enginePreview.sanMoves.map((s, idx) => (
                    <span
                      key={idx}
                      className={`px-1.5 py-0.5 rounded text-[11.5px] font-mono ${
                        idx === enginePreview.stepIndex
                          ? 'bg-[#81b64c] text-white font-bold'
                          : idx < enginePreview.stepIndex
                          ? 'bg-[#e8e7e5] text-[#262522] font-semibold'
                          : 'text-[#6e6b68]'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            ) : subView === 'summary' && report ? (
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="font-extrabold text-[13px] text-[#262522]">
                    Coach Aly
                  </span>
                  <span className="px-1.5 py-0.5 rounded bg-[#e8e7e5] text-[#262522] font-mono font-bold text-[10.5px] tabular-nums">
                    {report.game.result}
                  </span>
                </div>
                <p className="text-[12.5px] text-[#3d3b38] leading-snug font-medium">
                  {report.summaryQuote}
                </p>
              </div>
            ) : currentPlyData ? (
              <div>
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {currentPlyData.classification && (
                      <ClassificationBadge type={currentPlyData.classification} size="sm" />
                    )}
                    <span className="font-extrabold text-[13px] text-[#262522] truncate">
                      {currentPlyData.coachTitle || 'Starting Position'}
                    </span>
                  </div>
                  <span
                    className={`px-1.5 py-0.5 rounded font-mono font-bold text-[11px] tabular-nums shrink-0 ${
                      currentPlyData.cpWhite >= 0
                        ? 'bg-[#e8e7e3] text-[#262522]'
                        : 'bg-[#262522] text-white'
                    }`}
                  >
                    {formatEvalBadge(currentPlyData.cpWhite, currentPlyData.mateWhite)}
                  </span>
                </div>
                <p className="text-[12.5px] text-[#3d3b38] leading-[1.36]">
                  {currentPlyData.coachBody}
                </p>
                {currentPlyData.coachTip && (
                  <div className="mt-1.5 pt-1.5 border-t border-[#e8e7e4] text-[11.5px] font-semibold text-[#537133] leading-snug">
                    {currentPlyData.coachTip}
                  </div>
                )}
                {currentPlyData.coachTags && currentPlyData.coachTags.length > 0 && (
                  <div className="mt-1.5 flex flex-wrap gap-1">
                    {currentPlyData.coachTags.map((tag) => (
                      <span
                        key={tag}
                        className="px-1.5 py-[1px] rounded bg-[#eeedea] text-[#524f4c] font-bold text-[10px]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>

      {/* Body: Loading vs Summary vs Move-by-Move */}
      {isReviewing || !report ? (
        <div className="flex-1 flex flex-col items-center justify-center px-6 text-center bg-[#262522]">
          <div className="w-11 h-11 rounded-full border-4 border-[#3a3835] border-t-[#81b64c] animate-spin mb-3" />
          <div className="font-extrabold text-[15px] text-white">
            Evaluating Game...
          </div>
          <p className="text-[12.5px] text-[#9e9c99] mt-1 max-w-[270px]">
            Running Stockfish 19 Lite WASM (Depth 16 · MultiPV 3) across every position.
          </p>
        </div>
      ) : subView === 'summary' ? (
        /* ================= STATE 1: DARK-MODE SUMMARY CARD ================= */
        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3.5">
            {/* Advantage Area Graph */}
            <AdvantageChart
              plies={report.plies}
              activePly={activePly}
              onSelectPly={(ply) => {
                onSelectPly(ply);
                onChangeSubView('moves');
              }}
            />

            {/* Players & CAPS2 Accuracy Comparison */}
            <div className="pt-1">
              <div className="grid grid-cols-[1fr_92px_1fr] items-center gap-2">
                {/* White Player */}
                <button
                  type="button"
                  onClick={() =>
                    onOpenPlayerProfile?.(report.game.white.username)
                  }
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <PlayerAvatar
                    username={report.game.white.username}
                    avatarUrl={report.game.white.avatarUrl}
                    color="w"
                    size={42}
                  />
                  <span className="mt-1 font-bold text-[12.5px] text-[#dad9d7] group-hover:text-white group-hover:underline truncate max-w-[125px]">
                    {report.game.white.username}
                  </span>
                  <span className="text-[11px] font-semibold text-[#8b8987] tabular-nums">
                    ({report.game.white.rating})
                  </span>
                </button>

                <div />

                {/* Black Player */}
                <button
                  type="button"
                  onClick={() =>
                    onOpenPlayerProfile?.(report.game.black.username)
                  }
                  className="flex flex-col items-center group cursor-pointer"
                >
                  <PlayerAvatar
                    username={report.game.black.username}
                    avatarUrl={report.game.black.avatarUrl}
                    color="b"
                    size={42}
                  />
                  <span className="mt-1 font-bold text-[12.5px] text-[#dad9d7] group-hover:text-white group-hover:underline truncate max-w-[125px]">
                    {report.game.black.username}
                  </span>
                  <span className="text-[11px] font-semibold text-[#8b8987] tabular-nums">
                    ({report.game.black.rating})
                  </span>
                </button>
              </div>

              {/* Accuracy Row */}
              <div className="grid grid-cols-[1fr_92px_1fr] items-center gap-2 mt-2">
                <div className="flex justify-center">
                  <div
                    className={`min-w-[78px] text-center px-3 py-1.5 rounded-[6px] bg-[#ffffff] text-[#21201e] font-black text-[20px] leading-none tabular-nums ${
                      report.whiteAccuracy >= report.blackAccuracy
                        ? 'ring-2 ring-[#81b64c]'
                        : ''
                    }`}
                  >
                    {report.whiteAccuracy.toFixed(1)}
                  </div>
                </div>
                <div className="text-center text-[12.5px] font-bold text-[#9e9c99]">
                  Accuracy
                </div>
                <div className="flex justify-center">
                  <div
                    className={`min-w-[78px] text-center px-3 py-1.5 rounded-[6px] bg-[#191816] text-white border border-[#3d3b38] font-black text-[20px] leading-none tabular-nums ${
                      report.blackAccuracy > report.whiteAccuracy
                        ? 'ring-2 ring-[#81b64c]'
                        : ''
                    }`}
                  >
                    {report.blackAccuracy.toFixed(1)}
                  </div>
                </div>
              </div>
            </div>

            <div className="border-t border-[#363431]" />

            {/* 10-Row Move Classification Breakdown */}
            <div className="space-y-1">
              {CLASSIFICATION_ORDER.map((cls) => {
                const meta = CLASSIFICATION_META[cls];
                const wCount = report.whiteCounts[cls] || 0;
                const bCount = report.blackCounts[cls] || 0;
                return (
                  <div
                    key={cls}
                    className="grid grid-cols-[1fr_144px_1fr] items-center py-1 px-2 rounded hover:bg-[#2f2e2b] transition-colors text-[13px]"
                  >
                    <button
                      type="button"
                      disabled={wCount === 0}
                      onClick={() => jumpToFirstClassification('w', cls)}
                      style={{ color: wCount > 0 ? meta.color : '#666461' }}
                      className={`font-extrabold tabular-nums text-center ${
                        wCount > 0 ? 'cursor-pointer hover:underline' : 'cursor-default'
                      }`}
                    >
                      {wCount}
                    </button>

                    <div className="flex items-center justify-between px-2">
                      <span className="font-semibold text-[#c5c4c2] text-[12.5px]">
                        {meta.label}
                      </span>
                      <ClassificationBadge type={cls} size="sm" />
                    </div>

                    <button
                      type="button"
                      disabled={bCount === 0}
                      onClick={() => jumpToFirstClassification('b', cls)}
                      style={{ color: bCount > 0 ? meta.color : '#666461' }}
                      className={`font-extrabold tabular-nums text-center ${
                        bCount > 0 ? 'cursor-pointer hover:underline' : 'cursor-default'
                      }`}
                    >
                      {bCount}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-[#363431]" />

            {/* Estimated Game Rating Row */}
            <div className="grid grid-cols-[1fr_144px_1fr] items-center py-1">
              <div className="flex justify-center">
                <span className="px-3 py-0.5 rounded-[5px] bg-[#ffffff] text-[#21201e] font-extrabold text-[14px] tabular-nums">
                  {report.whiteEstimatedElo}
                </span>
              </div>
              <div className="text-center font-bold text-[12.5px] text-[#9e9c99]">
                Game Rating
              </div>
              <div className="flex justify-center">
                <span className="px-3 py-0.5 rounded-[5px] bg-[#191816] text-white border border-[#3d3b38] font-extrabold text-[14px] tabular-nums">
                  {report.blackEstimatedElo}
                </span>
              </div>
            </div>
          </div>

          {/* Sticky `#21201e` Footer with 3D Green Start Review Button */}
          <div className="p-3.5 bg-[#21201e] border-t border-[#31302d] shrink-0">
            <button
              type="button"
              onClick={() => {
                onChangeSubView('moves');
                if (report.plies.length > 1) {
                  onSelectPly(1);
                }
              }}
              style={{
                background: 'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
                boxShadow: '0 4px 0 #537133',
              }}
              className="w-full h-[46px] rounded-[8px] hover:brightness-105 active:translate-y-[1px] text-white font-extrabold text-[17px] tracking-tight cursor-pointer transition-all"
            >
              Start Review
            </button>
          </div>
        </div>
      ) : (
        /* ================= STATE 2: DARK-MODE MOVE-BY-MOVE REVIEW ================= */
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Coach Action Row (`Show Best` / `Explain` / `Next` / `Key ★`) */}
          <div className="px-3.5 py-2.5 bg-[#262522] border-b border-[#33322f] flex items-center gap-2 shrink-0">
            {enginePreview ? (
              <>
                <button
                  type="button"
                  onClick={onExitEnginePreview}
                  className="flex-1 h-[38px] px-3 rounded-[6px] bg-[#373634] hover:bg-[#43423f] text-[#dad9d7] font-bold text-[12.5px] shadow-[0_3px_0_#191816] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Back to Game</span>
                </button>
                <button
                  type="button"
                  onClick={onStepEnginePreview}
                  disabled={enginePreview.stepIndex >= enginePreview.uciMoves.length - 1}
                  style={{
                    background: 'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
                    boxShadow: '0 3px 0 #537133',
                  }}
                  className="flex-1 h-[38px] px-3 rounded-[6px] disabled:opacity-45 text-white font-extrabold text-[12.5px] flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Next Move</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            ) : (
              <>
                {canShowBest ? (
                  <button
                    type="button"
                    onClick={onStartShowBest}
                    className="flex-1 h-[38px] px-2.5 rounded-[6px] bg-[#373634] hover:bg-[#43423f] text-[#e5e4e2] font-bold text-[12px] whitespace-nowrap shadow-[0_3px_0_#191816] flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Lightbulb className="w-3.5 h-3.5 text-[#9cd062] shrink-0" />
                    <span>Best ({currentPlyData?.bestMoveSan})</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={!canExplain}
                    onClick={onStartExplain}
                    className="flex-1 h-[38px] px-2.5 rounded-[6px] bg-[#373634] hover:bg-[#43423f] disabled:opacity-40 text-[#e5e4e2] font-bold text-[12px] whitespace-nowrap shadow-[0_3px_0_#191816] flex items-center justify-center gap-1.5 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#5c8bb0] shrink-0" />
                    <span>Show Moves</span>
                  </button>
                )}

                {canShowBest && canExplain && (
                  <button
                    type="button"
                    onClick={onStartExplain}
                    title="Show opponent's refutation sequence"
                    className="h-[38px] px-2.5 rounded-[6px] bg-[#373634] hover:bg-[#43423f] text-[#e5e4e2] font-bold text-[12px] shadow-[0_3px_0_#191816] flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#e58f2a]" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => {
                    if (activePly < report.plies.length - 1) {
                      onSelectPly(activePly + 1);
                    }
                  }}
                  disabled={activePly >= report.plies.length - 1}
                  style={{
                    background: 'linear-gradient(180deg, #87b059 0%, #739b49 100%)',
                    boxShadow: '0 3px 0 #537133',
                  }}
                  className="flex-1 h-[38px] px-3 rounded-[6px] hover:brightness-105 disabled:opacity-45 text-white font-extrabold text-[13.5px] flex items-center justify-center gap-1 cursor-pointer disabled:cursor-not-allowed"
                >
                  <span>Next</span>
                  <ChevronRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={onJumpNextKeyMove}
                  title="Next Key Move"
                  className="h-[38px] px-2.5 rounded-[6px] bg-[#373634] hover:bg-[#43423f] text-[#9cd062] font-extrabold text-[11.5px] shadow-[0_3px_0_#191816] cursor-pointer shrink-0"
                >
                  Key ★
                </button>
              </>
            )}
          </div>

          {/* Opening Row (`#262522` with book icon on right, matching Chess.com) */}
          <div className="h-[34px] px-3.5 bg-[#262522] border-b border-[#33322f] flex items-center justify-between text-[12px] text-[#c3c2c0] shrink-0">
            <span className="truncate">
              {currentPlyData?.opening?.eco || report.opening.eco}{' '}
              {currentPlyData?.opening?.name || report.opening.name}
            </span>
            <CcGlyphBookSmall className="w-4 h-4 text-[#939290] shrink-0 ml-2" />
          </div>

          {/* Dark Alternating 2-Column Move List (`#2a2926` / `#262522`) */}
          <div className="flex-1 overflow-y-auto">
            {movePairs.map((pair, idx) => (
              <div
                key={pair.moveNumber}
                className={`grid grid-cols-[42px_1fr_1fr] items-center text-[13px] h-[30px] ${
                  idx % 2 === 0 ? 'bg-[#2a2926]' : 'bg-[#262522]'
                }`}
              >
                <div className="pl-3.5 text-[#8b8987] font-semibold text-[12px] tabular-nums">
                  {pair.moveNumber}.
                </div>

                {pair.white ? (() => {
                  const cls = pair.white.classification;
                  const showInlineBadge = Boolean(
                    cls && CLASSIFICATION_META[cls].isKeyMove
                  );
                  const isActive = activePly === pair.white.ply;
                  return (
                    <button
                      ref={isActive ? activeMoveBtnRef : null}
                      type="button"
                      onClick={() => onSelectPly(pair.white!.ply)}
                      className={`h-full px-2 flex items-center justify-between text-left transition-colors cursor-pointer rounded-[3px] ${
                        isActive
                          ? 'bg-[#48452a] text-[#ffff7a] font-extrabold'
                          : 'hover:bg-[#363531] font-bold text-[#dad9d7]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        {showInlineBadge && cls && (
                          <ClassificationBadge type={cls} size="xs" />
                        )}
                        <span
                          style={
                            !isActive && showInlineBadge && cls
                              ? { color: CLASSIFICATION_META[cls].color }
                              : undefined
                          }
                        >
                          <SanFigurine san={pair.white.san || ''} color="w" />
                        </span>
                      </span>
                      {pair.white.clock && (
                        <span className="text-[10.5px] font-mono text-[#7d7b78] tabular-nums ml-1">
                          {formatPgnClock(pair.white.clock)}
                        </span>
                      )}
                    </button>
                  );
                })() : (
                  <div />
                )}

                {pair.black ? (() => {
                  const cls = pair.black.classification;
                  const showInlineBadge = Boolean(
                    cls && CLASSIFICATION_META[cls].isKeyMove
                  );
                  const isActive = activePly === pair.black.ply;
                  return (
                    <button
                      ref={isActive ? activeMoveBtnRef : null}
                      type="button"
                      onClick={() => onSelectPly(pair.black!.ply)}
                      className={`h-full px-2 flex items-center justify-between text-left transition-colors cursor-pointer rounded-[3px] ${
                        isActive
                          ? 'bg-[#48452a] text-[#ffff7a] font-extrabold'
                          : 'hover:bg-[#363531] font-bold text-[#dad9d7]'
                      }`}
                    >
                      <span className="flex items-center gap-1.5 truncate">
                        {showInlineBadge && cls && (
                          <ClassificationBadge type={cls} size="xs" />
                        )}
                        <span
                          style={
                            !isActive && showInlineBadge && cls
                              ? { color: CLASSIFICATION_META[cls].color }
                              : undefined
                          }
                        >
                          <SanFigurine san={pair.black.san || ''} color="b" />
                        </span>
                      </span>
                      {pair.black.clock && (
                        <span className="text-[10.5px] font-mono text-[#7d7b78] tabular-nums ml-1">
                          {formatPgnClock(pair.black.clock)}
                        </span>
                      )}
                    </button>
                  );
                })() : (
                  <div />
                )}
              </div>
            ))}
          </div>

          {/* Mini Sparkline Strip */}
          <div className="px-3 py-1.5 bg-[#21201e] border-t border-[#31302d] shrink-0">
            <AdvantageChart
              plies={report.plies}
              activePly={activePly}
              onSelectPly={onSelectPly}
              compact
            />
          </div>

          {/* Exact Chess.com Transport & Secondary Controls */}
          <GameControlsFooter
            canBack={activePly > 0}
            canForward={activePly < report.plies.length - 1}
            onFirst={() => onSelectPly(0)}
            onPrev={() => onSelectPly(Math.max(0, activePly - 1))}
            onNext={() => onSelectPly(Math.min(report.plies.length - 1, activePly + 1))}
            onLast={() => onSelectPly(report.plies.length - 1)}
            onNewGame={onOpenImporter}
            onReviewAction={() => {
              onExitEnginePreview();
              onChangeSubView('summary');
            }}
            reviewLabel="Summary"
            isAutoPlaying={isAutoPlaying}
            onToggleAutoPlay={onToggleAutoPlay}
            onFlipBoard={onFlipBoard}
          />
        </div>
      )}
    </RightPanelShell>
  );
};
