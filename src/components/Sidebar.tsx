import React from 'react';
import { Moon, PanelLeftClose, PanelLeftOpen, Sun, Volume2, VolumeX } from 'lucide-react';
import { AppMode, BoardThemeId, BOARD_THEMES, ChessComPlayerProfile } from '../types/chess';
import { PlayerAvatar } from './AlyMascot';
import {
  CcColorIconCommunity,
  CcColorIconLearn,
  CcColorIconPlay,
  CcColorIconPuzzle,
  CcColorIconTrain,
  CcColorIconWatch,
  CcGlyphEllipsis,
  CcGlyphFlipBoard,
  CcGlyphHelpQuestion,
  CcGlyphMagnifierBlank,
  CcPawnLogo3D,
} from './ChessComIcons';

interface SidebarProps {
  activeMode: AppMode;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onSelectMode: (mode: AppMode) => void;
  onOpenImporter: () => void;
  onLoadBrilliancyPuzzle: () => void;
  onOpenProfile: (targetUser?: string) => void;
  username: string;
  userProfile: ChessComPlayerProfile | null;
  themeId: BoardThemeId;
  onCycleTheme: () => void;
  uiLightMode: boolean;
  onToggleUiLightMode: () => void;
  muted: boolean;
  onToggleMute: () => void;
  onFlipBoard: () => void;
}

/**
 * 1:1 Chess.com Dark Left Navigation Sidebar (`nav#sidebar-main-menu`)
 * Supports Chess.com's exact 170px expanded bar & 56px collapsed icon rail!
 */
