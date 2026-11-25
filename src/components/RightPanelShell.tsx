import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { AppMode } from '../types/chess';
import {
  CcGlyphCircleFillStar,
  CcGlyphExplorerCompass,
  CcGlyphFolderBoard,
  CcGlyphMagnifierChecker,
} from './ChessComIcons';

interface RightPanelShellProps {
  title: string;
  headerIcon?: React.ReactNode;
  onBack?: () => void;
  activeTab: AppMode | 'games';
  onSelectTab: (tab: AppMode | 'games') => void;
  children: React.ReactNode;
}

/**
 * Exact Chess.com `#board-layout-sidebar` floating dark card container:
 * - 406px width, `my-4 mr-4`, rounded-[6px], `#262522` body
 * - 48px `#21201e` `.cc-sidebar-header-component`
 * - 56px `#21201e` `.board-tab-container-component` (Analysis | Review | Games | Play)
 */
export const RightPanelShell: React.FC<RightPanelShellProps> = ({
  title,
  headerIcon,
  onBack,
  activeTab,
  onSelectTab,
  children,
}) => {
  const tabs: Array<{
    id: AppMode | 'games';
    label: string;
    icon: React.ReactNode;
  }> = [
    {
      id: 'analysis',
      label: 'Analysis',
      icon: <CcGlyphMagnifierChecker className="w-6 h-6" />,
    },
    {
      id: 'review',
      label: 'Review',
      icon: <CcGlyphCircleFillStar className="w-6 h-6" />,
    },
    {
      id: 'games',
      label: 'Games',
      icon: <CcGlyphFolderBoard className="w-6 h-6" />,
    },
    {
      id: 'play-aly',
      label: 'Play',
      icon: <CcGlyphExplorerCompass className="w-6 h-6" />,
    },
  ];

  return (
    <aside
      id="board-layout-sidebar"
      className="w-[406px] h-[calc(100vh-32px)] my-4 mr-4 rounded-[6px] overflow-hidden bg-[#262522] flex flex-col shrink-0 select-none z-20 shadow-[0_4px_18px_rgba(0,0,0,0.28)]"
    >
      {/* 48px `.cc-sidebar-header-component` */}
      <header className="h-[48px] px-3 bg-[#21201e] flex items-center justify-center relative shrink-0">
        {onBack && (
          <button
            type="button"
            onClick={onBack}
            title="Back"
            className="absolute left-2.5 w-8 h-8 rounded-[5px] flex items-center justify-center text-[#9e9c99] hover:bg-[#31302d] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
        )}
        <div className="flex items-center gap-2 text-white">
          {headerIcon}
          <h1 className="font-extrabold text-[17px] tracking-tight leading-none">
            {title}
          </h1>
        </div>
      </header>

      {/* 56px `.board-tab-container-component` */}
      <div
        role="tablist"
        className="h-[56px] bg-[#21201e] grid grid-cols-4 shrink-0 border-b border-[#31302d]"
      >
        {tabs.map((t) => {
          const isSelected =
            activeTab === t.id ||
            (t.id === 'play-aly' && activeTab === 'local-2p');
          return (
            <button
              key={t.id}
              role="tab"
              type="button"
              aria-selected={isSelected}
              onClick={() => onSelectTab(t.id)}
              className={`h-full flex flex-col items-center justify-center gap-1 text-[11.5px] font-semibold transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-[#262522] text-white border-t-2 border-t-[#81b64c]'
                  : 'bg-[#21201e] text-[#939291] hover:text-[#dad9d7]'
              }`}
            >
              {t.icon}
              <span className="leading-none">{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* Active Tab Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#262522]">
        {children}
      </div>
    </aside>
  );
};
