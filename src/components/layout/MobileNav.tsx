import React from 'react';
import { Home, Calendar, Dumbbell, Flame, Users, Plus, User } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCheckIn: () => void;
  onOpenProfile: () => void;
  isProfileOpen?: boolean;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenCheckIn,
  onOpenProfile,
  isProfileOpen = false,
}) => {
  // Symmetrical 6-item navigation around the central Check-in action:
  // 3 on the left (Home, Plan, Schedule) + Center Check-in + 3 on the right (Streaks, Crew, Profile)
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'smart-plan', label: 'Plan', icon: Dumbbell },
    { id: 'calendar', label: 'Schedule', shortLabel: 'Sched', icon: Calendar },
    { id: 'checkin', label: 'Check-in', icon: Plus, isAction: true },
    { id: 'progress', label: 'Streaks', shortLabel: 'Streak', icon: Flame },
    { id: 'group', label: 'Crew', icon: Users },
    { id: 'profile', label: 'Profile', icon: User, isProfile: true },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e14]/95 backdrop-blur-2xl border-t border-[#1a1e2b] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="grid grid-cols-7 items-center max-w-md mx-auto px-1 sm:px-2 py-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isAction) {
            return (
              <div key={tab.id} className="flex justify-center items-center">
                <button
                  type="button"
                  onClick={onOpenCheckIn}
                  className="flex flex-col items-center justify-center -mt-5 group focus:outline-none"
                  aria-label="Log Workout / Check-in"
                >
                  <div className="w-11 h-11 xs:w-12 xs:h-12 rounded-full bg-[#ccff00] text-[#090a0f] flex items-center justify-center shadow-lg shadow-[#ccff00]/30 active:scale-90 transition-transform">
                    <Icon size={22} className="xs:w-6 xs:h-6" strokeWidth={2.8} />
                  </div>
                  <span className="text-[9px] xs:text-[10px] font-extrabold text-[#ccff00] mt-0.5 leading-none tracking-tight">
                    Check-in
                  </span>
                </button>
              </div>
            );
          }

          const isActive = tab.isProfile
            ? isProfileOpen
            : !isProfileOpen && currentTab === tab.id;

          const handleClick = () => {
            if (tab.isProfile) {
              onOpenProfile();
            } else {
              setCurrentTab(tab.id);
            }
          };

          return (
            <div key={tab.id} className="flex justify-center items-center">
              <button
                type="button"
                onClick={handleClick}
                className={`flex flex-col items-center justify-center py-1 px-0.5 rounded-xl w-full min-w-[40px] max-w-[54px] min-h-[44px] transition-all touch-manipulation focus:outline-none ${
                  isActive ? 'text-[#ccff00]' : 'text-slate-400 hover:text-slate-200'
                }`}
                aria-label={tab.label}
              >
                <Icon size={18} strokeWidth={isActive ? 2.5 : 2} className="shrink-0" />
                <span
                  className={`text-[9px] xs:text-[10px] mt-0.5 font-semibold leading-tight tracking-tight text-center truncate max-w-[48px] ${
                    isActive ? 'text-[#ccff00] font-bold' : 'text-slate-400'
                  }`}
                >
                  <span className="xs:hidden">{tab.shortLabel || tab.label}</span>
                  <span className="hidden xs:inline">{tab.label}</span>
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </nav>
  );
};
