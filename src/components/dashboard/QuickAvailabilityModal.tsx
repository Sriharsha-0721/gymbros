import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { GymStatus } from '../../types';
import { Sun, Sunset, Moon, Coffee, HelpCircle, Clock, FileText } from 'lucide-react';
import { formatFriendlyDate, getTodayKey } from '../../lib/dateUtils';

interface QuickAvailabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  dateKey?: string;
  initialStatus?: GymStatus;
  initialTime?: string;
  initialNotes?: string;
  onSave: (dateKey: string, status: GymStatus, preferredTime?: string, notes?: string) => Promise<boolean>;
}

export const QuickAvailabilityModal: React.FC<QuickAvailabilityModalProps> = ({
  isOpen,
  onClose,
  dateKey = getTodayKey(),
  initialStatus = 'morning',
  initialTime = '',
  initialNotes = '',
  onSave,
}) => {
  const [status, setStatus] = useState<GymStatus>(initialStatus);
  const [preferredTime, setPreferredTime] = useState(initialTime);
  const [notes, setNotes] = useState(initialNotes);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setStatus(initialStatus || 'morning');
      setPreferredTime(initialTime || '');
      setNotes(initialNotes || '');
    }
  }, [isOpen, initialStatus, initialTime, initialNotes]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    await onSave(
      dateKey,
      status,
      status === 'rest' || status === 'undecided' ? undefined : preferredTime.trim() || undefined,
      notes.trim() || undefined
    );
    setSaving(false);
    onClose();
  };

  const statusOptions: { id: GymStatus; label: string; desc: string; icon: any; color: string; activeBorder: string }[] = [
    {
      id: 'morning',
      label: 'Morning',
      desc: '5:00 AM – 11:59 AM',
      icon: Sun,
      color: 'text-amber-400',
      activeBorder: 'border-amber-500/50 bg-amber-500/10 text-white',
    },
    {
      id: 'evening',
      label: 'Evening',
      desc: '12:00 PM – 7:59 PM',
      icon: Sunset,
      color: 'text-cyan-400',
      activeBorder: 'border-cyan-500/50 bg-cyan-500/10 text-white',
    },
    {
      id: 'night',
      label: 'Night',
      desc: '8:00 PM – Late Night',
      icon: Moon,
      color: 'text-purple-400',
      activeBorder: 'border-purple-500/50 bg-purple-500/10 text-white',
    },
    {
      id: 'rest',
      label: 'Rest Day',
      desc: 'Muscle Recovery & Recharge',
      icon: Coffee,
      color: 'text-emerald-400',
      activeBorder: 'border-emerald-500/50 bg-emerald-500/10 text-white',
    },
    {
      id: 'undecided',
      label: 'Not Decided',
      desc: 'Keep options open',
      icon: HelpCircle,
      color: 'text-slate-400',
      activeBorder: 'border-slate-500/50 bg-slate-500/10 text-white',
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Plan for ${formatFriendlyDate(dateKey)}`}
      description="Choose your workout window and coordinate with the squad."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Status Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {statusOptions.map((opt) => {
            const Icon = opt.icon;
            const isSelected = status === opt.id;
            return (
              <button
                type="button"
                key={opt.id}
                onClick={() => setStatus(opt.id)}
                className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? opt.activeBorder
                    : 'bg-[#151822] border-[#222838] text-slate-300 hover:bg-[#1a1f2c]'
                }`}
              >
                <div className={`mt-0.5 p-1.5 rounded-lg bg-[#0d0f15] ${opt.color}`}>
                  <Icon size={16} />
                </div>
                <div>
                  <div className="font-bold text-sm text-white">{opt.label}</div>
                  <div className="text-[11px] text-slate-400">{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Optional Time & Notes (Shown if not Rest / Not Decided) */}
        {status !== 'rest' && status !== 'undecided' && (
          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Clock size={13} className="text-[#ccff00]" />
                Preferred Time (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. 06:30 AM or 18:00"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ccff00] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <FileText size={13} className="text-[#ccff00]" />
                Workout Focus / Note (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Chest & Triceps, Leg Day, Going for Bench PR"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                maxLength={60}
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-[#ccff00] transition-colors"
              />
            </div>
          </div>
        )}

        {status === 'rest' && (
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <FileText size={13} className="text-emerald-400" />
              Recovery Note (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. Sore hamstrings, mobility & sauna day"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={60}
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
            />
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-[#1e2333]">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" size="md" isLoading={saving}>
            Save Availability
          </Button>
        </div>
      </form>
    </Modal>
  );
};
