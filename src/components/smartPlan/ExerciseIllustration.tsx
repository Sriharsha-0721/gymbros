import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, ShieldCheck, Info } from 'lucide-react';

interface ExerciseIllustrationProps {
  svgType: string;
  name: string;
  targetMuscle: string;
  className?: string;
}

type MovementPhase = 1 | 2 | 3; // 1: Setup/Start, 2: Motion/Range of Motion, 3: Peak Contraction/Finish

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({
  svgType,
  name,
  targetMuscle,
  className = 'w-full h-56 sm:h-64',
}) => {
  const [phase, setPhase] = useState<MovementPhase>(1);
  const [isPlaying, setIsPlaying] = useState<boolean>(true);

  // Auto-play loop through 3 phases: Start -> Motion -> Peak Contraction
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setPhase((prev) => (prev === 3 ? 1 : ((prev + 1) as MovementPhase)));
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const getPhaseName = () => {
    if (phase === 1) return 'Phase 1: Setup & Starting Posture';
    if (phase === 2) return 'Phase 2: Movement Path & Direction';
    return 'Phase 3: Peak Contraction & Lockout';
  };

  const getPhaseCue = () => {
    switch (svgType) {
      case 'chest_press':
        return phase === 1
          ? 'Eyes under bar, retract shoulder blades, plant feet flat.'
          : phase === 2
          ? 'Lower smoothly over 2–3s to mid-sternum; elbows at 45–70°.'
          : 'Drive through floor, press bar up over shoulders without bouncing.';
      case 'squat':
        return phase === 1
          ? 'Set feet shoulder-width, toes 15° out, 360° diaphragmatic brace.'
          : phase === 2
          ? 'Hinge hips & break knees simultaneously; descend to parallel depth.'
          : 'Drive up through whole foot, maintain upright chest, squeeze glutes.';
      case 'pullup':
        return phase === 1
          ? 'Dead hang with shoulders engaged, grip just outside shoulder-width.'
          : phase === 2
          ? 'Drive elbows down and inward, leaning torso back slightly 10°.'
          : 'Squeeze lats firmly with chest to bar, controlled 3s negative return.';
      case 'overhead_press':
        return phase === 1
          ? 'Hold dumbbells at shoulder level with elbows 30° forward in scapular plane.'
          : phase === 2
          ? 'Press vertically overhead while keeping ribcage down and glutes tight.'
          : 'Lock arms smoothly over spine, peak deltoid tension without arching lower back.';
      case 'rdl':
        return phase === 1
          ? 'Stand tall, soften knees 15°, lock knee angle throughout movement.'
          : phase === 2
          ? 'Push hips backward towards the wall, sliding weights closely along thighs.'
          : 'Feel loaded hamstring stretch at mid-shin, drive hips forward to lockout.';
      case 'row':
        return phase === 1
          ? 'Chest supported on 30–45° incline bench, dumbbells hanging straight.'
          : phase === 2
          ? 'Retract scapulae and pull elbows back towards hips.'
          : 'Squeeze shoulder blades hard at peak, slow 2s eccentric descent.';
      case 'lateral_raise':
        return phase === 1
          ? 'Stand with slight forward lean (5–10°), weights at sides.'
          : phase === 2
          ? 'Lead with elbows out in scapular plane with pinky side level.'
          : 'Pause at shoulder parallel, contract side delts, avoid shrugging neck.';
      case 'curl':
        return phase === 1
          ? 'Stand tall with neutral palms-in grip, elbows glued to ribcage.'
          : phase === 2
          ? 'Curl weights up along strict arc without swinging torso.'
          : 'Squeeze brachialis and biceps hard at top contraction, 2s negative.';
      case 'triceps':
        return phase === 1
          ? 'High cable pulley, elbows pinned to sides, forearms at 90°.'
          : phase === 2
          ? 'Extend forearms downward strictly using triceps.'
          : 'Spread rope ends apart at bottom for peak contraction, 1s hold.';
      case 'plank':
        return phase === 1
          ? 'Forearms flat on floor under shoulders, legs extended on toes.'
          : phase === 2
          ? 'Tuck pelvis into posterior tilt, push floor away through serratus.'
          : 'Full isometric tension: squeeze quads, glutes, and abs simultaneously.';
      default:
        return 'Maintain strict tempo, controlled breathing, and full range of motion.';
    }
  };

  return (
    <div className={`relative flex flex-col bg-[#090b10] border border-[#1c2130] rounded-2xl overflow-hidden select-none shadow-xl ${className}`}>
      {/* Background Subtle Tech Blueprint Grid */}
      <div
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ccff00 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Top Header Bar: Target Muscle, Equipment & Play/Pause Controls */}
      <div className="relative z-10 flex items-center justify-between px-3.5 py-2.5 bg-[#0e111a]/90 border-b border-[#1c2130]">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#ccff00]/10 border border-[#ccff00]/30 text-[10px] font-black text-[#ccff00]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
            <span>{targetMuscle}</span>
          </div>

          <div className="text-[10px] text-slate-400 font-mono hidden sm:inline-block">
            Biomechanics Demo
          </div>
        </div>

        {/* Phase selector tabs & Auto-play & Replay buttons */}
        <div className="flex items-center gap-1.5">
          <div className="flex rounded-lg bg-[#07080d] p-0.5 border border-[#1b1f2b]">
            {[
              { num: 1, label: 'Start' },
              { num: 2, label: 'Motion' },
              { num: 3, label: 'Lockout' },
            ].map(({ num, label }) => (
              <button
                key={num}
                type="button"
                onClick={() => {
                  setPhase(num as MovementPhase);
                  setIsPlaying(false);
                }}
                className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
                  phase === num
                    ? 'bg-[#ccff00] text-black shadow-sm font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={`View ${label} Phase`}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => {
              setPhase(1);
              setIsPlaying(true);
            }}
            className="p-1.5 rounded-lg border border-[#252b3d] bg-[#151926] text-slate-300 hover:text-white text-xs transition-colors"
            title="Replay from start"
          >
            <RotateCcw size={12} />
          </button>

          <button
            type="button"
            onClick={() => setIsPlaying(!isPlaying)}
            className={`p-1.5 rounded-lg border text-xs transition-colors ${
              isPlaying
                ? 'bg-amber-500/15 border-amber-500/30 text-amber-300'
                : 'bg-[#151926] border-[#252b3d] text-slate-300 hover:text-white'
            }`}
            title={isPlaying ? 'Pause movement loop' : 'Play movement loop'}
          >
            {isPlaying ? <Pause size={12} /> : <Play size={12} fill="currentColor" />}
          </button>
        </div>
      </div>

      {/* Main Vector Rendering Canvas */}
      <div className="relative flex-1 flex items-center justify-center p-3">
        <svg
          viewBox="0 0 240 140"
          className="w-full h-full max-h-40 sm:max-h-44"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* ============================================================== */}
          {/* CHEST PRESS (Barbell & Dumbbell Bench) */}
          {/* ============================================================== */}
          {svgType === 'chest_press' && (
            <g>
              {/* Bench */}
              <rect x="35" y="105" width="170" height="8" rx="2" fill="#1e2433" stroke="#2d374d" strokeWidth="1.5" />
              <rect x="65" y="113" width="8" height="20" rx="1" fill="#141822" />
              <rect x="165" y="113" width="8" height="20" rx="1" fill="#141822" />

              {/* Lifter Body */}
              <circle cx="60" cy="95" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
              <rect x="72" y="92" width="68" height="13" rx="4" fill="#1e293b" />
              {/* Chest Muscle Highlight */}
              <rect
                x="88"
                y="90"
                width="28"
                height="10"
                rx="3"
                fill={phase === 3 ? '#ccff00' : '#84cc16'}
                opacity={phase === 3 ? 1 : 0.6}
              />
              {/* Legs */}
              <path d="M140 100 L162 105 L165 128" stroke="#475569" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M165 128 L176 128" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />

              {/* Dynamic Arms & Barbell based on Phase */}
              {phase === 1 && (
                // Phase 1: Setup with bar un-racked overhead
                <g>
                  <line x1="102" y1="52" x2="102" y2="88" stroke="#ccff00" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" />
                  <rect x="86" y="48" width="32" height="4" rx="2" fill="#f1f5f9" />
                  <rect x="82" y="42" width="4" height="16" rx="1" fill="#94a3b8" />
                  <rect x="118" y="42" width="4" height="16" rx="1" fill="#94a3b8" />
                  <path d="M92 94 L94 72 L100 52" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M112 94 L110 72 L104 52" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="130" y="52" fill="#94a3b8" fontSize="8" fontFamily="monospace">Start / Setup</text>
                </g>
              )}

              {phase === 2 && (
                // Phase 2: Bar on descent touching sternum with motion arrows
                <g>
                  <rect x="86" y="84" width="32" height="4" rx="2" fill="#f1f5f9" />
                  <rect x="82" y="78" width="4" height="16" rx="1" fill="#94a3b8" />
                  <rect x="118" y="78" width="4" height="16" rx="1" fill="#94a3b8" />
                  <path d="M92 94 L82 92 L96 86" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M112 94 L122 92 L108 86" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Downward Directional Arrows */}
                  <path d="M102 60 L102 78 M99 74 L102 78 L105 74" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <text x="130" y="78" fill="#ccff00" fontSize="8" fontWeight="bold">Touch Sternum</text>
                </g>
              )}

              {phase === 3 && (
                // Phase 3: Explosive drive upward with peak contraction glow
                <g>
                  <rect x="86" y="46" width="32" height="4" rx="2" fill="#f1f5f9" stroke="#ccff00" strokeWidth="1" />
                  <rect x="82" y="40" width="4" height="16" rx="1" fill="#ccff00" />
                  <rect x="118" y="40" width="4" height="16" rx="1" fill="#ccff00" />
                  <path d="M92 94 L94 70 L100 50" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M112 94 L110 70 L104 50" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Upward Arrows */}
                  <path d="M102 74 L102 56 M99 60 L102 56 L105 60" stroke="#ccff00" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="102" cy="95" r="12" fill="#ccff00" opacity="0.25" />
                  <text x="130" y="50" fill="#ccff00" fontSize="8" fontWeight="bold">Peak Lockout</text>
                </g>
              )}
            </g>
          )}

          {/* ============================================================== */}
          {/* SQUAT (Barbell & Goblet Squat) */}
          {/* ============================================================== */}
          {svgType === 'squat' && (
            <g>
              {/* Floor */}
              <line x1="20" y1="130" x2="220" y2="130" stroke="#2d374d" strokeWidth="2" />

              {phase === 1 && (
                // Phase 1: Standing tall, bar racked on traps
                <g>
                  <circle cx="120" cy="38" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="47" x2="120" y2="85" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  <line x1="120" y1="85" x2="114" y2="128" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
                  <line x1="120" y1="85" x2="126" y2="128" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
                  {/* Barbell */}
                  <rect x="85" y="44" width="70" height="4" rx="2" fill="#f1f5f9" />
                  <rect x="80" y="36" width="5" height="20" rx="1" fill="#94a3b8" />
                  <rect x="155" y="36" width="5" height="20" rx="1" fill="#94a3b8" />
                  <text x="145" y="70" fill="#94a3b8" fontSize="8" fontFamily="monospace">1. Feet Set</text>
                </g>
              )}

              {phase === 2 && (
                // Phase 2: In the hole at parallel depth with guideline
                <g>
                  <circle cx="105" cy="58" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  {/* Torso hinged at 45° */}
                  <path d="M105 66 L95 94" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  {/* Barbell on Traps */}
                  <rect x="75" y="62" width="60" height="4" rx="2" fill="#f1f5f9" />
                  <rect x="70" y="54" width="5" height="20" rx="1" fill="#94a3b8" />
                  <rect x="135" y="54" width="5" height="20" rx="1" fill="#94a3b8" />
                  {/* Quads highlight */}
                  <path d="M95 94 L128 98" stroke="#ccff00" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
                  <path d="M128 98 L112 128" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
                  {/* Parallel depth dashed line */}
                  <line x1="75" y1="98" x2="145" y2="98" stroke="#ccff00" strokeWidth="1" strokeDasharray="3 3" opacity="0.8" />
                  <text x="150" y="100" fill="#ccff00" fontSize="8" fontWeight="bold">Parallel Depth</text>
                  {/* Downward descent arrow */}
                  <path d="M100 74 L96 86 M93 82 L96 86 L99 82" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}

              {phase === 3 && (
                // Phase 3: Concentric upward drive with glute/quad contraction
                <g>
                  <circle cx="118" cy="40" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <line x1="118" y1="49" x2="118" y2="86" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  {/* Active Muscle Glow on Glutes & Quads */}
                  <line x1="118" y1="86" x2="112" y2="128" stroke="#ccff00" strokeWidth="8" strokeLinecap="round" />
                  <line x1="118" y1="86" x2="124" y2="128" stroke="#ccff00" strokeWidth="8" strokeLinecap="round" />
                  <rect x="85" y="44" width="70" height="4" rx="2" fill="#f1f5f9" stroke="#ccff00" strokeWidth="1" />
                  <rect x="80" y="36" width="5" height="20" rx="1" fill="#ccff00" />
                  <rect x="155" y="36" width="5" height="20" rx="1" fill="#ccff00" />
                  {/* Upward Drive Arrows */}
                  <path d="M118 78 L118 64 M115 68 L118 64 L121 68" stroke="#ccff00" strokeWidth="2.5" strokeLinecap="round" />
                  <text x="145" y="70" fill="#ccff00" fontSize="8" fontWeight="bold">Lockout & Glutes</text>
                </g>
              )}
            </g>
          )}

          {/* ============================================================== */}
          {/* PULLUP / LAT PULLDOWN */}
          {/* ============================================================== */}
          {svgType === 'pullup' && (
            <g>
              {/* Overhead Lat Bar */}
              <line x1="50" y1="26" x2="190" y2="26" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" />
              <line x1="120" y1="10" x2="120" y2="26" stroke="#64748b" strokeWidth="2" />

              {phase === 1 && (
                // Phase 1: Full dead hang overhead stretch
                <g>
                  <circle cx="120" cy="56" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="65" x2="120" y2="108" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  {/* Arms extended up */}
                  <path d="M114 68 L94 44 L75 27" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  <path d="M126 68 L146 44 L165 27" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  <text x="135" y="56" fill="#94a3b8" fontSize="8" fontFamily="monospace">Full Hang Stretch</text>
                </g>
              )}

              {phase === 2 && (
                // Phase 2: Pulling elbows down with force direction arrows
                <g>
                  <circle cx="120" cy="46" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="55" x2="120" y2="98" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  {/* Arms pulling */}
                  <path d="M114 58 L98 46 L82 27" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  <path d="M126 58 L142 46 L158 27" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  {/* Downward & Inward Elbow Drive Arrows */}
                  <path d="M85 45 L95 62 M90 62 L95 62 L95 56" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
                  <path d="M155 45 L145 62 M150 62 L145 62 L145 56" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
                  <text x="130" y="80" fill="#ccff00" fontSize="8" fontWeight="bold">Drive Elbows Down</text>
                </g>
              )}

              {phase === 3 && (
                // Phase 3: Chest to bar, intense lat contraction
                <g>
                  <circle cx="120" cy="32" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="41" x2="120" y2="82" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
                  {/* Squeezed Lat Wings */}
                  <path d="M112 45 L88 64 L110 75 Z" fill="#ccff00" opacity="0.95" />
                  <path d="M128 45 L152 64 L130 75 Z" fill="#ccff00" opacity="0.95" />
                  {/* Bent Arms */}
                  <path d="M112 44 L92 35 L80 27" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" />
                  <path d="M128 44 L148 35 L160 27" stroke="#f1f5f9" strokeWidth="4" strokeLinecap="round" />
                  <text x="135" y="44" fill="#ccff00" fontSize="8" fontWeight="bold">Peak Lat Squeeze</text>
                </g>
              )}
            </g>
          )}

          {/* ============================================================== */}
          {/* ROMANIAN DEADLIFT (RDL) */}
          {/* ============================================================== */}
          {svgType === 'rdl' && (
            <g>
              <line x1="20" y1="130" x2="220" y2="130" stroke="#2d374d" strokeWidth="2" />

              {phase === 1 && (
                // Phase 1: Standing tall, soft knees, chest high
                <g>
                  <circle cx="120" cy="38" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="47" x2="120" y2="86" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  <line x1="120" y1="86" x2="118" y2="128" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
                  {/* Dumbbells hanging at thighs */}
                  <rect x="112" y="76" width="16" height="6" rx="2" fill="#f1f5f9" />
                  <text x="135" y="45" fill="#94a3b8" fontSize="8" fontFamily="monospace">Soft Knees (15°)</text>
                </g>
              )}

              {phase === 2 && (
                // Phase 2: Hips pushing back into hinge
                <g>
                  <circle cx="138" cy="52" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  {/* Torso hinged at 45° */}
                  <path d="M132 58 L98 84" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  {/* Hamstrings loaded */}
                  <path d="M98 84 L94 128" stroke="#ccff00" strokeWidth="8" strokeLinecap="round" opacity="0.8" />
                  {/* Arms with weights tracing shins */}
                  <line x1="122" y1="68" x2="114" y2="105" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                  <rect x="106" y="105" width="16" height="6" rx="2" fill="#f1f5f9" />
                  {/* Hips Back Direction Arrow */}
                  <path d="M98 80 L76 80 M82 76 L76 80 L82 84" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
                  <text x="45" y="78" fill="#ccff00" fontSize="8" fontWeight="bold">Hips Back</text>
                </g>
              )}

              {phase === 3 && (
                // Phase 3: Deep stretch at mid-shin with flat neutral back
                <g>
                  <circle cx="145" cy="62" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <path d="M138 68 L94 92" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  {/* Intense Hamstring & Glute Glow */}
                  <path d="M94 92 L90 128" stroke="#ccff00" strokeWidth="9" strokeLinecap="round" />
                  <line x1="124" y1="76" x2="112" y2="116" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                  <rect x="104" y="116" width="16" height="6" rx="2" fill="#ccff00" />
                  <text x="125" y="122" fill="#ccff00" fontSize="8" fontWeight="bold">Loaded Stretch</text>
                </g>
              )}
            </g>
          )}

          {/* ============================================================== */}
          {/* OVERHEAD PRESS */}
          {/* ============================================================== */}
          {svgType === 'overhead_press' && (
            <g>
              <line x1="50" y1="130" x2="190" y2="130" stroke="#2d374d" strokeWidth="2" />
              <circle cx="120" cy="58" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
              <line x1="120" y1="67" x2="120" y2="125" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />

              {phase === 1 && (
                <g>
                  <circle cx="106" cy="72" r="6" fill="#84cc16" opacity="0.7" />
                  <circle cx="134" cy="72" r="6" fill="#84cc16" opacity="0.7" />
                  {/* Dumbbells at collarbone */}
                  <rect x="94" y="66" width="16" height="6" rx="2" fill="#f1f5f9" />
                  <rect x="130" y="66" width="16" height="6" rx="2" fill="#f1f5f9" />
                  <text x="145" y="72" fill="#94a3b8" fontSize="8" fontFamily="monospace">At Shoulder Level</text>
                </g>
              )}

              {phase === 2 && (
                <g>
                  <circle cx="106" cy="72" r="6" fill="#ccff00" opacity="0.8" />
                  <circle cx="134" cy="72" r="6" fill="#ccff00" opacity="0.8" />
                  {/* Upward press trajectory */}
                  <rect x="94" y="44" width="16" height="6" rx="2" fill="#f1f5f9" />
                  <rect x="130" y="44" width="16" height="6" rx="2" fill="#f1f5f9" />
                  <path d="M102 62 L102 52 M99 56 L102 52 L105 56" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
                  <path d="M138 62 L138 52 M135 56 L138 52 L141 56" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
                  <text x="145" y="50" fill="#ccff00" fontSize="8" fontWeight="bold">Scapular Plane</text>
                </g>
              )}

              {phase === 3 && (
                <g>
                  {/* Peak Lockout */}
                  <circle cx="106" cy="70" r="7" fill="#ccff00" />
                  <circle cx="134" cy="70" r="7" fill="#ccff00" />
                  <path d="M106 70 L98 48 L102 26" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" />
                  <path d="M134 70 L142 48 L138 26" stroke="#f1f5f9" strokeWidth="3.5" strokeLinecap="round" />
                  <rect x="94" y="22" width="16" height="6" rx="2" fill="#ccff00" />
                  <rect x="130" y="22" width="16" height="6" rx="2" fill="#ccff00" />
                  <text x="145" y="26" fill="#ccff00" fontSize="8" fontWeight="bold">Overhead Lockout</text>
                </g>
              )}
            </g>
          )}

          {/* ============================================================== */}
          {/* ROW / LATERAL RAISE / CURL / TRICEPS / PLANK (Biomechanical Presets) */}
          {/* ============================================================== */}
          {['row', 'lateral_raise', 'curl', 'triceps', 'plank'].includes(svgType) && (
            <g>
              {svgType === 'lateral_raise' && (
                <>
                  <circle cx="120" cy="46" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="55" x2="120" y2="120" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  {/* Side Delts Glow */}
                  <circle cx="108" cy="62" r="6" fill="#ccff00" opacity={phase === 3 ? 1 : 0.6} />
                  <circle cx="132" cy="62" r="6" fill="#ccff00" opacity={phase === 3 ? 1 : 0.6} />

                  {phase === 1 && (
                    <>
                      <line x1="108" y1="62" x2="104" y2="102" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                      <line x1="132" y1="62" x2="136" y2="102" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                      <rect x="98" y="102" width="12" height="6" rx="2" fill="#f1f5f9" />
                      <rect x="130" y="102" width="12" height="6" rx="2" fill="#f1f5f9" />
                    </>
                  )}
                  {phase >= 2 && (
                    <>
                      <path d="M108 62 L78 64" stroke={phase === 3 ? '#ccff00' : '#94a3b8'} strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M132 62 L162 64" stroke={phase === 3 ? '#ccff00' : '#94a3b8'} strokeWidth="3.5" strokeLinecap="round" />
                      <rect x="68" y="61" width="12" height="6" rx="2" fill={phase === 3 ? '#ccff00' : '#f1f5f9'} />
                      <rect x="160" y="61" width="12" height="6" rx="2" fill={phase === 3 ? '#ccff00' : '#f1f5f9'} />
                      <path d="M85 86 C80 75 75 66 70 66" stroke="#ccff00" strokeWidth="1.5" strokeDasharray="2 2" />
                      <path d="M155 86 C160 75 165 66 170 66" stroke="#ccff00" strokeWidth="1.5" strokeDasharray="2 2" />
                      <text x="135" y="44" fill="#ccff00" fontSize="8" fontWeight="bold">Parallel Squeeze</text>
                    </>
                  )}
                </>
              )}

              {svgType === 'curl' && (
                <>
                  <circle cx="120" cy="46" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="55" x2="120" y2="120" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  <circle cx="108" cy="72" r="7" fill="#ccff00" opacity={phase === 3 ? 1 : 0.6} />

                  {phase === 1 && (
                    <>
                      <line x1="108" y1="72" x2="108" y2="108" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                      <rect x="102" y="108" width="12" height="6" rx="2" fill="#f1f5f9" />
                      <text x="135" y="72" fill="#94a3b8" fontSize="8" fontFamily="monospace">Elbows Pinned</text>
                    </>
                  )}
                  {phase >= 2 && (
                    <>
                      <path d="M108 72 L108 92 L98 72" stroke="#ccff00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="92" y="68" width="12" height="6" rx="2" fill="#ccff00" />
                      <path d="M108 102 C104 92 100 82 96 74" stroke="#ccff00" strokeWidth="1.5" strokeDasharray="2 2" />
                      <text x="135" y="72" fill="#ccff00" fontSize="8" fontWeight="bold">Peak Bicep Arc</text>
                    </>
                  )}
                </>
              )}

              {svgType === 'triceps' && (
                <>
                  {/* Cable Pulley */}
                  <circle cx="120" cy="18" r="4" fill="#64748b" />
                  <line x1="120" y1="22" x2="120" y2="60" stroke="#64748b" strokeWidth="1.5" />
                  <circle cx="120" cy="50" r="9" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <line x1="120" y1="59" x2="120" y2="120" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  <circle cx="112" cy="74" r="6" fill="#ccff00" opacity={phase === 3 ? 1 : 0.6} />

                  {phase === 1 && (
                    <>
                      <line x1="112" y1="74" x2="112" y2="92" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                      <text x="135" y="74" fill="#94a3b8" fontSize="8" fontFamily="monospace">90° Forearm Bend</text>
                    </>
                  )}
                  {phase >= 2 && (
                    <>
                      <line x1="112" y1="74" x2="112" y2="112" stroke="#ccff00" strokeWidth="3.5" strokeLinecap="round" />
                      <path d="M112 112 L105 118" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" />
                      <path d="M112 112 L119 118" stroke="#ccff00" strokeWidth="3" strokeLinecap="round" />
                      <text x="135" y="112" fill="#ccff00" fontSize="8" fontWeight="bold">Spread Rope Ends</text>
                    </>
                  )}
                </>
              )}

              {svgType === 'plank' && (
                <>
                  <line x1="30" y1="120" x2="210" y2="120" stroke="#2d374d" strokeWidth="2" />
                  <circle cx="68" cy="88" r="8" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  {/* Straight Spine Line */}
                  <line x1="76" y1="92" x2="165" y2="108" stroke={phase === 3 ? '#ccff00' : '#1e293b'} strokeWidth="10" strokeLinecap="round" />
                  {/* Elbow to Floor */}
                  <line x1="84" y1="94" x2="84" y2="120" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
                  {/* Core Highlight */}
                  <rect x="105" y="94" width="30" height="8" rx="2" fill="#ccff00" opacity="0.9" />
                  <text x="110" y="86" fill="#ccff00" fontSize="8" fontWeight="bold">Pelvic Tilt & Brace</text>
                </>
              )}

              {svgType === 'row' && (
                <>
                  {/* Incline Bench */}
                  <line x1="60" y1="125" x2="150" y2="65" stroke="#2d374d" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="155" cy="55" r="8" fill="#334155" stroke="#475569" strokeWidth="1.5" />
                  <line x1="146" y1="60" x2="85" y2="105" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
                  <ellipse cx="120" cy="78" rx="12" ry="7" fill="#ccff00" opacity={phase === 3 ? 1 : 0.6} />

                  {phase === 1 && (
                    <line x1="125" y1="75" x2="115" y2="108" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
                  )}
                  {phase >= 2 && (
                    <>
                      <path d="M125 75 L118 60 L108 72" stroke="#ccff00" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                      <rect x="102" y="68" width="12" height="6" rx="2" fill="#ccff00" />
                      <text x="40" y="55" fill="#ccff00" fontSize="8" fontWeight="bold">Drive Elbows Back</text>
                    </>
                  )}
                </>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* Bottom Footer: Dynamic Technique Cue for Current Phase */}
      <div className="relative z-10 px-3.5 py-2.5 bg-[#0e111a]/95 border-t border-[#1c2130] flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-hidden">
          <Info size={13} className="text-[#ccff00] shrink-0" />
          <div className="truncate">
            <span className="font-extrabold text-[#ccff00] mr-1.5">{getPhaseName()}:</span>
            <span className="text-slate-300 text-[11px]">{getPhaseCue()}</span>
          </div>
        </div>

        <div className="text-[10px] text-slate-500 font-mono shrink-0 hidden sm:block">
          Frame {phase} of 3
        </div>
      </div>
    </div>
  );
};
