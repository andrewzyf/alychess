import React from 'react';

export type PieceCode =
  | 'wP'
  | 'wN'
  | 'wB'
  | 'wR'
  | 'wQ'
  | 'wK'
  | 'bP'
  | 'bN'
  | 'bB'
  | 'bR'
  | 'bQ'
  | 'bK';

interface NeoPieceProps {
  piece: PieceCode;
  className?: string;
}

/**
 * 1:1 Chess.com "Neo" high-precision 150x150 vector piece set
 * Directly traced from Chess.com's official Neo proportions, bevels, and shading:
 * - White pieces: crisp #ffffff body, #d8d7d5 right-side bevel shade, #3a3836 sleek outline
 * - Black pieces: #575452 charcoal body, #3e3c3a right-side shade, #73706e subtle highlight, #272524 outline
 */
export const NeoPiece: React.FC<NeoPieceProps> = ({
  piece,
  className = 'w-full h-full',
}) => {
  const isWhite = piece[0] === 'w';
  const type = piece[1];

  const bodyFill = isWhite ? '#f9f9f7' : '#575452';
  const shadeFill = isWhite ? '#dad9d6' : '#3e3c3a';
  const highlightStroke = isWhite ? '#ffffff' : '#74726f';
  const stroke = isWhite ? '#383634' : '#262422';
  const innerLine = isWhite ? '#383634' : '#262422';

  switch (type) {
    case 'P':
      return (
        <svg viewBox="0 0 150 150" className={className}>
          {/* Pedestal + neck + head unified clean Neo silhouette */}
          <path
            d="M75 26c-12.5 0-22.5 10-22.5 22.5 0 7.7 3.9 14.5 9.8 18.5h-4.5c-3.8 0-6.8 3-6.8 6.5 0 3.2 2.4 5.9 5.5 6.4-4.2 13.5-11.8 25.2-19.5 33.1-3.3 3.4-5 7.5-5 12.2v5.8c0 2.2 1.8 4 4 4h78c2.2 0 4-1.8 4-4v-5.8c0-4.7-1.7-8.8-5-12.2-7.7-7.9-15.3-19.6-19.5-33.1 3.1-.5 5.5-3.2 5.5-6.4 0-3.5-3-6.5-6.8-6.5h-4.5c5.9-4 9.8-10.8 9.8-18.5C97.5 36 87.5 26 75 26z"
            fill={bodyFill}
            stroke={stroke}
            strokeWidth="5.4"
            strokeLinejoin="round"
          />
          {/* Subtle Neo right-side shadow */}
          <path
            d="M78 29.5c9.8 1.5 16.5 9.6 16.5 19 0 7.2-3.8 13.5-9.5 17.5h4.2c1.8 0 3.5 1.4 3.5 3.6 0 1.8-1.4 3.5-3.5 3.8 3.6 14.5 11.4 27 19.6 35.8 2.8 3 4.2 6.5 4.2 11v5.8H87c2.4-12.5-2.6-28.5-7.4-45.5 3.6-4.5 5.6-11.2 5.6-18.8 0-12.8-3.8-24.2-7.2-32.2z"
            fill={shadeFill}
          />
          {/* Collar ring & base bevel line */}
          <path
            d="M55 79.5h40M36 123h78"
            stroke={innerLine}
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          {/* Soft left specular arc */}
          <path
            d="M61 45c1.2-6.4 6.2-11.4 12.2-12.4"
            fill="none"
            stroke={highlightStroke}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'R':
      return (
        <svg viewBox="0 0 150 150" className={className}>
          {/* Main tower + battlements + stepped base */}
          <path
            d="M37 26v26l11 9v43l-11 10v17c0 2.2 1.8 4 4 4h68c2.2 0 4-1.8 4-4v-17l-11-10V61l11-9V26H96v13H84V26H66v13H54V26H37z"
            fill={bodyFill}
            stroke={stroke}
            strokeWidth="5.4"
            strokeLinejoin="round"
          />
          {/* Right-side Neo shading */}
          <path
            d="M84 29h12v13h14.2v8.8l-11 9V105l11 10v17H86.5v-17l-1.5-10V61l-1-32z"
            fill={shadeFill}
          />
          {/* Crisp horizontal Neo band dividers */}
          <path
            d="M48 61h54M48 104h54M37 121h76"
            stroke={innerLine}
            strokeWidth="4.4"
            strokeLinecap="round"
          />
          {/* Left tower highlight */}
          <path
            d="M56 68v29"
            stroke={highlightStroke}
            strokeWidth="4.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'N':
      return (
        <svg viewBox="0 0 150 150" className={className}>
          {/* Iconic Chess.com Neo Horse silhouette facing left */}
          <path
            d="M72 22c-3.5 0-7.5 2.5-10.5 7.5L56 36c-9.5 6.8-18.5 16.5-24.2 26.8-3 5.4-1.4 12.4 3.8 15.2 4.8 2.5 10.6 1.5 15.2-1.8 4.4-3.1 9.5-5.8 14.5-6.6-2.2 12-13.5 20.8-22.8 33.4-3.2 4.4-5.5 9.2-5.5 15.2V131c0 2.2 1.8 4 4 4h72c2.2 0 4-1.8 4-4v-12.5c0-45.5-9.5-79.5-36.5-89.5L78 22.8c-1.8-.6-3.8-.8-6-.8z"
            fill={bodyFill}
            stroke={stroke}
            strokeWidth="5.4"
            strokeLinejoin="round"
          />
          {/* Right-side neck & mane bevel shade */}
          <path
            d="M80 31.5c22.5 9.8 33.8 41.2 33.8 87v13H92.5c1.5-41.8-6.2-74.5-22.5-91.2l10-8.8z"
            fill={shadeFill}
          />
          {/* Pedestal base band */}
          <path
            d="M37 117h76M37 125h76"
            stroke={innerLine}
            strokeWidth="4.2"
            strokeLinecap="round"
          />
          {/* Horse ear notch, eye & nostril */}
          <path
            d="M62 31l7-8.5 5 9.5"
            fill={bodyFill}
            stroke={stroke}
            strokeWidth="4.8"
            strokeLinejoin="round"
          />
          <circle cx="56" cy="49" r="3.8" fill={innerLine} />
          <circle cx="40.5" cy="67" r="2.8" fill={innerLine} />
          {/* Jaw crease & mane specular arc */}
          <path
            d="M64 69c5.5-1.2 10.2-4.2 13.5-8.5"
            fill="none"
            stroke={innerLine}
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M85 41c13.5 11.5 19.5 34.5 19.5 64"
            fill="none"
            stroke={highlightStroke}
            strokeWidth="4"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'B':
      return (
        <svg viewBox="0 0 150 150" className={className}>
          {/* Top finial sphere */}
          <circle
            cx="75"
            cy="22"
            r="9.5"
            fill={bodyFill}
            stroke={stroke}
            strokeWidth="5.2"
          />
          {/* Smooth teardrop Neo mitre + flared collar + pedestal */}
          <path
            d="M75 31.5c-19 14.5-30.5 35.2-29 53.5.8 9.2 4.8 16.5 10.5 21.8-8.2 3.8-15.5 10.5-19.5 17.5-1.4 2.4-2 4.8-2 7.2v.5c0 2.2 1.8 4 4 4h72c2.2 0 4-1.8 4-4v-.5c0-2.4-.6-4.8-2-7.2-4-7-11.3-13.7-19.5-17.5 5.7-5.3 9.7-12.6 10.5-21.8 1.5-18.3-10-39-29-53.5z"
            fill={bodyFill}
            stroke={stroke}
            strokeWidth="5.4"
            strokeLinejoin="round"
          />
          {/* Right-side Neo shade */}
          <path
            d="M78.5 36.2c15.8 13.5 24 31.8 22.8 48.2-.8 8.8-4.5 15.8-10.2 21 7.6 3.8 14.2 9.8 18 16.4l2.4 10.8H86.5c-1.8-13.5-5.5-22.2-10-27.2 8.2-8.2 11.8-20.5 10.5-34.5-1.2-13.5-5-24.8-8.5-34.7z"
            fill={shadeFill}
          />
          {/* Signature Chess.com Neo diagonal mitre cut on upper right */}
          <path
            d="M92.5 53.5L74 72.5"
            stroke={innerLine}
            strokeWidth="6.2"
            strokeLinecap="round"
          />
          {/* Collar ring & pedestal line */}
          <path
            d="M54 105.5h42M39 124h72"
            stroke={innerLine}
            strokeWidth="4.4"
            strokeLinecap="round"
          />
          {/* Left specular highlight */}
          <path
            d="M55.5 81c-.8-13.8 4.6-27.6 14.5-38.2"
            fill="none"
            stroke={highlightStroke}
            strokeWidth="4.2"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'Q':
      return (
        <svg viewBox="0 0 150 150" className={className}>
          {/* 5-point splayed Chess.com Neo Queen crown + base */}
          <path
            d="M23 48l19 60c0 0-5 5-5 12v11c0 2.2 1.8 4 4 4h68c2.2 0 4-1.8 4-4v-11c0-7-5-12-5-12l19-60-24.5 29.5L99 36 75 72 51 36l-3.5 41.5L23 48z"
            fill={bodyFill}
            stroke={stroke}
            strokeWidth="5.2"
            strokeLinejoin="round"
          />
          {/* Right-side Neo shade */}
          <path
            d="M98.5 44l1.8 34.5L122 54l-16.5 53.5c2.8 3 4.8 6.8 4.8 11.5v12.5H88.5V108l10-64z"
            fill={shadeFill}
          />
          {/* 5 Royal Crown Pearls */}
          <circle cx="22.5" cy="43" r="7.5" fill={bodyFill} stroke={stroke} strokeWidth="4.8" />
          <circle cx="49" cy="31.5" r="7.5" fill={bodyFill} stroke={stroke} strokeWidth="4.8" />
          <circle cx="75" cy="25.5" r="8" fill={bodyFill} stroke={stroke} strokeWidth="4.8" />
          <circle cx="101" cy="31.5" r="7.5" fill={bodyFill} stroke={stroke} strokeWidth="4.8" />
          <circle cx="127.5" cy="43" r="7.5" fill={bodyFill} stroke={stroke} strokeWidth="4.8" />
          {/* Horizontal Neo crown bands */}
          <path
            d="M42 106.5c19-4.5 47-4.5 66 0M38 122h74"
            fill="none"
            stroke={innerLine}
            strokeWidth="4.4"
            strokeLinecap="round"
          />
          <path
            d="M46 98.5c17-3.6 41-3.6 58 0"
            fill="none"
            stroke={highlightStroke}
            strokeWidth="3.6"
            strokeLinecap="round"
          />
        </svg>
      );

    case 'K':
    default:
      return (
        <svg viewBox="0 0 150 150" className={className}>
          {/* Bold short Chess.com Neo Royal Cross */}
          <path
            d="M75 14v32M61 26h28"
            stroke={stroke}
            strokeWidth="9.5"
            strokeLinecap="round"
          />
          <path
            d="M75 16v28M63 26h24"
            stroke={bodyFill}
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Iconic wide double-lobe Neo King Crown + pedestal */}
          <path
            d="M75 56c-6.5-11.5-18.5-15.5-29-14-14.2 2-24 14.5-23.5 29.8.5 14.2 8.5 26 19.5 34.2-3 4-5 8.5-5 14v11c0 2.2 1.8 4 4 4h68c2.2 0 4-1.8 4-4v-11c0-5.5-2-10-5-14 11-8.2 19-20 19.5-34.2.5-15.3-9.3-27.8-23.5-29.8-10.5-1.5-22.5 2.5-29 14z"
            fill={bodyFill}
            stroke={stroke}
            strokeWidth="5.4"
            strokeLinejoin="round"
          />
          {/* Right lobe & base Neo shade */}
          <path
            d="M101 44.5c12.5 2.2 23.2 12.8 23 27-.4 12.8-7.5 23.5-17.8 31.2 2.8 4.2 4.2 8.8 4.2 14.2v14.8H86.5v-18c8.5-9.5 14.8-22.2 15.2-36.5.4-12.5-3.2-24.2-6.8-31.2l6.1-1.5z"
            fill={shadeFill}
          />
          {/* Center crown rib + curved royal base bands */}
          <path
            d="M75 56v46M42 106c19-4.8 47-4.8 66 0M38 122h74"
            fill="none"
            stroke={innerLine}
            strokeWidth="4.4"
            strokeLinecap="round"
          />
          {/* Left lobe specular highlight */}
          <path
            d="M34 74c-.5-11 6.5-21 17.5-22.5"
            fill="none"
            stroke={highlightStroke}
            strokeWidth="4.2"
            strokeLinecap="round"
          />
        </svg>
      );
  }
};

export const MiniCapturedPiece: React.FC<{
  type: 'q' | 'r' | 'b' | 'n' | 'p';
  capturedColor: 'w' | 'b';
}> = ({ type, capturedColor }) => {
  const code = `${capturedColor}${type.toUpperCase()}` as PieceCode;
  return (
    <span className="inline-block w-4 h-4 -ml-1 first:ml-0 opacity-95">
      <NeoPiece piece={code} />
    </span>
  );
};

/**
 * Chess.com-style Figurine Algebraic Notation (e.g. [Bishop icon]xf5, [Knight icon]e5, [Queen icon]b7)
 */
export const SanFigurine: React.FC<{
  san: string;
  color: 'w' | 'b';
  className?: string;
}> = ({ san, color, className = '' }) => {
  if (!san) return null;
  const first = san[0];
  const isPiecePrefix =
    first === 'K' || first === 'Q' || first === 'R' || first === 'B' || first === 'N';

  if (!isPiecePrefix) {
    return <span className={className}>{san}</span>;
  }

  const pieceCode = `${color}${first}` as PieceCode;
  const rest = san.slice(1);
  return (
    <span className={`inline-flex items-center ${className}`}>
      <span className="inline-block w-[15px] h-[15px] mr-[1px] shrink-0 -mt-[1px]">
        <NeoPiece piece={pieceCode} />
      </span>
      <span>{rest}</span>
    </span>
  );
};
