import React from 'react';
import { DailyAvailability, GymStatus } from '../../types';
import { Card } from '../common/Card';
import { GymStatusBadge } from '../common/Badge';
import { Sun, Sunset, Moon, Coffee, Edit3, Clock, CheckCircle2, Calendar } from 'lucide-react';
import { getTodayKey, getTomorrowKey, formatFullDate, formatFriendlyDate } from '../../lib/dateUtils';

interface PersonalStatusCardProps {
  selectedDate: string;
  onSelectDate: (dateKey: string) => void;
  currentAvailability?: DailyAvailability;
  onOpenSetPlan: () => void;
  onQuickSelectStatus: (status: GymStatus) => void;
  hasCompletedWorkoutToday: boolean;
  onOpenCheckIn: () => void;
}

export const PersonalStatusCard: React.FC<PersonalStatusCardProps> = ({
  selectedDate,
  onSelectDate,
  currentAvailability,
  onOpenSetPlan,
  onQuickSelectStatus,
  hasCompletedWorkoutToday,
  onOpenCheckIn,
}) => {
  const todayKey = getTodayKey();
  const tomorrowKey = getTomorrowKey();
  const isToday = selectedDate === todayKey;
  const isTomorrow = selectedDate === tomorrowKey;

  const status = currentAvailability?.status || 'undecided';

  const dateLabel = isToday
    ? "Today's Plan"
    : isTomorrow
    ? "Tomorrow's Plan"
    : `${formatFriendlyDate(selectedDate)} Plan`;

  return (
    <Card className="p-5 sm:p-6 bg-gradient-to-br from-[#121520] to-[#0c0e14] border-[#1e2333] relative overflow-hidden">
      {/* Decorative accent glow */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-[#ccff00]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Card Header with Today / Tomorrow Quick Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#1b2030]">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold text-[#ccff00] tracking-wider uppercase">
              {dateLabel} • {formatFullDate(selectedDate)}
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
            Your Gym Status
          </h2>
        </div>

        {/* Day Switcher Toggle: Today vs Tomorrow */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          <div className="flex items-center rounded-xl bg-[#151824] p-1 border border-[#22283a]">
            <button
              onClick={() => onSelectDate(todayKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isToday
                  ? 'bg-[#ccff00] text-[#090a0f] shadow-md shadow-[#ccff00]/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => onSelectDate(tomorrowKey)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isTomorrow
                  ? 'bg-[#ccff00] text-[#090a0f] shadow-md shadow-[#ccff00]/20'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
              }`}
            >
              Tomorrow
            </button>
          </div>

          {/* If today, show workout done / mark as done */}
          {isToday && (
            <>
              {hasCompletedWorkoutToday ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                  <CheckCircle2 size={14} />
                  Done!
                </span>
              ) : status !== 'rest' && status !== 'undecided' ? (
                <button
                  onClick={onOpenCheckIn}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#ccff00]/15 hover:bg-[#ccff00]/25 text-[#ccff00] border border-[#ccff00]/30 text-xs font-bold transition-colors"
                >
                  <CheckCircle2 size={13} />
                  Mark Done
                </button>
              ) : null}
            </>
          )}

          <button
            onClick={onOpenSetPlan}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#181c28] hover:bg-[#202538] text-slate-300 text-xs font-semibold border border-[#252b3e] transition-colors"
          >
            <Edit3 size={12} />
            <span>Details</span>
          </button>
        </div>
      </div>

      <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <GymStatusBadge status={status} size="lg" />
            {currentAvailability?.preferred_time && (
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-slate-300 bg-[#161a26] px-2.5 py-1 rounded-lg border border-[#22283a]">
                <Clock size={13} className="text-[#ccff00]" />
                {currentAvailability.preferred_time}
              </span>
            )}
          </div>

          {currentAvailability?.notes ? (
            <p className="text-sm text-slate-300 mt-2.5 italic">
              "{currentAvailability.notes}"
            </p>
          ) : (
            <p className="text-xs text-slate-400 mt-2">
              {status === 'undecided'
                ? `Choose below when you're planning to lift ${isToday ? 'today' : isTomorrow ? 'tomorrow' : 'on this day'}.`
                : status === 'rest'
                ? `Scheduled recovery day for ${isToday ? 'today' : 'tomorrow'}. Rest up!`
                : `Locked in for the ${status} session ${isToday ? 'today' : 'tomorrow'}.`}
            </p>
          )}
        </div>

        {/* 1-Tap Quick Action Selector */}
        <div className="flex items-center gap-1.5 flex-wrap sm:flex-nowrap">
          <button
            onClick={() => onQuickSelectStatus('morning')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              status === 'morning'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-sm shadow-amber-500/20'
                : 'bg-[#141722] text-slate-400 border-[#202536] hover:text-white hover:bg-[#1a1f2e]'
            }`}
          >
            <Sun size={14} className={status === 'morning' ? 'text-amber-400' : ''} />
            <span>Morning</span>
          </button>

          <button
            onClick={() => onQuickSelectStatus('evening')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              status === 'evening'
                ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 shadow-sm shadow-cyan-500/20'
                : 'bg-[#141722] text-slate-400 border-[#202536] hover:text-white hover:bg-[#1a1f2e]'
            }`}
          >
            <Sunset size={14} className={status === 'evening' ? 'text-cyan-400' : ''} />
            <span>Evening</span>
          </button>

          <button
            onClick={() => onQuickSelectStatus('night')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              status === 'night'
                ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm shadow-purple-500/20'
                : 'bg-[#141722] text-slate-400 border-[#202536] hover:text-white hover:bg-[#1a1f2e]'
            }`}
          >
            <Moon size={14} className={status === 'night' ? 'text-purple-400' : ''} />
            <span>Night</span>
          </button>

          <button
            onClick={() => onQuickSelectStatus('rest')}
            className={`flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
              status === 'rest'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40 shadow-sm shadow-emerald-500/20'
                : 'bg-[#141722] text-slate-400 border-[#202536] hover:text-white hover:bg-[#1a1f2e]'
            }`}
          >
            <Coffee size={14} className={status === 'rest' ? 'text-emerald-400' : ''} />
            <span>Rest</span>
          </button>
        </div>
      </div>
    </Card>
  );
};
