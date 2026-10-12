import React from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { GymGroup } from '../../types';
import { Users, Check, Plus, LogIn } from 'lucide-react';

interface GroupSwitcherModalProps {
  isOpen: boolean;
  onClose: () => void;
  groups: GymGroup[];
  activeGroupId: string;
  onSelectGroup: (id: string) => void;
  onOpenCreateGroup: () => void;
  onOpenJoinGroup: () => void;
}

export const GroupSwitcherModal: React.FC<GroupSwitcherModalProps> = ({
  isOpen,
  onClose,
  groups,
  activeGroupId,
  onSelectGroup,
  onOpenCreateGroup,
  onOpenJoinGroup,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Your Gym Squads"
      description="Switch between circles or add a new gym group."
    >
      <div className="space-y-3">
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {groups.map((g) => {
            const isActive = g.id === activeGroupId;
            return (
              <button
                key={g.id}
                onClick={() => {
                  onSelectGroup(g.id);
                  onClose();
                }}
                className={`w-full flex items-center justify-between p-3 rounded-xl border text-left transition-all ${
                  isActive
                    ? 'bg-[#181d2a] border-[#ccff00]/50'
                    : 'bg-[#151824] border-[#22283a] hover:bg-[#1a1f2e]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2 rounded-xl ${
                      isActive
                        ? 'bg-[#ccff00]/15 text-[#ccff00]'
                        : 'bg-[#1c2232] text-slate-400'
                    }`}
                  >
                    <Users size={16} />
                  </div>
                  <div>
                    <span className="text-sm font-bold text-white block">{g.name}</span>
                    {g.description && (
                      <span className="text-xs text-slate-400 block truncate max-w-[220px]">
                        {g.description}
                      </span>
                    )}
                  </div>
                </div>

                {isActive && <Check size={16} className="text-[#ccff00]" />}
              </button>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[#1e2333] flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            className="flex-1"
            leftIcon={<Plus size={14} />}
            onClick={() => {
              onClose();
              onOpenCreateGroup();
            }}
          >
            Create Group
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            leftIcon={<LogIn size={14} />}
            onClick={() => {
              onClose();
              onOpenJoinGroup();
            }}
          >
            Join Group
          </Button>
        </div>
      </div>
    </Modal>
  );
};
