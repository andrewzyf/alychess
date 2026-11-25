import React from 'react';
import { countryCodeToFlag } from '../services/profileService';
import { PlayerAvatar } from './AlyMascot';
import { MiniCapturedPiece } from './NeoPieces';

interface PlayerBannerProps {
  username: string;
  rating?: number;
  country?: string;
  avatarUrl?: string;
  title?: string;
  isAly?: boolean;
  color: 'w' | 'b';
  capturedPieces: ('q' | 'r' | 'b' | 'n' | 'p')[];
  materialDiff: number;
  clockText?: string;
  isActiveTurn?: boolean;
  width: number;
  onClickPlayer?: () => void;
}

const CountryBadge: React.FC<{ code?: string; isAly?: boolean }> = ({
  code,
  isAly,
}) => {
  if (isAly) {
    return (
      <span className="inline-flex items-center justify-center px-1 h-3.5 rounded-[2px] bg-[#81b64c] text-white text-[9px] font-black tracking-wider shrink-0">
        BOT
      </span>
    );
  }
  const emoji = countryCodeToFlag(code);
  if (!emoji) return null;
  return (
    <span
      title={`Country: ${code?.toUpperCase()}`}
      className="text-[14px] leading-none shrink-0"
    >
      {emoji}
    </span>
  );
};

/**
 * 1:1 Chess.com `#board-layout-player-top` & `#board-layout-player-bottom`
 * Shows real Chess.com avatar, title badge, clickable username -> Profile, accurate Elo, real flag & clock!
 */
export const PlayerBanner: React.FC<PlayerBannerProps> = ({
  username,
  rating,
  country,
  avatarUrl,
  title,
  isAly = false,
  color,
  capturedPieces,
  materialDiff,
  clockText,
  isActiveTurn = false,
  width,
  onClickPlayer,
}) => {
  const capturedEnemyColor = color === 'w' ? 'b' : 'w';
  const clickable = Boolean(onClickPlayer && !isAly);

  return (
    <div
      style={{ width, height: 40 }}
      className="flex items-center justify-between select-none shrink-0"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          disabled={!clickable}
          onClick={clickable ? onClickPlayer : undefined}
          title={clickable ? `View ${username}'s Chess.com Profile` : undefined}
          className={`shrink-0 rounded-[4px] ${
            clickable ? 'cursor-pointer hover:ring-2 hover:ring-[#81b64c]/60 transition-all' : 'cursor-default'
          }`}
        >
          <PlayerAvatar
            username={username}
            avatarUrl={avatarUrl}
            color={color}
            isAly={isAly}
            size={40}
          />
        </button>

        <div className="flex flex-col justify-center min-w-0">
          <div className="flex items-center gap-1.5">
            {title && (
              <span className="px-1 py-[1px] rounded-[3px] bg-[#b33430] text-white font-black text-[10px] leading-none shrink-0">
                {title}
              </span>
            )}
            <button
              type="button"
              disabled={!clickable}
              onClick={clickable ? onClickPlayer : undefined}
              className={`text-white font-bold text-[14px] leading-tight truncate max-w-[190px] text-left ${
                clickable ? 'hover:underline cursor-pointer' : 'cursor-default'
              }`}
            >
              {username}
            </button>
            {rating !== undefined && rating > 0 && (
              <span className="text-[#9e9c99] font-semibold text-[13px] leading-tight tabular-nums">
                ({rating})
              </span>
            )}
            <CountryBadge code={country} isAly={isAly} />
          </div>

          {(capturedPieces.length > 0 || materialDiff > 0) && (
            <div className="flex items-center h-4 mt-0.5">
              {capturedPieces.slice(0, 14).map((p, idx) => (
                <MiniCapturedPiece
                  key={`${p}-${idx}`}
                  type={p}
                  capturedColor={capturedEnemyColor}
                />
              ))}
              {materialDiff > 0 && (
                <span className="ml-1 text-[12px] font-semibold text-[#9e9c99] tabular-nums leading-none">
                  +{materialDiff}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {clockText && clockText !== '--:--' && (
        <div
          className={`h-[34px] px-3 rounded-[4px] flex items-center justify-center font-mono font-bold text-[16px] leading-none tracking-tight tabular-nums ${
            isActiveTurn
              ? color === 'w'
                ? 'bg-white text-[#262522]'
                : 'bg-[#1f1e1c] text-white'
              : 'bg-[#262522] text-[#939290]'
          }`}
        >
          {clockText}
        </div>
      )}
    </div>
  );
};
