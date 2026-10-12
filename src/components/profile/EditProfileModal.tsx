import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Avatar } from '../common/Avatar';
import { UserProfile } from '../../types';
import { User, AtSign, FileText, Target, LogOut, CheckCircle2 } from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: UserProfile | null;
  onUpdate: (updates: Partial<UserProfile>) => Promise<boolean>;
  onSignOut: () => void;
  isSupabaseConnected: boolean;
}

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
  user,
  onUpdate,
  onSignOut,
  isSupabaseConnected,
}) => {
  const [displayName, setDisplayName] = useState(user?.display_name || '');
  const [username, setUsername] = useState(user?.username || '');
  const [bio, setBio] = useState(user?.bio || '');
  const [weeklyGoal, setWeeklyGoal] = useState(user?.weekly_goal_days || 4);
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!user) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSavedSuccess(false);

    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');

    const ok = await onUpdate({
      display_name: displayName.trim(),
      username: cleanUsername,
      bio: bio.trim(),
      weekly_goal_days: Number(weeklyGoal),
    });

    setSaving(false);
    if (ok) {
      setSavedSuccess(true);
      setTimeout(() => {
        setSavedSuccess(false);
        onClose();
      }, 800);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="User Profile"
      description="Update your lifter identity and weekly training target."
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* User Avatar & Info Header */}
        <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#161a25] border border-[#23293c]">
          <Avatar
            src={user.avatar_url}
            name={user.display_name || user.username}
            size="lg"
          />
          <div className="min-w-0 flex-1">
            <span className="text-sm font-bold text-white block truncate">
              {user.display_name || user.username}
            </span>
            <span className="text-xs text-slate-400 block truncate">
              {user.email}
            </span>
            <span className="text-[11px] text-[#ccff00] font-semibold mt-0.5 inline-block">
              {isSupabaseConnected ? '● Cloud Account Synced' : '● Local Demo Mode'}
            </span>
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <User size={13} className="text-[#ccff00]" />
            Display Name
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            required
            maxLength={35}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-sm focus:outline-none focus:border-[#ccff00]"
          />
        </div>

        {/* Username */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <AtSign size={13} className="text-[#ccff00]" />
            Unique Username
          </label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            maxLength={25}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-sm lowercase focus:outline-none focus:border-[#ccff00]"
          />
        </div>

        {/* Weekly Goal Days */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <Target size={13} className="text-[#ccff00]" />
            Weekly Workout Target
          </label>
          <div className="grid grid-cols-5 gap-2">
            {[3, 4, 5, 6, 7].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => setWeeklyGoal(days)}
                className={`py-2 rounded-xl text-xs font-bold border transition-all ${
                  weeklyGoal === days
                    ? 'bg-[#ccff00] text-[#090a0f] border-[#ccff00]'
                    : 'bg-[#161a25] text-slate-300 border-[#262c3e] hover:bg-[#1f2434]'
                }`}
              >
                {days}d
              </button>
            ))}
          </div>
        </div>

        {/* Bio / Motivation */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
            <FileText size={13} className="text-[#ccff00]" />
            Bio / Fitness Motto
          </label>
          <input
            type="text"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="e.g. Chasing 405 squat & 6 AM discipline"
            maxLength={75}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-sm focus:outline-none focus:border-[#ccff00]"
          />
        </div>

        {savedSuccess && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
            <CheckCircle2 size={14} />
            <span>Profile successfully updated!</span>
          </div>
        )}

        <div className="pt-3 border-t border-[#1e2333] flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              onSignOut();
              onClose();
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 hover:text-rose-300 transition-colors"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>

          <div className="flex items-center gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={saving}>
              Save Profile
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
