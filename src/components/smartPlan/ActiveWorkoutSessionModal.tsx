import React, { useState, useEffect, useRef } from 'react';
import { PlannedWorkout, PlannedExercise } from '../../types/smartPlan';
import { useSmartPlan } from '../../context/SmartPlanContext';
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  RotateCcw, 
  Clock, 
  Dumbbell, 
  Flame, 
  Plus, 
  X, 
  ChevronRight, 
  Check, 
  Sparkles,
  Calendar,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { sanitizeNumericInput } from '../../lib/numberUtils';

interface ActiveWorkoutSessionModalProps {
  workout: PlannedWorkout;
  isOpen: boolean;
  onClose: () => void;
}

interface SetRecord {
  setNumber: number;
  weightKg: number;
  reps: number;
  completed: boolean;
}

export const ActiveWorkoutSessionModal: React.FC<ActiveWorkoutSessionModalProps> = ({
  workout,
  isOpen,
  onClose,
}) => {
  const { 
    activeSession, 
    completeWorkoutSession, 
    recordMissedOrRescheduledSession,
    logExerciseSet 
  } = useSmartPlan();

  // Timer state
  const [secondsElapsed, setSecondsElapsed] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(true);

  // Rest Timer state
  const [restSecondsRemaining, setRestSecondsRemaining] = useState<number | null>(null);

  // Exercise tracking: map exercise_id -> SetRecord[]
  const [exerciseSets, setExerciseSets] = useState<Record<string, SetRecord[]>>({});
  const [activeExerciseIndex, setActiveExerciseIndex] = useState<number>(0);
  const [notes, setNotes] = useState<string>('');

  // Summary state
  const [isFinishedSummaryOpen, setIsFinishedSummaryOpen] = useState(false);
  const [totalVolumeKg, setTotalVolumeKg] = useState(0);

  // Reschedule state
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState('');

  // Initialize sets for all exercises
  useEffect(() => {
    if (!isOpen) return;

    const initialSets: Record<string, SetRecord[]> = {};
    workout.exercises.forEach((ex) => {
      const setsCount = ex.sets || 3;
      initialSets[ex.id] = Array.from({ length: setsCount }, (_, i) => ({
        setNumber: i + 1,
        weightKg: 0,
        reps: Number(ex.reps_range?.split('–')[0]?.split('-')[0]) || 10,
        completed: false,
      }));
    });
    setExerciseSets(initialSets);
    setSecondsElapsed(0);
    setIsTimerRunning(true);
    setIsFinishedSummaryOpen(false);
  }, [isOpen, workout]);

  // Workout duration timer
  useEffect(() => {
    let interval: any = null;
    if (isOpen && isTimerRunning) {
      interval = setInterval(() => {
        setSecondsElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, isTimerRunning]);

  // Rest countdown timer
  useEffect(() => {
    let restInterval: any = null;
    if (restSecondsRemaining !== null && restSecondsRemaining > 0) {
      restInterval = setInterval(() => {
        setRestSecondsRemaining((prev) => (prev !== null && prev > 1 ? prev - 1 : null));
      }, 1000);
    }
    return () => clearInterval(restInterval);
  }, [restSecondsRemaining]);

  if (!isOpen) return null;

  const currentExercise = workout.exercises[activeExerciseIndex] || workout.exercises[0];
  const currentSets = (currentExercise && exerciseSets[currentExercise.id]) || [];

  const formatTimer = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleUpdateSet = (exerciseId: string, setIndex: number, field: 'weightKg' | 'reps', value: number) => {
    setExerciseSets((prev) => {
      const exSets = [...(prev[exerciseId] || [])];
      exSets[setIndex] = { ...exSets[setIndex], [field]: value };
      return { ...prev, [exerciseId]: exSets };
    });
  };

  const handleToggleSetComplete = (exerciseId: string, setIndex: number) => {
    setExerciseSets((prev) => {
      const exSets = [...(prev[exerciseId] || [])];
      const targetSet = exSets[setIndex];
      const nextCompleted = !targetSet.completed;
      exSets[setIndex] = { ...targetSet, completed: nextCompleted };

      // Trigger rest timer if completed
      if (nextCompleted) {
        setRestSecondsRemaining(currentExercise?.rest_seconds || 90);
        if (activeSession) {
          logExerciseSet(
            activeSession.id,
            currentExercise.name,
            targetSet.weightKg,
            targetSet.reps
          );
        }
      }

      return { ...prev, [exerciseId]: exSets };
    });
  };

  const handleAddSet = (exerciseId: string) => {
    setExerciseSets((prev) => {
      const exSets = [...(prev[exerciseId] || [])];
      const lastSet = exSets[exSets.length - 1];
      exSets.push({
        setNumber: exSets.length + 1,
        weightKg: lastSet ? lastSet.weightKg : 0,
        reps: lastSet ? lastSet.reps : 10,
        completed: false,
      });
      return { ...prev, [exerciseId]: exSets };
    });
  };

  const handleFinishWorkout = async () => {
    // Calculate total lifted volume
    let volume = 0;
    let completedSetsCount = 0;

    Object.values(exerciseSets).forEach((sets) => {
      sets.forEach((s) => {
        if (s.completed) {
          volume += s.weightKg * s.reps;
          completedSetsCount++;
        }
      });
    });

    setTotalVolumeKg(volume);
    const durationMins = Math.max(1, Math.round(secondsElapsed / 60));

    if (activeSession) {
      await completeWorkoutSession(activeSession.id, durationMins, notes);
    }

    setIsTimerRunning(false);
    setIsFinishedSummaryOpen(true);

    // Fire celebratory confetti!
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#ccff00', '#ffffff', '#00ffcc'],
      });
    } catch (e) {
      // ignore
    }
  };

  const handleMarkMissed = async () => {
    if (activeSession) {
      await recordMissedOrRescheduledSession(activeSession.id, 'missed');
    }
    onClose();
  };

  const handleReschedule = async () => {
    if (!rescheduleDate) return;
    if (activeSession) {
      await recordMissedOrRescheduledSession(activeSession.id, 'rescheduled', rescheduleDate);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0f1118] border border-[#232838] rounded-2xl shadow-2xl flex flex-col max-h-[94dvh] sm:max-h-[90dvh] my-auto overflow-hidden">
        {/* Workout Complete Summary Screen */}
        {isFinishedSummaryOpen ? (
          <div className="p-6 sm:p-8 space-y-6 text-center animate-in zoom-in-95 duration-200 overflow-y-auto">
            <div className="w-16 h-16 rounded-2xl bg-[#ccff00]/15 border border-[#ccff00]/40 text-[#ccff00] flex items-center justify-center mx-auto shadow-xl shadow-[#ccff00]/20">
              <Sparkles size={32} />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-black uppercase text-[#ccff00] tracking-wider">
                Workout Finished • Beast Mode
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading">
                {workout.title}
              </h2>
              <p className="text-xs text-slate-400">
                Session completed and logged to your progress history.
              </p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-3 gap-3 max-w-md mx-auto">
              <div className="p-3.5 rounded-xl bg-[#141722] border border-[#202536]">
                <Clock size={16} className="text-[#ccff00] mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-400">Duration</div>
                <div className="text-base font-black text-white font-heading mt-0.5">
                  {formatTimer(secondsElapsed)}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141722] border border-[#202536]">
                <Dumbbell size={16} className="text-[#ccff00] mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-400">Total Volume</div>
                <div className="text-base font-black text-white font-heading mt-0.5">
                  {totalVolumeKg > 0 ? `${totalVolumeKg.toLocaleString()} kg` : 'Bodyweight'}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#141722] border border-[#202536]">
                <Flame size={16} className="text-[#ccff00] mx-auto mb-1" />
                <div className="text-xs font-bold text-slate-400">Exercises</div>
                <div className="text-base font-black text-white font-heading mt-0.5">
                  {workout.exercises.length}
                </div>
              </div>
            </div>

            <div className="pt-4 max-w-xs mx-auto">
              <button
                onClick={onClose}
                className="w-full py-3 rounded-xl bg-[#ccff00] text-black font-black text-sm shadow-xl shadow-[#ccff00]/20 hover:bg-[#d8ff33] transition-all"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Live Workout Header */}
            <div className="px-5 py-3.5 border-b border-[#1b1f2b] flex items-center justify-between bg-[#131620]">
              <div className="flex items-center gap-2.5">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <div>
                  <h3 className="text-sm font-black text-white font-heading truncate max-w-[220px] sm:max-w-md">
                    {workout.title}
                  </h3>
                  <div className="text-[10px] text-slate-400 flex items-center gap-2">
                    <span>Exercise {activeExerciseIndex + 1} of {workout.exercises.length}</span>
                    <span>•</span>
                    <span className="text-[#ccff00] font-mono font-bold">
                      {formatTimer(secondsElapsed)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Header Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                  className="p-1.5 rounded-lg bg-[#1a1e2b] text-slate-300 hover:text-white transition-colors"
                  title={isTimerRunning ? 'Pause Timer' : 'Resume Timer'}
                >
                  {isTimerRunning ? <Pause size={14} /> : <Play size={14} />}
                </button>
                <button
                  onClick={onClose}
                  className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors text-xs font-bold"
                  title="Minimize / Leave in progress"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Rest Timer Banner (If active) */}
            {restSecondsRemaining !== null && (
              <div className="px-4 py-2 bg-[#ccff00]/15 border-b border-[#ccff00]/30 flex items-center justify-between text-xs animate-in slide-in-from-top-2">
                <div className="flex items-center gap-2 font-bold text-[#ccff00]">
                  <RotateCcw size={14} className="animate-spin" />
                  <span>Rest Interval: {restSecondsRemaining}s remaining</span>
                </div>
                <button
                  onClick={() => setRestSecondsRemaining(null)}
                  className="text-[10px] uppercase font-extrabold text-slate-400 hover:text-white bg-black/40 px-2 py-0.5 rounded"
                >
                  Skip Rest
                </button>
              </div>
            )}

            {/* Main Interactive Logging Area */}
            <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* Exercise Selection Carousel / Tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                {workout.exercises.map((ex, idx) => {
                  const isCurrent = idx === activeExerciseIndex;
                  const sets = exerciseSets[ex.id] || [];
                  const allDone = sets.length > 0 && sets.every((s) => s.completed);

                  return (
                    <button
                      key={ex.id || idx}
                      onClick={() => setActiveExerciseIndex(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                        isCurrent
                          ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                          : allDone
                          ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                          : 'bg-[#141722] border border-[#202536] text-slate-400 hover:text-white'
                      }`}
                    >
                      {allDone && <Check size={12} strokeWidth={3} />}
                      <span>{idx + 1}. {ex.name.split(' ')[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Current Exercise Card */}
              {currentExercise && (
                <div className="p-4 rounded-xl bg-[#12151e] border border-[#202536] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#ccff00] uppercase tracking-wider">
                        {currentExercise.target_muscle}
                      </span>
                      <h4 className="text-base font-extrabold text-white font-heading">
                        {currentExercise.name}
                      </h4>
                    </div>
                    <div className="text-right text-[11px] text-slate-400">
                      Target: <strong className="text-white">{currentExercise.sets} × {currentExercise.reps_range}</strong>
                    </div>
                  </div>

                  {/* Set-by-Set Logging Table */}
                  <div className="space-y-2">
                    <div className="grid grid-cols-12 gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
                      <div className="col-span-2">Set</div>
                      <div className="col-span-4">Weight (kg)</div>
                      <div className="col-span-3">Reps</div>
                      <div className="col-span-3 text-right">Done</div>
                    </div>

                    {currentSets.map((set, sIdx) => (
                      <div
                        key={sIdx}
                        className={`grid grid-cols-12 gap-2 items-center p-2 rounded-lg border transition-all ${
                          set.completed
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-white'
                            : 'bg-[#0b0c12] border-[#1e2333] text-slate-300'
                        }`}
                      >
                        <div className="col-span-2 font-mono font-bold text-xs pl-1">
                          #{set.setNumber}
                        </div>

                        {/* Weight input */}
                        <div className="col-span-4 flex items-center gap-1">
                          <input
                            type="number"
                            step="0.5"
                            value={set.weightKg || ''}
                            onChange={(e) =>
                              handleUpdateSet(
                                currentExercise.id,
                                sIdx,
                                'weightKg',
                                Number(sanitizeNumericInput(e.target.value))
                              )
                            }
                            placeholder="0"
                            className="w-full bg-[#161a26] border border-[#252b3d] rounded-md px-2 py-1 text-sm sm:text-xs text-white font-mono font-bold text-center focus:border-[#ccff00] focus:outline-none"
                          />
                        </div>

                        {/* Reps input */}
                        <div className="col-span-3">
                          <input
                            type="number"
                            value={set.reps || ''}
                            onChange={(e) =>
                              handleUpdateSet(
                                currentExercise.id,
                                sIdx,
                                'reps',
                                Number(sanitizeNumericInput(e.target.value))
                              )
                            }
                            placeholder="10"
                            className="w-full bg-[#161a26] border border-[#252b3d] rounded-md px-2 py-1 text-sm sm:text-xs text-white font-mono font-bold text-center focus:border-[#ccff00] focus:outline-none"
                          />
                        </div>

                        {/* Checkmark Button */}
                        <div className="col-span-3 flex justify-end">
                          <button
                            type="button"
                            onClick={() => handleToggleSetComplete(currentExercise.id, sIdx)}
                            className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                              set.completed
                                ? 'bg-emerald-500 text-black shadow-sm shadow-emerald-500/30'
                                : 'bg-[#1b202e] text-slate-400 hover:text-white hover:bg-[#252d40]'
                            }`}
                          >
                            <Check size={14} strokeWidth={set.completed ? 3 : 2} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Add Extra Set Button */}
                  <button
                    onClick={() => handleAddSet(currentExercise.id)}
                    className="w-full py-1.5 rounded-lg bg-[#161a26] hover:bg-[#1e2333] border border-[#242a3b] text-[11px] font-bold text-slate-300 flex items-center justify-center gap-1 transition-colors"
                  >
                    <Plus size={12} />
                    <span>Add Set</span>
                  </button>
                </div>
              )}

              {/* Workout Session Notes */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Session Notes & Energy
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hit a new bench PR, good shoulder pump"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-[#141722] border border-[#202536] rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ccff00]"
                />
              </div>

              {/* Missed / Reschedule Collapsible */}
              <div className="pt-2">
                {!isRescheduling ? (
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <button
                      onClick={() => setIsRescheduling(true)}
                      className="hover:text-slate-200 underline text-[11px]"
                    >
                      Need to reschedule or mark missed?
                    </button>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[#141722] border border-[#202536] space-y-2.5">
                    <div className="text-xs font-bold text-slate-200">Reschedule or Skip Workout</div>
                    <div className="flex items-center gap-2">
                      <input
                        type="date"
                        value={rescheduleDate}
                        onChange={(e) => setRescheduleDate(e.target.value)}
                        className="bg-[#0b0c12] border border-[#1e2333] rounded-lg px-2.5 py-1 text-xs text-white font-mono"
                      />
                      <button
                        onClick={handleReschedule}
                        disabled={!rescheduleDate}
                        className="px-3 py-1 rounded-lg bg-[#ccff00] text-black text-xs font-bold disabled:opacity-40"
                      >
                        Reschedule
                      </button>
                      <button
                        onClick={handleMarkMissed}
                        className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-bold hover:bg-rose-500/30"
                      >
                        Mark Missed
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Bottom Controls */}
            <div className="px-5 py-3.5 border-t border-[#1b1f2b] flex items-center justify-between bg-[#131620]">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-[#1a1e2b] text-slate-300 hover:text-white font-bold text-xs transition-colors"
                title="Saves in-progress state to continue later"
              >
                Leave In-Progress
              </button>

              <button
                onClick={handleFinishWorkout}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] text-black font-black text-xs shadow-lg shadow-[#ccff00]/20 active:scale-95 transition-all"
              >
                <CheckCircle2 size={15} />
                <span>Finish Workout</span>
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