export const Sidebar: React.FC<SidebarProps> = ({
  activeMode,
  collapsed,
  onToggleCollapse,
  onSelectMode,
  onOpenImporter,
  onLoadBrilliancyPuzzle,
  onOpenProfile,
  username,
  userProfile,
  themeId,
  onCycleTheme,
  uiLightMode,
  onToggleUiLightMode,
  muted,
  onToggleMute,
  onFlipBoard,
}) => {
  const navRows: Array<{
    key: string;
    label: string;
    icon: React.ReactNode;
    active: boolean;
    onClick: () => void;
  }> = [
    {
      key: 'play',
      label: 'Play',
      icon: <CcColorIconPlay />,
      active: activeMode === 'play-aly',
      onClick: () => onSelectMode('play-aly'),
    },
    {
      key: 'puzzles',
      label: 'Puzzles',
      icon: <CcColorIconPuzzle />,
      active: false,
      onClick: onLoadBrilliancyPuzzle,
    },
    {
      key: 'learn',
      label: 'Review',
      icon: <CcColorIconLearn />,
      active: activeMode === 'review',
      onClick: () => onSelectMode('review'),
    },
    {
      key: 'train',
      label: 'Analysis',
      icon: <CcColorIconTrain />,
      active: activeMode === 'analysis',
      onClick: () => onSelectMode('analysis'),
    },
    {
      key: 'watch',
      label: 'Add Game',
      icon: <CcColorIconWatch />,
      active: activeMode === 'home',
      onClick: () => onSelectMode('home'),
    },
    {
      key: 'community',
      label: '2-Player',
      icon: <CcColorIconCommunity />,
      active: activeMode === 'local-2p',
      onClick: () => onSelectMode('local-2p'),
    },
    {
      key: 'other',
      label: 'Import',
      icon: <CcGlyphEllipsis className="w-6 h-6 text-[#9e9c99] shrink-0" />,
      active: false,
      onClick: onOpenImporter,
    },
  ];

  return (
    <nav
      id="sidebar-main-menu"
      className={`${
        collapsed ? 'w-[58px]' : 'w-[170px]'
      } h-full bg-[#262522] flex flex-col justify-between shrink-0 select-none z-20 transition-[width] duration-150`}
    >
      {/* Top Logo & Primary Nav Links */}
      <div className="p-2">
        {/* Chess.com-identical Logo Lockup */}
        <button
          type="button"
          onClick={() => onSelectMode('home')}
          title="AlyChess Home & Add Game"
          className={`w-full h-[52px] ${
            collapsed ? 'justify-center px-0' : 'px-2'
          } flex items-center gap-1.5 rounded-[6px] hover:bg-[#31302d] transition-colors cursor-pointer`}
        >
          <CcPawnLogo3D className="w-[26px] h-[30px] shrink-0" />
          {!collapsed && (
            <div className="flex items-baseline tracking-tight leading-none whitespace-nowrap">
              <span className="font-['Montserrat'] font-black text-[17px] text-white">
                AlyChess
              </span>
              <span className="font-bold text-[10px] text-[#9e9c99] ml-[1px]">
                .com
              </span>
            </div>
          )}
        </button>

        {/* Pinned Nav Items */}
        <div className="mt-0.5 flex flex-col gap-0.5">
          {navRows.map((row) => (
            <button
              key={row.key}
              type="button"
              onClick={row.onClick}
              title={row.label}
              className={`w-full h-[40px] ${
                collapsed ? 'justify-center px-0' : 'px-2.5'
              } rounded-[6px] flex items-center gap-3 text-[14.5px] font-bold transition-colors cursor-pointer ${
                row.active
                  ? 'bg-[#1e1d1b] text-white'
                  : 'text-[#dad9d7] hover:bg-[#31302d] hover:text-white'
              }`}
            >
              {row.icon}
              {!collapsed && <span className="truncate">{row.label}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Bottom Search + Green 3D CTA + User Button + Footer Utilities */}
      <div className="p-2 flex flex-col gap-2">
        <button
          type="button"
          onClick={onOpenImporter}
          title="Search Chess.com Player or URL"
          className={`w-full h-[36px] ${
            collapsed ? 'justify-center px-0' : 'px-2.5'
          } rounded-[6px] flex items-center gap-3 text-[#9e9c99] hover:bg-[#31302d] hover:text-[#dad9d7] transition-colors cursor-pointer`}
        >
          <CcGlyphMagnifierBlank className="w-5 h-5 shrink-0" />
          {!collapsed && <span className="text-[13.5px] font-bold">Search</span>}
        </button>

        {/* Chess.com Green 3D Primary Button */}
        <button
          type="button"
          onClick={() => onSelectMode('home')}
          title="Add Game for Review"
          style={{
            background: 'linear-gradient(180deg, #89b559 0%, #6f9844 100%)',
            boxShadow: '0 3px 0 #4d6e2c',
          }}
          className="w-full h-[40px] rounded-[6px] hover:brightness-105 active:translate-y-[1px] text-white font-['Montserrat'] font-extrabold text-[13.5px] tracking-tight flex items-center justify-center transition-all cursor-pointer"
        >
          {collapsed ? '+' : 'Add Game'}
        </button>

        {/* Live Profile Card (`IceChoker` avatar + accurate rating -> opens Chess.com Profile Page!) */}
        <button
          type="button"
          onClick={() => onOpenProfile(username)}
          title={`View ${username}'s Chess.com Profile`}
          className={`w-full h-[44px] ${
            collapsed ? 'justify-center px-0' : 'px-2'
          } rounded-[6px] ${
            activeMode === 'profile'
              ? 'bg-[#1e1d1b] ring-1 ring-[#81b64c]/60'
              : 'bg-[#373634] hover:bg-[#42403e]'
          } text-[#dad9d7] flex items-center gap-2 transition-colors cursor-pointer shadow-[0_2px_0_#1e1d1b]`}
        >
          <PlayerAvatar
            username={username}
            avatarUrl={userProfile?.avatar}
            color="w"
            size={28}
          />
          {!collapsed && (
            <div className="min-w-0 flex-1 text-left">
              <div className="text-[12.5px] font-extrabold text-white truncate leading-tight">
                {userProfile?.displayUsername || username}
              </div>
              <div className="text-[10.5px] font-bold text-[#9cd062] tabular-nums leading-tight">
                {userProfile?.stats.rapid?.rating
                  ? `Rapid ${userProfile.stats.rapid.rating}`
                  : userProfile?.stats.blitz?.rating
                  ? `Blitz ${userProfile.stats.blitz.rating}`
                  : 'View Profile'}
              </div>
            </div>
          )}
        </button>

        {/* Utility Footer Links */}
        <div className="pt-0.5 flex flex-col gap-0.5">
          {!collapsed && (
            <button
              type="button"
              onClick={onToggleUiLightMode}
              title={uiLightMode ? 'Switch to Dark UI' : 'Switch to Light UI'}
              className="w-full h-[34px] px-2.5 rounded-[6px] flex items-center gap-2.5 text-[#939290] hover:bg-[#31302d] hover:text-[#dad9d7] text-[12.5px] font-bold transition-colors cursor-pointer"
            >
              {uiLightMode ? (
                <Moon className="w-[16px] h-[16px] shrink-0" />
              ) : (
                <Sun className="w-[16px] h-[16px] shrink-0" />
              )}
              <span>{uiLightMode ? 'Dark UI' : 'Light UI'}</span>
            </button>
          )}

          {!collapsed && (
            <button
              type="button"
              onClick={onCycleTheme}
              title="Cycle Board Theme"
              className="w-full h-[34px] px-2.5 rounded-[6px] flex items-center gap-2.5 text-[#939290] hover:bg-[#31302d] hover:text-[#dad9d7] text-[12.5px] font-bold transition-colors cursor-pointer"
            >
              <CcGlyphHelpQuestion className="w-[17px] h-[17px] shrink-0" />
              <span className="truncate">{BOARD_THEMES[themeId].name}</span>
            </button>
          )}

          <div className={`flex items-center ${collapsed ? 'flex-col gap-1' : 'gap-1'}`}>
            <button
              type="button"
              onClick={onToggleMute}
              title={muted ? 'Unmute Sounds' : 'Mute Sounds'}
              className={`${
                collapsed ? 'w-full justify-center px-0' : 'flex-1 px-2.5'
              } h-[34px] rounded-[6px] flex items-center gap-2 text-[#939290] hover:bg-[#31302d] hover:text-[#dad9d7] text-[12.5px] font-bold transition-colors cursor-pointer`}
            >
              {muted ? (
                <VolumeX className="w-[17px] h-[17px] text-[#fa412d] shrink-0" />
              ) : (
                <Volume2 className="w-[17px] h-[17px] shrink-0" />
              )}
              {!collapsed && <span>{muted ? 'Muted' : 'Sound'}</span>}
            </button>
            <button
              type="button"
              onClick={onFlipBoard}
              title="Flip Board"
              className={`${
                collapsed ? 'w-full' : 'w-[34px]'
              } h-[34px] rounded-[6px] flex items-center justify-center text-[#939290] hover:bg-[#31302d] hover:text-[#dad9d7] transition-colors cursor-pointer`}
            >
              <CcGlyphFlipBoard className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            onClick={onToggleCollapse}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
            className={`w-full h-[32px] ${
              collapsed ? 'justify-center px-0' : 'px-2.5'
            } rounded-[6px] flex items-center gap-2.5 text-[#7d7b78] hover:bg-[#31302d] hover:text-[#dad9d7] text-[12px] font-bold transition-colors cursor-pointer`}
          >
            {collapsed ? (
              <PanelLeftOpen className="w-4 h-4 shrink-0" />
            ) : (
              <>
                <PanelLeftClose className="w-4 h-4 shrink-0" />
                <span>Collapse</span>
              </>
            )}
          </button>
        </div>
      </div>
    </nav>
  );
};
