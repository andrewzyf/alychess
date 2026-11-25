import React from 'react';

/**
 * Verbatim SVG glyphs & color icons extracted from Chess.com's Design System (`cc-icon-glyph` & `color-icons`)
 */

export const CcGlyphMagnifierChecker: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m11 18.33c4.15 0 7.33-3.19 7.33-7.33 0-4.15-3.19-7.33-7.33-7.33-4.15 0-7.33 3.19-7.33 7.33 0 4.15 3.19 7.33 7.33 7.33zm0 3c-5.79 0-10.33-4.55-10.33-10.33 0-5.79 4.55-10.33 10.33-10.33 5.79 0 10.33 4.55 10.33 10.33 0 5.79-4.55 10.33-10.33 10.33zm10.67 2.24c-.53 0-1.03-.2-1.8-1.07l-3.5-3.67 2.47-2.47 3.6 3.43c.93.8 1.13 1.33 1.13 1.87 0 1.03-.87 1.9-1.9 1.9zm-15.67-12.57c0-2.77 2.27-5 5-5v5zm5 5v-5h5c0 2.73-2.23 5-5 5zm0 0" />
  </svg>
);

export const CcGlyphMagnifierBlank: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m11 18.33c4.15 0 7.33-3.19 7.33-7.33 0-4.15-3.19-7.33-7.33-7.33-4.15 0-7.33 3.19-7.33 7.33 0 4.15 3.19 7.33 7.33 7.33zm0 3c-5.79 0-10.33-4.55-10.33-10.33 0-5.79 4.55-10.33 10.33-10.33 5.79 0 10.33 4.55 10.33 10.33 0 5.79-4.55 10.33-10.33 10.33zm10.67 2.24c-.53 0-1.03-.2-1.8-1.07l-3.5-3.67 2.47-2.47 3.6 3.43c.93.8 1.13 1.33 1.13 1.87 0 1.03-.87 1.9-1.9 1.9zm0 0" />
  </svg>
);

export const CcGlyphFolderBoard: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m2 3.43c0-1.03.4-1.43 1.43-1.43h13.13c1.03 0 1.43.4 1.43 1.43v6.57h-2v-3h-3v-3h-3v3h-3v-3h-3v3h3v1c-.03 0-.07 0-.1 0h-4.9zm8 3.57h3v3h-2.97zm9.9 15h-16.37c-1.03 0-1.5-.4-1.7-1.4l-1.77-9.3c-.13-.8.27-1.3 1.1-1.3h3.87c1.03 0 1.6.37 2 1.3l-.07-.17c.23.57.7.87 1.3.87h7.97c1.03 0 1.5.4 1.63 1.43l.83 6.57c.13.93 1.3.97 1.3-.33v-12.67h2.9c.83 0 1.23.5 1.07 1.3l-2.37 12.3c-.2 1-.67 1.4-1.7 1.4zm0 0" />
  </svg>
);

export const CcGlyphExplorerCompass: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m9.67 11.57c.4-.97.93-1.5 1.9-1.9l4.87-2.1-2.1 4.87c-.4.97-.93 1.5-1.9 1.9l-4.87 2.1zm2.33 10.93c-5.77 0-10.5-4.73-10.5-10.5s4.73-10.5 10.5-10.5 10.5 4.73 10.5 10.5-4.73 10.5-10.5 10.5zm0-3c4.13 0 7.5-3.37 7.5-7.5s-3.37-7.5-7.5-7.5-7.5 3.37-7.5 7.5 3.37 7.5 7.5 7.5zm0 0" />
  </svg>
);

export const CcGlyphCircleFillStar: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m12 22.5c-5.8 0-10.5-4.7-10.5-10.5s4.7-10.5 10.5-10.5 10.5 4.7 10.5 10.5-4.7 10.5-10.5 10.5zm-4.63-4.63c-.2.8.07 1 .77.53l3.87-2.73 3.83 2.73c.7.47.97.27.77-.53l-1.17-4.6 3.47-2.7c.67-.53.57-.87-.27-.93l-4.53-.33-1.63-4.13c-.3-.77-.67-.77-.97 0l-1.53 4.13-4.63.33c-.83.07-.93.4-.27.9l3.5 2.73zm0 0" />
  </svg>
);

