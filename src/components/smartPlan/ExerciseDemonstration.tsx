import React, { useState, useRef } from 'react';
import { ExerciseMediaRecord, getExerciseMedia } from '../../lib/exerciseMediaMapping';
import { AnatomicalMuscleViewer } from './AnatomicalMuscleViewer';
import { Play, Pause, RotateCcw, Activity, Dumbbell, ExternalLink, ShieldCheck } from 'lucide-react';

interface ExerciseDemonstrationProps {
  exerciseId: string;
  exerciseName: string;
  targetMuscleDesc?: string;
  secondaryMusclesDesc?: string;
  className?: string;
}

export const ExerciseDemonstration: React.FC<ExerciseDemonstrationProps> = ({
  exerciseId,
  exerciseName,
  targetMuscleDesc,
  secondaryMusclesDesc,
  className = '',
}) => {
  const mediaRecord: ExerciseMediaRecord | null = getExerciseMedia(exerciseId, exerciseName);

  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'demo' | 'anatomy'>('demo');
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);
  const [loadError, setLoadError] = useState<boolean>(false);
  const [replayKey, setReplayKey] = useState<number>(0);

  const handleReplay = () => {
    setIsPlaying(true);
    setReplayKey((prev) => prev + 1);
  };

  const handleTogglePlay = () => {
    setIsPlaying((prev) => !prev);
  };

  if (!mediaRecord) {
    return (
      <div className={`p-6 rounded-2xl bg-[#0f1118] border border-[#202538] text-center space-y-3 ${className}`}>
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center">
          <Dumbbell size={24} />
        </div>
        <h4 className="font-extrabold text-sm text-white">Movement Demonstration Unavailable</h4>
        <p className="text-xs text-slate-400 max-w-sm mx-auto">
          We do not substitute unrelated exercises. Please refer to the form setup and movement cues below.
        </p>
      </div>
    );
  }

  const currentMediaSrc = isPlaying ? `${mediaRecord.gifUrl}?k=${replayKey}` : mediaRecord.posterUrl;

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Top Media Switcher Bar */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 bg-[#121520] p-1 rounded-xl border border-[#202638]">
          <button
            type="button"
            onClick={() => setActiveTab('demo')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'demo'
                ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Play size={12} className={activeTab === 'demo' ? 'fill-black' : ''} />
            <span>Movement Demo</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('anatomy')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-black transition-all ${
              activeTab === 'anatomy'
                ? 'bg-[#ccff00] text-black shadow-md shadow-[#ccff00]/20'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Activity size={12} />
            <span>Muscle Heatmap</span>
          </button>
        </div>

        {activeTab === 'demo' && (
          <div className="flex items-center gap-1 bg-[#121520] p-1 rounded-xl border border-[#202638]">
            <button
              type="button"
              onClick={handleTogglePlay}
              className="p-1.5 rounded-lg text-slate-300 hover:text-[#ccff00] hover:bg-[#1a1f30] active:scale-95 transition-all"
              title={isPlaying ? 'Pause animation' : 'Play animation'}
              aria-label={isPlaying ? 'Pause animation' : 'Play animation'}
            >
              {isPlaying ? <Pause size={14} /> : <Play size={14} className="fill-current" />}
            </button>
            <button
              type="button"
              onClick={handleReplay}
              className="p-1.5 rounded-lg text-slate-300 hover:text-[#ccff00] hover:bg-[#1a1f30] active:scale-95 transition-all"
              title="Replay from start"
              aria-label="Replay from start"
            >
              <RotateCcw size={14} />
            </button>
          </div>
        )}
      </div>

      {/* Main Display Area */}
      {activeTab === 'demo' ? (
        <div className="relative rounded-2xl bg-[#0b0d13] border border-[#202638] overflow-hidden flex flex-col items-center justify-center min-h-[260px] sm:min-h-[300px] shadow-2xl">
          {/* Subtle Grid Background */}
          <div
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage:
                'radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)',
              backgroundSize: '24px 24px',
            }}
          />

          {/* Loading Skeleton */}
          {!imgLoaded && !loadError && (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 bg-[#0d0f17] z-10 animate-pulse">
              <Dumbbell size={28} className="text-[#ccff00] animate-bounce" />
              <span className="text-xs font-bold text-slate-400">Loading exercise demonstration...</span>
            </div>
          )}

          {/* Error State */}
          {loadError ? (
            <div className="p-6 text-center space-y-2 z-10">
              <p className="text-xs text-amber-400 font-bold">Failed to stream online GIF asset.</p>
              <p className="text-[11px] text-slate-400">Displaying form guide below.</p>
              <img
                src={mediaRecord.posterUrl}
                alt={exerciseName}
                className="max-h-56 object-contain rounded-xl border border-[#22293d]"
              />
            </div>
          ) : (
            <div className="relative z-0 p-2 sm:p-4 flex items-center justify-center w-full">
              <img
                key={replayKey}
                src={currentMediaSrc}
                alt={exerciseName}
                loading="lazy"
                onLoad={() => setImgLoaded(true)}
                onError={() => {
                  setLoadError(true);
                  setImgLoaded(true);
                }}
                className={`max-h-64 sm:max-h-72 w-auto object-contain rounded-xl transition-opacity duration-300 ${
                  imgLoaded ? 'opacity-100' : 'opacity-0'
                }`}
              />
            </div>
          )}

          {/* Bottom Badges Overlay */}
          <div className="w-full bg-[#10131d]/90 backdrop-blur-md px-3.5 py-2 border-t border-[#1b2233] flex items-center justify-between gap-2 text-[11px]">
            <div className="flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-[#ccff00]" />
              <span className="font-extrabold text-white truncate capitalize">{mediaRecord.name}</span>
            </div>
            <span className="text-[10px] text-slate-500 shrink-0 font-medium">
              {mediaRecord.attribution}
            </span>
          </div>
        </div>
      ) : (
        /* Realistic Anatomical Heatmap View */
        <AnatomicalMuscleViewer
          primaryMuscles={mediaRecord.primaryAnatomy}
          secondaryMuscles={mediaRecord.secondaryAnatomy}
          primaryLabel={targetMuscleDesc || mediaRecord.targetMuscle}
          secondaryLabel={
            secondaryMusclesDesc
              ? [secondaryMusclesDesc]
              : mediaRecord.secondaryMuscles
          }
        />
      )}
    </div>
  );
};
