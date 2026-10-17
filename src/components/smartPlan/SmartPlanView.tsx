import React, { useState } from 'react';
import { useSmartPlan } from '../../context/SmartPlanContext';
import { useAuth } from '../../context/AuthContext';
import { FitnessOnboardingModal } from './FitnessOnboardingModal';
import { ExerciseLibraryModal } from './ExerciseLibraryModal';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { ActiveWorkoutSessionModal } from './ActiveWorkoutSessionModal';
import { LogActivityModal } from '../activity/LogActivityModal';
import { SmartProgressAnalytics } from './SmartProgressAnalytics';
import { CrewAchievementsCard } from './CrewAchievementsCard';
import { EXERCISE_DATABASE, ExerciseDetail } from '../../lib/exerciseDatabase';
import { 
  Sparkles, 
  Dumbbell, 
  Calendar, 
  Clock, 
  Flame, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  SlidersHorizontal,
  ChevronRight,
  ShieldCheck,
  Target,
  Heart,
  Activity,
  Plus,
  BookOpen,
  Repeat,
  Compass,
  BarChart2
} from 'lucide-react';
import { PlannedWorkout, PlannedExercise } from '../../types/smartPlan';

interface SmartPlanViewProps {
  onOpenCheckIn?: () => void;
}

export const SmartPlanView: React.FC<SmartPlanViewProps> = ({ onOpenCheckIn }) => {
  const { user } = useAuth();
  const { 
    profile, 
    activePlan, 
    activeSession, 
    activityLogs,
    saveProfileAndGeneratePlan, 
    regeneratePlan,
    startWorkoutSession,
    completeWorkoutSession,
    syncStatus 
  } = useSmartPlan();

  // Sub-tab navigation: 'workouts' | 'activity' | 'progress'
  const [activeSubTab, setActiveSubTab] = useState<'workouts' | 'activity' | 'progress'>('workouts');

  // Modals state
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isLogActivityOpen, setIsLogActivityOpen] = useState(false);
  const [selectedExerciseForGuide, setSelectedExerciseForGuide] = useState<ExerciseDetail | null>(null);
  const [substitutingExercise, setSubstitutingExercise] = useState<{ workoutId: string; exerciseId: string; name: string } | null>(null);
  const [liveSessionWorkout, setLiveSessionWorkout] = useState<PlannedWorkout | null>(null);

  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(1);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Determine current day of week (1 = Mon, 7 = Sun)
  const currentJsDay = new Date().getDay(); // 0 is Sun, 1 is Mon...
  const currentDayIndex = currentJsDay === 0 ? 7 : currentJsDay;

  const todayWorkout = activePlan?.workouts.find((w) => w.day_index === currentDayIndex);
  const selectedWorkout = activePlan?.workouts.find((w) => w.day_index === selectedDayIndex) || todayWorkout;

  const handleRegenerate = async () => {
    if (!profile) return;
    setIsRegenerating(true);
    try {
      await regeneratePlan();
    } catch (err) {
      console.error('Failed to regenerate plan:', err);
    } finally {
      setIsRegenerating(false);
    }
  };

  const handleStartWorkout = async (wk: PlannedWorkout) => {
    try {
      await startWorkoutSession(wk);
      setLiveSessionWorkout(wk);
    } catch (err) {
      console.error('Failed to start session:', err);
    }
  };

  const handleOpenExerciseGuide = (exerciseName: string) => {
    const found = EXERCISE_DATABASE.find(
      (e) => e.name.toLowerCase() === exerciseName.toLowerCase() ||
             exerciseName.toLowerCase().includes(e.name.toLowerCase())
    );
    if (found) {
      setSelectedExerciseForGuide(found);
    } else {
      setSelectedExerciseForGuide(EXERCISE_DATABASE[0]);
    }
  };

  const handleSubstituteExercise = (newEx: ExerciseDetail) => {
    if (!substitutingExercise || !activePlan) return;

    const updatedWorkouts = activePlan.workouts.map((wk) => {
      if (wk.id !== substitutingExercise.workoutId) return wk;

      const updatedExercises = wk.exercises.map((ex) => {
        if (ex.id !== substitutingExercise.exerciseId) return ex;

        return {
          ...ex,
          exercise_id: newEx.id,
          name: newEx.name,
          target_muscle: newEx.targetMuscle,
          equipment: newEx.equipment.toLowerCase(),
          notes: `Substituted with ${newEx.name}. Focus on proper biomechanics.`,
        };
      });

      return { ...wk, exercises: updatedExercises };
    });

    activePlan.workouts = updatedWorkouts;
    setSubstitutingExercise(null);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. If no profile yet, display Onboarding Banner */}
      {!profile || !activePlan ? (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#12141c] via-[#10121a] to-[#0c0d14] border border-[#232838] p-6 sm:p-8 shadow-2xl">
          <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-[#ccff00]/10 blur-3xl pointer-events-none" />
          
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-xs font-black text-[#ccff00] tracking-wide uppercase">
              <Sparkles size={13} />
              <span>Smart Plan Engine 2.0</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight leading-tight">
              Personalized Workout & <br className="hidden sm:block" />
              Progress Engine for <span className="text-[#ccff00]">Your Goals</span>
            </h2>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Answer 8 quick questions about your experience, available equipment, target goals, and joint limitations. GYMCREW will construct a balanced, science-based weekly workout plan.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
              <div className="p-3 rounded-xl bg-[#171a26]/80 border border-[#232838] flex items-center gap-2.5">
                <Dumbbell size={18} className="text-[#ccff00] shrink-0" />
                <span className="text-xs font-bold text-slate-200">2–6 Day Custom Splits</span>
              </div>
              <div className="p-3 rounded-xl bg-[#171a26]/80 border border-[#232838] flex items-center gap-2.5">
                <ShieldCheck size={18} className="text-[#ccff00] shrink-0" />
                <span className="text-xs font-bold text-slate-200">Spine & Joint Safe</span>
              </div>
              <div className="p-3 rounded-xl bg-[#171a26]/80 border border-[#232838] flex items-center gap-2.5">
                <Flame size={18} className="text-[#ccff00] shrink-0" />
                <span className="text-xs font-bold text-slate-200">Live Set & Rep Logging</span>
              </div>
            </div>

            <div className="pt-3">
              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] text-[#090a0f] font-black text-sm shadow-xl shadow-[#ccff00]/20 active:scale-95 transition-all"
              >
                <Sparkles size={16} />
                <span>Start 8-Step Questionnaire</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Header Banner: Active Plan Summary & Controls */}
          <div className="rounded-2xl bg-[#12141c] border border-[#202536] p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-bold text-[#ccff00] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={13} />
                  Active Plan
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1b1f2b] text-slate-300 border border-[#2a3042] font-semibold">
                  {profile.days_per_week} Days / Week
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#1b1f2b] text-slate-300 border border-[#2a3042] font-semibold">
                  {profile.experience_level}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30 font-bold flex items-center gap-1">
                  <Sparkles size={10} />
                  <span>{activePlan.engine_badge || 'Sports-Science Deterministic Engine (Offline & Verified)'}</span>
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-bold ${
                  syncStatus === 'synced' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                }`}>
                  {syncStatus === 'synced' ? '● Synced to Supabase' : '○ Local Offline Cache'}
                </span>
              </div>

              <h2 className="text-2xl font-black text-white font-heading">
                {activePlan.name}
              </h2>

              <p className="text-xs text-slate-400 max-w-xl">
                {activePlan.summary}
              </p>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
              <button
                onClick={() => setIsLibraryOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171a26] hover:bg-[#1e2233] border border-[#262c3d] text-xs font-bold text-slate-200 transition-colors"
                title="Browse Exercise Guides"
              >
                <BookOpen size={14} className="text-[#ccff00]" />
                <span>Exercise Library</span>
              </button>

              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171a26] hover:bg-[#1e2233] border border-[#262c3d] text-xs font-bold text-slate-200 transition-colors"
                title="Regenerate Plan with same settings"
              >
                <RefreshCw size={14} className={isRegenerating ? 'animate-spin text-[#ccff00]' : ''} />
                <span>Regenerate</span>
              </button>

              <button
                onClick={() => setIsOnboardingOpen(true)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171a26] hover:bg-[#1e2233] border border-[#262c3d] text-xs font-bold text-slate-200 transition-colors"
              >
                <SlidersHorizontal size={14} className="text-[#ccff00]" />
                <span>Edit Profile</span>
              </button>
            </div>
          </div>

          {/* Sub-Navigation Tabs */}
          <div className="flex items-center gap-1.5 bg-[#12141c] p-1 rounded-xl border border-[#1f2433] max-w-md">
            <button
              onClick={() => setActiveSubTab('workouts')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'workouts'
                  ? 'bg-[#ccff00] text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Dumbbell size={13} />
              <span>Workouts</span>
            </button>
            <button
              onClick={() => setActiveSubTab('activity')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'activity'
                  ? 'bg-[#ccff00] text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Activity size={13} />
              <span>Activity Day</span>
            </button>
            <button
              onClick={() => setActiveSubTab('progress')}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                activeSubTab === 'progress'
                  ? 'bg-[#ccff00] text-black shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BarChart2 size={13} />
              <span>Reports</span>
            </button>
          </div>

          {/* SUBTAB 1: WORKOUTS */}
          {activeSubTab === 'workouts' && (
            <div className="space-y-6">
              {/* Today's Planned Workout Hero Card */}
              {todayWorkout && (
                <div className="rounded-2xl bg-gradient-to-br from-[#141722] via-[#12141c] to-[#0f1118] border border-[#262c3e] p-5 sm:p-6 shadow-xl relative overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#ccff00] bg-[#ccff00]/10 px-2.5 py-0.5 rounded-full border border-[#ccff00]/30">
                          Today's Training Focus • {todayWorkout.day_name}
                        </span>
                        {todayWorkout.is_rest_day ? (
                          <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            Recovery Day
                          </span>
                        ) : (
                          <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                            <Clock size={12} className="text-slate-400" />
                            {todayWorkout.suggested_duration_min} mins
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-white font-heading">
                        {todayWorkout.title}
                      </h3>

                      <p className="text-xs text-slate-400">
                        Focus: <strong className="text-slate-200">{todayWorkout.focus}</strong>
                        {todayWorkout.exercises.length > 0 && ` • ${todayWorkout.exercises.length} prescribed exercises`}
                      </p>
                    </div>

                    <div className="flex items-center gap-2.5">
                      {todayWorkout.is_rest_day ? (
                        <div className="p-3 rounded-xl bg-[#1a1f2e] border border-[#262c3e] text-xs font-bold text-emerald-300 flex items-center gap-2">
                          <CheckCircle2 size={16} className="text-emerald-400" />
                          <span>Enjoy your recovery! Muscles grow while resting.</span>
                        </div>
                      ) : activeSession ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setLiveSessionWorkout(todayWorkout)}
                            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-extrabold animate-pulse hover:bg-amber-500/30 transition-colors"
                          >
                            <Activity size={15} />
                            <span>Resume Live Session</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleStartWorkout(todayWorkout)}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] text-black font-black text-xs shadow-lg shadow-[#ccff00]/20 transition-all active:scale-95"
                        >
                          <Play size={15} fill="currentColor" />
                          <span>Start Today's Workout</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Quick Exercise Chips with Clickable Guides */}
                  {!todayWorkout.is_rest_day && todayWorkout.exercises.length > 0 && (
                    <div className="mt-4 pt-4 border-t border-[#1e2333] flex flex-wrap gap-2">
                      {todayWorkout.exercises.map((ex, idx) => (
                        <button 
                          key={ex.id || idx}
                          onClick={() => handleOpenExerciseGuide(ex.name)}
                          className="px-2.5 py-1.5 rounded-lg bg-[#0b0c12] hover:bg-[#161a26] border border-[#1e2333] hover:border-[#ccff00]/40 text-xs text-slate-300 flex items-center gap-2 transition-all cursor-pointer"
                          title="Click to view biomechanics guide"
                        >
                          <span className="w-4 h-4 rounded-full bg-[#1b1f2b] text-[10px] font-bold text-[#ccff00] flex items-center justify-center">
                            {idx + 1}
                          </span>
                          <span className="font-semibold">{ex.name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            {ex.sets} × {ex.reps_range}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* 7-Day Weekly Split Calendar */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Calendar size={14} className="text-[#ccff00]" />
                    Weekly Training Split Schedule
                  </h3>
                  <span className="text-[11px] text-slate-500">Tap any day to view & substitute exercises</span>
                </div>

                {/* Horizontal Day Selector */}
                <div className="grid grid-cols-2 sm:grid-cols-7 gap-2">
                  {activePlan.workouts.map((wk) => {
                    const isToday = wk.day_index === currentDayIndex;
                    const isSelected = wk.day_index === selectedDayIndex;

                    return (
                      <button
                        key={wk.id}
                        onClick={() => setSelectedDayIndex(wk.day_index)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#ccff00]/15 border-[#ccff00] text-white shadow-md shadow-[#ccff00]/10'
                            : 'bg-[#12141c] border-[#1e2333] text-slate-400 hover:text-white hover:bg-[#161a26]'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-[10px] uppercase font-extrabold ${isToday ? 'text-[#ccff00]' : 'text-slate-400'}`}>
                            {wk.day_name.slice(0, 3)} {isToday && '• TODAY'}
                          </span>
                        </div>

                        <div className="font-extrabold text-xs text-white mt-1 truncate">
                          {wk.is_rest_day ? 'Rest Day' : wk.title.split(':')[0]}
                        </div>

                        <div className="text-[10px] text-slate-500 mt-0.5 truncate">
                          {wk.is_rest_day ? 'Recovery' : `${wk.exercises.length} moves`}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Selected Day Exercise Breakdown Card */}
                {selectedWorkout && (
                  <div className="rounded-2xl bg-[#12141c] border border-[#202536] p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-[#ccff00] uppercase tracking-wider">
                          {selectedWorkout.day_name} Routine
                        </span>
                        <h4 className="text-lg font-black text-white font-heading">
                          {selectedWorkout.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Focus: <strong className="text-slate-300">{selectedWorkout.focus}</strong>
                        </p>
                      </div>

                      {!selectedWorkout.is_rest_day && (
                        <button
                          onClick={() => handleStartWorkout(selectedWorkout)}
                          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#ccff00] text-black font-extrabold text-xs hover:bg-[#d8ff33] transition-all"
                        >
                          <Play size={13} fill="currentColor" />
                          <span>Start Workout</span>
                        </button>
                      )}
                    </div>

                    {selectedWorkout.warmup_notes && (
                      <div className="p-3 rounded-xl bg-[#0b0c12] border border-[#1b1f2b] text-xs text-slate-400">
                        <strong className="text-slate-200">Warm-up:</strong> {selectedWorkout.warmup_notes}
                      </div>
                    )}

                    {selectedWorkout.is_rest_day ? (
                      <div className="py-8 text-center space-y-2">
                        <div className="w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 mx-auto flex items-center justify-center">
                          <Heart size={20} />
                        </div>
                        <div className="font-black text-sm text-white">Dedicated Rest & Muscle Synthesis</div>
                        <p className="text-xs text-slate-400 max-w-sm mx-auto">
                          Rest days allow central nervous system recovery, glycogen replenishment, and joint repair.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {selectedWorkout.exercises.map((ex, idx) => (
                          <div
                            key={ex.id || idx}
                            className="p-3 rounded-xl bg-[#141722] border border-[#202536] flex items-center justify-between gap-3 hover:border-[#2d344a] transition-all"
                          >
                            <div 
                              onClick={() => handleOpenExerciseGuide(ex.name)}
                              className="flex items-center gap-3 cursor-pointer group flex-1"
                            >
                              <div className="w-8 h-8 rounded-lg bg-[#0b0c12] border border-[#1e2333] flex items-center justify-center font-mono font-bold text-xs text-[#ccff00] group-hover:border-[#ccff00] transition-colors">
                                {idx + 1}
                              </div>
                              <div>
                                <div className="font-extrabold text-xs text-white group-hover:text-[#ccff00] transition-colors flex items-center gap-1.5">
                                  <span>{ex.name}</span>
                                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-[11px] text-slate-400">
                                  {ex.target_muscle} • <span className="capitalize">{ex.equipment}</span>
                                </div>
                              </div>
                            </div>

                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <div className="font-mono font-black text-xs text-white">
                                  {ex.sets} Sets × {ex.reps_range} Reps
                                </div>
                                <div className="text-[10px] text-slate-500">
                                  {ex.rest_seconds}s Rest
                                </div>
                              </div>

                              <button
                                onClick={() => {
                                  setSubstitutingExercise({
                                    workoutId: selectedWorkout.id,
                                    exerciseId: ex.id,
                                    name: ex.name,
                                  });
                                  setIsLibraryOpen(true);
                                }}
                                className="p-1.5 rounded-lg bg-[#1a1e2b] text-slate-400 hover:text-white hover:bg-[#252c40] transition-colors"
                                title="Substitute this exercise"
                              >
                                <Repeat size={13} />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBTAB 2: ACTIVITY DAY (OUTDOOR SPORTS & RECREATIONAL) */}
          {activeSubTab === 'activity' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-6 rounded-2xl bg-gradient-to-br from-[#12141c] via-[#10131d] to-[#0c0e14] border border-[#202536] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xl">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Compass size={14} />
                    Activity Day • Sports & Outdoors
                  </span>
                  <h3 className="text-xl font-black text-white font-heading">
                    Cardio & Team Sports Tracking
                  </h3>
                  <p className="text-xs text-slate-400 max-w-lg">
                    Record running, swimming, cycling, trekking, football, cricket, and active recovery outside the gym without affecting your rest days.
                  </p>
                </div>

                <button
                  onClick={() => setIsLogActivityOpen(true)}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs shadow-lg shadow-cyan-400/20 active:scale-95 transition-all self-start sm:self-auto"
                >
                  <Plus size={15} />
                  <span>Log Activity Day</span>
                </button>
              </div>

              {/* Past Activity Logs List */}
              <div className="rounded-2xl bg-[#12141c] border border-[#202536] p-5 space-y-4">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>Logged Outdoor Sessions</span>
                  <span>{activityLogs.length} Activities Total</span>
                </h4>

                {activityLogs.length === 0 ? (
                  <div className="py-10 text-center space-y-2">
                    <div className="w-12 h-12 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mx-auto flex items-center justify-center">
                      <Activity size={20} />
                    </div>
                    <div className="font-bold text-sm text-white">No Outdoor Activities Yet</div>
                    <p className="text-xs text-slate-400 max-w-sm mx-auto">
                      Log your next trail run, soccer game, cycling ride, or trekking weekend to build well-rounded athleticism.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activityLogs.map((log) => (
                      <div
                        key={log.id}
                        className="p-3.5 rounded-xl bg-[#141722] border border-[#202536] flex items-center justify-between gap-3"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-lg">
                            {log.activity_type === 'running' ? '🏃' :
                             log.activity_type === 'cycling' ? '🚴' :
                             log.activity_type === 'swimming' ? '🏊' :
                             log.activity_type === 'football' ? '⚽' :
                             log.activity_type === 'cricket' ? '🏏' :
                             log.activity_type === 'hiking' ? '🥾' : '🎯'}
                          </div>
                          <div>
                            <span className="font-extrabold text-xs text-white capitalize block">
                              {log.activity_type.replace(/_/g, ' ')}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              {log.activity_date} • {log.duration_minutes} mins
                              {log.distance_km && ` • ${log.distance_km} km`}
                            </span>
                          </div>
                        </div>

                        {log.notes && (
                          <div className="text-right text-xs text-slate-400 italic max-w-xs truncate hidden sm:block">
                            "{log.notes}"
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUBTAB 3: REPORTS & PROGRESS */}
          {activeSubTab === 'progress' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <SmartProgressAnalytics />
              <CrewAchievementsCard />
            </div>
          )}
        </>
      )}

      {/* Onboarding Questionnaire Modal */}
      <FitnessOnboardingModal
        isOpen={isOnboardingOpen}
        onClose={() => setIsOnboardingOpen(false)}
        initialProfile={profile}
        onSaveProfile={async (newProfile) => {
          await saveProfileAndGeneratePlan(newProfile);
        }}
      />

      {/* Exercise Library Modal (Browse or Substitute) */}
      <ExerciseLibraryModal
        isOpen={isLibraryOpen}
        onClose={() => {
          setIsLibraryOpen(false);
          setSubstitutingExercise(null);
        }}
        isSubstitutionMode={Boolean(substitutingExercise)}
        replacingExerciseName={substitutingExercise?.name}
        onSelectSubstitute={handleSubstituteExercise}
      />

      {/* Exercise Form & Biomechanics Detail Guide */}
      <ExerciseDetailModal
        exercise={selectedExerciseForGuide}
        isOpen={Boolean(selectedExerciseForGuide)}
        onClose={() => setSelectedExerciseForGuide(null)}
      />

      {/* Live Active Workout Session Tracker */}
      {liveSessionWorkout && (
        <ActiveWorkoutSessionModal
          workout={liveSessionWorkout}
          isOpen={Boolean(liveSessionWorkout)}
          onClose={() => setLiveSessionWorkout(null)}
        />
      )}

      {/* Log Activity Day Modal */}
      <LogActivityModal
        isOpen={isLogActivityOpen}
        onClose={() => setIsLogActivityOpen(false)}
      />
    </div>
  );
};
