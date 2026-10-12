import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { AtSign, User, Sparkles } from 'lucide-react';

interface OnboardingModalProps {
  isOpen: boolean;
  onComplete: (username: string, displayName: string) => Promise<boolean>;
  initialDisplayName?: string;
  error?: string | null;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({
  isOpen,
  onComplete,
  initialDisplayName = '',
  error,
}) => {
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState(initialDisplayName);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setSubmitting(true);
    await onComplete(username, displayName || username);
    setSubmitting(false);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}} // Non-dismissible until username is set
      title="Welcome to GymBros! 💪"
      description="Select a unique username so your gym friends can recognize you."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <AtSign size={13} className="text-[#ccff00]" />
            Choose Your Username
          </label>
          <input
            type="text"
            placeholder="e.g. iron_beast, harsha_lifts"
            value={username}
            onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
            required
            minLength={3}
            maxLength={25}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-sm lowercase focus:outline-none focus:border-[#ccff00]"
          />
          <span className="text-[11px] text-slate-400 mt-1 block">
            Letters, numbers, and underscores only. Must be unique.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <User size={13} className="text-[#ccff00]" />
            Display Name
          </label>
          <input
            type="text"
            placeholder="e.g. Sriharsha B."
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            maxLength={35}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-sm focus:outline-none focus:border-[#ccff00]"
          />
        </div>

        {error && (
          <p className="text-xs text-rose-400 font-semibold bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
            {error}
          </p>
        )}

        <div className="pt-2">
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            isLoading={submitting}
            leftIcon={<Sparkles size={16} />}
          >
            Lock In & Start Lifting
          </Button>
        </div>
      </form>
    </Modal>
  );
};
