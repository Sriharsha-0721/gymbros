import React from 'react';
import { useSmartPlan } from '../../context/SmartPlanContext';
import { useGroup } from '../../context/GroupContext';
import { Award, Sparkles, Users, CheckCircle2, Flame, Trophy } from 'lucide-react';
import confetti from 'canvas-confetti';

export const CrewAchievementsCard: React.FC = () => {
  const { activeGroup } = useGroup();
  const { sessions, activityLogs } = useSmartPlan();

  const completedCount = sessions.filter((s) => s.status === 'completed').length;
  const activityCount = activityLogs.length;

  const triggerCelebration = () => {
    try {
      confetti({
        particleCount: 90,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ccff00', '#06b6d4', '#e2e8f0'],
      });
    } catch (e) {
      // ignore
    }
  };

  const milestones = [
    {
      id: 'first_workout',
      title: 'First Smart Plan Workout',
      desc: 'Completed your first structured session in GYMCREW 2.0',
      unlocked: completedCount >= 1,
      icon: Dumbbell,
    },
    {
      id: 'four_workouts',
      title: 'Weekly 4-Day Warrior',
      desc: 'Achieved 4 verified workouts in a single training cycle',
      unlocked: completedCount >= 4,
      icon: Flame,
    },
    {
      id: 'outdoor_explorer',
      title: 'Outdoor Activity Milestone',
      desc: 'Logged a sports or outdoor cardio session with your crew',
      unlocked: activityCount >= 1,
      icon: Award,
    },
    {
      id: 'crew_consistency',
      title: 'Squad Consistency Champion',
      desc: 'Logged 10+ combined resistance & activity sessions',
      unlocked: completedCount + activityCount >= 10,
      icon: Trophy,
    },
  ];

  return (
    <div className="rounded-2xl bg-[#12141c] border border-[#202536] p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-[10px] font-bold text-[#ccff00] uppercase tracking-wider flex items-center gap-1.5">
            <Trophy size={13} />
            Crew Celebrations & Badges
          </span>
          <h3 className="text-base font-black text-white font-heading mt-0.5">
            Verified Milestones
          </h3>
          <p className="text-xs text-slate-400">
            {activeGroup ? `Shared with ${activeGroup.name}` : 'Personal milestones unlocked'}
          </p>
        </div>

        <button
          onClick={triggerCelebration}
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#ccff00]/10 hover:bg-[#ccff00]/20 border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold transition-all"
        >
          <Sparkles size={13} />
          <span>Celebrate</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
        {milestones.map((m) => (
          <div
            key={m.id}
            className={`p-3.5 rounded-xl border flex items-start gap-3 transition-all ${
              m.unlocked
                ? 'bg-[#141722] border-[#2c3447]'
                : 'bg-[#0e1017] border-[#181c28] opacity-60'
            }`}
          >
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                m.unlocked
                  ? 'bg-[#ccff00]/10 border border-[#ccff00]/40 text-[#ccff00]'
                  : 'bg-[#151824] text-slate-600'
              }`}
            >
              <m.icon size={18} />
            </div>

            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xs text-white">{m.title}</span>
                {m.unlocked && (
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/15 text-emerald-400 font-bold border border-emerald-500/30">
                    Unlocked
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{m.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function Dumbbell(props: any) {
  return <Sparkles {...props} />;
}
