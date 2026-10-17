import React, { useState } from 'react';
import { useSmartPlan } from '../../context/SmartPlanContext';
import { useGroup } from '../../context/GroupContext';
import { OutdoorActivityType } from '../../types/smartPlan';
import { sanitizeNumericInput } from '../../lib/numberUtils';
import { 
  Activity, 
  Clock, 
  MapPin, 
  Users, 
  Check, 
  Sparkles,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

const ACTIVITIES: { id: OutdoorActivityType; label: string; icon: string; distanceRequired?: boolean }[] = [
  { id: 'running', label: 'Running / Jogging', icon: '🏃', distanceRequired: true },
  { id: 'walking', label: 'Brisk Walk / Incline', icon: '🚶', distanceRequired: true },
  { id: 'cycling', label: 'Cycling / Biking', icon: '🚴', distanceRequired: true },
  { id: 'swimming', label: 'Lap Swimming', icon: '🏊', distanceRequired: true },
  { id: 'hiking', label: 'Hiking & Trekking', icon: '🥾', distanceRequired: true },
  { id: 'football', label: 'Football / Soccer', icon: '⚽' },
  { id: 'cricket', label: 'Cricket Match', icon: '🏏' },
  { id: 'basketball', label: 'Basketball Game', icon: '🏀' },
  { id: 'badminton', label: 'Badminton Match', icon: '🏸' },
  { id: 'tennis', label: 'Tennis Match', icon: '🎾' },
  { id: 'active_recovery', label: 'Yoga & Mobility', icon: '🧘' },
  { id: 'other_sports', label: 'Other Outdoor Sport', icon: '🎯' },
];

export const LogActivityModal: React.FC<LogActivityModalProps> = ({
  isOpen,
  onClose,
  defaultDate,
}) => {
  const { logOutdoorActivity } = useSmartPlan();
  const { activeGroup } = useGroup();

  const todayKey = defaultDate || new Date().toISOString().split('T')[0];
  const [activityType, setActivityType] = useState<OutdoorActivityType>('running');
  const [activityDate, setActivityDate] = useState<string>(todayKey);
  const [durationMinutes, setDurationMinutes] = useState<string>('45');
  const [distanceKm, setDistanceKm] = useState<string>('5.0');
  const [notes, setNotes] = useState<string>('');
  const [shareWithCrew, setShareWithCrew] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedDuration = Number(durationMinutes) || 45;
      const parsedDistance = distanceKm ? parseFloat(distanceKm) : undefined;

      await logOutdoorActivity({
        group_id: shareWithCrew && activeGroup ? activeGroup.id : undefined,
        activity_date: activityDate,
        activity_type: activityType,
        duration_minutes: parsedDuration,
        distance_km: parsedDistance,
        notes: notes.trim() || undefined,
      });

      // Fire festive celebration
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.65 },
          colors: ['#06b6d4', '#ccff00', '#10b981'],
        });
      } catch (err) {
        // ignore
      }

      onClose();
    } catch (err) {
      console.error('Failed to log outdoor activity:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto overscroll-contain animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-[#0f1118] border border-[#232838] rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90dvh] my-auto overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Header (shrink-0) */}
        <div className="px-4 sm:px-5 py-3.5 border-b border-[#1b1f2b] flex items-center justify-between bg-[#131620] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
              <Activity size={16} />
            </div>
            <div className="min-w-0">
              <h2 className="text-base font-extrabold text-white font-heading truncate">
                Log Activity Day / Outdoor Sport
              </h2>
              <p className="text-[11px] text-slate-400 truncate">
                Track cardio and sports outside the gym
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-10 h-10 -mr-2 rounded-xl flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/5 transition-colors shrink-0"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body (flex-1 min-h-0) */}
        <form id="activity-log-form" onSubmit={handleSubmit} className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs text-slate-300">
          {/* Activity Grid Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
              Select Activity Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {ACTIVITIES.map((act) => {
                const isSelected = activityType === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActivityType(act.id)}
                    className={`min-h-[44px] px-3 py-2 rounded-xl border text-left flex items-center gap-2 transition-all min-w-0 ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-white font-extrabold shadow-sm'
                        : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base shrink-0">{act.icon}</span>
                    <span className="truncate text-xs min-w-0">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Duration (Responsive 1-col on small mobile, 2-col on sm+) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
                Date
              </label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                required
                className="w-full h-11 bg-[#141722] border border-[#202536] rounded-xl px-3 py-2 text-white font-mono text-base sm:text-xs focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
                Duration (Minutes)
              </label>
              <div className="flex items-center gap-2 bg-[#141722] border border-[#202536] rounded-xl px-3 h-11">
                <Clock size={15} className="text-cyan-400 shrink-0" />
                <input
                  type="number"
                  min="5"
                  max="600"
                  placeholder="45"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(sanitizeNumericInput(e.target.value))}
                  required
                  className="w-full bg-transparent text-white font-bold text-base sm:text-xs focus:outline-none min-w-0"
                />
                <span className="text-slate-400 text-xs shrink-0 font-semibold">mins</span>
              </div>
            </div>
          </div>

          {/* Distance (Optional / Activity Dependent) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider block flex items-center justify-between text-[10px]">
              <span>Distance (Kilometers)</span>
              <span className="text-slate-500 font-normal">Optional</span>
            </label>
            <div className="flex items-center gap-2 bg-[#141722] border border-[#202536] rounded-xl px-3 h-11">
              <MapPin size={15} className="text-cyan-400 shrink-0" />
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 5.0"
                value={distanceKm}
                onChange={(e) => setDistanceKm(sanitizeNumericInput(e.target.value))}
                className="w-full bg-transparent text-white font-bold text-base sm:text-xs focus:outline-none min-w-0"
              />
              <span className="text-slate-400 text-xs shrink-0 font-semibold">km</span>
            </div>
          </div>

          {/* Activity Notes */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider block text-[10px]">
              Notes / Route / Effort
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Morning trail run in the park, moderate pace"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#141722] border border-[#202536] rounded-xl px-3 py-2 text-white placeholder-slate-500 text-base sm:text-xs focus:outline-none focus:border-cyan-500 resize-none"
            />
          </div>

          {/* Share with Crew Toggle */}
          {activeGroup && (
            <div 
              onClick={() => setShareWithCrew(!shareWithCrew)}
              className="p-3 rounded-xl bg-[#141722] border border-[#202536] flex items-center justify-between cursor-pointer hover:border-[#2d344a] transition-all min-h-[44px]"
            >
              <div className="flex items-center gap-2 min-w-0 pr-2">
                <Users size={16} className="text-[#ccff00] shrink-0" />
                <div className="min-w-0">
                  <span className="font-bold text-white block text-xs truncate">Share with {activeGroup.name}</span>
                  <span className="text-[10px] text-slate-400 block truncate">Inspires your squad and adds to crew activities</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all shrink-0 ${
                shareWithCrew 
                  ? 'bg-[#ccff00] border-[#ccff00] text-black font-bold' 
                  : 'bg-[#1b202e] border-[#293246]'
              }`}>
                {shareWithCrew && <Check size={13} strokeWidth={3} />}
              </div>
            </div>
          )}
        </form>

        {/* Pinned Non-Collapsing Footer (shrink-0) */}
        <div className="px-4 sm:px-5 py-3 border-t border-[#1b1f2b] bg-[#131620] flex items-center justify-between gap-3 shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={onClose}
            className="h-11 px-4 rounded-xl bg-[#1a1e2b] text-slate-300 hover:text-white font-bold text-xs transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="activity-log-form"
            disabled={isSubmitting}
            className="h-11 flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold text-xs shadow-lg shadow-cyan-400/20 active:scale-95 transition-all disabled:opacity-50"
          >
            <Sparkles size={15} />
            <span>{isSubmitting ? 'Logging...' : 'Log Activity Day'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
