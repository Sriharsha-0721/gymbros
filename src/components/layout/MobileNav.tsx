import React from 'react';
import { Home, Calendar, Dumbbell, Flame, Users, Plus } from 'lucide-react';

interface MobileNavProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  onOpenCheckIn: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentTab,
  setCurrentTab,
  onOpenCheckIn,
}) => {
  const tabs = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'smart-plan', label: 'Plan', icon: Dumbbell },
    { id: 'checkin', label: 'Log', icon: Plus, isAction: true },
    { id: 'calendar', label: 'Schedule', icon: Calendar },
    { id: 'progress', label: 'Streaks', icon: Flame },
    { id: 'group', label: 'Crew', icon: Users },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0c0e14]/95 backdrop-blur-2xl border-t border-[#1a1e2b] pb-[max(0.5rem,env(safe-area-inset-bottom))]">
      <div className="flex items-center justify-around px-2 py-1 max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;

          if (tab.isAction) {
            return (
              <button
                key={tab.id}
                onClick={onOpenCheckIn}
                className="flex flex-col items-center justify-center -mt-5 group"
                aria-label="Log Workout"
              >
                <div className="w-12 h-12 rounded-full bg-[#ccff00] text-[#090a0f] flex items-center justify-center shadow-lg shadow-[#ccff00]/30 active:scale-90 transition-transform">
                  <Icon size={24} strokeWidth={2.8} />
                </div>
                <span className="text-[10px] font-bold text-[#ccff00] mt-1">Check-in</span>
              </button>
            );
          }

          const isActive = currentTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setCurrentTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1.5 px-1.5 sm:px-3 rounded-xl min-w-[44px] min-h-[44px] transition-all ${
                isActive ? 'text-[#ccff00]' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Icon size={19} strokeWidth={isActive ? 2.5 : 2} />
              <span className={`text-[10px] mt-0.5 font-semibold leading-tight ${isActive ? 'text-[#ccff00]' : 'text-slate-400'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
