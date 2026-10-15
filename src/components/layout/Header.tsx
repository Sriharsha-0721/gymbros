import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useGroup } from '../../context/GroupContext';
import { Avatar } from '../common/Avatar';
import { Users, ChevronDown, Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  onOpenSetPlan: () => void;
  onOpenGroupModal: () => void;
  onOpenProfileModal: () => void;
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenSetPlan,
  onOpenGroupModal,
  onOpenProfileModal,
  currentTab,
  setCurrentTab,
}) => {
  const { user, isConfigured } = useAuth();
  const { activeGroup, groups } = useGroup();

  return (
    <header className="sticky top-0 z-40 w-full bg-[#090a0f]/90 backdrop-blur-xl border-b border-[#1b1f2b]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand & Emblem */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setCurrentTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-[#12141c] border border-[#232838] p-0.5 flex items-center justify-center group-hover:border-[#ccff00]/60 transition-all duration-200 overflow-hidden">
              <img src="/gym-icon.png" alt="GYMCREW Emblem" className="w-9 h-9 rounded-lg select-none object-cover" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-white font-heading">
                  GYM<span className="text-[#ccff00]">CREW</span>
                </span>
                {!isConfigured && (
                  <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-[#1a1f2c] text-slate-400 border border-[#2b3347]">
                    DEMO
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-400 font-medium hidden sm:block">
                Gym Partner & Availability
              </p>
            </div>
          </div>

          {/* Group Switcher Pill */}
          {activeGroup && (
            <button
              onClick={onOpenGroupModal}
              className="ml-1 sm:ml-2 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-full bg-[#141620] hover:bg-[#1a1e2b] border border-[#222736] text-xs font-semibold text-slate-200 transition-colors shrink-0"
              title="Switch Gym Squad"
            >
              <Users size={13} className="text-[#ccff00] shrink-0" />
              <span className="max-w-[85px] sm:max-w-[140px] truncate">{activeGroup.name}</span>
              {groups.length > 1 && (
                <span className="text-[10px] font-bold text-[#ccff00] bg-[#ccff00]/10 px-1.5 py-0.2 rounded-full border border-[#ccff00]/25">
                  {groups.length}
                </span>
              )}
              <ChevronDown size={12} className="text-slate-400 shrink-0" />
            </button>
          )}
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-[#12141c] p-1 rounded-xl border border-[#1f2433]">
          <button
            onClick={() => setCurrentTab('dashboard')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'dashboard'
                ? 'bg-[#ccff00] text-[#090a0f]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Dashboard
          </button>
          <button
            onClick={() => setCurrentTab('calendar')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'calendar'
                ? 'bg-[#ccff00] text-[#090a0f]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Weekly Schedule
          </button>
          <button
            onClick={() => setCurrentTab('smart-plan')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              currentTab === 'smart-plan'
                ? 'bg-[#ccff00] text-[#090a0f]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            <span>Smart Plan</span>
            <span className="text-[9px] uppercase px-1.5 py-0.2 rounded-full font-extrabold bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40">
              AI
            </span>
          </button>
          <button
            onClick={() => setCurrentTab('progress')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'progress'
                ? 'bg-[#ccff00] text-[#090a0f]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Streak & Progress
          </button>
          <button
            onClick={() => setCurrentTab('group')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              currentTab === 'group'
                ? 'bg-[#ccff00] text-[#090a0f]'
                : 'text-slate-300 hover:text-white hover:bg-white/5'
            }`}
          >
            Crew Members
          </button>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick Action: Set Today's Plan */}
          <button
            onClick={onOpenSetPlan}
            className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] active:scale-95 text-[#090a0f] text-xs sm:text-sm font-extrabold shadow-md shadow-[#ccff00]/15 transition-all"
          >
            <Sparkles size={14} className="shrink-0" />
            <span>Set Today</span>
          </button>

          {/* User Profile Avatar */}
          {user && (
            <button
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 p-1 pl-1.5 rounded-xl hover:bg-[#141620] border border-transparent hover:border-[#222736] transition-all"
              title="Edit Profile"
            >
              <Avatar
                src={user.avatar_url}
                name={user.display_name || user.username}
                size="sm"
              />
              <span className="hidden sm:block text-xs font-semibold text-slate-300 max-w-[100px] truncate">
                @{user.username || 'user'}
              </span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
