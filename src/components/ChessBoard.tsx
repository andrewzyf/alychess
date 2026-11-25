import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Chess, Square } from 'chess.js';
import { BoardArrow, BoardTheme, MoveClassification } from '../types/chess';
import { ClassificationBadge } from './ClassificationBadge';
import { NeoPiece, PieceCode } from './NeoPieces';

interface ChessBoardProps {
  fen: string;
  size: number;
  flipped: boolean;
  theme: BoardTheme;
  interactive: boolean;
  allowedTurn?: 'w' | 'b' | 'both';
  lastMove?: { from: string; to: string } | null;
  destinationBadge?: {
    square: string;
    classification: MoveClassification;
  } | null;
  kingOutcome?: {
    winner: 'w' | 'b';
    isTimeout?: boolean;
  } | null;
  arrows?: BoardArrow[];
  onMove?: (move: { from: string; to: string; promotion?: string }) => boolean;
}

const FILES = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
const RANKS = ['8', '7', '6', '5', '4', '3', '2', '1'];

// Exact Chess.com `<svg viewBox="0 0 100 100" class="coordinates">` positions
const RANK_Y_COORDS = [3.5, 15.75, 28.25, 40.75, 53.25, 65.75, 78.25, 90.75];
const FILE_X_COORDS = [10, 22.5, 35, 47.5, 60, 72.5, 85, 97.5];

function squareToCoords(square: string, flipped: boolean): { col: number; row: number } {
  const fileIdx = square.charCodeAt(0) - 97;
  const rankIdx = 8 - parseInt(square[1], 10);
  if (flipped) {
    return { col: 7 - fileIdx, row: 7 - rankIdx };
  }
  return { col: fileIdx, row: rankIdx };
}

function coordsToSquare(col: number, row: number, flipped: boolean): string | null {
  if (col < 0 || col > 7 || row < 0 || row > 7) return null;
  const fileIdx = flipped ? 7 - col : col;
  const rankNum = flipped ? row + 1 : 8 - row;
  return `${FILES[fileIdx]}${rankNum}`;
}

function buildArrowPolygon(fromSq: string, toSq: string, flipped: boolean): string | null {
  if (fromSq === toSq) return null;
  const c1 = squareToCoords(fromSq, flipped);
  const c2 = squareToCoords(toSq, flipped);

  const x1 = c1.col * 100 + 50;
  const y1 = c1.row * 100 + 50;
  const x2 = c2.col * 100 + 50;
  const y2 = c2.row * 100 + 50;

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy);
  if (len < 10) return null;

  const ux = dx / len;
  const uy = dy / len;
  const px = -uy;
  const py = ux;

  const startOffset = 18;
  const tipOffset = 4;
  const headLength = 36;
  const shaftHalfWidth = 10.5;
  const headHalfWidth = 24;

  const sx = x1 + ux * startOffset;
  const sy = y1 + uy * startOffset;
  const tx = x2 - ux * tipOffset;
  const ty = y2 - uy * tipOffset;
  const bx = tx - ux * headLength;
  const by = ty - uy * headLength;

  return [
    `${sx + px * shaftHalfWidth},${sy + py * shaftHalfWidth}`,
    `${bx + px * shaftHalfWidth},${by + py * shaftHalfWidth}`,
    `${bx + px * headHalfWidth},${by + py * headHalfWidth}`,
    `${tx},${ty}`,
    `${bx - px * headHalfWidth},${by - py * headHalfWidth}`,
    `${bx - px * shaftHalfWidth},${by - py * shaftHalfWidth}`,
    `${sx - px * shaftHalfWidth},${sy - py * shaftHalfWidth}`,
  ].join(' ');
}

