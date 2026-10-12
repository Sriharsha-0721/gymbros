import React from 'react';
import { DailyAvailability } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { GymStatusBadge } from '../common/Badge';
import { Calendar, ArrowRight, Sun, Sunset, Moon, Coffee } from 'lucide-react';
import { getTodayKey, addWeeks, formatFriendlyDate, parseDateKey } from '../../lib/dateUtils';

interface UpcomingSchedulePreviewProps {
  availabilities: DailyAvailability[];
  onGoToCalendar: () => void;
  onSelectDate: (dateKey: string) => void;
}

export const UpcomingSchedulePreview: React.FC<UpcomingSchedulePreviewProps> = ({
  availabilities,
  onGoToCalendar,
  onSelectDate,
}) => {
  const todayKey = getTodayKey();

  // Find future availabilities starting from tomorrow
  const futureAvailabilities = availabilities
    .filter((a) => a.date > todayKey)
    .sort((a, b) => a.date.localeCompare(b.date));

  // Group by date
  const groupedByDate: { [key: string]: DailyAvailability[] } = {};
  for (const item of futureAvailabilities) {
    if (!groupedByDate[item.date]) {
      groupedByDate[item.date] = [];
    }
    groupedByDate[item.date].push(item);
  }

  const upcomingDates = Object.keys(groupedByDate).slice(0, 3);

  return (
    <Card className="p-5 bg-[#12141c]/90 border-[#1f2433]">
      <div className="flex items-center justify-between pb-3.5 border-b border-[#1b202e]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-[#181d2a] text-slate-300">
            <Calendar size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-heading">
              Upcoming Squad Plans
            </h3>
            <p className="text-xs text-slate-400">Preview next few days</p>
          </div>
        </div>

        <button
          onClick={onGoToCalendar}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#ccff00] hover:text-[#d8ff33] transition-colors group"
        >
          <span>Full Calendar</span>
          <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>

      <div className="pt-3.5">
        {upcomingDates.length > 0 ? (
          <div className="space-y-3">
            {upcomingDates.map((date) => {
              const items = groupedByDate[date];
              return (
                <div
                  key={date}
                  onClick={() => onSelectDate(date)}
                  className="p-3 rounded-xl bg-[#151824] border border-[#202638] hover:border-[#2f3850] cursor-pointer transition-all"
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-black text-slate-200">
                      {formatFriendlyDate(date)}
                    </span>
                    <span className="text-[11px] text-slate-400 font-medium">
                      {items.length} Lifter{items.length === 1 ? '' : 's'} Ready
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {items.map((item) => (
                      <div
                        key={item.id}
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a1e2d] border border-[#252b3e]"
                      >
                        <Avatar
                          src={item.profile?.avatar_url}
                          name={item.profile?.display_name || item.profile?.username || 'Bro'}
                          size="xs"
                        />
                        <span className="text-xs font-medium text-slate-300">
                          {item.profile?.display_name || item.profile?.username}
                        </span>
                        <GymStatusBadge status={item.status} size="sm" showIcon={false} />
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6 text-slate-500 text-xs">
            No upcoming plans posted yet for this week.{' '}
            <button
              onClick={onGoToCalendar}
              className="text-[#ccff00] font-semibold underline underline-offset-2 ml-1"
            >
              Open weekly schedule
            </button>{' '}
            to set plans ahead of time!
          </div>
        )}
      </div>
    </Card>
  );
};
