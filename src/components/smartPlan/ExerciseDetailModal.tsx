import React, { useEffect, useState } from 'react';
import { ExerciseDetail } from '../../lib/exerciseDatabase';
import { ExerciseIllustration } from './ExerciseIllustration';
import { 
  X, 
  Dumbbell, 
  Wind, 
  AlertTriangle, 
  ShieldCheck, 
  Check, 
  Sparkles,
  Repeat,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface ExerciseDetailModalProps {
  exercise: ExerciseDetail | null;
  isOpen: boolean;
  onClose: () => void;
  onSubstitute?: (newExercise: ExerciseDetail) => void;
  allowSubstitution?: boolean;
}

export const ExerciseDetailModal: React.FC<ExerciseDetailModalProps> = ({
  exercise,
  isOpen,
  onClose,
  onSubstitute,
  allowSubstitution = false,
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen, onClose]);

  // Lock background scroll on mount
  useEffect(() => {
    if (isOpen) {
      const originalStyle = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalStyle;
      };
    }
  }, [isOpen]);

  if (!isOpen || !exercise) return null;

  const handleClose = (e?: React.SyntheticEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[70] flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200"
      onClick={handleClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exercise-modal-title"
    >
      <div 
        className="w-full max-w-xl bg-[#0f1118] border border-[#232838] rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[88dvh] overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Pinned Modal Header */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-b border-[#1b1f2b] flex items-center justify-between bg-[#131620] shrink-0">
          <div className="min-w-0 pr-3">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
              <span className="text-[10px] uppercase font-black text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/30">
                {exercise.category}
              </span>
              <span className="text-[10px] text-slate-300 bg-[#1b1f2b] px-2 py-0.5 rounded-full border border-[#282f42] font-semibold">
                {exercise.equipment}
              </span>
              <span className="text-[10px] text-slate-400 bg-[#1b1f2b] px-2 py-0.5 rounded-full border border-[#282f42] capitalize font-medium">
                {exercise.difficulty}
              </span>
            </div>
            <h2 id="exercise-modal-title" className="text-base sm:text-lg font-black text-white font-heading mt-1 truncate">
              {exercise.name}
            </h2>
          </div>

          {/* Top Accessible Close Button */}
          <button
            type="button"
            onClick={handleClose}
            onTouchEnd={handleClose}
            className="w-11 h-11 min-w-[44px] min-h-[44px] rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white flex items-center justify-center transition-colors shrink-0 cursor-pointer touch-manipulation z-20 border border-white/10"
            aria-label="Close movement details"
            title="Close"
          >
            <X size={20} strokeWidth={2.5} />
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1 min-h-0 space-y-4 text-sm text-slate-300">
          {/* Visual Movement Demonstration Player */}
          <ExerciseIllustration
            svgType={exercise.svgType}
            name={exercise.name}
            targetMuscle={exercise.targetMuscle}
            className="w-full h-52 sm:h-60"
          />

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#141722] border border-[#202536]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended</span>
              <span className="text-xs font-black text-white mt-0.5 block">{exercise.recommendedSetsReps}</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#141722] border border-[#202536]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Rest</span>
              <span className="text-xs font-black text-white mt-0.5 block">{exercise.recommendedRest}</span>
            </div>
            <div className="p-2 sm:p-2.5 rounded-xl bg-[#141722] border border-[#202536]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Equipment</span>
              <span className="text-xs font-black text-[#ccff00] mt-0.5 block truncate">{exercise.equipment}</span>
            </div>
          </div>

          {/* Scannable Short Instructions Card */}
          <div className="p-4 rounded-xl bg-[#141722] border border-[#202536] space-y-3">
            {/* Target Muscle */}
            <div className="flex items-start gap-2.5">
              <span className="text-xs font-black text-[#ccff00] uppercase tracking-wider min-w-[70px] shrink-0 pt-0.5">
                Target:
              </span>
              <span className="text-xs font-semibold text-white">
                {exercise.targetMuscle}
                {exercise.secondaryMuscles && exercise.secondaryMuscles.length > 0 && (
                  <span className="text-slate-400 font-normal"> (Assisting: {exercise.secondaryMuscles.join(', ')})</span>
                )}
              </span>
            </div>

            {/* Setup */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-[#1b1f2d]">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider min-w-[70px] shrink-0 pt-0.5">
                Setup:
              </span>
              <span className="text-xs text-slate-200 leading-relaxed">
                {exercise.startingPosition}
              </span>
            </div>

            {/* Movement Steps */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-[#1b1f2d]">
              <span className="text-xs font-black text-slate-300 uppercase tracking-wider min-w-[70px] shrink-0 pt-0.5">
                Movement:
              </span>
              <div className="space-y-1.5 flex-1">
                {exercise.executionSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-200 leading-relaxed">
                    <span className="font-mono font-bold text-[#ccff00] shrink-0">{idx + 1}.</span>
                    <span>{step}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Breathing */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-[#1b1f2d]">
              <span className="text-xs font-black text-sky-400 uppercase tracking-wider min-w-[70px] shrink-0 pt-0.5">
                Breathing:
              </span>
              <span className="text-xs text-slate-200 leading-relaxed">
                {exercise.breathingCue}
              </span>
            </div>

            {/* Avoid Common Mistakes */}
            <div className="flex items-start gap-2.5 pt-2 border-t border-[#1b1f2d]">
              <span className="text-xs font-black text-rose-400 uppercase tracking-wider min-w-[70px] shrink-0 pt-0.5">
                Avoid:
              </span>
              <div className="space-y-1 flex-1">
                {exercise.commonMistakes.map((mistake, idx) => (
                  <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-300">
                    <span className="text-rose-400 font-bold shrink-0">•</span>
                    <span>{mistake}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Optional Toggle: Variations & Joint Safety */}
          <div className="rounded-xl bg-[#141722] border border-[#202536] overflow-hidden">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-bold text-slate-300 hover:text-white transition-colors"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={15} className="text-[#ccff00]" />
                <span>Variations & Safety Advice</span>
              </div>
              {showAdvanced ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
            </button>

            {showAdvanced && (
              <div className="p-4 pt-1 border-t border-[#1d2232] space-y-3 animate-in fade-in duration-150">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-[#0b0d14] border border-[#1e2333]">
                    <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                      Easier Progression
                    </span>
                    <span className="text-xs text-slate-200 mt-0.5 block">{exercise.easierVariation}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-[#0b0d14] border border-[#1e2333]">
                    <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                      Harder Progression
                    </span>
                    <span className="text-xs text-slate-200 mt-0.5 block">{exercise.harderVariation}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-lg bg-[#0b0d14] border border-[#1e2333] flex items-start gap-2">
                  <ShieldCheck size={14} className="text-slate-400 shrink-0 mt-0.5" />
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    <strong className="text-slate-300">Safety Cue:</strong> {exercise.safetyCautions}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Pinned Responsive Modal Footer */}
        <div className="px-4 sm:px-5 py-3 sm:py-3.5 border-t border-[#1b1f2b] flex items-center justify-between gap-3 bg-[#131620] shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          <button
            type="button"
            onClick={handleClose}
            onTouchEnd={handleClose}
            className="px-5 py-2.5 min-h-[44px] rounded-xl bg-[#1a1e2b] active:bg-[#252b3d] text-slate-200 hover:text-white font-bold text-xs transition-colors flex items-center justify-center cursor-pointer touch-manipulation border border-[#2a3044]"
          >
            Close Guide
          </button>

          {allowSubstitution && onSubstitute && (
            <button
              type="button"
              onClick={() => onSubstitute(exercise)}
              className="flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#ccff00] hover:bg-[#d8ff33] active:scale-95 text-black font-black text-xs shadow-md shadow-[#ccff00]/15 transition-all cursor-pointer touch-manipulation"
            >
              <Repeat size={14} />
              <span>Substitute Into Plan</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