export const ChessBoard: React.FC<ChessBoardProps> = ({
  fen,
  size,
  flipped,
  theme,
  interactive,
  allowedTurn = 'both',
  lastMove,
  destinationBadge,
  kingOutcome = null,
  arrows = [],
  onMove,
}) => {
  const boardRef = useRef<HTMLDivElement | null>(null);

  const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
  const [dragging, setDragging] = useState<{
    square: string;
    piece: PieceCode;
    x: number;
    y: number;
  } | null>(null);
  const [hoverSquare, setHoverSquare] = useState<string | null>(null);
  const [pendingPromotion, setPendingPromotion] = useState<{
    from: string;
    to: string;
    color: 'w' | 'b';
  } | null>(null);

  const [userArrows, setUserArrows] = useState<BoardArrow[]>([]);
  const [rightDragStart, setRightDragStart] = useState<string | null>(null);

  useEffect(() => {
    setSelectedSquare(null);
    setDragging(null);
    setPendingPromotion(null);
    setUserArrows([]);
  }, [fen]);

  const chess = useMemo(() => {
    try {
      return new Chess(fen);
    } catch {
      return new Chess();
    }
  }, [fen]);

  const boardPieces = useMemo(() => {
    const map: Record<string, PieceCode> = {};
    const grid = chess.board();
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const p = grid[r][c];
        if (p) {
          const sq = `${FILES[c]}${8 - r}`;
          map[sq] = `${p.color}${p.type.toUpperCase()}` as PieceCode;
        }
      }
    }
    return map;
  }, [chess]);

  const kingInCheckSquare = useMemo(() => {
    if (!chess.inCheck()) return null;
    const turn = chess.turn();
    for (const [sq, code] of Object.entries(boardPieces)) {
      if (code === `${turn}K`) return sq;
    }
    return null;
  }, [chess, boardPieces]);

  const legalTargetsForSelected = useMemo(() => {
    const activeOrigin = dragging?.square || selectedSquare;
    if (!interactive || !activeOrigin) return new Map<string, { isCapture: boolean; isPromotion: boolean }>();

    const piece = chess.get(activeOrigin as Square);
    if (!piece) return new Map();
    if (allowedTurn !== 'both' && piece.color !== allowedTurn) return new Map();
    if (piece.color !== chess.turn()) return new Map();

    const moves = chess.moves({ square: activeOrigin as Square, verbose: true });
    const map = new Map<string, { isCapture: boolean; isPromotion: boolean }>();
    for (const m of moves) {
      map.set(m.to, {
        isCapture: Boolean(m.captured),
        isPromotion: Boolean(m.promotion),
      });
    }
    return map;
  }, [chess, interactive, allowedTurn, selectedSquare, dragging]);

  const squareSize = size / 8;

  const clientPosToSquare = (clientX: number, clientY: number): string | null => {
    const rect = boardRef.current?.getBoundingClientRect();
    if (!rect) return null;
    const col = Math.floor(((clientX - rect.left) / rect.width) * 8);
    const row = Math.floor(((clientY - rect.top) / rect.height) * 8);
    return coordsToSquare(col, row, flipped);
  };

  const attemptMove = (from: string, to: string) => {
    if (!interactive || !onMove || from === to) return false;
    const piece = chess.get(from as Square);
    if (!piece) return false;
    if (allowedTurn !== 'both' && piece.color !== allowedTurn) return false;

    const moves = chess.moves({ square: from as Square, verbose: true });
    const matching = moves.filter((m) => m.to === to);
    if (matching.length === 0) return false;

    if (matching.some((m) => m.promotion)) {
      setPendingPromotion({ from, to, color: piece.color });
      setSelectedSquare(null);
      return true;
    }

    const ok = onMove({ from, to });
    setSelectedSquare(null);
    return ok;
  };

  useEffect(() => {
    if (!dragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return;
      setDragging((prev) =>
        prev
          ? {
              ...prev,
              x: e.clientX - rect.left,
              y: e.clientY - rect.top,
            }
          : null
      );
      setHoverSquare(clientPosToSquare(e.clientX, e.clientY));
    };

    const handlePointerUp = (e: PointerEvent) => {
      const dropSq = clientPosToSquare(e.clientX, e.clientY);
      const fromSq = dragging.square;
      setDragging(null);
      setHoverSquare(null);

      if (dropSq && dropSq !== fromSq) {
        attemptMove(fromSq, dropSq);
      }
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  });

  const handleSquarePointerDown = (e: React.PointerEvent, sq: string) => {
    if (e.button === 2) {
      e.preventDefault();
      setRightDragStart(sq);
      return;
    }
    if (e.button !== 0) return;

    if (userArrows.length > 0) {
      setUserArrows([]);
    }

    if (!interactive) return;

    if (selectedSquare && legalTargetsForSelected.has(sq)) {
      attemptMove(selectedSquare, sq);
      return;
    }

    const pieceCode = boardPieces[sq];
    if (!pieceCode) {
      setSelectedSquare(null);
      return;
    }

    const pieceColor = pieceCode[0] as 'w' | 'b';
    const canControl =
      pieceColor === chess.turn() &&
      (allowedTurn === 'both' || pieceColor === allowedTurn);

    if (!canControl) {
      setSelectedSquare(null);
      return;
    }

    setSelectedSquare(sq);
    const rect = boardRef.current?.getBoundingClientRect();
    if (rect) {
      setDragging({
        square: sq,
        piece: pieceCode,
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
      setHoverSquare(sq);
    }
  };

  const handleSquarePointerUp = (e: React.PointerEvent, sq: string) => {
    if (e.button === 2 && rightDragStart) {
      e.preventDefault();
      if (rightDragStart !== sq) {
        setUserArrows((prev) => {
          const exists = prev.some((a) => a.from === rightDragStart && a.to === sq);
          if (exists) {
            return prev.filter((a) => !(a.from === rightDragStart && a.to === sq));
          }
          return [...prev, { from: rightDragStart, to: sq, color: '#e58f2a', opacity: 0.85 }];
        });
      }
      setRightDragStart(null);
    }
  };

  const displayRanks = flipped ? [...RANKS].reverse() : RANKS;
  const displayFiles = flipped ? [...FILES].reverse() : FILES;
  const combinedArrows = [...arrows, ...userArrows];

  return (
    <div
      id="board-analysis-board"
      ref={boardRef}
      onContextMenu={(e) => e.preventDefault()}
      style={{ width: size, height: size }}
      className="relative rounded-[4px] select-none shrink-0"
    >
      {/* 8x8 Squares Grid */}
      <div className="grid grid-cols-8 grid-rows-8 w-full h-full rounded-[4px] overflow-hidden">
        {displayRanks.map((rank) =>
          displayFiles.map((file) => {
            const sq = `${file}${rank}`;
            const fileIdx = FILES.indexOf(file);
            const rankNum = parseInt(rank, 10);
            const isLight = (fileIdx + rankNum) % 2 === 0;

            const isLastMoveOrigin = lastMove?.from === sq;
            const isLastMoveDest = lastMove?.to === sq;
            const isSelected = selectedSquare === sq;
            const isHoverTarget = Boolean(
              dragging && hoverSquare === sq && legalTargetsForSelected.has(sq)
            );
            const legalTarget = legalTargetsForSelected.get(sq);
            const pieceCode = boardPieces[sq];
            const isBeingDragged = dragging?.square === sq;
            const isKingChecked = kingInCheckSquare === sq;

            const baseBg = isLight ? theme.light : theme.dark;

            return (
              <div
                key={sq}
                data-square={sq}
                onPointerDown={(e) => handleSquarePointerDown(e, sq)}
                onPointerUp={(e) => handleSquarePointerUp(e, sq)}
                style={{ backgroundColor: baseBg }}
                className={`relative flex items-center justify-center ${
                  interactive && pieceCode ? 'cursor-grab active:cursor-grabbing' : ''
                }`}
              >
                {/* Exact Chess.com `.highlight { background-color: #ffff33; opacity: 0.5 }` */}
                {(isLastMoveOrigin || isLastMoveDest || isSelected) && (
                  <div
                    style={{ backgroundColor: 'rgba(255, 255, 51, 0.5)' }}
                    className="absolute inset-0 pointer-events-none"
                  />
                )}

                {isHoverTarget && (
                  <div className="absolute inset-0 ring-[3px] ring-inset ring-white/75 pointer-events-none z-10" />
                )}

                {isKingChecked && (
                  <div
                    style={{
                      background:
                        'radial-gradient(circle, rgba(250,65,45,0.85) 0%, rgba(250,65,45,0.4) 55%, rgba(250,65,45,0) 78%)',
                    }}
                    className="absolute inset-0 pointer-events-none"
                  />
                )}

                {pieceCode && !isBeingDragged && (
                  <div className="w-[92%] h-[92%] z-10 pointer-events-none">
                    <NeoPiece piece={pieceCode} />
                  </div>
                )}

                {legalTarget && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
                    {legalTarget.isCapture ? (
                      <div className="w-[86%] h-[86%] rounded-full border-[5.5px] border-black/15" />
                    ) : (
                      <div className="w-[32%] h-[32%] rounded-full bg-black/15" />
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Verbatim Chess.com `<svg viewBox="0 0 100 100" class="coordinates">` */}
      <svg
        viewBox="0 0 100 100"
        className="coordinates absolute inset-0 w-full h-full pointer-events-none z-[8]"
        aria-hidden="true"
      >
        {displayRanks.map((rankLabel, idx) => (
          <text
            key={`rank-${rankLabel}`}
            x="0.75"
            y={RANK_Y_COORDS[idx]}
            fontSize="2.8"
            fontWeight="700"
            fill={idx % 2 === 0 ? theme.dark : theme.light}
          >
            {rankLabel}
          </text>
        ))}
        {displayFiles.map((fileLabel, idx) => (
          <text
            key={`file-${fileLabel}`}
            x={FILE_X_COORDS[idx]}
            y="99"
            fontSize="2.8"
            fontWeight="700"
            fill={idx % 2 === 0 ? theme.light : theme.dark}
          >
            {fileLabel}
          </text>
        ))}
      </svg>

      {/* SVG Move Arrows */}
      {combinedArrows.length > 0 && (
        <svg
          viewBox="0 0 800 800"
          className="absolute inset-0 w-full h-full pointer-events-none z-20"
        >
          {combinedArrows.map((arrow, idx) => {
            const poly = buildArrowPolygon(arrow.from, arrow.to, flipped);
            if (!poly) return null;
            return (
              <polygon
                key={`${arrow.from}-${arrow.to}-${idx}`}
                points={poly}
                fill={arrow.color}
                fillOpacity={arrow.opacity ?? 0.84}
              />
            );
          })}
        </svg>
      )}

      {/* Destination Square Classification Badge */}
      {destinationBadge &&
        (() => {
          const { col, row } = squareToCoords(destinationBadge.square, flipped);
          const leftPx = col * squareSize + squareSize - (col === 7 ? 22 : 15);
          const topPx = row * squareSize - (row === 0 ? -2 : 9);
          return (
            <div
              style={{ left: leftPx, top: topPx }}
              className="absolute z-30 pointer-events-none transition-all duration-150"
            >
              <ClassificationBadge type={destinationBadge.classification} size="board" />
            </div>
          );
        })()}

      {/* Chess.com Final-Move Winner Crown & Loser King Badge */}
      {kingOutcome &&
        (() => {
          const winnerCode = `${kingOutcome.winner}K` as PieceCode;
          const loserCode = `${kingOutcome.winner === 'w' ? 'b' : 'w'}K` as PieceCode;
          let winSq: string | null = null;
          let loseSq: string | null = null;
          for (const [sq, code] of Object.entries(boardPieces)) {
            if (code === winnerCode) winSq = sq;
            if (code === loserCode) loseSq = sq;
          }
          const renderOutcomeDot = (
            sq: string | null,
            isWinner: boolean
          ) => {
            if (!sq || destinationBadge?.square === sq) return null;
            const { col, row } = squareToCoords(sq, flipped);
            const leftPx = col * squareSize + squareSize - (col === 7 ? 22 : 15);
            const topPx = row * squareSize - (row === 0 ? -2 : 9);
            return (
              <div
                key={sq}
                style={{ left: leftPx, top: topPx }}
                className={`absolute z-30 w-[24px] h-[24px] rounded-full ring-2 ring-white/95 shadow-md flex items-center justify-center pointer-events-none ${
                  isWinner ? 'bg-[#81b64c]' : 'bg-[#ca3431]'
                }`}
              >
                {isWinner ? (
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                    <path d="M5 16L3 6l5.5 4L12 4l3.5 6L21 6l-2 10H5zm0 2h14v2H5v-2z" />
                  </svg>
                ) : kingOutcome.isTimeout ? (
                  <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white">
                    <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm1 11H8v-2h3V6h2v7z" />
                  </svg>
                ) : (
                  <span className="text-white font-black text-[11px] leading-none">#</span>
                )}
              </div>
            );
          };
          return (
            <>
              {renderOutcomeDot(winSq, true)}
              {renderOutcomeDot(loseSq, false)}
            </>
          );
        })()}

      {/* Dragging Ghost Piece */}
      {dragging && (
        <div
          style={{
            width: squareSize * 1.06,
            height: squareSize * 1.06,
            left: dragging.x - (squareSize * 1.06) / 2,
            top: dragging.y - (squareSize * 1.06) / 2,
          }}
          className="absolute z-40 pointer-events-none drop-shadow-[0_10px_14px_rgba(0,0,0,0.45)]"
        >
          <NeoPiece piece={dragging.piece} />
        </div>
      )}

      {/* Pawn Promotion Chooser */}
      {pendingPromotion &&
        (() => {
          const { col, row } = squareToCoords(pendingPromotion.to, flipped);
          const openDownward = row < 4;
          const promoTypes: ('q' | 'n' | 'r' | 'b')[] = ['q', 'n', 'r', 'b'];
          return (
            <div
              onClick={() => setPendingPromotion(null)}
              className="absolute inset-0 bg-black/35 z-50 rounded-[4px]"
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  width: squareSize,
                  left: col * squareSize,
                  top: openDownward ? row * squareSize : (row - 3) * squareSize,
                }}
                className="absolute bg-white rounded-[4px] shadow-2xl overflow-hidden flex flex-col"
              >
                {promoTypes.map((pType) => (
                  <button
                    key={pType}
                    type="button"
                    onClick={() => {
                      const { from, to } = pendingPromotion;
                      setPendingPromotion(null);
                      onMove?.({ from, to, promotion: pType });
                    }}
                    style={{ height: squareSize }}
                    className="w-full flex items-center justify-center hover:bg-[#81b64c]/25 transition-colors cursor-pointer"
                  >
                    <div className="w-[88%] h-[88%]">
                      <NeoPiece
                        piece={`${pendingPromotion.color}${pType.toUpperCase()}` as PieceCode}
                      />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          );
        })()}
    </div>
  );
};
