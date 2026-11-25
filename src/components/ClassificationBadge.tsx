import React from 'react';
import { CLASSIFICATION_META, MoveClassification } from '../types/chess';

interface ClassificationBadgeProps {
  type: MoveClassification;
  size?: 'xs' | 'sm' | 'md' | 'board';
  className?: string;
}

/**
 * Exact Chess.com circular move classification badge
 */
export const ClassificationBadge: React.FC<ClassificationBadgeProps> = ({
  type,
  size = 'md',
  className = '',
}) => {
  const meta = CLASSIFICATION_META[type];

  const dimClass =
    size === 'xs'
      ? 'w-[15px] h-[15px] text-[9px]'
      : size === 'sm'
      ? 'w-[18px] h-[18px] text-[10px]'
      : size === 'board'
      ? 'w-[24px] h-[24px] text-[12px] ring-2 ring-white/95 shadow-[0_2px_6px_rgba(0,0,0,0.42)]'
      : 'w-[22px] h-[22px] text-[11px]';

  const renderGlyph = () => {
    switch (type) {
      case 'brilliant':
        return <span className="font-black tracking-tighter leading-none text-white">!!</span>;
      case 'great':
        return <span className="font-black leading-none text-white">!</span>;
      case 'best':
        return (
          <svg viewBox="0 0 24 24" className="w-[62%] h-[62%] fill-white">
            <path d="M12 2.4l2.92 5.92 6.53.95-4.72 4.6 1.11 6.5L12 17.3l-5.84 3.07 1.11-6.5-4.72-4.6 6.53-.95L12 2.4z" />
          </svg>
        );
      case 'excellent':
        return (
          <svg viewBox="0 0 24 24" className="w-[58%] h-[58%] fill-white">
            <path d="M2 20h2c.55 0 1-.45 1-1v-9c0-.55-.45-1-1-1H2v11zm19.83-7.12c.11-.25.17-.52.17-.8V11c0-1.1-.9-2-2-2h-5.5l.92-4.65c.05-.22.02-.46-.08-.66-.23-.45-.52-.86-.88-1.22L14 2 7.59 8.41C7.21 8.79 7 9.3 7 9.83v7.84C7 18.95 8.05 20 9.34 20h8.11c.7 0 1.36-.37 1.72-.97l2.66-6.15z" />
          </svg>
        );
      case 'good':
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-[64%] h-[64%] stroke-white fill-none"
            strokeWidth="3.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      case 'book':
        return (
          <svg viewBox="0 0 24 24" className="w-[60%] h-[60%] fill-white">
            <path d="M21 5c-1.11-.35-2.33-.5-3.5-.5-1.95 0-4.05.4-5.5 1.5-1.45-1.1-3.55-1.5-5.5-1.5S2.45 4.9 1 6v14.65c0 .25.25.5.5.5.1 0 .15-.05.25-.05C3.1 20.45 5.05 20 6.5 20c1.95 0 4.05.4 5.5 1.5 1.35-.85 3.8-1.5 5.5-1.5 1.65 0 3.35.3 4.75 1.05.1.05.15.05.25.05.25 0 .5-.25.5-.5V6c-.6-.45-1.25-.75-2-1zm0 13.5c-1.1-.35-2.3-.5-3.5-.5-1.7 0-4.15.65-5.5 1.5V8c1.35-.85 3.8-1.5 5.5-1.5 1.2 0 2.4.15 3.5.5v11.5z" />
          </svg>
        );
      case 'inaccuracy':
        return <span className="font-black tracking-tighter leading-none text-white">?!</span>;
      case 'mistake':
        return <span className="font-black leading-none text-white">?</span>;
      case 'miss':
        return (
          <svg
            viewBox="0 0 24 24"
            className="w-[58%] h-[58%] stroke-white fill-none"
            strokeWidth="3.6"
            strokeLinecap="round"
          >
            <line x1="6" y1="6" x2="18" y2="18" />
            <line x1="18" y1="6" x2="6" y2="18" />
          </svg>
        );
      case 'blunder':
        return <span className="font-black tracking-tighter leading-none text-white">??</span>;
    }
  };

  return (
    <span
      title={meta.label}
      style={{ backgroundColor: meta.color }}
      className={`inline-flex items-center justify-center rounded-full shrink-0 select-none ${dimClass} ${className}`}
    >
      {renderGlyph()}
    </span>
  );
};
