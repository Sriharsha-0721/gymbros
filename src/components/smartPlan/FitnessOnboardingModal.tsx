import React, { useState } from 'react';
import { 
  FitnessProfile, 
  ExperienceLevel, 
  EquipmentType, 
  PrimaryGoal, 
  PhysiqueAspiration, 
  WorkoutStyle, 
  CardioPreference, 
  OutdoorActivityType 
} from '../../types/smartPlan';
import { 
  Dumbbell, 
  Flame, 
  Target, 
  Calendar, 
  ShieldAlert, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Check, 
  Info, 
  Heart, 
  Zap, 
  Activity,
  AlertTriangle,
  Scale
} from 'lucide-react';
import { sanitizeNumericInput } from '../../lib/numberUtils';

interface FitnessOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProfile: (profile: FitnessProfile) => Promise<void>;
  initialProfile?: FitnessProfile | null;
}

export const FitnessOnboardingModal: React.FC<FitnessOnboardingModalProps> = ({
  isOpen,
  onClose,
  onSaveProfile,
  initialProfile,
}) => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Unit toggles
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>('cm');
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lbs'>('kg');

  // Step A: Basic Info
  const [heightCm, setHeightCm] = useState<number>(initialProfile?.height_cm || 175);
  const [heightFeet, setHeightFeet] = useState<number>(5);
  const [heightInches, setHeightInches] = useState<number>(9);

  const [weightKg, setWeightKg] = useState<number>(initialProfile?.weight_kg || 75);
  const [weightLbs, setWeightLbs] = useState<number>(Math.round((initialProfile?.weight_kg || 75) * 2.20462));

  const [age, setAge] = useState<number | undefined>(initialProfile?.age || 25);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(
    initialProfile?.experience_level || 'beginner'
  );
  const [equipment, setEquipment] = useState<EquipmentType[]>(
    initialProfile?.equipment || ['full_gym']
  );

  // Step B: Goals
  const [primaryGoal, setPrimaryGoal] = useState<PrimaryGoal>(
    initialProfile?.primary_goal || 'muscle_building'
  );
  const [secondaryGoals, setSecondaryGoals] = useState<PrimaryGoal[]>(
    initialProfile?.secondary_goals || []
  );
  const [customGoal, setCustomGoal] = useState<string>(initialProfile?.custom_goal || '');

  // Step C: Physique Aspirations
  const [physiquePreference, setPhysiquePreference] = useState<PhysiqueAspiration>(
    initialProfile?.physique_preference || 'lean_muscular'
  );

  // Step D: Weekly Schedule
  const [daysPerWeek, setDaysPerWeek] = useState<number>(initialProfile?.days_per_week || 4);
  const [durationMinutes, setDurationMinutes] = useState<number>(initialProfile?.duration_minutes || 45);

  // Step E: Workout Style
  const [workoutStyle, setWorkoutStyle] = useState<WorkoutStyle[]>(
    initialProfile?.workout_style || ['hypertrophy']
  );
  const [scheduleFlexibility, setScheduleFlexibility] = useState<'structured' | 'flexible'>(
    initialProfile?.schedule_flexibility || 'flexible'
  );

  // Step F: Cardio & Outdoors
  const [cardioPreference, setCardioPreference] = useState<CardioPreference>(
    initialProfile?.cardio_preference || 'moderate'
  );
  const [outdoorActivities, setOutdoorActivities] = useState<OutdoorActivityType[]>(
    initialProfile?.outdoor_activities || ['running', 'walking']
  );

  // Step G: Safety & Limitations
  const [injuries, setInjuries] = useState<string[]>(initialProfile?.injuries || []);
  const [limitationsNotes, setLimitationsNotes] = useState<string>(
    initialProfile?.limitations_notes || ''
  );

  // Step H: Target Goals & Review
  const [targetGoal, setTargetGoal] = useState<string>(
    initialProfile?.target_goal || 'Complete 4 workouts each week consistently'
  );
  const [targetWeightKg, setTargetWeightKg] = useState<number | undefined>(
    initialProfile?.target_weight_kg || undefined
  );
  const [targetReviewDate, setTargetReviewDate] = useState<string>(
    initialProfile?.target_review_date || 
    new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );

  if (!isOpen) return null;

  // Convert unit changes
  const handleHeightUnitChange = (newUnit: 'cm' | 'ft') => {
    if (newUnit === 'ft' && heightUnit === 'cm') {
      const totalInches = heightCm / 2.54;
      setHeightFeet(Math.floor(totalInches / 12));
      setHeightInches(Math.round(totalInches % 12));
    } else if (newUnit === 'cm' && heightUnit === 'ft') {
      const calculatedCm = Math.round((heightFeet * 12 + heightInches) * 2.54);
      setHeightCm(calculatedCm);
    }
    setHeightUnit(newUnit);
  };

  const handleFeetChange = (valStr: string) => {
    const sanitized = sanitizeNumericInput(valStr);
    const digits = sanitized.replace(/\D/g, '');
    if (!digits) {
      setHeightFeet(0);
      return;
    }
    const cleanNum = parseInt(digits, 10);
    setHeightFeet(Math.min(8, cleanNum));
  };

  const handleInchesChange = (valStr: string) => {
    const sanitized = sanitizeNumericInput(valStr);
    const digits = sanitized.replace(/\D/g, '');
    if (!digits) {
      setHeightInches(0);
      return;
    }
    const cleanNum = parseInt(digits, 10);
    setHeightInches(Math.min(11, cleanNum));
  };

  const handleWeightUnitChange = (newUnit: 'kg' | 'lbs') => {
    if (newUnit === 'lbs' && weightUnit === 'kg') {
      setWeightLbs(Math.round(weightKg * 2.20462));
    } else if (newUnit === 'kg' && weightUnit === 'lbs') {
      setWeightKg(Math.round(weightLbs / 2.20462));
    }
    setWeightUnit(newUnit);
  };

  // BMI Calculation
  const activeHeightInM = (heightUnit === 'cm' ? heightCm : (heightFeet * 12 + heightInches) * 2.54) / 100;
  const activeWeightInKg = weightUnit === 'kg' ? weightKg : weightLbs / 2.20462;
  const bmi = activeHeightInM > 0 ? (activeWeightInKg / (activeHeightInM * activeHeightInM)).toFixed(1) : '22.0';

  const toggleEquipment = (eq: EquipmentType) => {
    if (equipment.includes(eq)) {
      if (equipment.length > 1) {
        setEquipment(equipment.filter(e => e !== eq));
      }
    } else {
      setEquipment([...equipment, eq]);
    }
  };

  const toggleSecondaryGoal = (goal: PrimaryGoal) => {
    if (secondaryGoals.includes(goal)) {
      setSecondaryGoals(secondaryGoals.filter(g => g !== goal));
    } else {
      if (secondaryGoals.length < 3) {
        setSecondaryGoals([...secondaryGoals, goal]);
      }
    }
  };

  const toggleWorkoutStyle = (style: WorkoutStyle) => {
    if (workoutStyle.includes(style)) {
      if (workoutStyle.length > 1) {
        setWorkoutStyle(workoutStyle.filter(s => s !== style));
      }
    } else {
      setWorkoutStyle([...workoutStyle, style]);
    }
  };

  const toggleOutdoor = (act: OutdoorActivityType) => {
    if (outdoorActivities.includes(act)) {
      setOutdoorActivities(outdoorActivities.filter(a => a !== act));
    } else {
      setOutdoorActivities([...outdoorActivities, act]);
    }
  };

  const toggleInjury = (inj: string) => {
    if (inj === 'none') {
      setInjuries([]);
      return;
    }
    if (injuries.includes(inj)) {
      setInjuries(injuries.filter(i => i !== inj));
    } else {
      setInjuries([...injuries.filter(i => i !== 'none'), inj]);
    }
  };

  const handleComplete = async () => {
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const finalHeightCm = heightUnit === 'cm' ? heightCm : Math.round((heightFeet * 12 + heightInches) * 2.54);
      const finalWeightKg = weightUnit === 'kg' ? weightKg : Math.round(weightLbs / 2.20462);

      const profilePayload: FitnessProfile = {
        user_id: initialProfile?.user_id || '',
        height_cm: finalHeightCm,
        weight_kg: finalWeightKg,
        age: age ? Number(age) : undefined,
        experience_level: experienceLevel,
        equipment,
        primary_goal: primaryGoal,
        secondary_goals: secondaryGoals,
        custom_goal: customGoal.trim() || undefined,
        physique_preference: physiquePreference,
        days_per_week: daysPerWeek,
        duration_minutes: durationMinutes,
        workout_style: workoutStyle,
        schedule_flexibility: scheduleFlexibility,
        cardio_preference: cardioPreference,
        outdoor_activities: outdoorActivities,
        injuries,
        limitations_notes: limitationsNotes.trim() || undefined,
        target_goal: targetGoal.trim() || 'Build a consistent 4-day workout habit',
        target_weight_kg: targetWeightKg ? Number(targetWeightKg) : undefined,
        target_review_date: targetReviewDate,
        created_at: initialProfile?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      await onSaveProfile(profilePayload);
      onClose();
    } catch (err: any) {
      console.error('Failed to save fitness profile:', err);
      setErrorMessage(err.message || 'Unable to save fitness questionnaire. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2.5 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-[#0f1118] border border-[#232838] rounded-2xl shadow-2xl flex flex-col max-h-[92dvh] sm:max-h-[90dvh] overflow-hidden my-auto">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#1b1f2b] flex items-center justify-between bg-[#131620]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#ccff00]/10 border border-[#ccff00]/30 flex items-center justify-center text-[#ccff00]">
              <Sparkles size={16} />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white font-heading">
                Smart Fitness Questionnaire
              </h2>
              <p className="text-xs text-slate-400">
                Step {currentStep} of 8 • Personalized AI & Science-Backed Plan
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/5 transition-colors text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#1b1f2b] h-1.5">
          <div 
            className="bg-[#ccff00] h-1.5 transition-all duration-300"
            style={{ width: `${(currentStep / 8) * 100}%` }}
          />
        </div>

        {/* Step Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-slate-200 text-sm">
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle size={15} className="shrink-0 text-rose-400" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* STEP 1: Basic Information */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Activity size={18} className="text-[#ccff00]" />
                  Step A: Basic Information
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Your baseline metrics calibrate exercise loads, baseline energy expenditure, and plan volume.
                </p>
              </div>

              {/* Height Input */}
              <div className="bg-[#141722] p-4 rounded-xl border border-[#202536] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Height
                  </label>
                  <div className="flex rounded-lg bg-[#0b0c12] p-0.5 border border-[#1e2333] text-xs">
                    <button
                      type="button"
                      onClick={() => handleHeightUnitChange('cm')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                        heightUnit === 'cm' ? 'bg-[#ccff00] text-black' : 'text-slate-400'
                      }`}
                    >
                      cm
                    </button>
                    <button
                      type="button"
                      onClick={() => handleHeightUnitChange('ft')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                        heightUnit === 'ft' ? 'bg-[#ccff00] text-black' : 'text-slate-400'
                      }`}
                    >
                      ft / in
                    </button>
                  </div>
                </div>

                {heightUnit === 'cm' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="130"
                      max="220"
                      value={heightCm}
                      onChange={(e) => setHeightCm(Number(e.target.value))}
                      className="flex-1 accent-[#ccff00]"
                    />
                    <div className="flex items-center gap-1 bg-[#0b0c12] px-3 py-1.5 rounded-lg border border-[#1e2333] min-w-[80px] justify-center">
                      <span className="font-extrabold text-white text-base">{heightCm}</span>
                      <span className="text-xs text-slate-400">cm</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    <div className="flex items-center gap-3">
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={heightFeet > 0 ? heightFeet : ''}
                          onChange={(e) => handleFeetChange(e.target.value)}
                          onBlur={() => {
                            if (heightFeet === 0) setHeightFeet(5);
                          }}
                          placeholder="5"
                          className="w-full bg-[#0b0c12] border border-[#1e2333] rounded-lg px-3 py-2 text-white font-bold text-center focus:border-[#ccff00] focus:outline-none"
                        />
                        <span className="text-xs text-slate-400">ft</span>
                      </div>
                      <div className="flex-1 flex items-center gap-2">
                        <input
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={heightInches > 0 ? String(heightInches) : ''}
                          onChange={(e) => handleInchesChange(e.target.value)}
                          placeholder="0"
                          className="w-full bg-[#0b0c12] border border-[#1e2333] rounded-lg px-3 py-2 text-white font-bold text-center focus:border-[#ccff00] focus:outline-none"
                        />
                        <span className="text-xs text-slate-400">in</span>
                      </div>
                    </div>

                    {/* Quick Height Preset Chips */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
                      {[
                        { ft: 5, in: 7, label: '5 ft 7 in' },
                        { ft: 5, in: 9, label: '5 ft 9 in' },
                        { ft: 5, in: 10, label: '5 ft 10 in' },
                        { ft: 5, in: 11, label: '5 ft 11 in' },
                        { ft: 6, in: 0, label: '6 ft 0 in' },
                        { ft: 6, in: 2, label: '6 ft 2 in' },
                      ].map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => {
                            setHeightFeet(preset.ft);
                            setHeightInches(preset.in);
                          }}
                          className={`px-2 py-1 rounded-md text-[10px] font-bold border transition-colors shrink-0 ${
                            heightFeet === preset.ft && heightInches === preset.in
                              ? 'bg-[#ccff00]/15 border-[#ccff00] text-[#ccff00]'
                              : 'bg-[#0b0c12] border-[#1e2333] text-slate-400 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Weight Input */}
              <div className="bg-[#141722] p-4 rounded-xl border border-[#202536] space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Current Weight
                  </label>
                  <div className="flex rounded-lg bg-[#0b0c12] p-0.5 border border-[#1e2333] text-xs">
                    <button
                      type="button"
                      onClick={() => handleWeightUnitChange('kg')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                        weightUnit === 'kg' ? 'bg-[#ccff00] text-black' : 'text-slate-400'
                      }`}
                    >
                      kg
                    </button>
                    <button
                      type="button"
                      onClick={() => handleWeightUnitChange('lbs')}
                      className={`px-2.5 py-1 rounded-md font-bold transition-all ${
                        weightUnit === 'lbs' ? 'bg-[#ccff00] text-black' : 'text-slate-400'
                      }`}
                    >
                      lbs
                    </button>
                  </div>
                </div>

                {weightUnit === 'kg' ? (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="40"
                      max="180"
                      value={weightKg}
                      onChange={(e) => setWeightKg(Number(e.target.value))}
                      className="flex-1 accent-[#ccff00]"
                    />
                    <div className="flex items-center gap-1 bg-[#0b0c12] px-3 py-1.5 rounded-lg border border-[#1e2333] min-w-[80px] justify-center">
                      <span className="font-extrabold text-white text-base">{weightKg}</span>
                      <span className="text-xs text-slate-400">kg</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <input
                      type="range"
                      min="90"
                      max="400"
                      value={weightLbs}
                      onChange={(e) => setWeightLbs(Number(e.target.value))}
                      className="flex-1 accent-[#ccff00]"
                    />
                    <div className="flex items-center gap-1 bg-[#0b0c12] px-3 py-1.5 rounded-lg border border-[#1e2333] min-w-[80px] justify-center">
                      <span className="font-extrabold text-white text-base">{weightLbs}</span>
                      <span className="text-xs text-slate-400">lbs</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Age & Experience Level */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#141722] p-4 rounded-xl border border-[#202536] space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Age (Optional)
                  </label>
                  <input
                    type="number"
                    min="14"
                    max="90"
                    placeholder="e.g. 26"
                    value={age || ''}
                    onChange={(e) => setAge(e.target.value ? Number(sanitizeNumericInput(e.target.value)) : undefined)}
                    className="w-full bg-[#0b0c12] border border-[#1e2333] rounded-lg px-3 py-2 text-white font-bold"
                  />
                </div>

                <div className="bg-[#141722] p-4 rounded-xl border border-[#202536] space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Calculated BMI Indicator
                  </label>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-black text-[#ccff00] font-heading">{bmi}</span>
                    <span className="text-[11px] text-slate-400">General screening only</span>
                  </div>
                </div>
              </div>

              {/* Training Experience */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Training Experience
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'beginner', title: 'Beginner', desc: '< 1 year. Learning form & habit.' },
                    { id: 'intermediate', title: 'Intermediate', desc: '1–3 years. Consistent lifting.' },
                    { id: 'advanced', title: 'Advanced', desc: '3+ years. High technique & volume.' },
                  ].map((exp) => (
                    <button
                      key={exp.id}
                      type="button"
                      onClick={() => setExperienceLevel(exp.id as ExperienceLevel)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        experienceLevel === exp.id
                          ? 'bg-[#ccff00]/10 border-[#ccff00] text-white shadow-sm'
                          : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-white">{exp.title}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5 leading-snug">{exp.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Available Equipment */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Available Equipment (Select all that apply)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'full_gym', label: 'Commercial Gym' },
                    { id: 'home_gym', label: 'Home Gym (Barbell/Rack)' },
                    { id: 'dumbbells_only', label: 'Dumbbells Only' },
                    { id: 'cables_machines', label: 'Cables & Machines' },
                    { id: 'kettlebells', label: 'Kettlebells' },
                    { id: 'bodyweight', label: 'Calisthenics / Bodyweight' },
                  ].map((eq) => {
                    const isSelected = equipment.includes(eq.id as EquipmentType);
                    return (
                      <button
                        key={eq.id}
                        type="button"
                        onClick={() => toggleEquipment(eq.id as EquipmentType)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                            : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{eq.label}</span>
                        {isSelected && <Check size={14} className="text-[#ccff00]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Fitness Goals */}
          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Target size={18} className="text-[#ccff00]" />
                  Step B: Fitness Goals
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Pick your primary objective and secondary focal points.
                </p>
              </div>

              {/* Primary Goal */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Primary Goal (Select One)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'muscle_building', label: 'Muscle Building & Hypertrophy', desc: 'Maximize clean muscle mass & density' },
                    { id: 'fat_loss', label: 'Fat Loss & Definition', desc: 'Shed body fat while preserving lean muscle' },
                    { id: 'strength_development', label: 'Raw Strength & Power', desc: 'Increase numbers on compound lifts' },
                    { id: 'lean_bulk', label: 'Lean Bulk', desc: 'Slow, controlled mass gain with minimal fat' },
                    { id: 'athletic_performance', label: 'Athletic Performance', desc: 'Explosiveness, agility & functional power' },
                    { id: 'general_fitness', label: 'General Health & Vitality', desc: 'Overall well-being, stamina & joint health' },
                    { id: 'bodybuilding', label: 'Bodybuilding & Aesthetics', desc: 'High volume symmetry & muscle isolation' },
                    { id: 'cardio_health', label: 'Cardiovascular Conditioning', desc: 'Heart health, lung capacity & endurance' },
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setPrimaryGoal(g.id as PrimaryGoal)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        primaryGoal === g.id
                          ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                          : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-white">{g.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{g.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Secondary Goals */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Secondary Goals (Optional, select up to 3)
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { id: 'muscular_endurance', label: 'Muscular Endurance' },
                    { id: 'athletic_performance', label: 'Agility & Speed' },
                    { id: 'maintain_fitness', label: 'Maintain Current Fitness' },
                    { id: 'cardio_health', label: 'Cardio Stamina' },
                    { id: 'strength_development', label: 'Joint Stability' },
                  ].map((sg) => {
                    const isSelected = secondaryGoals.includes(sg.id as PrimaryGoal);
                    return (
                      <button
                        key={sg.id}
                        type="button"
                        onClick={() => toggleSecondaryGoal(sg.id as PrimaryGoal)}
                        className={`px-3 py-1.5 rounded-full border text-xs font-semibold transition-all ${
                          isSelected
                            ? 'bg-[#ccff00] text-black border-[#ccff00]'
                            : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                        }`}
                      >
                        {sg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Custom Goal */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Custom Goal Note (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Bench press 100kg, run a 5k under 25 mins"
                  value={customGoal}
                  onChange={(e) => setCustomGoal(e.target.value)}
                  className="w-full bg-[#141722] border border-[#202536] rounded-xl px-3.5 py-2.5 text-white text-xs font-medium focus:border-[#ccff00] focus:outline-none"
                />
              </div>

              {/* Science-Based Realistic Disclaimer */}
              <div className="p-3.5 rounded-xl bg-[#141722] border border-[#232838] flex items-start gap-3">
                <Info size={16} className="text-[#ccff00] shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-200">Evidence-Based Disclaimer:</strong> Fitness progress requires progressive resistance, caloric balance, adequate protein, sleep, and time. We do not promise unrealistic overnight results or guaranteed physiques.
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Preferred Physique */}
          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Flame size={18} className="text-[#ccff00]" />
                  Step C: Preferred Physique Aspiration
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select an aesthetic direction to calibrate training splits, volume, and rep ranges.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'lean_athletic',
                    title: 'Lean & Athletic',
                    desc: 'Low body fat, high mobility, wire-strong muscle tone suitable for sports.',
                    reps: '10–15 reps, active recovery',
                  },
                  {
                    id: 'lean_muscular',
                    title: 'Lean & Muscular',
                    desc: 'Classic aesthetic V-taper, defined shoulders, chest, and arms with lean midsection.',
                    reps: '8–12 hypertrophy reps',
                  },
                  {
                    id: 'bigger_muscular',
                    title: 'Bigger & Muscular (Bulked)',
                    desc: 'Dense mass, full muscle bellies, thick upper back and powerful legs.',
                    reps: '6–10 heavy compound reps',
                  },
                  {
                    id: 'bodybuilding',
                    title: 'Bodybuilding Symmetry',
                    desc: 'Deep isolation focus, muscle striations, arm peaks, and targeted muscle pumps.',
                    reps: '8–15 isolation & dropsets',
                  },
                  {
                    id: 'strength_focused',
                    title: 'Strength Powerhouse',
                    desc: 'Powerlifter frame built on raw mechanical tension and spinal/core density.',
                    reps: '3–6 low rep compound strength',
                  },
                  {
                    id: 'healthy_fitness',
                    title: 'General Healthy Fitness',
                    desc: 'Sustainable long-term vitality, joint longevity, posture, and functional ease.',
                    reps: 'Balanced resistance & cardio',
                  },
                ].map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setPhysiquePreference(p.id as PhysiqueAspiration)}
                    className={`p-4 rounded-xl border text-left transition-all ${
                      physiquePreference === p.id
                        ? 'bg-[#ccff00]/10 border-[#ccff00] text-white shadow-md'
                        : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="font-black text-sm text-white font-heading">{p.title}</div>
                      {physiquePreference === p.id && <Check size={16} className="text-[#ccff00]" />}
                    </div>
                    <div className="text-xs text-slate-400 mt-1.5 leading-relaxed">{p.desc}</div>
                    <div className="mt-2 text-[10px] font-bold text-[#ccff00]/90 uppercase tracking-wider bg-[#0b0c12] px-2 py-0.5 rounded-md inline-block">
                      {p.reps}
                    </div>
                  </button>
                ))}
              </div>

              <p className="text-[11px] text-slate-500 italic">
                *Physique aspirations guide program design and exercise selection. Individual outcomes depend on nutrition, recovery, and consistency.
              </p>
            </div>
          )}

          {/* STEP 4: Weekly Schedule */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Calendar size={18} className="text-[#ccff00]" />
                  Step D: Weekly Schedule & Duration
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  How many days per week can you realistically commit to training?
                </p>
              </div>

              {/* Training Days */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Weekly Training Frequency: <span className="text-[#ccff00]">{daysPerWeek} Days / Week</span>
                </label>
                <div className="grid grid-cols-5 gap-2">
                  {[2, 3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDaysPerWeek(days)}
                      className={`py-3 rounded-xl border text-center font-extrabold text-sm transition-all ${
                        daysPerWeek === days
                          ? 'bg-[#ccff00] text-black border-[#ccff00] shadow-md shadow-[#ccff00]/20'
                          : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                      }`}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              {/* Recommended Split Based on Days */}
              <div className="p-4 rounded-xl bg-[#141722] border border-[#202536] space-y-1">
                <span className="text-[10px] uppercase font-bold text-[#ccff00] tracking-wider">
                  Recommended Training Split
                </span>
                <div className="text-sm font-extrabold text-white">
                  {daysPerWeek === 2 && '2-Day Full Body Circuit'}
                  {daysPerWeek === 3 && '3-Day Full Body or Push/Pull/Legs'}
                  {daysPerWeek === 4 && '4-Day Upper / Lower Split (Optimal Recovery)'}
                  {daysPerWeek === 5 && '5-Day Push / Pull / Legs / Upper / Lower'}
                  {daysPerWeek === 6 && '6-Day Push / Pull / Legs (PPL x2)'}
                </div>
                <p className="text-xs text-slate-400">
                  {daysPerWeek <= 3 && 'High frequency full-body workouts ensure each muscle is stimulated 2-3 times per week.'}
                  {daysPerWeek === 4 && 'The gold standard for balancing intensity with joint recovery and muscle protein synthesis.'}
                  {daysPerWeek >= 5 && 'Advanced volume split targeting individual muscle groups with focused pump sessions.'}
                </p>
              </div>

              {/* Preferred Duration */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Target Workout Duration
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { val: 30, label: '30 mins', desc: 'Express high-efficiency' },
                    { val: 45, label: '45 mins', desc: 'Optimal hypertrophy' },
                    { val: 60, label: '60 mins', desc: 'Full workout + accessories' },
                    { val: 75, label: '75+ mins', desc: 'Heavy strength + warmup' },
                  ].map((dur) => (
                    <button
                      key={dur.val}
                      type="button"
                      onClick={() => setDurationMinutes(dur.val)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        durationMinutes === dur.val
                          ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                          : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-extrabold text-xs text-white">{dur.label}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5">{dur.desc}</div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: Workout Style */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Dumbbell size={18} className="text-[#ccff00]" />
                  Step E: Workout Style & Movement Preferences
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select training modalities you enjoy and plan structure.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Training Modalities (Select Multiple)
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'hypertrophy', label: 'Hypertrophy & Muscle Growth', desc: 'Moderate weight, 8-12 reps, 90s rest' },
                    { id: 'heavy_strength', label: 'Heavy Compound Strength', desc: 'Squat, bench, deadlift with progressive overload' },
                    { id: 'bodybuilding', label: 'Bodybuilding & Isolation', desc: 'Cables, dumbbell flies, concentrated contractions' },
                    { id: 'machines', label: 'Machine-Based Training', desc: 'Safe joint paths, guided resistance, low injury risk' },
                    { id: 'free_weights', label: 'Free-Weights Focused', desc: 'Barbells and dumbbells requiring stabilizer muscles' },
                    { id: 'functional', label: 'Functional & Athletic Conditioning', desc: 'Kettlebells, lunges, explosive movements' },
                  ].map((st) => {
                    const isSelected = workoutStyle.includes(st.id as WorkoutStyle);
                    return (
                      <button
                        key={st.id}
                        type="button"
                        onClick={() => toggleWorkoutStyle(st.id as WorkoutStyle)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                            : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-white">{st.label}</span>
                          {isSelected && <Check size={14} className="text-[#ccff00]" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{st.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Structured vs Flexible */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Plan Flexibility
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setScheduleFlexibility('structured')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      scheduleFlexibility === 'structured'
                        ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                        : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">Structured Plan</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Fixed exercises & progression each week.</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setScheduleFlexibility('flexible')}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      scheduleFlexibility === 'flexible'
                        ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                        : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                    }`}
                  >
                    <div className="font-bold text-xs text-white">Flexible Substitution</div>
                    <div className="text-[11px] text-slate-400 mt-0.5">Allows 1-tap exercise alternatives if machines are busy.</div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: Cardio & Outdoor Preferences */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Zap size={18} className="text-[#ccff00]" />
                  Step F: Cardio & Outdoor Activities
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Designate cardio balance and outdoor recreational interests.
                </p>
              </div>

              {/* Cardio Volume */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Cardio Volume Preference
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'minimal', label: 'Minimal Cardio', desc: 'Focus strictly on weights & lifting' },
                    { id: 'moderate', label: 'Moderate Balance', desc: '15-20 min post-lift or on rest days' },
                    { id: 'high', label: 'High Cardio Emphasis', desc: 'Regular stamina & fat burn runs' },
                  ].map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => setCardioPreference(c.id as CardioPreference)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        cardioPreference === c.id
                          ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                          : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                      }`}
                    >
                      <div className="font-bold text-xs text-white">{c.label}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">{c.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Outdoor Sports & Activities */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Outdoor & Recreational Activities (Select your favorites)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {[
                    { id: 'running', label: '🏃 Outdoor Running' },
                    { id: 'walking', label: '🚶 Walking / Incline Walks' },
                    { id: 'cycling', label: '🚴 Cycling / Biking' },
                    { id: 'swimming', label: '🏊 Swimming' },
                    { id: 'hiking', label: '🥾 Hiking & Trekking' },
                    { id: 'football', label: '⚽ Football / Soccer' },
                    { id: 'cricket', label: '🏏 Cricket' },
                    { id: 'basketball', label: '🏀 Basketball' },
                    { id: 'badminton', label: '🏸 Badminton' },
                    { id: 'tennis', label: '🎾 Tennis' },
                    { id: 'active_recovery', label: '🧘 Active Recovery Yoga' },
                  ].map((act) => {
                    const isSelected = outdoorActivities.includes(act.id as OutdoorActivityType);
                    return (
                      <button
                        key={act.id}
                        type="button"
                        onClick={() => toggleOutdoor(act.id as OutdoorActivityType)}
                        className={`p-2.5 rounded-xl border text-left text-xs font-bold flex items-center justify-between transition-all ${
                          isSelected
                            ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                            : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                        }`}
                      >
                        <span>{act.label}</span>
                        {isSelected && <Check size={14} className="text-[#ccff00]" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* STEP 7: Safety & Limitations */}
          {currentStep === 7 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <ShieldAlert size={18} className="text-[#ccff00]" />
                  Step G: Safety, Injuries & Limitations
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  The planner automatically excludes unsuitable movements to protect your joints and spine.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Select Any Areas Requiring Caution
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    { id: 'none', label: 'No Limitations / Fully Healthy', desc: 'No movement restrictions' },
                    { id: 'lower_back', label: 'Lower Back / Lumbar Spine', desc: 'Excludes heavy bent-over deadlifts/squats' },
                    { id: 'knee', label: 'Knee Issues / Patellar', desc: 'Excludes deep lunges & heavy leg presses' },
                    { id: 'shoulder', label: 'Shoulder Impingement / Rotator Cuff', desc: 'Excludes behind-neck presses & upright rows' },
                    { id: 'wrist', label: 'Wrist Pain / Weak Grips', desc: 'Substitutes neutral dumbbells & ez-curl bars' },
                    { id: 'elbow', label: 'Elbow Tendonitis / Tennis Elbow', desc: 'Substitutes gentle cable triceps extensions' },
                  ].map((inj) => {
                    const isSelected = inj.id === 'none' ? injuries.length === 0 : injuries.includes(inj.id);
                    return (
                      <button
                        key={inj.id}
                        type="button"
                        onClick={() => toggleInjury(inj.id)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'bg-amber-500/10 border-amber-500 text-white'
                            : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-white">{inj.label}</span>
                          {isSelected && <Check size={14} className="text-amber-400" />}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">{inj.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Limitations Notes */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Additional Notes or Specific Exercises to Avoid
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Avoid barbell bench press due to right AC joint pain, use dumbbells instead"
                  value={limitationsNotes}
                  onChange={(e) => setLimitationsNotes(e.target.value)}
                  className="w-full bg-[#141722] border border-[#202536] rounded-xl px-3.5 py-2 text-white text-xs font-medium focus:border-[#ccff00] focus:outline-none"
                />
              </div>

              {/* Medical Notice */}
              <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertTriangle size={16} className="text-amber-400 shrink-0 mt-0.5" />
                <div className="text-[11px] text-amber-200/80 leading-relaxed">
                  <strong>Important Safety Notice:</strong> GYMCREW does not provide medical diagnoses or clinical rehabilitation. If you experience sharp pain or have existing clinical conditions, consult a physician or licensed physiotherapist before exercising.
                </div>
              </div>
            </div>
          )}

          {/* STEP 8: Goal Setting & Target Review */}
          {currentStep === 8 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-lg font-black text-white font-heading flex items-center gap-2">
                  <Sparkles size={18} className="text-[#ccff00]" />
                  Step H: Habit Goal & Target Review Date
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Define a measurable commitment and review milestone to celebrate with your crew.
                </p>
              </div>

              {/* Measurable Goal Statement */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Primary Habit Commitment
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {[
                    'Complete 4 workouts each week consistently',
                    'Build an unbroken 8-week strength training habit',
                    'Hit 10,000 steps on rest days and lift 3x a week',
                    'Progressive overload: Add 2.5kg to compound lifts over 6 weeks',
                  ].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setTargetGoal(preset)}
                      className={`p-3 rounded-xl border text-left text-xs font-bold transition-all ${
                        targetGoal === preset
                          ? 'bg-[#ccff00]/10 border-[#ccff00] text-white'
                          : 'bg-[#141722] border-[#202536] text-slate-400 hover:text-white'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={targetGoal}
                  onChange={(e) => setTargetGoal(e.target.value)}
                  className="w-full bg-[#141722] border border-[#202536] rounded-xl px-3.5 py-2.5 text-white text-xs font-medium focus:border-[#ccff00] focus:outline-none mt-2"
                />
              </div>

              {/* Target Weight & Target Review Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-[#141722] p-4 rounded-xl border border-[#202536] space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Target Weight (Optional, kg)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 78"
                    value={targetWeightKg || ''}
                    onChange={(e) => setTargetWeightKg(e.target.value ? Number(sanitizeNumericInput(e.target.value)) : undefined)}
                    className="w-full bg-[#0b0c12] border border-[#1e2333] rounded-lg px-3 py-2 text-white font-bold"
                  />
                  <p className="text-[11px] text-slate-500">
                    Sustainable rates: ~0.5kg/week for healthy fat loss or lean bulk.
                  </p>
                </div>

                <div className="bg-[#141722] p-4 rounded-xl border border-[#202536] space-y-2">
                  <label className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                    Milestone Review Date
                  </label>
                  <input
                    type="date"
                    value={targetReviewDate}
                    onChange={(e) => setTargetReviewDate(e.target.value)}
                    className="w-full bg-[#0b0c12] border border-[#1e2333] rounded-lg px-3 py-2 text-white font-bold"
                  />
                  <p className="text-[11px] text-slate-500">
                    Recommended: 6 to 12 weeks for noticeable adaptations.
                  </p>
                </div>
              </div>

              {/* Privacy Notice */}
              <div className="p-3.5 rounded-xl bg-[#141722] border border-[#202536] flex items-start gap-3">
                <Info size={16} className="text-[#ccff00] shrink-0 mt-0.5" />
                <div className="text-[11px] text-slate-400 leading-relaxed">
                  <strong className="text-slate-200">Private & Secure:</strong> Your weight, measurements, injuries, and private goals are protected by Supabase Row Level Security and are never shared with crew members. Only your workout check-in milestones and squad consistency appear in group celebrations.
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="px-4 sm:px-5 py-3 sm:py-4 border-t border-[#1b1f2b] flex items-center justify-between bg-[#131620] shrink-0 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              className="flex items-center gap-1.5 px-4 py-2 min-h-[44px] rounded-xl bg-[#1a1e2b] text-slate-300 hover:text-white font-bold text-xs transition-colors"
            >
              <ChevronLeft size={16} />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 8 ? (
            <button
              type="button"
              onClick={() => setCurrentStep((prev) => Math.min(8, prev + 1))}
              className="flex items-center gap-1.5 px-5 py-2.5 min-h-[44px] rounded-xl bg-[#ccff00] text-[#090a0f] hover:bg-[#d8ff33] font-black text-xs shadow-md shadow-[#ccff00]/15 transition-all"
            >
              <span>Next Step</span>
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleComplete}
              className="flex items-center gap-2 px-6 py-2.5 min-h-[44px] rounded-xl bg-[#ccff00] text-[#090a0f] hover:bg-[#d8ff33] font-black text-xs shadow-lg shadow-[#ccff00]/25 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Saving Profile...</span>
              ) : (
                <>
                  <Sparkles size={16} />
                  <span>Generate My Smart Plan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
