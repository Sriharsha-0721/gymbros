import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Dumbbell, Clock, Flame, Sparkles } from 'lucide-react';
import { getTodayKey, formatFriendlyDate } from '../../lib/dateUtils';
import { sanitizeNumericInput } from '../../lib/numberUtils';
import confetti from 'canvas-confetti';

interface WorkoutCheckInModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateKey?: string;
  defaultWorkoutType?: string;
  onComplete: (data: {
    date: string;
    workout_type: string;
    duration_minutes: number;
    notes?: string;
    intensity: 'light' | 'moderate' | 'heavy' | 'pr_beast';
  }) => Promise<boolean>;
}

export const WorkoutCheckInModal: React.FC<WorkoutCheckInModalProps> = ({
  isOpen,
  onClose,
  dateKey = getTodayKey(),
  defaultWorkoutType = 'Upper Body & Arms',
  onComplete,
}) => {
  const [workoutType, setWorkoutType] = useState(defaultWorkoutType);
  const [duration, setDuration] = useState('60');
  const [intensity, setIntensity] = useState<'light' | 'moderate' | 'heavy' | 'pr_beast'>('heavy');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const presetWorkouts = [
    'Push Day',
    'Pull Day',
    'Leg Day',
    'Upper Body',
    'Full Body Compound',
    'Shoulders & Arms',
    'Cardio & Core',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const success = await onComplete({
      date: dateKey,
      workout_type: workoutType.trim() || 'Gym Workout',
      duration_minutes: Number(duration) || 60,
      notes: notes.trim() || undefined,
      intensity,
    });

    if (success) {
      // Trigger festive celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ccff00', '#10b981', '#38bdf8', '#ffffff'],
        });
      } catch (err) {
        // Fallback gracefully
      }
    }

    setSubmitting(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Workout Check-In"
      description={`Log your completed session for ${formatFriendlyDate(dateKey)}.`}
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Workout Category presets */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-2 flex items-center gap-1.5">
            <Dumbbell size={13} className="text-[#ccff00]" />
            Workout Focus
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2.5">
            {presetWorkouts.map((pw) => (
              <button
                type="button"
                key={pw}
                onClick={() => setWorkoutType(pw)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                  workoutType === pw
                    ? 'bg-[#ccff00] text-[#090a0f]'
                    : 'bg-[#181c28] text-slate-300 border border-[#23283a] hover:bg-[#202538]'
                }`}
              >
                {pw}
              </button>
            ))}
          </div>
          <input
            type="text"
            placeholder="Or type custom workout title"
            value={workoutType}
            onChange={(e) => setWorkoutType(e.target.value)}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-sm focus:outline-none focus:border-[#ccff00]"
          />
        </div>

        {/* Duration & Intensity */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Clock size={13} className="text-[#ccff00]" />
              Duration (mins)
            </label>
            <input
              type="number"
              min="5"
              max="300"
              value={duration}
              onChange={(e) => setDuration(sanitizeNumericInput(e.target.value))}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-base sm:text-sm focus:outline-none focus:border-[#ccff00]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Flame size={13} className="text-[#ccff00]" />
              Intensity
            </label>
            <select
              value={intensity}
              onChange={(e) => setIntensity(e.target.value as any)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-sm focus:outline-none focus:border-[#ccff00]"
            >
              <option value="light">Light Recovery</option>
              <option value="moderate">Moderate Solid</option>
              <option value="heavy">Heavy Work</option>
              <option value="pr_beast">PR Beast Mode 🔥</option>
            </select>
          </div>
        </div>

        {/* Notes & PRs */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Sparkles size={13} className="text-[#ccff00]" />
            Notes & Lifts (Optional)
          </label>
          <textarea
            placeholder="e.g. Hit 225 lbs bench press for 5 reps! Energy was high."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={2}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-sm focus:outline-none focus:border-[#ccff00]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e2333]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={submitting}>
            Log Workout & Celebrate
          </Button>
        </div>
      </form>
    </Modal>
  );
};
