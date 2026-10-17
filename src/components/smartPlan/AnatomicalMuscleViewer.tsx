import React, { useState } from 'react';
import { AnatomyMuscle } from '../../lib/exerciseMediaMapping';

interface AnatomicalMuscleViewerProps {
  primaryMuscles: AnatomyMuscle[];
  secondaryMuscles?: AnatomyMuscle[];
  primaryLabel?: string;
  secondaryLabel?: string[];
  className?: string;
}

export const AnatomicalMuscleViewer: React.FC<AnatomicalMuscleViewerProps> = ({
  primaryMuscles,
  secondaryMuscles = [],
  primaryLabel,
  secondaryLabel = [],
  className = '',
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'front' | 'back'>('both');

  // Determine fill & stroke color for an anatomical muscle group
  const getMuscleColor = (muscle: AnatomyMuscle) => {
    if (primaryMuscles.includes(muscle)) {
      return {
        fill: '#ccff00',
        stroke: '#e6ff80',
        strokeWidth: 1.5,
        filter: 'url(#limeGlow)',
        opacity: 0.95,
      };
    }
    if (secondaryMuscles.includes(muscle)) {
      return {
        fill: '#fb923c',
        stroke: '#fdba74',
        strokeWidth: 1.5,
        filter: 'url(#orangeGlow)',
        opacity: 0.9,
      };
    }
    return {
      fill: '#181e2b',
      stroke: '#29334a',
      strokeWidth: 1,
      opacity: 0.7,
    };
  };

  const isPosteriorPrimary = primaryMuscles.some((m) =>
    ['rear_delts', 'traps', 'rhomboids', 'lats', 'lower_back', 'triceps', 'glutes', 'hamstrings'].includes(m)
  );

  return (
    <div className={`rounded-2xl bg-[#0f1118] border border-[#202638] p-4 flex flex-col items-center select-none ${className}`}>
      {/* Top Header / View Selector */}
      <div className="w-full flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
          <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider">
            Target Anatomy
          </span>
        </div>

        <div className="flex items-center bg-[#161a25] p-0.5 rounded-lg border border-[#232a3d]">
          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
              viewMode === 'both' ? 'bg-[#ccff00] text-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Dual
          </button>
          <button
            type="button"
            onClick={() => setViewMode('front')}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
              viewMode === 'front' ? 'bg-[#ccff00] text-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Anterior
          </button>
          <button
            type="button"
            onClick={() => setViewMode('back')}
            className={`px-2 py-1 rounded text-[10px] font-bold transition-all ${
              viewMode === 'back' ? 'bg-[#ccff00] text-black shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Posterior
          </button>
        </div>
      </div>

      {/* SVG Container */}
      <div className="w-full flex items-center justify-center gap-4 py-2">
        <svg className="hidden">
          <defs>
            <filter id="limeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="orangeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
        </svg>

        {/* ANTERIOR (FRONT) BODY */}
        {(viewMode === 'both' || viewMode === 'front') && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Front
            </span>
            <svg
              viewBox="0 0 160 300"
              className="w-28 sm:w-32 h-52 sm:h-60 transition-transform duration-200"
            >
              {/* Head & Neck */}
              <circle cx="80" cy="22" r="14" fill="#131722" stroke="#252e42" strokeWidth="1" />
              <path d="M74,36 L86,36 L88,48 L72,48 Z" fill="#131722" stroke="#252e42" strokeWidth="1" />

              {/* Traps (Anterior visible crest) */}
              <path
                d="M72,44 Q60,48 56,54 L62,56 Q72,50 80,50 Q88,50 98,56 L104,54 Q100,48 88,44 Z"
                {...getMuscleColor('traps')}
              />

              {/* Left & Right Shoulders (Front Deltoids) */}
              <path
                d="M54,54 C48,58 44,66 44,74 C44,80 48,84 54,82 C56,76 56,66 58,58 Z"
                {...getMuscleColor('front_delts')}
              />
              <path
                d="M106,54 C112,58 116,66 116,74 C116,80 112,84 106,82 C104,76 104,66 102,58 Z"
                {...getMuscleColor('front_delts')}
              />

              {/* Chest (Pectorals) */}
              <path
                d="M58,58 Q78,54 79,62 L79,88 C70,90 60,86 56,78 C54,70 56,62 58,58 Z"
                {...getMuscleColor('chest')}
              />
              <path
                d="M102,58 Q82,54 81,62 L81,88 C90,90 100,86 104,78 C106,70 104,62 102,58 Z"
                {...getMuscleColor('chest')}
              />

              {/* Biceps (Left & Right) */}
              <path
                d="M44,78 C40,84 40,96 42,106 C46,108 50,104 52,98 C54,90 52,82 48,78 Z"
                {...getMuscleColor('biceps')}
              />
              <path
                d="M116,78 C120,84 120,96 118,106 C114,108 110,104 108,98 C106,90 108,82 112,78 Z"
                {...getMuscleColor('biceps')}
              />

              {/* Forearms (Left & Right) */}
              <path
                d="M42,108 C38,118 36,132 38,144 C42,146 48,142 48,136 C50,126 50,116 48,108 Z"
                {...getMuscleColor('forearms')}
              />
              <path
                d="M118,108 C122,118 124,132 122,144 C118,146 112,142 112,136 C110,126 110,116 112,108 Z"
                {...getMuscleColor('forearms')}
              />

              {/* Hands */}
              <circle cx="37" cy="150" r="5" fill="#131722" stroke="#252e42" strokeWidth="1" />
              <circle cx="123" cy="150" r="5" fill="#131722" stroke="#252e42" strokeWidth="1" />

              {/* Abdominals (Core) */}
              <path
                d="M72,90 L88,90 L88,100 L72,100 Z M72,103 L88,103 L88,113 L72,113 Z M72,116 L88,116 L88,128 L72,128 Z"
                {...getMuscleColor('abs')}
              />

              {/* Obliques (Flanks) */}
              <path
                d="M58,88 C62,98 62,112 64,126 C68,128 70,128 70,124 C68,110 68,98 64,88 Z"
                {...getMuscleColor('obliques')}
              />
              <path
                d="M102,88 C98,98 98,112 96,126 C92,128 90,128 90,124 C92,110 92,98 96,88 Z"
                {...getMuscleColor('obliques')}
              />

              {/* Pelvis & Hips */}
              <path
                d="M66,130 C74,134 86,134 94,130 L98,144 C90,148 70,148 62,144 Z"
                fill="#131722"
                stroke="#252e42"
                strokeWidth="1"
              />

              {/* Quadriceps (Left & Right Thighs) */}
              <path
                d="M62,146 C58,162 58,186 64,204 C70,206 76,204 78,198 C82,180 82,160 76,146 Z"
                {...getMuscleColor('quads')}
              />
              <path
                d="M98,146 C102,162 102,186 96,204 C90,206 84,204 82,198 C78,180 78,160 84,146 Z"
                {...getMuscleColor('quads')}
              />

              {/* Knees */}
              <circle cx="70" cy="210" r="5" fill="#131722" stroke="#252e42" strokeWidth="1" />
              <circle cx="90" cy="210" r="5" fill="#131722" stroke="#252e42" strokeWidth="1" />

              {/* Calves / Shins (Anterior) */}
              <path
                d="M66,218 C62,230 62,254 66,272 C70,274 74,272 75,264 C76,250 76,232 74,218 Z"
                {...getMuscleColor('calves')}
              />
              <path
                d="M94,218 C98,230 98,254 94,272 C90,274 86,272 85,264 C84,250 84,232 86,218 Z"
                {...getMuscleColor('calves')}
              />

              {/* Feet */}
              <path d="M64,274 L74,274 L76,288 L60,288 Z" fill="#131722" stroke="#252e42" strokeWidth="1" />
              <path d="M96,274 L86,274 L84,288 L100,288 Z" fill="#131722" stroke="#252e42" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* POSTERIOR (BACK) BODY */}
        {(viewMode === 'both' || viewMode === 'back') && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Back
            </span>
            <svg
              viewBox="0 0 160 300"
              className="w-28 sm:w-32 h-52 sm:h-60 transition-transform duration-200"
            >
              {/* Back Head & Neck */}
              <circle cx="80" cy="22" r="14" fill="#131722" stroke="#252e42" strokeWidth="1" />
              <path d="M74,36 L86,36 L88,48 L72,48 Z" fill="#131722" stroke="#252e42" strokeWidth="1" />

              {/* Trapezius (Diamond Back Shape) */}
              <path
                d="M74,44 L86,44 L100,54 L88,86 L80,94 L72,86 L60,54 Z"
                {...getMuscleColor('traps')}
              />

              {/* Rear Deltoids (Left & Right) */}
              <path
                d="M58,54 C50,58 46,66 46,74 C46,80 50,84 56,82 C58,74 60,64 62,56 Z"
                {...getMuscleColor('rear_delts')}
              />
              <path
                d="M102,54 C110,58 114,66 114,74 C114,80 110,84 104,82 C102,74 100,64 98,56 Z"
                {...getMuscleColor('rear_delts')}
              />

              {/* Triceps (Left & Right) */}
              <path
                d="M44,76 C38,84 38,98 40,108 C44,110 50,106 52,98 C54,88 52,80 46,76 Z"
                {...getMuscleColor('triceps')}
              />
              <path
                d="M116,76 C122,84 122,98 120,108 C116,110 110,106 108,98 C106,88 108,80 114,76 Z"
                {...getMuscleColor('triceps')}
              />

              {/* Forearms Rear */}
              <path
                d="M40,110 C36,122 36,134 38,144 C42,146 48,142 48,136 C50,126 48,116 46,110 Z"
                {...getMuscleColor('forearms')}
              />
              <path
                d="M120,110 C124,122 124,134 122,144 C118,146 112,142 112,136 C110,126 112,116 114,110 Z"
                {...getMuscleColor('forearms')}
              />

              {/* Hands */}
              <circle cx="37" cy="150" r="5" fill="#131722" stroke="#252e42" strokeWidth="1" />
              <circle cx="123" cy="150" r="5" fill="#131722" stroke="#252e42" strokeWidth="1" />

              {/* Latissimus Dorsi (Lats) */}
              <path
                d="M60,68 C56,82 58,104 68,118 C72,118 76,108 76,96 C72,86 66,76 60,68 Z"
                {...getMuscleColor('lats')}
              />
              <path
                d="M100,68 C104,82 102,104 92,118 C88,118 84,108 84,96 C88,86 94,76 100,68 Z"
                {...getMuscleColor('lats')}
              />

              {/* Rhomboids */}
              <path
                d="M66,66 L74,70 L74,86 L66,80 Z M94,66 L86,70 L86,86 L94,80 Z"
                {...getMuscleColor('rhomboids')}
              />

              {/* Lower Back / Erector Spinae */}
              <path
                d="M74,96 L86,96 L88,132 L72,132 Z"
                {...getMuscleColor('lower_back')}
              />

              {/* Glutes (Buttocks) */}
              <path
                d="M62,134 C58,146 58,162 66,172 C74,174 80,168 80,154 C80,144 74,136 62,134 Z"
                {...getMuscleColor('glutes')}
              />
              <path
                d="M98,134 C102,146 102,162 94,172 C86,174 80,168 80,154 C80,144 86,136 98,134 Z"
                {...getMuscleColor('glutes')}
              />

              {/* Hamstrings (Left & Right Posterior Thighs) */}
              <path
                d="M64,174 C60,190 60,202 66,212 C72,214 78,208 80,196 C82,184 76,174 64,174 Z"
                {...getMuscleColor('hamstrings')}
              />
              <path
                d="M96,174 C100,190 100,202 94,212 C88,214 82,208 80,196 C78,184 84,174 96,174 Z"
                {...getMuscleColor('hamstrings')}
              />

              {/* Knees (Popliteal) */}
              <circle cx="70" cy="216" r="4" fill="#131722" stroke="#252e42" strokeWidth="1" />
              <circle cx="90" cy="216" r="4" fill="#131722" stroke="#252e42" strokeWidth="1" />

              {/* Calves (Gastrocnemius & Soleus) */}
              <path
                d="M64,222 C58,236 60,256 66,270 C70,272 74,270 76,260 C78,246 76,232 72,222 Z"
                {...getMuscleColor('calves')}
              />
              <path
                d="M96,222 C102,236 100,256 94,270 C90,272 86,270 84,260 C82,246 84,232 88,222 Z"
                {...getMuscleColor('calves')}
              />

              {/* Feet Back */}
              <path d="M64,274 L74,274 L74,286 L62,286 Z" fill="#131722" stroke="#252e42" strokeWidth="1" />
              <path d="M96,274 L86,274 L86,286 L98,286 Z" fill="#131722" stroke="#252e42" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      {/* Muscle Labels Legend */}
      <div className="w-full mt-2 pt-2 border-t border-[#1a202e] flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-md bg-[#ccff00] border border-[#e6ff80]/50 shadow-sm shadow-[#ccff00]/40" />
          <span className="font-extrabold text-white text-[11px]">Primary:</span>
          <span className="text-[#ccff00] font-bold text-[11px] capitalize">
            {primaryLabel || primaryMuscles.map((m) => m.replace(/_/g, ' ')).join(', ')}
          </span>
        </div>

        {secondaryMuscles.length > 0 && (
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-md bg-[#fb923c] border border-[#fdba74]/50 shadow-sm shadow-[#fb923c]/40" />
            <span className="font-bold text-slate-400 text-[11px]">Assisting:</span>
            <span className="text-orange-300 font-semibold text-[11px] capitalize">
              {secondaryLabel.length > 0
                ? secondaryLabel.join(', ')
                : secondaryMuscles.map((m) => m.replace(/_/g, ' ')).join(', ')}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
