import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { KeyRound } from 'lucide-react';

interface JoinGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onJoin: (inviteCode: string) => Promise<boolean>;
  initialCode?: string;
}

export const JoinGroupModal: React.FC<JoinGroupModalProps> = ({
  isOpen,
  onClose,
  onJoin,
  initialCode = '',
}) => {
  const [code, setCode] = useState(initialCode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (initialCode) {
      setCode(initialCode.trim().toUpperCase());
    }
  }, [initialCode, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    setError(null);

    const success = await onJoin(code);
    setLoading(false);

    if (success) {
      setCode('');
      onClose();
    } else {
      setError('Invalid invite code or group not found.');
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Join Gym Group"
      description="Enter the invite code shared by your gym bro."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <KeyRound size={13} className="text-[#ccff00]" />
            Invite Code
          </label>
          <input
            type="text"
            placeholder="e.g. BRO-6942 or IRON-9921"
            value={code}
            onChange={(e) => {
              setCode(e.target.value.toUpperCase());
              setError(null);
            }}
            required
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-base font-mono uppercase tracking-wider text-center focus:outline-none focus:border-[#ccff00]"
          />
          {error && <p className="text-xs text-rose-400 mt-1.5">{error}</p>}
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e2333]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Join Squad
          </Button>
        </div>
      </form>
    </Modal>
  );
};
