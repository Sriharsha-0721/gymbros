import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Users, MapPin, Sparkles } from 'lucide-react';
import { GymGroup } from '../../types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, description?: string) => Promise<GymGroup | null>;
}

export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreate,
}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    await onCreate(name, description);
    setLoading(false);
    setName('');
    setDescription('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Private Gym Group"
      description="Start a private circle for your gym buddies."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Users size={13} className="text-[#ccff00]" />
            Group Name
          </label>
          <input
            type="text"
            placeholder="e.g. Morning Gym Crew, Iron Brothers"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={40}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-sm focus:outline-none focus:border-[#ccff00]"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <MapPin size={13} className="text-[#ccff00]" />
            Gym Location / Vibe (Optional)
          </label>
          <input
            type="text"
            placeholder="e.g. Gold's Gym Downtown • 6:30 AM crew"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={80}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-sm focus:outline-none focus:border-[#ccff00]"
          />
        </div>

        <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#1e2333]">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={loading}>
            Create Group
          </Button>
        </div>
      </form>
    </Modal>
  );
};
