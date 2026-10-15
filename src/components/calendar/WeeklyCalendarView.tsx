import React, { useState } from 'react';
import { DailyAvailability, GroupMember, GymStatus, UserProfile } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { GymStatusBadge } from '../common/Badge';
import {
  getWeekDates,
  addWeeks,
  formatWeekRange,
  formatFriendlyDate,
} from '../../lib/dateUtils';
import {
  ChevronLeft,
  ChevronRight,
  Filter,
  Plus,
  Clock,
  Sparkles,
  Sun,
  Sunset,
  Moon,
  Coffee,
} from 'lucide-react';

interface WeeklyCalendarViewProps {
  availabilities: DailyAvailability[];
  members: GroupMember[];
  currentUser: UserProfile;
  onOpenSetPlanForDate: (dateKey: string) => void;
}

export const WeeklyCalendarView: React.FC<WeeklyCalendarViewProps> = ({
  availabilities,
  members,
  currentUser,
  onOpenSetPlanForDate,
}) => {
  const [referenceDate, setReferenceDate] = useState<Date>(new Date());
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [memberFilter, setMemberFilter] = useState<string>('all');

  const weekDays = getWeekDates(referenceDate);

  const handlePrevWeek = () => setReferenceDate((prev) => addWeeks(prev, -1));
  const handleNextWeek = () => setReferenceDate((prev) => addWeeks(prev, 1));
  const handleCurrentWeek = () => setReferenceDate(new Date());

  // Filter logic
  const filteredAvailabilities = availabilities.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    if (memberFilter !== 'all' && a.user_id !== memberFilter) return false;
    return true;
  });

  return (
    <div className="space-y-4">
      {/* Calendar Header with Navigation and Filter Bar */}
      <Card className="p-4 sm:p-5 bg-[#12141c]/90 border-[#1f2433]">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#ccff00] uppercase tracking-wider">
                Group Schedule
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400 font-medium">
                {formatWeekRange(weekDays)}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
              Weekly Availability
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCurrentWeek}
              className="px-3 py-1.5 rounded-xl bg-[#181c28] hover:bg-[#222838] text-xs font-bold text-slate-300 border border-[#252b3c] transition-colors"
            >
              Today
            </button>
            <div className="flex items-center rounded-xl bg-[#181c28] border border-[#252b3c] p-0.5">
              <button
                onClick={handlePrevWeek}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                title="Previous Week"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                onClick={handleNextWeek}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                title="Next Week"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4 pt-3 border-t border-[#1a1f2c] flex items-center gap-2 flex-wrap text-xs">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium mr-1">
            <Filter size={13} className="text-[#ccff00]" />
            <span>Filter:</span>
          </div>

          {/* Status Quick Filters */}
          <div className="flex items-center gap-1 flex-wrap">
            {['all', 'morning', 'afternoon', 'evening', 'rest'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all ${
                  statusFilter === st
                    ? 'bg-[#ccff00] text-[#090a0f]'
                    : 'bg-[#161a25] text-slate-400 hover:text-white border border-[#222737]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Member Filter Dropdown */}
          <div className="sm:ml-auto">
            <select
              value={memberFilter}
              onChange={(e) => setMemberFilter(e.target.value)}
              className="bg-[#161a25] border border-[#222737] text-slate-300 text-xs rounded-lg px-2.5 py-1 focus:outline-none focus:border-[#ccff00]"
            >
              <option value="all">All Members ({members.length})</option>
              {members.map((m) => (
                <option key={m.user_id} value={m.user_id}>
                  {m.profile?.display_name || m.profile?.username}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Card>

      {/* 7-Day Calendar Grid */}
      <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
        {weekDays.map((day) => {
          const dayAvailabilities = filteredAvailabilities.filter(
            (a) => a.date === day.dateKey
          );

          const userPlan = dayAvailabilities.find((a) => a.user_id === currentUser.id);

          return (
            <Card
              key={day.dateKey}
              className={`flex flex-col p-3.5 transition-all min-h-[220px] ${
                day.isToday
                  ? 'border-[#ccff00]/50 bg-[#141722] shadow-lg shadow-[#ccff00]/5'
                  : 'bg-[#12141c]/80 border-[#1f2433]'
              }`}
            >
              {/* Day Card Header */}
              <div className="flex items-center justify-between pb-2.5 border-b border-[#1b202e]">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      {day.dayName}
                    </span>
                    {day.isToday && (
                      <span className="px-1.5 py-0.2 rounded bg-[#ccff00] text-[#090a0f] text-[9px] font-black uppercase tracking-wider">
                        TODAY
                      </span>
                    )}
                  </div>
                  <span className="text-lg font-black text-white font-heading">
                    {day.dayNumber}
                  </span>
                </div>

                <button
                  onClick={() => onOpenSetPlanForDate(day.dateKey)}
                  className="p-1 rounded-lg bg-[#181d2a] hover:bg-[#242b3e] text-slate-300 hover:text-[#ccff00] transition-colors"
                  title="Set plan for this day"
                >
                  <Plus size={14} />
                </button>
              </div>

              {/* Day Member Availability List */}
              <div className="flex-1 pt-2.5 space-y-2 overflow-y-auto">
                {dayAvailabilities.length > 0 ? (
                  dayAvailabilities.map((item) => {
                    const isMe = item.user_id === currentUser.id;
                    return (
                      <div
                        key={item.id}
                        className={`p-2 rounded-xl border text-xs transition-all ${
                          isMe
                            ? 'bg-[#181d28] border-[#ccff00]/30'
                            : 'bg-[#151822] border-[#222838]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Avatar
                              src={item.profile?.avatar_url}
                              name={item.profile?.display_name || item.profile?.username || 'Bro'}
                              size="xs"
                            />
                            <span className="font-bold text-white truncate max-w-[80px]">
                              {item.profile?.display_name || item.profile?.username}
                            </span>
                          </div>
                          <GymStatusBadge status={item.status} size="sm" showIcon={false} />
                        </div>

                        {/* Preferred Time / Note */}
                        {(item.preferred_time || item.notes) && (
                          <div className="text-[10px] text-slate-400 space-y-0.5">
                            {item.preferred_time && (
                              <div className="flex items-center gap-1 text-[#ccff00] font-semibold">
                                <Clock size={10} />
                                <span>{item.preferred_time}</span>
                              </div>
                            )}
                            {item.notes && (
                              <p className="truncate text-slate-400 italic">
                                {item.notes}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-center py-4 text-slate-600 text-xs">
                    <span>No plans</span>
                  </div>
                )}
              </div>

              {/* Quick Action footer if user hasn't set their plan yet */}
              {!userPlan && (
                <button
                  onClick={() => onOpenSetPlanForDate(day.dateKey)}
                  className="mt-2 w-full py-1.5 rounded-lg border border-dashed border-[#232a3d] hover:border-[#ccff00]/50 text-[11px] font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  + Add my plan
                </button>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