export const CcGlyphChevronStart: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m6.07 22h-.13c-1.6 0-1.93-.33-1.93-1.93v-16.13c0-1.6.33-1.93 1.93-1.93h.13c1.6 0 1.93.33 1.93 1.93v16.13c0 1.6-.33 1.93-1.93 1.93zm13.86-.87-.07.07c-1.13 1.13-1.6 1.13-2.73 0l-6.4-6.37c-1.73-1.77-1.73-3.9 0-5.67l6.4-6.37c1.13-1.13 1.6-1.13 2.73 0l.07.07c1.13 1.13 1.13 1.6 0 2.73l-6.37 6.4 6.37 6.4c1.13 1.13 1.13 1.6 0 2.73zm0 0" />
  </svg>
);

export const CcGlyphChevronLeft: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m16.27 21.13-.07.07c-1.13 1.13-1.6 1.13-2.73 0l-6.4-6.37c-1.73-1.77-1.73-3.9 0-5.67l6.4-6.37c1.13-1.13 1.6-1.13 2.73 0l.07.07c1.13 1.13 1.13 1.6 0 2.73l-6.37 6.4 6.37 6.4c1.13 1.13 1.13 1.6 0 2.73zm0 0" />
  </svg>
);

export const CcGlyphChevronRight: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 24 24"
    className={`fill-current -scale-x-100 ${className}`}
    aria-hidden="true"
  >
    <path d="m16.27 21.13-.07.07c-1.13 1.13-1.6 1.13-2.73 0l-6.4-6.37c-1.73-1.77-1.73-3.9 0-5.67l6.4-6.37c1.13-1.13 1.6-1.13 2.73 0l.07.07c1.13 1.13 1.13 1.6 0 2.73l-6.37 6.4 6.37 6.4c1.13 1.13 1.13 1.6 0 2.73zm0 0" />
  </svg>
);

export const CcGlyphChevronEnd: React.FC<{ className?: string }> = ({
  className = 'w-6 h-6',
}) => (
  <svg
    viewBox="0 0 24 24"
    className={`fill-current -scale-x-100 ${className}`}
    aria-hidden="true"
  >
    <path d="m6.07 22h-.13c-1.6 0-1.93-.33-1.93-1.93v-16.13c0-1.6.33-1.93 1.93-1.93h.13c1.6 0 1.93.33 1.93 1.93v16.13c0 1.6-.33 1.93-1.93 1.93zm13.86-.87-.07.07c-1.13 1.13-1.6 1.13-2.73 0l-6.4-6.37c-1.73-1.77-1.73-3.9 0-5.67l6.4-6.37c1.13-1.13 1.6-1.13 2.73 0l.07.07c1.13 1.13 1.13 1.6 0 2.73l-6.37 6.4 6.37 6.4c1.13 1.13 1.13 1.6 0 2.73zm0 0" />
  </svg>
);

export const CcGlyphEllipsis: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m20 14.5c-1.34 0-2.5-1.16-2.5-2.5s1.16-2.5 2.5-2.5 2.5 1.16 2.5 2.5-1.16 2.5-2.5 2.5zm-16 0c-1.34 0-2.5-1.16-2.5-2.5s1.16-2.5 2.5-2.5 2.5 1.16 2.5 2.5-1.16 2.5-2.5 2.5zm8 0c-1.34 0-2.5-1.16-2.5-2.5s1.16-2.5 2.5-2.5 2.5 1.16 2.5 2.5-1.16 2.5-2.5 2.5zm0 0" />
  </svg>
);

export const CcGlyphCogwheel: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m9.57 20.53-1.17 1.27c-.37.4-.67.43-1.13.17l-1.53-.87c-.47-.27-.57-.57-.43-1.07l.53-1.67c.13-.5.1-.87-.17-1.33l-1.17-2.07c-.27-.47-.57-.67-1.07-.8l-1.73-.4c-.5-.13-.7-.37-.7-.9v-1.77c0-.5.2-.73.7-.87l1.73-.4c.5-.13.8-.33 1.07-.8l1.17-2.07c.27-.47.3-.83.17-1.33l-.53-1.67c-.13-.5-.03-.8.43-1.07l1.53-.87c.47-.27.77-.23 1.13.17l1.17 1.27c.37.4.7.53 1.23.53h2.43c.5 0 .83-.13 1.2-.53l1.17-1.27c.37-.4.67-.43 1.13-.17l1.53.87c.47.27.57.57.43 1.07l-.53 1.67c.13.5-.1.87.17 1.33l1.17 2.07c.27.47.57.67 1.07.8l1.73.4c.5.13.7.37.7.87v1.77c0 .53-.2.77-.7.9l-1.73.4c-.5.13-.8.33-1.07.8l-1.17 2.07c-.27.47-.3.83-.17 1.33l.53 1.67c.13.5.03.8-.43 1.07l-1.53.87c-.47.27-.77.23-1.13-.17l-1.17-1.27c-.37-.4-.7-.53-1.2-.53h-2.43c-.53 0-.87.13-1.23.53zm2.46-5.03c1.9 0 3.5-1.57 3.5-3.53 0-1.9-1.6-3.47-3.5-3.47-1.93 0-3.5 1.57-3.5 3.47 0 1.97 1.57 3.53 3.5 3.53z" />
  </svg>
);

