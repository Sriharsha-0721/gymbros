import React from 'react';
import { StreakStats } from '../../types';
import { Card } from '../common/Card';
import { Flame, Trophy, CalendarCheck, Target, ShieldCheck } from 'lucide-react';

interface ConsistencyStreakCardProps {
  stats: StreakStats;
  onOpenCheckIn: () => void;
}

export const ConsistencyStreakCard: React.FC<ConsistencyStreakCardProps> = ({
  stats,
  onOpenCheckIn,
}) => {
  const goalProgress = Math.min(
    100,
    Math.round((stats.completedThisWeek / (stats.weeklyGoal || 4)) * 100)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
      {/* 1. Consistency Streak Card */}
      <Card className="p-5 bg-gradient-to-br from-[#171a25] to-[#0f1118] border-[#252c3f] relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between pb-3 border-b border-[#1f2537]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-orange-500/15 text-orange-400">
              <Flame size={20} className="animate-bounce" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400">
                Discipline
              </span>
              <h3 className="text-sm font-bold text-white">Current Streak</h3>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-400">
            <Trophy size={13} className="text-[#ccff00]" />
            <span>Best: {stats.bestStreak}d</span>
          </div>
        </div>

        <div className="pt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-heading tracking-tight">
              {stats.currentStreak}
            </span>
            <span className="text-sm font-bold text-[#ccff00]">
              {stats.currentStreak === 1 ? 'Day Active' : 'Days Active'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20">
            <ShieldCheck size={12} />
            <span>Rest Protected</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-2">
          Keep logging workouts or marking scheduled rest days to keep your flame burning!
        </p>
      </Card>

      {/* 2. Weekly Goal Card */}
      <Card className="p-5 bg-[#12141c]/90 border-[#1f2433]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b202e]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#ccff00]/10 text-[#ccff00]">
              <Target size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#ccff00]">
                Weekly Target
              </span>
              <h3 className="text-sm font-bold text-white">Workout Goal</h3>
            </div>
          </div>

          <span className="text-xs font-black text-white bg-[#1a1e2b] px-2 py-0.5 rounded-lg border border-[#252b3e]">
            {stats.completedThisWeek} / {stats.weeklyGoal} Days
          </span>
        </div>

        {/* Progress bar */}
        <div className="pt-4">
          <div className="flex items-center justify-between text-xs font-bold mb-1.5">
            <span className="text-slate-300">Progress</span>
            <span className="text-[#ccff00]">{goalProgress}%</span>
          </div>

          <div className="w-full h-3 rounded-full bg-[#1b1f2d] overflow-hidden p-0.5 border border-[#23283a]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-lime-500 to-[#ccff00] transition-all duration-500 shadow-sm shadow-[#ccff00]/50"
              style={{ width: `${goalProgress}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            {stats.completedThisWeek >= stats.weeklyGoal
              ? '🎯 Goal achieved this week! Great commitment.'
              : `${stats.weeklyGoal - stats.completedThisWeek} more session${stats.weeklyGoal - stats.completedThisWeek === 1 ? '' : 's'} to hit your goal.`}
          </p>
        </div>
      </Card>

      {/* 3. Monthly Attendance Summary Card */}
      <Card className="p-5 bg-[#12141c]/90 border-[#1f2433]">
        <div className="flex items-center justify-between pb-3 border-b border-[#1b202e]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-cyan-500/10 text-cyan-400">
              <CalendarCheck size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                Monthly Total
              </span>
              <h3 className="text-sm font-bold text-white">This Month</h3>
            </div>
          </div>

          <button
            onClick={onOpenCheckIn}
            className="text-xs font-bold text-[#ccff00] hover:text-[#d8ff33] transition-colors"
          >
            + Log Session
          </button>
        </div>

        <div className="pt-4 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-white font-heading tracking-tight">
              {stats.completedThisMonth}
            </span>
            <span className="text-xs font-bold text-slate-400">Completed Sessions</span>
          </div>
        </div>

        <p className="text-[11px] text-slate-400 mt-2">
          Total lifetime logged: <strong className="text-white">{stats.totalCompleted} workouts</strong>
        </p>
      </Card>
    </div>
  );
};
