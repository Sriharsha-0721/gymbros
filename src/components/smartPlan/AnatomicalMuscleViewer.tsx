import React, { useState, useEffect } from 'react';
import { AnatomyMuscle } from '../../lib/exerciseMediaMapping';
import { Layers, Eye, ShieldCheck, Sparkles, CheckCircle2 } from 'lucide-react';

interface AnatomicalMuscleViewerProps {
  primaryMuscles: AnatomyMuscle[];
  secondaryMuscles?: AnatomyMuscle[];
  primaryLabel?: string;
  secondaryLabel?: string[];
  className?: string;
}

export const AnatomicalMuscleViewer: React.FC<AnatomicalMuscleViewerProps> = ({
  primaryMuscles = [],
  secondaryMuscles = [],
  primaryLabel,
  secondaryLabel = [],
  className = '',
}) => {
  // Determine if primary muscle is predominantly posterior
  const isPosteriorPrimary = primaryMuscles.some((m) =>
    ['rear_delts', 'traps', 'rhomboids', 'lats', 'lower_back', 'triceps', 'glutes', 'hamstrings'].includes(m)
  );

  // Auto-select correct anatomical view based on the exercise's primary target
  const [viewMode, setViewMode] = useState<'front' | 'back' | 'both'>(
    isPosteriorPrimary ? 'back' : 'front'
  );

  // Update viewMode if exercise changes
  useEffect(() => {
    setViewMode(isPosteriorPrimary ? 'back' : 'front');
  }, [primaryMuscles, isPosteriorPrimary]);

  // Color generator with premium 3D anatomical styling
  const getMuscleStyle = (muscle: AnatomyMuscle) => {
    const isPrimary = primaryMuscles.includes(muscle);
    const isSecondary = secondaryMuscles.includes(muscle);

    if (isPrimary) {
      return {
        fill: 'url(#limeMuscularGradient)',
        stroke: '#e6ff80',
        strokeWidth: 1.5,
        filter: 'url(#glowLimeEffect)',
        opacity: 0.98,
        className: 'transition-all duration-300 cursor-pointer hover:brightness-110',
      };
    }

    if (isSecondary) {
      return {
        fill: 'url(#orangeMuscularGradient)',
        stroke: '#fdba74',
        strokeWidth: 1.5,
        filter: 'url(#glowOrangeEffect)',
        opacity: 0.94,
        className: 'transition-all duration-300 cursor-pointer hover:brightness-110',
      };
    }

    // Neutral anatomical tone
    return {
      fill: 'url(#neutralMuscularGradient)',
      stroke: '#283347',
      strokeWidth: 0.85,
      opacity: 0.78,
      className: 'transition-all duration-300',
    };
  };

  const formatMuscleName = (name: string) => {
    return name
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className={`rounded-2xl bg-[#090b10] border border-[#1e2436] p-3 sm:p-5 flex flex-col items-center select-none shadow-2xl relative overflow-hidden ${className}`}>
      {/* Background Studio Vignette */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          background: 'radial-gradient(circle at 50% 30%, #151a28 0%, #080a0f 80%)',
        }}
      />

      {/* SVG Global Filters & Muscular Gradients */}
      <svg className="hidden">
        <defs>
          {/* Primary Electric Lime 3D Shading */}
          <linearGradient id="limeMuscularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d9ff33" />
            <stop offset="45%" stopColor="#ccff00" />
            <stop offset="100%" stopColor="#99cc00" />
          </linearGradient>

          {/* Secondary Radiant Orange 3D Shading */}
          <linearGradient id="orangeMuscularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb923c" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#c2410c" />
          </linearGradient>

          {/* Neutral Anatomical Deep Charcoal Shading */}
          <linearGradient id="neutralMuscularGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1c2232" />
            <stop offset="70%" stopColor="#131722" />
            <stop offset="100%" stopColor="#0d1017" />
          </linearGradient>

          {/* Bone & Joint Shading */}
          <linearGradient id="jointGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#161b26" />
            <stop offset="100%" stopColor="#0d1017" />
          </linearGradient>

          {/* Electric Lime Glow Filter */}
          <filter id="glowLimeEffect" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feComponentTransfer in="blur" result="boost">
              <feFuncA type="linear" slope="1.4" />
            </feComponentTransfer>
            <feMerge>
              <feMergeNode in="boost" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Amber Orange Glow Filter */}
          <filter id="glowOrangeEffect" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Top Header & View Controls */}
      <div className="w-full relative z-10 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2.5 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-[#ccff00] animate-pulse" />
          </div>
          <div>
            <h3 className="text-xs font-black text-white tracking-wide uppercase">
              Realistic Muscle Heatmap
            </h3>
            <p className="text-[10px] text-slate-400">
              {isPosteriorPrimary ? 'Posterior chain target view' : 'Anterior chain target view'}
            </p>
          </div>
        </div>

        {/* View Mode Toggle Switcher */}
        <div className="flex items-center bg-[#11141c] p-1 rounded-xl border border-[#202638] self-stretch xs:self-auto justify-center">
          <button
            type="button"
            onClick={() => setViewMode('front')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider transition-all ${
              viewMode === 'front'
                ? 'bg-[#ccff00] text-[#090a0f] shadow-md shadow-[#ccff00]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Anterior (Front)
          </button>

          <button
            type="button"
            onClick={() => setViewMode('back')}
            className={`px-3 py-1.5 rounded-lg text-[10px] font-black tracking-wider transition-all ${
              viewMode === 'back'
                ? 'bg-[#ccff00] text-[#090a0f] shadow-md shadow-[#ccff00]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Posterior (Back)
          </button>

          <button
            type="button"
            onClick={() => setViewMode('both')}
            className={`px-2.5 py-1.5 rounded-lg text-[10px] font-black tracking-wider transition-all ${
              viewMode === 'both'
                ? 'bg-[#ccff00] text-[#090a0f] shadow-md shadow-[#ccff00]/25'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Dual View
          </button>
        </div>
      </div>

      {/* Main Anatomical Display Area */}
      <div className="w-full relative z-10 flex items-center justify-center gap-4 sm:gap-8 py-2 min-h-[310px] sm:min-h-[380px]">
        {/* ======================================================== */}
        {/* 1. ANTERIOR (FRONT) REALISTIC ANATOMY                   */}
        {/* ======================================================== */}
        {(viewMode === 'both' || viewMode === 'front') && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 px-2.5 py-0.5 rounded-full bg-[#131722] border border-[#222a3d]">
              Anterior View
            </span>

            <svg
              viewBox="0 0 200 440"
              className={`transition-all duration-300 drop-shadow-xl ${
                viewMode === 'front'
                  ? 'h-[320px] xs:h-[350px] sm:h-[400px] w-auto'
                  : 'h-[250px] sm:h-[300px] w-auto'
              }`}
            >
              {/* Silhouette Base & Head */}
              <ellipse cx="100" cy="30" rx="15" ry="19" fill="#10131d" stroke="#252d40" strokeWidth="1" />
              {/* Neck & Sternocleidomastoid */}
              <path d="M92,48 L108,48 L109,68 L91,68 Z" fill="#111520" stroke="#252d40" strokeWidth="1" />

              {/* Trapezius (Superior / Clavicular visible crest) */}
              <path
                d="M91,52 Q76,58 70,68 L78,71 Q90,64 100,64 Q110,64 122,71 L130,68 Q124,58 109,52 Z"
                {...getMuscleStyle('traps')}
              />

              {/* Deltoids (Shoulders: Anterior & Lateral) */}
              {/* Left Front Deltoid */}
              <path
                d="M68,69 C60,73 54,82 54,93 C54,101 58,107 66,104 C69,96 71,84 74,74 Z"
                {...getMuscleStyle('front_delts')}
              />
              {/* Left Side/Lateral Deltoid cap */}
              <path
                d="M54,77 C46,82 42,91 42,100 C42,107 46,112 52,109 C54,101 54,89 54,77 Z"
                {...getMuscleStyle('side_delts')}
              />
              {/* Right Front Deltoid */}
              <path
                d="M132,69 C140,73 146,82 146,93 C146,101 142,107 134,104 C131,96 129,84 126,74 Z"
                {...getMuscleStyle('front_delts')}
              />
              {/* Right Side/Lateral Deltoid cap */}
              <path
                d="M146,77 C154,82 158,91 158,100 C158,107 154,112 148,109 C146,101 146,89 146,77 Z"
                {...getMuscleStyle('side_delts')}
              />

              {/* Pectoralis Major (Chest: Left & Right with sternal division) */}
              {/* Left Pec */}
              <path
                d="M74,73 Q98,68 99,78 L99,114 C88,117 76,111 70,101 C68,90 70,80 74,73 Z"
                {...getMuscleStyle('chest')}
              />
              {/* Right Pec */}
              <path
                d="M126,73 Q102,68 101,78 L101,114 C112,117 124,111 130,101 C132,90 130,80 126,73 Z"
                {...getMuscleStyle('chest')}
              />

              {/* Biceps Brachii (Upper Arms) */}
              {/* Left Biceps */}
              <path
                d="M52,106 C47,113 46,128 49,141 C54,144 60,139 63,131 C65,121 64,111 58,106 Z"
                {...getMuscleStyle('biceps')}
              />
              {/* Right Biceps */}
              <path
                d="M148,106 C153,113 154,128 151,141 C146,144 140,139 137,131 C135,121 136,111 142,106 Z"
                {...getMuscleStyle('biceps')}
              />

              {/* Forearms (Brachioradialis & Flexors) */}
              {/* Left Forearm */}
              <path
                d="M49,143 C44,155 42,172 45,188 C50,191 57,186 58,178 C60,165 60,152 57,143 Z"
                {...getMuscleStyle('forearms')}
              />
              {/* Right Forearm */}
              <path
                d="M151,143 C156,155 158,172 155,188 C150,191 143,186 142,178 C140,165 140,152 143,143 Z"
                {...getMuscleStyle('forearms')}
              />
              {/* Hands */}
              <circle cx="45" cy="197" r="6" fill="#10131d" stroke="#252d40" strokeWidth="1" />
              <circle cx="155" cy="197" r="6" fill="#10131d" stroke="#252d40" strokeWidth="1" />

              {/* Serratus Anterior & Obliques (Flanks) */}
              {/* Left Serratus */}
              <path
                d="M71,114 C73,123 75,134 77,145 C80,147 82,146 82,142 C80,131 78,121 75,114 Z"
                {...getMuscleStyle('obliques')}
              />
              {/* Left Obliques */}
              <path
                d="M74,146 C77,158 79,173 81,186 C85,188 88,187 87,181 C85,168 83,156 79,146 Z"
                {...getMuscleStyle('obliques')}
              />
              {/* Right Serratus */}
              <path
                d="M129,114 C127,123 125,134 123,145 C120,147 118,146 118,142 C120,131 122,121 125,114 Z"
                {...getMuscleStyle('obliques')}
              />
              {/* Right Obliques */}
              <path
                d="M126,146 C123,158 121,173 119,186 C115,188 112,187 113,181 C115,168 117,156 121,146 Z"
                {...getMuscleStyle('obliques')}
              />

              {/* Rectus Abdominis (Six-Pack Core Segments) */}
              {/* Upper Pack Left */}
              <rect x="85" y="118" width="13" height="13" rx="3" {...getMuscleStyle('abs')} />
              {/* Upper Pack Right */}
              <rect x="102" y="118" width="13" height="13" rx="3" {...getMuscleStyle('abs')} />
              {/* Mid Pack Left */}
              <rect x="85" y="134" width="13" height="14" rx="3" {...getMuscleStyle('abs')} />
              {/* Mid Pack Right */}
              <rect x="102" y="134" width="13" height="14" rx="3" {...getMuscleStyle('abs')} />
              {/* Lower Pack Left */}
              <rect x="86" y="151" width="12" height="16" rx="3" {...getMuscleStyle('abs')} />
              {/* Lower Pack Right */}
              <rect x="102" y="151" width="12" height="16" rx="3" {...getMuscleStyle('abs')} />
              {/* Lower Abdominal V-Taper */}
              <path d="M86,170 Q100,186 100,188 Q100,186 114,170 Z" {...getMuscleStyle('abs')} />

              {/* Pelvis & Hips Base */}
              <path d="M81,188 Q100,192 119,188 L123,205 Q100,211 77,205 Z" fill="#10131d" stroke="#252d40" strokeWidth="1" />

              {/* Quadriceps Femoris (Thighs: Rectus Femoris, Vastus Lateralis & Medialis Teardrop) */}
              {/* Left Quadriceps (Rectus femoris & vastus lateralis) */}
              <path
                d="M77,208 C71,230 71,262 78,287 C86,290 94,286 96,278 C100,254 101,227 94,208 Z"
                {...getMuscleStyle('quads')}
              />
              {/* Left Vastus Medialis (Teardrop above knee) */}
              <path
                d="M87,272 C87,284 91,296 95,299 C98,299 100,294 100,286 C98,276 94,271 87,272 Z"
                {...getMuscleStyle('quads')}
              />

              {/* Right Quadriceps */}
              <path
                d="M123,208 C129,230 129,262 122,287 C114,290 106,286 104,278 C100,254 99,227 106,208 Z"
                {...getMuscleStyle('quads')}
              />
              {/* Right Vastus Medialis (Teardrop above knee) */}
              <path
                d="M113,272 C113,284 109,296 105,299 C102,299 100,294 100,286 C102,276 106,271 113,272 Z"
                {...getMuscleStyle('quads')}
              />

              {/* Knees & Patellar Tendon */}
              <circle cx="86" cy="305" r="7" fill="url(#jointGradient)" stroke="#252d40" strokeWidth="1" />
              <circle cx="114" cy="305" r="7" fill="url(#jointGradient)" stroke="#252d40" strokeWidth="1" />

              {/* Calves & Shins (Anterior) */}
              {/* Left Calf / Tibialis Anterior */}
              <path
                d="M81,316 C76,330 76,362 81,386 C86,389 91,386 93,376 C95,358 95,334 92,316 Z"
                {...getMuscleStyle('calves')}
              />
              {/* Right Calf / Tibialis Anterior */}
              <path
                d="M119,316 C124,330 124,362 119,386 C114,389 109,386 107,376 C105,358 105,334 108,316 Z"
                {...getMuscleStyle('calves')}
              />

              {/* Feet Base */}
              <path d="M78,390 L92,390 L95,410 L73,410 Z" fill="#10131d" stroke="#252d40" strokeWidth="1" />
              <path d="M122,390 L108,390 L105,410 L127,410 Z" fill="#10131d" stroke="#252d40" strokeWidth="1" />
            </svg>
          </div>
        )}

        {/* ======================================================== */}
        {/* 2. POSTERIOR (BACK) REALISTIC ANATOMY                   */}
        {/* ======================================================== */}
        {(viewMode === 'both' || viewMode === 'back') && (
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5 px-2.5 py-0.5 rounded-full bg-[#131722] border border-[#222a3d]">
              Posterior View
            </span>

            <svg
              viewBox="0 0 200 440"
              className={`transition-all duration-300 drop-shadow-xl ${
                viewMode === 'back'
                  ? 'h-[320px] xs:h-[350px] sm:h-[400px] w-auto'
                  : 'h-[250px] sm:h-[300px] w-auto'
              }`}
            >
              {/* Silhouette Base Back Head */}
              <ellipse cx="100" cy="30" rx="15" ry="19" fill="#10131d" stroke="#252d40" strokeWidth="1" />
              <path d="M92,48 L108,48 L109,64 L91,64 Z" fill="#111520" stroke="#252d40" strokeWidth="1" />

              {/* Trapezius (The Classic Anatomical Diamond/Kite) */}
              <path
                d="M91,52 L109,52 L126,65 L112,106 L100,120 L88,106 L74,65 Z"
                {...getMuscleStyle('traps')}
              />

              {/* Scapular Stabilizers: Rhomboids & Infraspinatus */}
              {/* Left Rhomboid/Infraspinatus */}
              <path
                d="M78,82 L88,88 L86,112 L76,104 Z"
                {...getMuscleStyle('rhomboids')}
              />
              {/* Right Rhomboid/Infraspinatus */}
              <path
                d="M122,82 L112,88 L114,112 L124,104 Z"
                {...getMuscleStyle('rhomboids')}
              />

              {/* Rear Deltoids (Posterior Shoulders) */}
              {/* Left Rear Deltoid */}
              <path
                d="M72,66 C62,71 56,80 56,92 C56,100 61,105 69,102 C72,93 74,81 77,71 Z"
                {...getMuscleStyle('rear_delts')}
              />
              {/* Right Rear Deltoid */}
              <path
                d="M128,66 C138,71 144,80 144,92 C144,100 139,105 131,102 C128,93 126,81 123,71 Z"
                {...getMuscleStyle('rear_delts')}
              />

              {/* Triceps Brachii (Posterior Upper Arm: Lateral & Long Heads) */}
              {/* Left Triceps */}
              <path
                d="M54,100 C47,109 46,126 50,140 C55,143 62,138 65,128 C67,117 66,107 59,100 Z"
                {...getMuscleStyle('triceps')}
              />
              {/* Right Triceps */}
              <path
                d="M146,100 C153,109 154,126 150,140 C145,143 138,138 135,128 C133,117 134,107 141,100 Z"
                {...getMuscleStyle('triceps')}
              />

              {/* Posterior Forearms (Extensors) */}
              {/* Left Forearm Extensor */}
              <path
                d="M50,142 C45,154 43,171 46,187 C51,190 58,185 59,177 C61,164 61,151 58,142 Z"
                {...getMuscleStyle('forearms')}
              />
              {/* Right Forearm Extensor */}
              <path
                d="M150,142 C155,154 157,171 154,187 C149,190 142,185 141,177 C139,164 139,151 142,142 Z"
                {...getMuscleStyle('forearms')}
              />
              {/* Hands Back */}
              <circle cx="46" cy="197" r="6" fill="#10131d" stroke="#252d40" strokeWidth="1" />
              <circle cx="154" cy="197" r="6" fill="#10131d" stroke="#252d40" strokeWidth="1" />

              {/* Latissimus Dorsi (Lats: The Iconic V-Taper Wings) */}
              {/* Left Lat Wing */}
              <path
                d="M74,86 C67,104 69,134 82,156 C88,155 93,142 93,126 C88,112 80,98 74,86 Z"
                {...getMuscleStyle('lats')}
              />
              {/* Right Lat Wing */}
              <path
                d="M126,86 C133,104 131,134 118,156 C112,155 107,142 107,126 C112,112 120,98 126,86 Z"
                {...getMuscleStyle('lats')}
              />

              {/* Lower Back / Erector Spinae (Lumbar Spinal Columns) */}
              {/* Left Erector Spinae */}
              <path
                d="M91,122 L99,122 L99,180 L90,178 Z"
                {...getMuscleStyle('lower_back')}
              />
              {/* Right Erector Spinae */}
              <path
                d="M101,122 L109,122 L110,178 L101,180 Z"
                {...getMuscleStyle('lower_back')}
              />

              {/* Gluteal Complex (Gluteus Medius & Maximus: Large Defined Buttocks) */}
              {/* Left Gluteus Medius (Upper Lateral Hip) */}
              <path
                d="M73,178 C68,187 67,198 72,207 C78,208 86,203 89,195 C88,186 82,180 73,178 Z"
                {...getMuscleStyle('glutes')}
              />
              {/* Left Gluteus Maximus */}
              <path
                d="M76,192 C68,206 68,228 78,244 C88,247 98,238 99,220 C99,207 92,196 76,192 Z"
                {...getMuscleStyle('glutes')}
              />

              {/* Right Gluteus Medius */}
              <path
                d="M127,178 C132,187 133,198 128,207 C122,208 114,203 111,195 C112,186 118,180 127,178 Z"
                {...getMuscleStyle('glutes')}
              />
              {/* Right Gluteus Maximus */}
              <path
                d="M124,192 C132,206 132,228 122,244 C112,247 102,238 101,220 C101,207 108,196 124,192 Z"
                {...getMuscleStyle('glutes')}
              />

              {/* Hamstrings (Posterior Thigh: Biceps Femoris, Semitendinosus & Semimembranosus) */}
              {/* Left Hamstring Group */}
              <path
                d="M78,246 C73,266 73,284 80,300 C88,303 96,295 98,280 C100,264 94,248 78,246 Z"
                {...getMuscleStyle('hamstrings')}
              />
              {/* Right Hamstring Group */}
              <path
                d="M122,246 C127,266 127,284 120,300 C112,303 104,295 102,280 C100,264 106,248 122,246 Z"
                {...getMuscleStyle('hamstrings')}
              />

              {/* Popliteal Fossa (Back of Knees) */}
              <ellipse cx="86" cy="309" rx="6" ry="5" fill="url(#jointGradient)" stroke="#252d40" strokeWidth="1" />
              <ellipse cx="114" cy="309" rx="6" ry="5" fill="url(#jointGradient)" stroke="#252d40" strokeWidth="1" />

              {/* Calves (Gastrocnemius Medial & Lateral Heads, Soleus, Achilles) */}
              {/* Left Calf Gastrocnemius */}
              <path
                d="M78,316 C71,332 73,358 81,376 C87,378 93,374 95,362 C98,344 95,328 89,316 Z"
                {...getMuscleStyle('calves')}
              />
              {/* Right Calf Gastrocnemius */}
              <path
                d="M122,316 C129,332 127,358 119,376 C113,378 107,374 105,362 C102,344 105,328 111,316 Z"
                {...getMuscleStyle('calves')}
              />

              {/* Achilles Tendon & Feet Back */}
              <path d="M83,380 L89,380 L91,406 L81,406 Z" fill="#10131d" stroke="#252d40" strokeWidth="1" />
              <path d="M117,380 L111,380 L109,406 L119,406 Z" fill="#10131d" stroke="#252d40" strokeWidth="1" />
            </svg>
          </div>
        )}
      </div>

      {/* Clear Anatomical Muscle Legend & Activation Badges */}
      <div className="w-full relative z-10 mt-3 pt-3 border-t border-[#1a2030] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 text-xs">
        {/* Left: Highlight Chips */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Primary Target Chip */}
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 shadow-sm shadow-[#ccff00]/15">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ccff00] shadow-sm shadow-[#ccff00]" />
            <span className="font-black text-white text-[11px] uppercase tracking-wider">Primary:</span>
            <span className="text-[#ccff00] font-extrabold text-[11px] capitalize">
              {primaryLabel || primaryMuscles.map(formatMuscleName).join(', ')}
            </span>
          </div>

          {/* Assisting / Secondary Chip */}
          {secondaryMuscles.length > 0 && (
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-orange-500/10 border border-orange-500/30 shadow-sm shadow-orange-500/15">
              <span className="w-2.5 h-2.5 rounded-full bg-[#f97316] shadow-sm shadow-orange-500" />
              <span className="font-black text-slate-300 text-[11px] uppercase tracking-wider">Assisting:</span>
              <span className="text-orange-300 font-bold text-[11px] capitalize">
                {secondaryLabel.length > 0
                  ? secondaryLabel.join(', ')
                  : secondaryMuscles.map(formatMuscleName).join(', ')}
              </span>
            </div>
          )}
        </div>

        {/* Right: Bilateral activation note */}
        <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-medium">
          <CheckCircle2 size={13} className="text-[#ccff00]" />
          <span>Bilateral symmetric activation</span>
        </div>
      </div>
    </div>
  );
};