export const CcGlyphPlusNew: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m11 18.33c4.15 0 7.33-3.19 7.33-7.33 0-4.15-3.19-7.33-7.33-7.33-4.15 0-7.33 3.19-7.33 7.33 0 4.15 3.19 7.33 7.33 7.33zm0 3c-5.79 0-10.33-4.55-10.33-10.33 0-5.79 4.55-10.33 10.33-10.33 5.79 0 10.33 4.55 10.33 10.33 0 5.79-4.55 10.33-10.33 10.33zm10.67 2.24c-.53 0-1.03-.2-1.8-1.07l-3.5-3.67 2.47-2.47 3.6 3.43c.93.8 1.13 1.33 1.13 1.87 0 1.03-.87 1.9-1.9 1.9zm-11.67-16.57h2v3h3v2h-3v3h-2v-3h-3v-2h3z" />
  </svg>
);

export const CcGlyphFlipBoard: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="M7 3L3 7h3v10h2V7h3L7 3zm10 14V7h-2v10h-3l4 4 4-4h-3z" />
  </svg>
);

export const CcGlyphBookSmall: React.FC<{ className?: string }> = ({
  className = 'w-4 h-4',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="M18 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM9 4h2v5l-1-.75L9 9V4zm9 16H6V4h1v9l3-2.25L13 13V4h5v16z" />
  </svg>
);

export const CcGlyphHelpQuestion: React.FC<{ className?: string }> = ({
  className = 'w-5 h-5',
}) => (
  <svg viewBox="0 0 24 24" className={`fill-current ${className}`} aria-hidden="true">
    <path d="m17.03 22h-10.07c-3.67 0-4.97-1.3-4.97-4.97v-10.07c0-3.67 1.3-4.97 4.97-4.97h10.07c3.67 0 4.97 1.3 4.97 4.97v10.07c0 3.67-1.3 4.97-4.97 4.97zm-5.1-8.37c4.5 0 5.57-2.53 5.57-4.23 0-3-2.5-4.57-5.17-4.57-2.3 0-4.03 1.27-4.93 2.1-.47.53-.5.93-.07 1.47l.63.77c.47.57.83.57 1.3.07.67-.6 1.83-1.4 3.17-1.4 1 0 2.07.37 2.07 1.6 0 1.07-.87 1.2-2.57 1.2h-.4c-.73 0-1 .27-1 .97v1.03c0 .73.27 1 .97 1zm.07 5.2c1.13 0 1.83-.7 1.83-1.83s-.7-1.83-1.83-1.83-1.83.7-1.83 1.83.7 1.83 1.83 1.83zm0 0" />
  </svg>
);

/**
 * 3D Green Chess.com Pawn Logo Emblem + Color Sidebar Icons
 */
export const CcPawnLogo3D: React.FC<{ className?: string }> = ({ className = 'w-7 h-7' }) => (
  <svg viewBox="0 0 32 36" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="ccPawnG" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#9cd062" />
        <stop offset="55%" stopColor="#7eb648" />
        <stop offset="100%" stopColor="#5a8f2e" />
      </linearGradient>
    </defs>
    <path
      d="M16 2.5c-4.1 0-7.4 3.3-7.4 7.4 0 2.7 1.5 5.1 3.7 6.4-.8.6-1.5 1.4-1.8 2.4h11c-.3-1-1-1.8-1.8-2.4 2.2-1.3 3.7-3.7 3.7-6.4 0-4.1-3.3-7.4-7.4-7.4zm-5.2 18.2c-1.4 3.6-3.2 6.4-4.8 7.8-.8.7-1.2 1.6-1.2 2.7V33c0 .8.7 1.5 1.5 1.5h19.4c.8 0 1.5-.7 1.5-1.5v-1.8c0-1.1-.4-2-1.2-2.7-1.6-1.4-3.4-4.2-4.8-7.8H10.8z"
      fill="url(#ccPawnG)"
    />
    <ellipse cx="13.8" cy="7.5" rx="2.3" ry="1.6" fill="rgba(255,255,255,0.45)" transform="rotate(-25 13.8 7.5)" />
  </svg>
);

export const CcColorIconPlay: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
    {/* White pawn held by warm hand */}
    <path d="M12 2.5a3.8 3.8 0 0 0-2.3 6.8c-1.5 1.2-2.4 3-2.6 5.2h9.8c-.2-2.2-1.1-4-2.6-5.2A3.8 3.8 0 0 0 12 2.5z" fill="#f5f5f3" />
    <rect x="6" y="14.5" width="12" height="2.6" rx="1.2" fill="#dfdeda" />
    <path d="M4 19.5c1.5-1.8 4-2.4 8-2.4s6.5.6 8 2.4c.6.8.2 2-1 2H5c-1.2 0-1.6-1.2-1-2z" fill="#e5a97c" />
  </svg>
);

