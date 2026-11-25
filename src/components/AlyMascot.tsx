import React, { useEffect, useState } from 'react';
import { AlyMood } from '../types/chess';

interface AlyMascotProps {
  mood?: AlyMood;
  size?: number;
  className?: string;
}

/**
 * Custom expressive flat-vector Coach Avatar for Aly (styled in Chess.com's 64x64 rounded coach frame)
 */
export const AlyMascot: React.FC<AlyMascotProps> = ({
  mood = 'happy',
  size = 60,
  className = '',
}) => {
  const renderEyes = () => {
    switch (mood) {
      case 'excited':
        return (
          <>
            <path
              d="M23.5 29l1.1 2.4 2.4 1.1-2.4 1.1-1.1 2.4-1.1-2.4-2.4-1.1 2.4-1.1z"
              fill="#5ef2d6"
            />
            <path
              d="M40.5 29l1.1 2.4 2.4 1.1-2.4 1.1-1.1 2.4-1.1-2.4-2.4-1.1 2.4-1.1z"
              fill="#5ef2d6"
            />
          </>
        );
      case 'shocked':
        return (
          <>
            <circle cx="23.5" cy="32.5" r="3.2" fill="none" stroke="#ff7a6b" strokeWidth="2" />
            <circle cx="23.5" cy="32.5" r="1.1" fill="#ffffff" />
            <circle cx="40.5" cy="32.5" r="3.2" fill="none" stroke="#ff7a6b" strokeWidth="2" />
            <circle cx="40.5" cy="32.5" r="1.1" fill="#ffffff" />
          </>
        );
      case 'concerned':
        return (
          <>
            <path d="M19.5 30.5l7 1.5" stroke="#ffd166" strokeWidth="2.1" strokeLinecap="round" />
            <circle cx="23.5" cy="33.8" r="2" fill="#5ef2d6" />
            <path d="M44.5 30.5l-7 1.5" stroke="#ffd166" strokeWidth="2.1" strokeLinecap="round" />
            <circle cx="40.5" cy="33.8" r="2" fill="#5ef2d6" />
          </>
        );
      case 'thinking':
        return (
          <>
            <rect x="20" y="32" width="7" height="2.4" rx="1.2" fill="#5ef2d6" />
            <circle cx="40.5" cy="32.2" r="2.6" fill="#5ef2d6" />
            <path d="M37.5 28.8l5.8-1" stroke="#96bc4b" strokeWidth="1.8" strokeLinecap="round" />
          </>
        );
      case 'book':
      case 'happy':
      default:
        return (
          <>
            <path
              d="M20.2 33.4c1-2.5 5.6-2.5 6.6 0"
              fill="none"
              stroke="#5ef2d6"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
            <path
              d="M37.2 33.4c1-2.5 5.6-2.5 6.6 0"
              fill="none"
              stroke="#5ef2d6"
              strokeWidth="2.4"
              strokeLinecap="round"
            />
          </>
        );
      case 'neutral':
        return (
          <>
            <circle cx="23.5" cy="32.5" r="2.3" fill="#5ef2d6" />
            <circle cx="40.5" cy="32.5" r="2.3" fill="#5ef2d6" />
          </>
        );
    }
  };

  const renderMouth = () => {
    switch (mood) {
      case 'excited':
        return (
          <path
            d="M27.5 44.5c1.5 3.2 7.5 3.2 9 0z"
            fill="#1f2933"
            stroke="#1f2933"
            strokeWidth="1"
          />
        );
      case 'shocked':
        return <ellipse cx="32" cy="46" rx="2.6" ry="3.1" fill="#1f2933" />;
      case 'concerned':
        return (
          <path
            d="M28.5 47c2-1.8 5-1.8 7 0"
            fill="none"
            stroke="#1f2933"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      case 'thinking':
        return <path d="M29 45.8h5.5" stroke="#1f2933" strokeWidth="2" strokeLinecap="round" />;
      default:
        return (
          <path
            d="M28 44.8c2 2.4 6 2.4 8 0"
            fill="none"
            stroke="#1f2933"
            strokeWidth="2.1"
            strokeLinecap="round"
          />
        );
    }
  };

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      className={`shrink-0 select-none rounded-[8px] shadow-md ${className}`}
    >
      <defs>
        <linearGradient id="alyCoachFrame" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3c4b4d" />
          <stop offset="100%" stopColor="#263133" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="64" height="64" rx="8" fill="url(#alyCoachFrame)" />
      <path d="M12 64c2.5-9.5 10-13 20-13s17.5 3.5 20 13H12z" fill="#81b64c" />
      <path d="M26 51l6 6 6-6" fill="#ffffff" />

      <line x1="32" y1="7" x2="32" y2="14" stroke="#5ef2d6" strokeWidth="2.5" strokeLinecap="round" />
      <circle
        cx="32"
        cy="6.5"
        r="3"
        fill={mood === 'shocked' ? '#fa412d' : '#81b64c'}
        stroke="#ffffff"
        strokeWidth="1.2"
      />

      <rect x="9.5" y="27" width="5" height="11" rx="2.5" fill="#1f2628" />
      <rect x="49.5" y="27" width="5" height="11" rx="2.5" fill="#1f2628" />

      <rect
        x="13"
        y="14"
        width="38"
        height="37"
        rx="14"
        fill="#f5f7f6"
        stroke="#1b2224"
        strokeWidth="1.8"
      />

      <rect
        x="15.5"
        y="25"
        width="33"
        height="14.5"
        rx="6.5"
        fill="#192226"
        stroke="#1baca6"
        strokeWidth="1.8"
      />
      <path
        d="M19 27.5h8"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {renderEyes()}
      {renderMouth()}
    </svg>
  );
};

/**
 * Chess.com Player Avatar: renders real Chess.com profile photo when available,
 * gracefully falling back to Chess.com's exact 40x40 pawn silhouette avatar.
 */
export const PlayerAvatar: React.FC<{
  username: string;
  avatarUrl?: string;
  color?: 'w' | 'b';
  isAly?: boolean;
  size?: number;
}> = ({ username, avatarUrl, color = 'w', isAly = false, size = 40 }) => {
  const [imgFailed, setImgFailed] = useState(false);

  useEffect(() => {
    setImgFailed(false);
  }, [avatarUrl]);

  if (isAly) {
    return <AlyMascot mood="happy" size={size} />;
  }

  if (avatarUrl && !imgFailed) {
    return (
      <img
        src={avatarUrl}
        alt={username}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
        style={{ width: size, height: size }}
        className="rounded-[4px] object-cover shrink-0 select-none bg-[#3d3b38]"
      />
    );
  }

  const isLightAvatar = color === 'w';
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      className="rounded-[4px] shrink-0 select-none overflow-hidden"
    >
      <rect
        width="40"
        height="40"
        fill={isLightAvatar ? '#dad8d4' : '#3d3b38'}
      />
      <circle
        cx="20"
        cy="13.5"
        r="6.2"
        fill={isLightAvatar ? '#ffffff' : '#242321'}
      />
      <path
        d="M8.5 38c1.2-8.2 5.4-12.5 11.5-12.5S30.3 29.8 31.5 38H8.5z"
        fill={isLightAvatar ? '#ffffff' : '#242321'}
      />
    </svg>
  );
};
