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
  const [confirmSignOut, setConfirmSignOut] = useState(false);

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

  const handleSignOutClick = () => {
    if (!confirmSignOut) {
      setConfirmSignOut(true);
      return;
    }
    onSignOut();
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Lifter Profile & Account"
      description="Manage your account, training identity, and session settings."
    >
      <div className="space-y-4">
        {/* User Identity & Direct Sign Out Card */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3.5 sm:p-4 rounded-2xl bg-[#161a25] border border-[#23293c]">
          <div className="flex items-center gap-3 min-w-0">
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
                {user.email || 'No email attached'}
              </span>
              <span className="text-[11px] text-[#ccff00] font-semibold mt-0.5 inline-block">
                {isSupabaseConnected ? '● Cloud Account Synced' : '● Local Offline Demo'}
              </span>
            </div>
          </div>

          {/* Prominent Direct Mobile/Desktop Log Out Action */}
          <button
            type="button"
            onClick={handleSignOutClick}
            className={`flex items-center justify-center gap-2 px-4 py-2.5 min-h-[44px] rounded-xl font-black text-xs transition-all cursor-pointer touch-manipulation shrink-0 ${
              confirmSignOut
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 animate-pulse'
                : 'bg-rose-500/15 hover:bg-rose-500/25 active:bg-rose-500/35 border border-rose-500/30 text-rose-300'
            }`}
            title="Sign out of GYMCREW"
          >
            <LogOut size={16} />
            <span>{confirmSignOut ? 'Tap Again to Confirm Log Out' : 'Log Out'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-base sm:text-sm focus:outline-none focus:border-[#ccff00]"
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-base sm:text-sm lowercase focus:outline-none focus:border-[#ccff00]"
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
                  className={`py-2 rounded-xl text-xs font-bold border transition-all min-h-[44px] flex items-center justify-center cursor-pointer ${
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
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-white text-base sm:text-sm focus:outline-none focus:border-[#ccff00]"
            />
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-500/10 p-2.5 rounded-xl border border-emerald-500/20">
              <CheckCircle2 size={14} />
              <span>Profile successfully updated!</span>
            </div>
          )}

          <div className="pt-3 border-t border-[#1e2333] flex items-center justify-end gap-2.5">
            <Button type="button" variant="ghost" size="sm" onClick={onClose} className="min-h-[44px]">
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" isLoading={saving} className="min-h-[44px]">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </Modal>
  );
};