export const CcColorIconPuzzle: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
    <path
      d="M13.5 2.5a2.5 2.5 0 0 1 2.5 2.5c0 .6-.2 1-.4 1.5H19a1.5 1.5 0 0 1 1.5 1.5v3.4c.5-.2.9-.4 1.5-.4a2 2 0 1 1 0 4c-.6 0-1-.2-1.5-.4V18a1.5 1.5 0 0 1-1.5 1.5h-3.6c.2-.5.4-.9.4-1.5a2.3 2.3 0 1 0-4.6 0c0 .6.2 1 .4 1.5H6A1.5 1.5 0 0 1 4.5 18v-3.6c.5.2.9.4 1.5.4a2.3 2.3 0 1 0 0-4.6c-.6 0-1 .2-1.5.4V8A1.5 1.5 0 0 1 6 6.5h5.4c-.2-.5-.4-.9-.4-1.5a2.5 2.5 0 0 1 2.5-2.5z"
      fill="#eb8b38"
    />
    <path d="M7 8h4v2H7z" fill="rgba(255,255,255,0.28)" />
  </svg>
);

export const CcColorIconLearn: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
    <path d="M12 3L2 8l10 5 10-5-10-5z" fill="#4aa3df" />
    <path d="M6 10.8v5.2c0 2 2.7 3.6 6 3.6s6-1.6 6-3.6v-5.2l-6 3-6-3z" fill="#2c81ba" />
    <path d="M20.5 9v6.5" stroke="#f7c045" strokeWidth="2" strokeLinecap="round" />
    <circle cx="20.5" cy="16.2" r="1.3" fill="#f7c045" />
  </svg>
);

export const CcColorIconTrain: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
    <circle cx="12" cy="12" r="9.5" fill="#5c8bb0" />
    <circle cx="12" cy="12" r="6.2" fill="#f4f4f2" />
    <circle cx="12" cy="12" r="3" fill="#81b64c" />
  </svg>
);

export const CcColorIconWatch: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
    <rect x="2.5" y="9" width="7.5" height="9" rx="3.2" fill="#7c8b99" />
    <rect x="14" y="9" width="7.5" height="9" rx="3.2" fill="#7c8b99" />
    <rect x="8.5" y="10.5" width="7" height="3.5" rx="1" fill="#546270" />
    <circle cx="6.2" cy="14.5" r="2.4" fill="#63cdda" />
    <circle cx="17.8" cy="14.5" r="2.4" fill="#63cdda" />
  </svg>
);

export const CcColorIconCommunity: React.FC = () => (
  <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden="true">
    <circle cx="15.5" cy="8" r="3.2" fill="#e58f2a" />
    <path d="M11 19c.4-3.2 2.2-5 4.8-5 2.5 0 4.4 1.8 4.7 5H11z" fill="#c97719" />
    <circle cx="9" cy="9" r="3.6" fill="#5c8bb0" />
    <path d="M3.2 20c.5-3.6 2.6-5.6 5.8-5.6s5.3 2 5.8 5.6H3.2z" fill="#467499" />
  </svg>
);
