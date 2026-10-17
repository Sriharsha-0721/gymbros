import React, { useState, useMemo } from 'react';
import { EXERCISE_DATABASE, ExerciseDetail } from '../../lib/exerciseDatabase';
import { ExerciseDetailModal } from './ExerciseDetailModal';
import { 
  Search, 
  Dumbbell, 
  Filter, 
  Sparkles, 
  ChevronRight, 
  Check, 
  Repeat,
  X 
} from 'lucide-react';

interface ExerciseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSubstitute?: (exercise: ExerciseDetail) => void;
  isSubstitutionMode?: boolean;
  replacingExerciseName?: string;
}

export const ExerciseLibraryModal: React.FC<ExerciseLibraryModalProps> = ({
  isOpen,
  onClose,
  onSelectSubstitute,
  isSubstitutionMode = false,
  replacingExerciseName,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedEquipment, setSelectedEquipment] = useState<string>('All');
  const [selectedExerciseForDetail, setSelectedExerciseForDetail] = useState<ExerciseDetail | null>(null);

  const categories = ['All', 'Chest', 'Back', 'Shoulders', 'Legs', 'Arms', 'Core'];
  const equipmentOptions = ['All', 'Barbell', 'Dumbbell', 'Cable', 'Machine', 'Bodyweight'];

  const filteredExercises = useMemo(() => {
    return EXERCISE_DATABASE.filter((ex) => {
      const matchesSearch = 
        ex.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.targetMuscle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ex.equipment.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesCategory = selectedCategory === 'All' || ex.category === selectedCategory;
      const matchesEquipment = selectedEquipment === 'All' || ex.equipment === selectedEquipment;

      return matchesSearch && matchesCategory && matchesEquipment;
    });
  }, [searchQuery, selectedCategory, selectedEquipment]);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
        <div className="w-full max-w-3xl bg-[#0f1118] border border-[#232838] rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[88dvh] overflow-hidden my-auto">
          {/* Header */}
          <div className="px-4 sm:px-5 py-3 sm:py-4 border-b border-[#1b1f2b] flex items-center justify-between bg-[#131620] shrink-0">
            <div className="flex items-center gap-2.5 min-w-0 pr-2">
              <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00] shrink-0">
                <Dumbbell size={16} />
              </div>
              <div className="min-w-0">
                <h2 className="text-base font-extrabold text-white font-heading truncate">
                  {isSubstitutionMode ? 'Select Exercise Alternative' : 'Interactive Exercise Library'}
                </h2>
                <p className="text-xs text-slate-400 truncate">
                  {isSubstitutionMode 
                    ? `Replacing "${replacingExerciseName}" in your plan` 
                    : '100% offline, illustrated biomechanics & execution guides'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 min-w-[40px] rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white flex items-center justify-center transition-colors shrink-0"
              aria-label="Close library"
            >
              <X size={18} />
            </button>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="p-3 sm:p-4 border-b border-[#1b1f2b] bg-[#11131c] space-y-2.5 sm:space-y-3 shrink-0">
            {/* Search Input */}
            <div className="relative">
              <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search exercise, muscle (chest, quads, lats)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#161925] border border-[#23293b] rounded-xl pl-10 pr-4 py-2.5 text-base sm:text-xs text-white placeholder-slate-500 focus:outline-none focus:border-[#ccff00]"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-[#ccff00] text-black shadow-sm'
                      : 'bg-[#181c28] text-slate-400 hover:text-white hover:bg-[#202536]'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Exercise Grid */}
          <div className="p-3 sm:p-5 overflow-y-auto flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 gap-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
            {filteredExercises.length === 0 ? (
              <div className="col-span-full py-12 text-center text-slate-400 text-xs">
                No exercises matched your search criteria. Try a different muscle or keyword.
              </div>
            ) : (
              filteredExercises.map((ex) => (
                <div
                  key={ex.id}
                  className="p-4 rounded-xl bg-[#141722] border border-[#202536] hover:border-[#2d344a] flex flex-col justify-between gap-3 transition-all"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-[#ccff00] uppercase tracking-wider bg-[#ccff00]/10 px-2 py-0.5 rounded-full border border-[#ccff00]/30">
                        {ex.category}
                      </span>
                      <span className="text-[10px] text-slate-400 bg-[#0c0e14] px-2 py-0.5 rounded-md border border-[#1e2333]">
                        {ex.equipment}
                      </span>
                    </div>

                    <h4 className="font-extrabold text-sm text-white">
                      {ex.name}
                    </h4>

                    <p className="text-xs text-slate-400">
                      Primary: <strong className="text-slate-300">{ex.targetMuscle}</strong>
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-[#1e2333]">
                    <button
                      onClick={() => setSelectedExerciseForDetail(ex)}
                      className="text-xs font-bold text-slate-300 hover:text-[#ccff00] flex items-center gap-1 transition-colors"
                    >
                      <span>View Form Guide</span>
                      <ChevronRight size={13} />
                    </button>

                    {isSubstitutionMode && onSelectSubstitute && (
                      <button
                        onClick={() => {
                          onSelectSubstitute(ex);
                          onClose();
                        }}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#ccff00] text-black font-extrabold text-xs hover:bg-[#d8ff33] transition-all"
                      >
                        <Repeat size={12} />
                        <span>Substitute</span>
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Full Detail View Modal */}
      <ExerciseDetailModal
        exercise={selectedExerciseForDetail}
        isOpen={Boolean(selectedExerciseForDetail)}
        onClose={() => setSelectedExerciseForDetail(null)}
        allowSubstitution={isSubstitutionMode}
        onSubstitute={(sub) => {
          if (onSelectSubstitute) {
            onSelectSubstitute(sub);
            setSelectedExerciseForDetail(null);
            onClose();
          }
        }}
      />
    </>
  );
};
