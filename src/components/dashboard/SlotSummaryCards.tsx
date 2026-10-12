import React from 'react';
import { DailyAvailability } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Sun, Sunset, Moon } from 'lucide-react';

interface SlotSummaryCardsProps {
  availabilities: DailyAvailability[];
  currentUserId?: string;
  onSelectSlotFilter?: (slot: 'morning' | 'evening' | 'night') => void;
}

export const SlotSummaryCards: React.FC<SlotSummaryCardsProps> = ({
  availabilities,
  currentUserId,
  onSelectSlotFilter,
}) => {
  const morningList = availabilities.filter((a) => a.status === 'morning');
  const eveningList = availabilities.filter((a) => a.status === 'evening');
  const nightList = availabilities.filter((a) => a.status === 'night');

  const slots = [
    {
      id: 'morning' as const,
      title: 'Morning',
      timeRange: '5 AM – 12 PM',
      count: morningList.length,
      items: morningList,
      icon: Sun,
      color: 'text-amber-400',
      badgeBg: 'bg-amber-500/10 border-amber-500/20 text-amber-300',
      glow: 'hover:border-amber-500/40',
    },
    {
      id: 'evening' as const,
      title: 'Evening',
      timeRange: '12 PM – 8 PM',
      count: eveningList.length,
      items: eveningList,
      icon: Sunset,
      color: 'text-cyan-400',
      badgeBg: 'bg-cyan-500/10 border-cyan-500/20 text-cyan-300',
      glow: 'hover:border-cyan-500/40',
    },
    {
      id: 'night' as const,
      title: 'Night',
      timeRange: '8 PM – Late',
      count: nightList.length,
      items: nightList,
      icon: Moon,
      color: 'text-purple-400',
      badgeBg: 'bg-purple-500/10 border-purple-500/20 text-purple-300',
      glow: 'hover:border-purple-500/40',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
      {slots.map((slot) => {
        const Icon = slot.icon;
        return (
          <Card
            key={slot.id}
            onClick={() => onSelectSlotFilter?.(slot.id)}
            className={`p-4 bg-[#12141c]/90 border-[#1f2433] ${slot.glow} cursor-pointer transition-all duration-200 group`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`p-2 rounded-xl bg-[#171a24] ${slot.color}`}>
                  <Icon size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-[#ccff00] transition-colors">
                    {slot.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">{slot.timeRange}</p>
                </div>
              </div>

              <span className={`text-base font-black px-2.5 py-0.5 rounded-lg border ${slot.badgeBg}`}>
                {slot.count}
              </span>
            </div>

            {/* Avatars of people going in this slot */}
            <div className="mt-3.5 pt-3 border-t border-[#1a1e2b] flex items-center justify-between">
              {slot.items.length > 0 ? (
                <div className="flex items-center -space-x-2 overflow-hidden">
                  {slot.items.slice(0, 4).map((item) => (
                    <Avatar
                      key={item.id}
                      src={item.profile?.avatar_url}
                      name={item.profile?.display_name || item.profile?.username || 'Gym Bro'}
                      size="xs"
                      className={item.user_id === currentUserId ? 'ring-2 ring-[#ccff00]' : ''}
                    />
                  ))}
                  {slot.items.length > 4 && (
                    <div className="w-6 h-6 rounded-full bg-[#1e2333] border-2 border-[#12141c] text-[10px] font-bold text-slate-300 flex items-center justify-center">
                      +{slot.items.length - 4}
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-[11px] text-slate-500">No one yet</span>
              )}

              <span className="text-[11px] font-semibold text-slate-400 group-hover:text-slate-200">
                {slot.count === 1 ? '1 Bro' : `${slot.count} Bros`}
              </span>
            </div>
          </Card>
        );
      })}
    </div>
  );
};
