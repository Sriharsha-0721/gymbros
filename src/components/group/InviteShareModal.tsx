import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { GymGroup } from '../../types';
import { Copy, Check, Share2, MessageCircle } from 'lucide-react';

interface InviteShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  group: GymGroup | null;
}

export const InviteShareModal: React.FC<InviteShareModalProps> = ({
  isOpen,
  onClose,
  group,
}) => {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!group) return null;

  const origin = window.location.origin;
  const inviteLink = `${origin}/?join=${group.invite_code}`;

  const copyCode = () => {
    navigator.clipboard.writeText(group.invite_code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const shareText = `Join my gym squad "${group.name}" on GYMCREW to coordinate workout times and stay consistent! Code: ${group.invite_code}`;
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    shareText + '\n' + inviteLink
  )}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Invite Squad Members"
      description={`Share the access code for "${group.name}".`}
    >
      <div className="space-y-4">
        {/* Invite Code Big Box */}
        <div className="p-4 rounded-2xl bg-[#161a25] border border-[#252c3e] text-center">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
            Squad Invite Code
          </span>
          <div className="text-3xl font-black font-mono tracking-widest text-[#ccff00] my-2 select-all">
            {group.invite_code}
          </div>
          <button
            onClick={copyCode}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-[#1f2537] hover:bg-[#272f44] text-xs font-bold text-slate-200 border border-[#2e374f] transition-colors"
          >
            {copiedCode ? (
              <>
                <Check size={13} className="text-[#ccff00]" />
                <span className="text-[#ccff00]">Code Copied!</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy Code</span>
              </>
            )}
          </button>
        </div>

        {/* Direct Link */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Direct Invitation Link
          </label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={inviteLink}
              className="flex-1 px-3 py-2 rounded-xl bg-[#161a25] border border-[#252c3e] text-slate-300 text-xs font-mono select-all focus:outline-none"
            />
            <Button variant="secondary" size="sm" onClick={copyLink}>
              {copiedLink ? <Check size={14} className="text-[#ccff00]" /> : <Copy size={14} />}
            </Button>
          </div>
        </div>

        {/* Share via WhatsApp */}
        <div className="pt-2">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-400 text-xs font-bold transition-colors"
          >
            <MessageCircle size={15} />
            <span>Share via WhatsApp / Group Chat</span>
          </a>
        </div>
      </div>
    </Modal>
  );
};
