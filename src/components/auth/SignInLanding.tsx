import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Dumbbell, Users, Calendar, Flame, Shield, ArrowRight, Loader2 } from 'lucide-react';
import { INITIAL_USER } from '../../lib/mockData';

interface SignInLandingProps {
  onContinueDemo?: () => void;
}

export const SignInLanding: React.FC<SignInLandingProps> = () => {
  const { signInWithGoogle, error, enableDemoMode } = useAuth();
  const [signingIn, setSigningIn] = useState(false);
  const [inviteCode, setInviteCode] = useState<string>('');

  React.useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('join') || localStorage.getItem('pending_join_code');
    if (code) {
      const clean = code.trim().toUpperCase();
      setInviteCode(clean);
      localStorage.setItem('pending_join_code', clean);
    }
  }, []);

  const handleGoogleSignIn = async () => {
    setSigningIn(true);
    try {
      await signInWithGoogle();
    } catch {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col justify-between selection:bg-[#ccff00] selection:text-black">
      {/* Top Brand Header */}
      <header className="max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#12141c] border border-[#232838] p-0.5 flex items-center justify-center overflow-hidden">
            <img src="/gym-icon.png" alt="GYMCREW Emblem" className="w-9 h-9 rounded-lg select-none object-cover" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-white font-heading">
              GYM<span className="text-[#ccff00]">CREW</span>
            </span>
            <p className="text-[10px] text-slate-400 font-medium">Gym Partner & Availability Tracker</p>
          </div>
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#161a25] border border-[#232a3b] text-slate-400 text-xs font-semibold">
          <Shield size={13} className="text-[#ccff00]" />
          <span>v1.0 Live</span>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-4xl mx-auto px-6 py-12 flex flex-col items-center text-center">
        {/* Emblem Highlight */}
        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#181b26] to-[#0c0d12] border border-[#2a3144] p-1 shadow-2xl flex items-center justify-center mb-6 lime-border-glow overflow-hidden">
          <img src="/gym-icon.png" alt="GYMCREW" className="w-full h-full rounded-2xl object-cover" />
        </div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[#ccff00] text-xs font-bold uppercase tracking-wider mb-4">
          <Flame size={14} />
          <span>Private Gym Squad Coordination</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-white font-heading tracking-tight leading-tight max-w-2xl">
          Never lift alone. Coordinate schedules with your <span className="text-[#ccff00]">bros</span>.
        </h1>

        <p className="text-base sm:text-lg text-slate-400 mt-4 max-w-xl">
          Coordinate morning, afternoon, and evening workout sessions with your friends, discover compatible partners, mark intentional rest days, and build consistency streaks together.
        </p>

        {/* Invite Banner if invited */}
        {inviteCode && (
          <div className="mt-6 mb-2 p-3.5 rounded-2xl bg-[#141824] border border-[#ccff00]/40 text-left flex items-center gap-3 animate-in fade-in max-w-sm w-full">
            <div className="w-10 h-10 rounded-xl bg-[#ccff00]/15 text-[#ccff00] flex items-center justify-center shrink-0">
              <Users size={20} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] font-bold text-[#ccff00] uppercase tracking-wider">Squad Invite</span>
                <span className="text-[10px] font-mono font-bold bg-[#202638] px-1.5 py-0.2 rounded text-slate-200">
                  {inviteCode}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-semibold truncate">
                Sign in to join your gym bro's squad!
              </p>
            </div>
          </div>
        )}

        {/* Google Sign-In Action */}
        <div className="mt-8 w-full max-w-sm space-y-3">
          <button
            onClick={handleGoogleSignIn}
            disabled={signingIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-extrabold text-base shadow-xl active:scale-[0.98] transition-all disabled:opacity-60 cursor-pointer"
          >
            {signingIn ? (
              <Loader2 size={20} className="animate-spin text-slate-900" />
            ) : (
              <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Sign in with Google</span>
          </button>

          <button
            type="button"
            onClick={enableDemoMode}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#141724] hover:bg-[#1c2133] border border-[#262c3e] text-slate-200 font-bold text-xs transition-all active:scale-[0.98] cursor-pointer"
          >
            <Dumbbell size={15} className="text-[#ccff00]" />
            <span>Continue with Demo / Guest Mode</span>
          </button>

          <p className="text-[11px] text-slate-500 font-medium">
            Fast, secure login. Syncs your availability and squads automatically.
          </p>

          {error && (
            <p className="text-xs text-rose-400 bg-rose-500/10 p-2.5 rounded-xl border border-rose-500/20">
              {error}
            </p>
          )}
        </div>

        {/* Feature Cards Grid */}
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full text-left">
          <div className="p-4 rounded-2xl bg-[#12141c]/90 border border-[#1f2433]">
            <div className="p-2 w-fit rounded-xl bg-amber-500/15 text-amber-400 mb-2.5">
              <Calendar size={18} />
            </div>
            <h3 className="text-sm font-bold text-white font-heading">Daily Time Slots</h3>
            <p className="text-xs text-slate-400 mt-1">
              Mark Morning, Afternoon, Evening, or explicit Rest days to protect consistency.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#12141c]/90 border border-[#1f2433]">
            <div className="p-2 w-fit rounded-xl bg-cyan-500/15 text-cyan-400 mb-2.5">
              <Users size={18} />
            </div>
            <h3 className="text-sm font-bold text-white font-heading">Matching Partners</h3>
            <p className="text-xs text-slate-400 mt-1">
              Immediately see who is lifting in your same window and what muscle groups they're hitting.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#12141c]/90 border border-[#1f2433]">
            <div className="p-2 w-fit rounded-xl bg-[#ccff00]/15 text-[#ccff00] mb-2.5">
              <Flame size={18} />
            </div>
            <h3 className="text-sm font-bold text-white font-heading">Streaks & Check-ins</h3>
            <p className="text-xs text-slate-400 mt-1">
              Separate planned workouts from verified completions with weekly goal tracking.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-6 border-t border-[#161a25] text-center text-xs text-slate-500">
        GYMCREW • Built for gym discipline, friendships, and consistency.
      </footer>
    </div>
  );
};
