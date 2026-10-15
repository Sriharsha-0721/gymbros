import React from 'react';

interface ExerciseIllustrationProps {
  svgType: string;
  name: string;
  targetMuscle: string;
  className?: string;
}

export const ExerciseIllustration: React.FC<ExerciseIllustrationProps> = ({
  svgType,
  name,
  targetMuscle,
  className = 'w-full h-44',
}) => {
  return (
    <div className={`relative flex items-center justify-center bg-[#090b10] border border-[#1c2130] rounded-xl overflow-hidden p-2 select-none ${className}`}>
      {/* Background Subtle Tech Grid */}
      <div 
        className="absolute inset-0 opacity-15 pointer-events-none"
        style={{
          backgroundImage: 'radial-gradient(#ccff00 1px, transparent 1px)',
          backgroundSize: '16px 16px',
        }}
      />

      {/* Target Muscle Tag */}
      <div className="absolute top-2 left-2 z-10 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#12151e]/90 border border-[#232838] text-[10px] font-bold text-[#ccff00]">
        <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-pulse" />
        <span>{targetMuscle}</span>
      </div>

      {/* Dynamic SVG Vector Figures */}
      <svg
        viewBox="0 0 240 160"
        className="w-full h-full max-h-40 text-slate-400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Chest Press Figure */}
        {svgType === 'chest_press' && (
          <g>
            {/* Bench */}
            <rect x="40" y="110" width="160" height="8" rx="2" fill="#1e2433" stroke="#2d374d" strokeWidth="1.5" />
            <rect x="70" y="118" width="8" height="24" rx="1" fill="#181d29" />
            <rect x="162" y="118" width="8" height="24" rx="1" fill="#181d29" />
            
            {/* Lifter Body */}
            {/* Head */}
            <circle cx="65" cy="100" r="10" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            {/* Torso */}
            <rect x="78" y="96" width="65" height="14" rx="4" fill="#1e293b" />
            {/* Chest Muscle Highlight */}
            <rect x="92" y="94" width="28" height="10" rx="3" fill="#ccff00" opacity="0.9" />
            {/* Legs */}
            <path d="M143 105 L165 110 L168 135" stroke="#475569" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M168 135 L180 135" stroke="#64748b" strokeWidth="3" strokeLinecap="round" />
            
            {/* Arms & Barbell */}
            {/* Barbell Path */}
            <path d="M106 65 L106 88" stroke="#ccff00" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.7" />
            {/* Barbell */}
            <rect x="90" y="60" width="32" height="4" rx="2" fill="#e2e8f0" />
            <rect x="86" y="54" width="4" height="16" rx="1" fill="#94a3b8" />
            <rect x="122" y="54" width="4" height="16" rx="1" fill="#94a3b8" />
            {/* Arms */}
            <path d="M96 98 L94 80 L102 63" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M116 98 L118 80 L110 63" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
            {/* Direction Arrows */}
            <path d="M106 72 L106 64 M103 67 L106 64 L109 67" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {/* Squat Figure */}
        {svgType === 'squat' && (
          <g>
            {/* Ground */}
            <line x1="30" y1="140" x2="210" y2="140" stroke="#2d374d" strokeWidth="2" />
            
            {/* Squatter Body */}
            {/* Head */}
            <circle cx="105" cy="50" r="10" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            {/* Barbell on Traps */}
            <rect x="75" y="56" width="60" height="4" rx="2" fill="#e2e8f0" />
            <rect x="70" y="48" width="5" height="20" rx="1" fill="#94a3b8" />
            <rect x="135" y="48" width="5" height="20" rx="1" fill="#94a3b8" />
            
            {/* Torso */}
            <path d="M105 60 L95 90" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
            
            {/* Quads & Glutes Highlight */}
            <path d="M95 90 L125 98" stroke="#ccff00" strokeWidth="10" strokeLinecap="round" opacity="0.9" />
            <path d="M125 98 L108 135" stroke="#475569" strokeWidth="7" strokeLinecap="round" />
            <path d="M108 135 L120 137" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
            
            {/* Depth Guideline */}
            <line x1="80" y1="98" x2="140" y2="98" stroke="#ccff00" strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />
            <text x="145" y="101" fill="#ccff00" fontSize="8" fontWeight="bold">Parallel</text>
            
            {/* Drive Up Arrow */}
            <path d="M105 78 L105 68 M102 72 L105 68 L108 72" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}

        {/* Pull-Up / Lat Pulldown */}
        {svgType === 'pullup' && (
          <g>
            {/* Cable Machine Bar */}
            <line x1="60" y1="35" x2="180" y2="35" stroke="#e2e8f0" strokeWidth="4" strokeLinecap="round" />
            <line x1="120" y1="15" x2="120" y2="35" stroke="#64748b" strokeWidth="2" />
            
            {/* Lifter Back View */}
            {/* Head */}
            <circle cx="120" cy="55" r="10" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            {/* Torso Back */}
            <path d="M120 65 L120 105" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
            {/* Lat Wing Highlights */}
            <path d="M110 70 L95 85 L112 95 Z" fill="#ccff00" opacity="0.9" />
            <path d="M130 70 L145 85 L128 95 Z" fill="#ccff00" opacity="0.9" />
            {/* Arms Gripping Bar */}
            <path d="M110 68 L92 48 L75 36" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <path d="M130 68 L148 48 L165 36" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            {/* Pull Down Direction Cues */}
            <path d="M85 55 L85 68 M82 64 L85 68 L88 64" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
            <path d="M155 55 L155 68 M152 64 L155 68 L158 64" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
          </g>
        )}

        {/* Overhead Press */}
        {svgType === 'overhead_press' && (
          <g>
            <circle cx="120" cy="80" r="10" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            {/* Torso */}
            <line x1="120" y1="90" x2="120" y2="135" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
            {/* Deltoid Highlights */}
            <circle cx="106" cy="92" r="6" fill="#ccff00" opacity="0.9" />
            <circle cx="134" cy="92" r="6" fill="#ccff00" opacity="0.9" />
            {/* Arms Pressing Overhead */}
            <path d="M106 92 L96 65 L102 42" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <path d="M134 92 L144 65 L138 42" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            {/* Dumbbells */}
            <rect x="94" y="38" width="16" height="6" rx="2" fill="#e2e8f0" />
            <rect x="130" y="38" width="16" height="6" rx="2" fill="#e2e8f0" />
            {/* Vertical Press Arrows */}
            <path d="M102 55 L102 46 M99 50 L102 46 L105 50" stroke="#ccff00" strokeWidth="1.5" />
            <path d="M138 55 L138 46 M135 50 L138 46 L141 50" stroke="#ccff00" strokeWidth="1.5" />
          </g>
        )}

        {/* Romanian Deadlift (RDL) */}
        {svgType === 'rdl' && (
          <g>
            <line x1="30" y1="140" x2="210" y2="140" stroke="#2d374d" strokeWidth="2" />
            {/* Torso Hinged at 45° */}
            <path d="M135 70 L95 95" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
            <circle cx="145" cy="62" r="10" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            {/* Glute & Hamstrings Highlight */}
            <path d="M95 95 L90 135" stroke="#ccff00" strokeWidth="9" strokeLinecap="round" opacity="0.9" />
            {/* Arms Hanging Down */}
            <line x1="125" y1="78" x2="125" y2="115" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
            <rect x="117" y="115" width="16" height="6" rx="2" fill="#e2e8f0" />
            {/* Hip Drive Arrow */}
            <path d="M95 90 L80 90 M85 86 L80 90 L85 94" stroke="#ccff00" strokeWidth="2" strokeLinecap="round" />
            <text x="50" y="87" fill="#ccff00" fontSize="8" fontWeight="bold">Hips Back</text>
          </g>
        )}

        {/* Row Figure */}
        {svgType === 'row' && (
          <g>
            {/* Incline Bench */}
            <line x1="70" y1="125" x2="150" y2="75" stroke="#2d374d" strokeWidth="6" strokeLinecap="round" />
            {/* Prone Lifter */}
            <circle cx="155" cy="65" r="9" fill="#334155" />
            <line x1="146" y1="70" x2="85" y2="110" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
            {/* Upper Back Muscle Highlight */}
            <ellipse cx="120" cy="85" rx="14" ry="7" fill="#ccff00" opacity="0.9" />
            {/* Arm Rowing Up */}
            <path d="M125 80 L115 65 L108 80" stroke="#94a3b8" strokeWidth="3.5" strokeLinecap="round" />
            <rect x="102" y="77" width="12" height="6" rx="2" fill="#e2e8f0" />
            <path d="M115 76 L115 66 M112 70 L115 66 L118 70" stroke="#ccff00" strokeWidth="2" />
          </g>
        )}

        {/* Default / Fallback Figure */}
        {['curl', 'triceps', 'plank', 'lateral_raise'].includes(svgType) && (
          <g>
            <circle cx="120" cy="55" r="12" fill="#334155" stroke="#475569" strokeWidth="1.5" />
            <line x1="120" y1="67" x2="120" y2="120" stroke="#1e293b" strokeWidth="14" strokeLinecap="round" />
            {svgType === 'curl' && (
              <>
                <circle cx="108" cy="88" r="6" fill="#ccff00" opacity="0.9" />
                <path d="M112 75 L108 95 L112 85" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
              </>
            )}
            {svgType === 'lateral_raise' && (
              <>
                <circle cx="108" cy="74" r="5" fill="#ccff00" opacity="0.9" />
                <circle cx="132" cy="74" r="5" fill="#ccff00" opacity="0.9" />
                <path d="M108 74 L80 75" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
                <path d="M132 74 L160 75" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" />
              </>
            )}
            {svgType === 'triceps' && (
              <>
                <circle cx="112" cy="82" r="5" fill="#ccff00" opacity="0.9" />
                <line x1="120" y1="35" x2="120" y2="70" stroke="#64748b" strokeWidth="2" />
              </>
            )}
            {svgType === 'plank' && (
              <>
                <line x1="60" y1="120" x2="180" y2="120" stroke="#ccff00" strokeWidth="6" strokeLinecap="round" />
              </>
            )}
          </g>
        )}
      </svg>

      {/* Movement Quality Badge */}
      <div className="absolute bottom-2 right-2 text-[10px] text-slate-400 bg-[#0c0e14]/90 px-2 py-0.5 rounded-md border border-[#1e2333]">
        Form Guide • Biomechanics
      </div>
    </div>
  );
};
