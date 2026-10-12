import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, KeyRound, X, ChevronRight, ShieldCheck } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';

export const AuthPromptBanner: React.FC = () => {
  const { isConfigured, signInWithGoogle } = useAuth();
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  if (isConfigured || dismissed) return null;

  return (
    <>
      <div className="bg-gradient-to-r from-[#171b26] via-[#1b2234] to-[#171b26] border-b border-[#242e47] px-4 py-2.5 text-xs">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ccff00]/15 text-[#ccff00] font-extrabold text-[10px] shrink-0 border border-[#ccff00]/30">
              <Sparkles size={11} />
              DEMO MODE ACTIVE
            </span>
            <p className="text-slate-300 truncate font-medium">
              You are exploring GYMCREW with live local state! All buttons, scheduling, and streak tracking are fully interactive.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setShowConfigModal(true)}
              className="font-bold text-[#ccff00] hover:underline flex items-center gap-1"
            >
              <span>Setup Supabase</span>
              <ChevronRight size={13} />
            </button>
            <button
              onClick={() => setDismissed(true)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Supabase & Google OAuth Instructions Modal */}
      <Modal
        isOpen={showConfigModal}
        onClose={() => setShowConfigModal(false)}
        title="Connect Supabase & Google OAuth"
        description="Switch from local Demo mode to free cloud database & authentication."
        maxWidth="lg"
      >
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-[#161a25] border border-[#242c3e] space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-sm">
              <ShieldCheck className="text-[#ccff00]" size={16} />
              <span>Free Setup Steps</span>
            </div>
            <ol className="list-decimal list-inside space-y-1.5 text-slate-300 leading-relaxed">
              <li>Create a free project at <strong className="text-white">supabase.com</strong>.</li>
              <li>Run the PostgreSQL migration schema located in <code className="text-[#ccff00]">supabase/schema.sql</code>.</li>
              <li>In Supabase <strong className="text-white">Auth → Providers</strong>, enable Google.</li>
              <li>Create a Web OAuth client in <strong className="text-white">console.cloud.google.com</strong> with redirect URI to Supabase.</li>
              <li>Copy your Supabase Project URL and anon key into <code className="text-[#ccff00]">.env.local</code>.</li>
            </ol>
          </div>

          <div className="p-3 rounded-xl bg-[#11141c] border border-[#1e2333]">
            <span className="font-mono text-slate-400 block mb-1"># File: .env.local</span>
            <pre className="font-mono text-[11px] text-[#ccff00] bg-black/40 p-2.5 rounded-lg overflow-x-auto">
{`VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-actual-anon-key
VITE_APP_URL=http://localhost:5173`}
            </pre>
          </div>

          <div className="flex justify-end pt-2">
            <Button variant="primary" size="sm" onClick={() => setShowConfigModal(false)}>
              Got it!
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
};
