import React from 'react';
import { DailyAvailability } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Coffee, ShieldCheck } from 'lucide-react';

interface RestDayBuddiesListProps {
  todayAvailabilities: DailyAvailability[];
}

export const RestDayBuddiesList: React.FC<RestDayBuddiesListProps> = ({
  todayAvailabilities,
}) => {
  const restBuddies = todayAvailabilities.filter((a) => a.status === 'rest');

  if (restBuddies.length === 0) {
    return null; // Keep dashboard compact when no one is resting
  }

  return (
    <Card className="p-4 bg-[#10151a]/80 border-[#1c2c26]">
      <div className="flex items-center justify-between pb-3 border-b border-[#1c2e26]">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400">
            <Coffee size={16} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white font-heading">
              Active Recovery & Rest Today
            </h4>
            <p className="text-[11px] text-emerald-400/80">
              Recovering muscles, protecting streaks
            </p>
          </div>
        </div>

        <span className="text-xs font-bold text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30">
          {restBuddies.length} Resting
        </span>
      </div>

      <div className="pt-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {restBuddies.map((buddy) => (
          <div
            key={buddy.id}
            className="flex items-center gap-2.5 p-2 rounded-xl bg-[#131b1f] border border-[#1b2b2b]"
          >
            <Avatar
              src={buddy.profile?.avatar_url}
              name={buddy.profile?.display_name || buddy.profile?.username || 'Bro'}
              size="sm"
            />
            <div className="min-w-0 flex-1">
              <span className="text-xs font-bold text-slate-200 block truncate">
                {buddy.profile?.display_name || buddy.profile?.username}
              </span>
              <p className="text-[11px] text-slate-400 truncate">
                {buddy.notes || 'Resting & recharging'}
              </p>
            </div>
            <span title="Streak Protected">
              <ShieldCheck size={14} className="text-emerald-400 shrink-0" />
            </span>
          </div>
        ))}
      </div>
    </Card>
  );
};
