import React, { useState } from 'react';
import { useSmartPlan } from '../../context/SmartPlanContext';
import { useGroup } from '../../context/GroupContext';
import { 
  BarChart2, 
  CheckCircle2, 
  Calendar, 
  Clock, 
  Flame, 
  Activity, 
  Heart, 
  AlertCircle, 
  RotateCcw, 
  Dumbbell, 
  Sparkles,
  TrendingUp,
  Award
} from 'lucide-react';

export const SmartProgressAnalytics: React.FC = () => {
  const { profile, activePlan, sessions, activityLogs } = useSmartPlan();
  const { workoutLogs } = useGroup();
  const [reportPeriod, setReportPeriod] = useState<'weekly' | 'monthly'>('weekly');

  // Time boundaries
  const now = new Date();
  const daysWindow = reportPeriod === 'weekly' ? 7 : 30;
  const cutoffTime = now.getTime() - daysWindow * 24 * 60 * 60 * 1000;

  // Filter actual recorded sessions in window
  const recentSessions = sessions.filter((s) => {
    const sessionTime = new Date(s.session_date).getTime();
    return sessionTime >= cutoffTime;
  });

  const recentActivities = activityLogs.filter((a) => {
    const actTime = new Date(a.activity_date).getTime();
    return actTime >= cutoffTime;
  });

  const completedGymSessions = recentSessions.filter((s) => s.status === 'completed');
  const missedSessions = recentSessions.filter((s) => s.status === 'missed');
  const rescheduledSessions = recentSessions.filter((s) => s.status === 'rescheduled');
  const inProgressSessions = recentSessions.filter((s) => s.status === 'in_progress');

  // Planned target based on user's profile
  const daysPerWeek = profile?.days_per_week || 4;
  const plannedTargetCount = reportPeriod === 'weekly' ? daysPerWeek : Math.round(daysPerWeek * 4.2);
  const totalCompletedCombined = completedGymSessions.length + recentActivities.length;

  const consistencyRate = Math.min(
    100,
    Math.round((totalCompletedCombined / Math.max(1, plannedTargetCount)) * 100)
  );

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header & Period Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <span className="text-xs font-bold text-[#ccff00] uppercase tracking-wider flex items-center gap-1.5">
            <TrendingUp size={13} />
            Consistency & Progress Reports
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-white font-heading mt-0.5">
            {reportPeriod === 'weekly' ? 'Weekly Training Report' : 'Monthly Comprehensive Overview'}
          </h2>
          <p className="text-xs text-slate-400">
            Accurate separation of scheduled plans from actual completed sessions. Rest protects your gains.
          </p>
        </div>

        <div className="flex rounded-xl bg-[#12141c] p-1 border border-[#1f2433] self-start sm:self-auto text-xs font-bold">
          <button
            onClick={() => setReportPeriod('weekly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              reportPeriod === 'weekly'
                ? 'bg-[#ccff00] text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Weekly Summary
          </button>
          <button
            onClick={() => setReportPeriod('monthly')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              reportPeriod === 'monthly'
                ? 'bg-[#ccff00] text-black shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Monthly Report
          </button>
        </div>
      </div>

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {/* Completed Sessions */}
        <div className="p-4 rounded-xl bg-[#12141c] border border-[#202536] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Completed Gym</span>
            <CheckCircle2 size={15} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-heading">
            {completedGymSessions.length}
          </div>
          <div className="text-[10px] text-slate-500">
            Target: {plannedTargetCount} sessions
          </div>
        </div>

        {/* Outdoor Activity Days */}
        <div className="p-4 rounded-xl bg-[#12141c] border border-[#202536] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Activity Days</span>
            <Activity size={15} className="text-cyan-400" />
          </div>
          <div className="text-2xl font-black text-cyan-400 font-heading">
            {recentActivities.length}
          </div>
          <div className="text-[10px] text-slate-500">
            Cardio, sports & trekking
          </div>
        </div>

        {/* Consistency Score */}
        <div className="p-4 rounded-xl bg-[#12141c] border border-[#202536] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Consistency</span>
            <Flame size={15} className="text-[#ccff00]" />
          </div>
          <div className="text-2xl font-black text-[#ccff00] font-heading">
            {consistencyRate}%
          </div>
          <div className="text-[10px] text-slate-500">
            {consistencyRate >= 80 ? 'Elite consistency' : 'Building solid momentum'}
          </div>
        </div>

        {/* Rescheduled / Neutral Missed */}
        <div className="p-4 rounded-xl bg-[#12141c] border border-[#202536] space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Rescheduled</span>
            <RotateCcw size={15} className="text-amber-400" />
          </div>
          <div className="text-2xl font-black text-amber-300 font-heading">
            {rescheduledSessions.length + missedSessions.length}
          </div>
          <div className="text-[10px] text-slate-500">
            Flexible schedule adaptations
          </div>
        </div>
      </div>

      {/* Constructive Guidance Banner (If missed sessions occurred) */}
      {(missedSessions.length > 0 || rescheduledSessions.length > 0) && (
        <div className="p-4 rounded-xl bg-[#141722] border border-[#252c3e] flex items-start gap-3 text-xs text-slate-300">
          <Sparkles size={18} className="text-[#ccff00] shrink-0 mt-0.5" />
          <div className="space-y-1">
            <strong className="text-white">Schedule Adjustment Insight:</strong>
            <p className="text-slate-400 leading-relaxed text-[11px]">
              You rescheduled or missed {missedSessions.length + rescheduledSessions.length} planned session(s). Remember: consistency over 8–12 weeks matters far more than any single missed day. Do not double up workout volume to compensate—simply continue with your next planned workout or take appropriate rest.
            </p>
          </div>
        </div>
      )}

      {/* Planned vs Actual Breakdown Card */}
      <div className="rounded-2xl bg-[#12141c] border border-[#202536] p-5 space-y-4">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <BarChart2 size={14} className="text-[#ccff00]" />
          Planned vs. Actual Logged Activity
        </h3>

        <div className="space-y-3">
          {/* Consistency Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-bold text-white">Period Goal Completion</span>
              <span className="font-mono text-[#ccff00] font-bold">
                {totalCompletedCombined} / {plannedTargetCount} sessions ({consistencyRate}%)
              </span>
            </div>
            <div className="w-full bg-[#1b1f2b] h-3 rounded-full overflow-hidden p-0.5">
              <div
                className="bg-gradient-to-r from-[#ccff00] to-cyan-400 h-2 rounded-full transition-all duration-500"
                style={{ width: `${consistencyRate}%` }}
              />
            </div>
          </div>

          {/* Activity Category Breakdown */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
            <div className="p-3 rounded-xl bg-[#141722] border border-[#1e2333] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Dumbbell size={16} className="text-[#ccff00]" />
                <span className="text-xs text-slate-300 font-semibold">Resistance Training</span>
              </div>
              <span className="text-xs font-extrabold text-white font-mono">
                {completedGymSessions.length}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#141722] border border-[#1e2333] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-cyan-400" />
                <span className="text-xs text-slate-300 font-semibold">Cardio & Sports</span>
              </div>
              <span className="text-xs font-extrabold text-white font-mono">
                {recentActivities.length}
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#141722] border border-[#1e2333] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={16} className="text-emerald-400" />
                <span className="text-xs text-slate-300 font-semibold">Scheduled Rest</span>
              </div>
              <span className="text-xs font-extrabold text-emerald-400 font-mono">
                {reportPeriod === 'weekly' ? 7 - daysPerWeek : Math.round((7 - daysPerWeek) * 4.2)} days
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Target Goal Timeline Banner */}
      {profile?.target_review_date && (
        <div className="p-4 rounded-xl bg-[#12141c] border border-[#202536] flex items-center justify-between text-xs">
          <div className="flex items-center gap-2.5">
            <Award size={18} className="text-[#ccff00]" />
            <div>
              <span className="font-extrabold text-white block">
                Target Commitment: {profile.target_goal}
              </span>
              <span className="text-[10px] text-slate-400">
                Milestone Review Date: {profile.target_review_date}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
