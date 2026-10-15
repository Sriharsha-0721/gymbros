import React from 'react';
import { ExerciseDetail } from '../../lib/exerciseDatabase';
import { ExerciseIllustration } from './ExerciseIllustration';
import { 
  X, 
  Dumbbell, 
  Wind, 
  AlertTriangle, 
  ShieldCheck, 
  ArrowRight, 
  Check, 
  Sparkles,
  Repeat
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
  if (!isOpen || !exercise) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0f1118] border border-[#232838] rounded-2xl shadow-2xl flex flex-col max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1b1f2b] flex items-center justify-between bg-[#131620]">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] uppercase font-bold text-[#ccff00] bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/30">
                {exercise.category}
              </span>
              <span className="text-[10px] text-slate-400 bg-[#1b1f2b] px-2 py-0.5 rounded-full border border-[#282f42]">
                {exercise.equipment}
              </span>
              <span className="text-[10px] text-slate-400 bg-[#1b1f2b] px-2 py-0.5 rounded-full border border-[#282f42]">
                {exercise.difficulty}
              </span>
            </div>
            <h2 className="text-lg font-black text-white font-heading mt-1">
              {exercise.name}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-sm text-slate-300">
          {/* Vector Biomechanics Illustration */}
          <ExerciseIllustration
            svgType={exercise.svgType}
            name={exercise.name}
            targetMuscle={exercise.targetMuscle}
            className="w-full h-44"
          />

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="p-3 rounded-xl bg-[#141722] border border-[#202536]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Sets</span>
              <span className="text-xs font-black text-white mt-0.5 block">{exercise.recommendedSetsReps}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#141722] border border-[#202536]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Target Rest</span>
              <span className="text-xs font-black text-white mt-0.5 block">{exercise.recommendedRest}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#141722] border border-[#202536]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Primary Muscle</span>
              <span className="text-xs font-black text-[#ccff00] mt-0.5 block truncate">{exercise.targetMuscle}</span>
            </div>
            <div className="p-3 rounded-xl bg-[#141722] border border-[#202536]">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Equipment</span>
              <span className="text-xs font-black text-white mt-0.5 block">{exercise.equipment}</span>
            </div>
          </div>

          {/* Setup & Starting Position */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Dumbbell size={14} className="text-[#ccff00]" />
              Setup & Starting Position
            </h4>
            <p className="text-xs text-slate-300 bg-[#12141c] p-3 rounded-xl border border-[#1e2333] leading-relaxed">
              {exercise.startingPosition}
            </p>
          </div>

          {/* Execution Steps */}
          <div className="space-y-2">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <Check size={14} className="text-[#ccff00]" />
              Step-by-Step Technique
            </h4>
            <div className="space-y-1.5">
              {exercise.executionSteps.map((step, idx) => (
                <div 
                  key={idx}
                  className="flex items-start gap-2.5 p-2.5 rounded-lg bg-[#141722] border border-[#202536] text-xs"
                >
                  <span className="w-5 h-5 rounded-full bg-[#1e2333] text-[11px] font-bold text-[#ccff00] flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span className="text-slate-300 leading-relaxed">{step}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Breathing Guidance */}
          <div className="p-3.5 rounded-xl bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-start gap-3">
            <Wind size={18} className="text-[#ccff00] shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-extrabold text-[#ccff00] uppercase tracking-wider block">
                Breathing Guidance
              </span>
              <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">
                {exercise.breathingCue}
              </p>
            </div>
          </div>

          {/* Common Mistakes */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={14} className="text-amber-400" />
              Common Mistakes to Avoid
            </h4>
            <div className="space-y-1">
              {exercise.commonMistakes.map((mistake, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-slate-400">
                  <span className="text-rose-400 font-bold shrink-0">✕</span>
                  <span>{mistake}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Variations */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#141722] border border-[#202536]">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">
                Easier Variation
              </span>
              <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                {exercise.easierVariation}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#141722] border border-[#202536]">
              <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider block">
                Harder Variation
              </span>
              <span className="text-xs font-semibold text-slate-200 mt-0.5 block">
                {exercise.harderVariation}
              </span>
            </div>
          </div>

          {/* Safety Notice */}
          <div className="p-3 rounded-xl bg-[#141722] border border-[#232838] flex items-start gap-2.5">
            <ShieldCheck size={16} className="text-slate-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-relaxed">
              <strong className="text-slate-300">Safety & Joint Note:</strong> {exercise.safetyCautions}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3.5 border-t border-[#1b1f2b] flex items-center justify-between bg-[#131620]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#1a1e2b] text-slate-300 hover:text-white font-bold text-xs transition-colors"
          >
            Close Guide
          </button>

          {allowSubstitution && onSubstitute && (
            <button
              onClick={() => onSubstitute(exercise)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#ccff00] text-black hover:bg-[#d8ff33] font-black text-xs shadow-md shadow-[#ccff00]/15 transition-all"
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
