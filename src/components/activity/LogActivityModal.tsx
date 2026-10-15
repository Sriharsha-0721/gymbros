import React, { useState } from 'react';
import { useSmartPlan } from '../../context/SmartPlanContext';
import { useGroup } from '../../context/GroupContext';
import { OutdoorActivityType } from '../../types/smartPlan';
import { 
  Activity, 
  Clock, 
  MapPin, 
  FileText, 
  Users, 
  Check, 
  Sparkles,
  Heart
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LogActivityModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultDate?: string;
}

const ACTIVITIES: { id: OutdoorActivityType; label: string; icon: string; distanceRequired?: boolean }[] = [
  { id: 'running', label: 'Running / Jogging', icon: '🏃', distanceRequired: true },
  { id: 'walking', label: 'Brisk Walking / Incline', icon: '🚶', distanceRequired: true },
  { id: 'cycling', label: 'Cycling / Road Biking', icon: '🚴', distanceRequired: true },
  { id: 'swimming', label: 'Lap Swimming', icon: '🏊', distanceRequired: true },
  { id: 'hiking', label: 'Hiking & Trekking', icon: '🥾', distanceRequired: true },
  { id: 'football', label: 'Football / Soccer Match', icon: '⚽' },
  { id: 'cricket', label: 'Cricket Session', icon: '🏏' },
  { id: 'basketball', label: 'Basketball Game', icon: '🏀' },
  { id: 'badminton', label: 'Badminton Match', icon: '🏸' },
  { id: 'tennis', label: 'Tennis Match', icon: '🎾' },
  { id: 'active_recovery', label: 'Active Recovery Yoga / Mobility', icon: '🧘' },
  { id: 'other_sports', label: 'Other Outdoor Recreational Sport', icon: '🎯' },
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
  const [durationMinutes, setDurationMinutes] = useState<number>(45);
  const [distanceKm, setDistanceKm] = useState<string>('5.0');
  const [notes, setNotes] = useState<string>('');
  const [shareWithCrew, setShareWithCrew] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const currentActivityConfig = ACTIVITIES.find((a) => a.id === activityType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const parsedDistance = distanceKm ? parseFloat(distanceKm) : undefined;
      await logOutdoorActivity({
        group_id: shareWithCrew && activeGroup ? activeGroup.id : undefined,
        activity_date: activityDate,
        activity_type: activityType,
        duration_minutes: Number(durationMinutes),
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-lg bg-[#0f1118] border border-[#232838] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1b1f2b] flex items-center justify-between bg-[#131620]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Activity size={16} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white font-heading">
                Log Activity Day / Outdoor Sport
              </h2>
              <p className="text-xs text-slate-400">
                Track cardio, team sports, and active recovery outside the gym
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300">
          {/* Activity Grid Selector */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider block">
              Activity Type
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {ACTIVITIES.map((act) => {
                const isSelected = activityType === act.id;
                return (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setActivityType(act.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-cyan-500/15 border-cyan-500 text-white font-extrabold shadow-sm'
                        : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                    }`}
                  >
                    <span className="text-base">{act.icon}</span>
                    <span className="truncate">{act.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Date & Duration */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">
                Date
              </label>
              <input
                type="date"
                value={activityDate}
                onChange={(e) => setActivityDate(e.target.value)}
                required
                className="w-full bg-[#141722] border border-[#202536] rounded-xl px-3 py-2 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-slate-300 uppercase tracking-wider block">
                Duration (Minutes)
              </label>
              <div className="flex items-center gap-2 bg-[#141722] border border-[#202536] rounded-xl px-3 py-2">
                <Clock size={14} className="text-cyan-400 shrink-0" />
                <input
                  type="number"
                  min="5"
                  max="600"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  required
                  className="w-full bg-transparent text-white font-bold focus:outline-none"
                />
                <span className="text-slate-500">mins</span>
              </div>
            </div>
          </div>

          {/* Distance (Optional / Activity Dependent) */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider block flex items-center justify-between">
              <span>Distance (Kilometers)</span>
              <span className="text-slate-500 text-[10px] font-normal">Optional</span>
            </label>
            <div className="flex items-center gap-2 bg-[#141722] border border-[#202536] rounded-xl px-3 py-2">
              <MapPin size={14} className="text-cyan-400 shrink-0" />
              <input
                type="number"
                step="0.1"
                min="0"
                placeholder="e.g. 5.5"
                value={distanceKm}
                onChange={(e) => setDistanceKm(e.target.value)}
                className="w-full bg-transparent text-white font-bold focus:outline-none"
              />
              <span className="text-slate-500">km</span>
            </div>
          </div>

          {/* Activity Notes */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 uppercase tracking-wider block">
              Notes / Route / Effort
            </label>
            <textarea
              rows={2}
              placeholder="e.g. Morning trail run in the park, moderate pace"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-[#141722] border border-[#202536] rounded-xl px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Share with Crew Toggle */}
          {activeGroup && (
            <div 
              onClick={() => setShareWithCrew(!shareWithCrew)}
              className="p-3 rounded-xl bg-[#141722] border border-[#202536] flex items-center justify-between cursor-pointer hover:border-[#2d344a] transition-all"
            >
              <div className="flex items-center gap-2">
                <Users size={15} className="text-[#ccff00]" />
                <div>
                  <span className="font-bold text-white block">Share with {activeGroup.name}</span>
                  <span className="text-[10px] text-slate-400">Inspires your crew and adds to weekly squad activity count</span>
                </div>
              </div>
              <div className={`w-5 h-5 rounded-md flex items-center justify-center border transition-all ${
                shareWithCrew 
                  ? 'bg-[#ccff00] border-[#ccff00] text-black font-bold' 
                  : 'bg-[#1b202e] border-[#293246]'
              }`}>
                {shareWithCrew && <Check size={13} strokeWidth={3} />}
              </div>
            </div>
          )}

          {/* Submit Buttons */}
          <div className="pt-2 flex items-center justify-between border-t border-[#1b1f2b]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#1a1e2b] text-slate-300 hover:text-white font-bold transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-extrabold shadow-lg shadow-cyan-400/20 transition-all disabled:opacity-50"
            >
              <Sparkles size={15} />
              <span>{isSubmitting ? 'Logging...' : 'Log Activity Day'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
