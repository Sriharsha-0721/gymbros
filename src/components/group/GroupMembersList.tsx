import React, { useState } from 'react';
import { GroupMember, GymGroup, UserProfile } from '../../types';
import { Card } from '../common/Card';
import { Avatar } from '../common/Avatar';
import { Button } from '../common/Button';
import {
  Users,
  Copy,
  Check,
  Share2,
  Plus,
  LogIn,
  LogOut,
  Shield,
  Target,
  Sparkles,
} from 'lucide-react';

interface GroupMembersListProps {
  group: GymGroup | null;
  members: GroupMember[];
  currentUser: UserProfile;
  onOpenCreateGroup: () => void;
  onOpenJoinGroup: () => void;
  onOpenInviteModal: () => void;
  onLeaveGroup: (groupId: string) => void;
}

export const GroupMembersList: React.FC<GroupMembersListProps> = ({
  group,
  members,
  currentUser,
  onOpenCreateGroup,
  onOpenJoinGroup,
  onOpenInviteModal,
  onLeaveGroup,
}) => {
  const [copied, setCopied] = useState(false);

  if (!group) {
    return (
      <Card className="p-8 text-center bg-[#12141c]/90 border-[#1f2433]">
        <Users className="mx-auto text-slate-600 mb-3" size={36} />
        <h3 className="text-lg font-bold text-white">No Gym Group Selected</h3>
        <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
          Create your private gym squad or join an existing group with an invite code.
        </p>
        <div className="mt-4 flex items-center justify-center gap-2.5">
          <Button variant="primary" size="sm" onClick={onOpenCreateGroup}>
            Create Group
          </Button>
          <Button variant="secondary" size="sm" onClick={onOpenJoinGroup}>
            Join with Code
          </Button>
        </div>
      </Card>
    );
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(group.invite_code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isCurrentUserAdmin = members.some(
    (m) => m.group_id === group.id && m.user_id === currentUser.id && m.role === 'admin'
  );

  return (
    <div className="space-y-4">
      {/* Group Banner Card */}
      <Card className="p-5 sm:p-6 bg-gradient-to-br from-[#151825] to-[#0e1017] border-[#22273a] relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-[#ccff00] uppercase tracking-wider">
                Private Gym Squad
              </span>
              <span className="text-xs text-slate-500">•</span>
              <span className="text-xs text-slate-400">
                {members.length} Bro{members.length === 1 ? '' : 's'} Active
              </span>
            </div>

            <h2 className="text-2xl font-black text-white font-heading mt-1">
              {group.name}
            </h2>

            {group.description && (
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                {group.description}
              </p>
            )}
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b2030] hover:bg-[#232a3f] text-xs font-bold text-slate-200 border border-[#2b334a] transition-colors"
            >
              {copied ? (
                <>
                  <Check size={13} className="text-[#ccff00]" />
                  <span className="text-[#ccff00]">Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={13} className="text-slate-400" />
                  <span>Code: {group.invite_code}</span>
                </>
              )}
            </button>

            <button
              onClick={onOpenInviteModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#ccff00] text-[#090a0f] text-xs font-extrabold hover:bg-[#d8ff33] transition-colors"
            >
              <Share2 size={13} />
              <span>Invite</span>
            </button>
          </div>
        </div>

        {/* Group Management Toolbar */}
        <div className="mt-4 pt-4 border-t border-[#1c2233] flex items-center justify-between gap-2 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenCreateGroup}
              className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <Plus size={13} className="text-[#ccff00]" />
              <span>New Group</span>
            </button>
            <span className="text-slate-600">•</span>
            <button
              onClick={onOpenJoinGroup}
              className="flex items-center gap-1 text-xs font-semibold text-slate-300 hover:text-white transition-colors"
            >
              <LogIn size={13} className="text-cyan-400" />
              <span>Join Another</span>
            </button>
          </div>

          <button
            onClick={() => onLeaveGroup(group.id)}
            className="flex items-center gap-1 text-xs font-semibold text-rose-400/80 hover:text-rose-400 transition-colors"
          >
            <LogOut size={13} />
            <span>Leave Group</span>
          </button>
        </div>
      </Card>

      {/* Members Grid / List */}
      <Card className="p-5 bg-[#12141c]/90 border-[#1f2433]">
        <div className="flex items-center justify-between pb-3.5 border-b border-[#1b202e]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#181d2a] text-slate-300">
              <Users size={18} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white font-heading">
                Squad Members ({members.length})
              </h3>
              <p className="text-xs text-slate-400">Teammates lifting together</p>
            </div>
          </div>
        </div>

        <div className="pt-3.5 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {members.map((member) => {
            const isMe = member.user_id === currentUser.id;
            const profile = member.profile || (isMe ? currentUser : undefined);
            const displayName = profile?.display_name || (isMe ? currentUser.display_name : 'Gym Bro');
            const username = profile?.username || (isMe ? currentUser.username : 'user');

            return (
              <div
                key={member.id}
                className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                  isMe
                    ? 'bg-[#181d2a] border-[#ccff00]/40 shadow-sm'
                    : 'bg-[#151824] border-[#22283a] hover:border-[#2e374f]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Avatar
                    src={profile?.avatar_url || (isMe ? currentUser.avatar_url : undefined)}
                    name={displayName}
                    size="md"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-bold text-white">
                        {displayName}
                      </span>
                      {isMe && (
                        <span className="px-1.5 py-0.2 rounded bg-[#ccff00] text-[#090a0f] text-[9px] font-black uppercase">
                          YOU
                        </span>
                      )}
                      {member.role === 'admin' && (
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.2 rounded border border-amber-500/20">
                          <Shield size={10} />
                          Admin
                        </span>
                      )}
                    </div>

                    <span className="text-xs text-slate-400 block">
                      @{username}
                    </span>

                    {profile?.bio && (
                      <p className="text-[11px] text-slate-400 mt-1 italic line-clamp-1">
                        "{profile.bio}"
                      </p>
                    )}
                  </div>
                </div>

                {profile?.weekly_goal_days && (
                  <div className="text-right shrink-0">
                    <span className="text-[10px] font-bold text-slate-400 block uppercase">
                      Goal
                    </span>
                    <span className="text-xs font-bold text-[#ccff00]">
                      {profile.weekly_goal_days}d / wk
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
};
