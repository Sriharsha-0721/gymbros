import { FitnessProfile, WorkoutPlan, PlannedWorkout, PlannedExercise, EquipmentType } from '../types/smartPlan';

export interface ExerciseTemplate {
  id: string;
  name: string;
  target_muscle: string;
  equipment: 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'kettlebell';
  contraindicatedInjuries: string[];
  substitutes: string[];
}

export const EXERCISE_CATALOG: Record<string, ExerciseTemplate> = {
  // --- CHEST ---
  barbell_bench_press: {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    target_muscle: 'Chest (Mid/Lower Pectorals)',
    equipment: 'barbell',
    contraindicatedInjuries: ['shoulder', 'wrist'],
    substitutes: ['dumbbell_bench_press', 'machine_chest_press', 'pushups'],
  },
  dumbbell_bench_press: {
    id: 'dumbbell_bench_press',
    name: 'Dumbbell Flat Bench Press',
    target_muscle: 'Chest',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['incline_dumbbell_press', 'pushups'],
  },
  incline_dumbbell_press: {
    id: 'incline_dumbbell_press',
    name: 'Incline Dumbbell Bench Press',
    target_muscle: 'Upper Chest (Clavicular Head)',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['dumbbell_bench_press', 'machine_chest_press', 'incline_pushups'],
  },
  machine_chest_press: {
    id: 'machine_chest_press',
    name: 'Seated Machine Chest Press',
    target_muscle: 'Chest (Stabilized)',
    equipment: 'machine',
    contraindicatedInjuries: [],
    substitutes: ['dumbbell_bench_press', 'pushups'],
  },
  cable_chest_flyes: {
    id: 'cable_chest_flyes',
    name: 'Standing Cable Chest Flyes',
    target_muscle: 'Inner Chest & Pectorals',
    equipment: 'cable',
    contraindicatedInjuries: ['shoulder'],
    substitutes: ['dumbbell_flyes', 'pushups'],
  },
  dumbbell_flyes: {
    id: 'dumbbell_flyes',
    name: 'Dumbbell Chest Flyes',
    target_muscle: 'Pectoralis Major Stretch',
    equipment: 'dumbbell',
    contraindicatedInjuries: ['shoulder'],
    substitutes: ['pushups', 'cable_chest_flyes'],
  },
  pushups: {
    id: 'pushups',
    name: 'Standard Push-Ups',
    target_muscle: 'Chest, Front Delts & Triceps',
    equipment: 'bodyweight',
    contraindicatedInjuries: ['wrist'],
    substitutes: ['incline_pushups', 'dumbbell_bench_press'],
  },
  incline_pushups: {
    id: 'incline_pushups',
    name: 'Incline / Hands-Elevated Push-Ups',
    target_muscle: 'Chest & Core (Joint Safe)',
    equipment: 'bodyweight',
    contraindicatedInjuries: [],
    substitutes: ['pushups'],
  },

  // --- SHOULDERS ---
  overhead_barbell_press: {
    id: 'overhead_barbell_press',
    name: 'Standing Barbell Overhead Press',
    target_muscle: 'Anterior Deltoids & Shoulders',
    equipment: 'barbell',
    contraindicatedInjuries: ['shoulder', 'lower_back'],
    substitutes: ['seated_dumbbell_shoulder_press', 'lateral_raises', 'pike_pushups'],
  },
  seated_dumbbell_shoulder_press: {
    id: 'seated_dumbbell_shoulder_press',
    name: 'Seated Dumbbell Shoulder Press',
    target_muscle: 'Shoulders (Anterior & Medial)',
    equipment: 'dumbbell',
    contraindicatedInjuries: ['shoulder'],
    substitutes: ['lateral_raises', 'pike_pushups'],
  },
  lateral_raises: {
    id: 'lateral_raises',
    name: 'Dumbbell Lateral Raises',
    target_muscle: 'Lateral Deltoids (Side Delts)',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['cable_lateral_raises'],
  },
  cable_lateral_raises: {
    id: 'cable_lateral_raises',
    name: 'Cable Lateral Raises',
    target_muscle: 'Lateral Deltoids (Constant Tension)',
    equipment: 'cable',
    contraindicatedInjuries: [],
    substitutes: ['lateral_raises'],
  },
  face_pulls: {
    id: 'face_pulls',
    name: 'Cable Face Pulls',
    target_muscle: 'Rear Deltoids & Rotator Cuff',
    equipment: 'cable',
    contraindicatedInjuries: [],
    substitutes: ['dumbbell_rear_delt_flyes'],
  },
  dumbbell_rear_delt_flyes: {
    id: 'dumbbell_rear_delt_flyes',
    name: 'Bent-Over Dumbbell Rear Delt Flyes',
    target_muscle: 'Rear Deltoids & Posture',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['face_pulls'],
  },
  pike_pushups: {
    id: 'pike_pushups',
    name: 'Bodyweight Pike Push-Ups',
    target_muscle: 'Deltoids & Triceps',
    equipment: 'bodyweight',
    contraindicatedInjuries: ['wrist'],
    substitutes: ['lateral_raises'],
  },

  // --- BACK ---
  pullups: {
    id: 'pullups',
    name: 'Wide-Grip Pull-Ups / Chin-Ups',
    target_muscle: 'Latissimus Dorsi & Upper Back',
    equipment: 'bodyweight',
    contraindicatedInjuries: ['shoulder', 'elbow'],
    substitutes: ['lat_pulldown', 'inverted_rows', 'single_arm_dumbbell_row'],
  },
  lat_pulldown: {
    id: 'lat_pulldown',
    name: 'Lat Pulldown (Neutral/Wide Grip)',
    target_muscle: 'Latissimus Dorsi (Lats)',
    equipment: 'cable',
    contraindicatedInjuries: [],
    substitutes: ['pullups', 'single_arm_dumbbell_row', 'inverted_rows'],
  },
  barbell_bent_row: {
    id: 'barbell_bent_row',
    name: 'Bent-Over Barbell Row',
    target_muscle: 'Mid-Back & Rhomboids',
    equipment: 'barbell',
    contraindicatedInjuries: ['lower_back'],
    substitutes: ['chest_supported_row', 'single_arm_dumbbell_row', 'cable_seated_row'],
  },
  chest_supported_row: {
    id: 'chest_supported_row',
    name: 'Chest-Supported Incline Dumbbell Row',
    target_muscle: 'Upper & Mid Back (Spine Safe)',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['single_arm_dumbbell_row', 'cable_seated_row', 'inverted_rows'],
  },
  single_arm_dumbbell_row: {
    id: 'single_arm_dumbbell_row',
    name: 'Single-Arm Dumbbell Row',
    target_muscle: 'Lats & Rhomboids',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['chest_supported_row', 'inverted_rows'],
  },
  cable_seated_row: {
    id: 'cable_seated_row',
    name: 'Seated Cable Row',
    target_muscle: 'Mid Back & Traps',
    equipment: 'cable',
    contraindicatedInjuries: [],
    substitutes: ['chest_supported_row', 'single_arm_dumbbell_row'],
  },
  inverted_rows: {
    id: 'inverted_rows',
    name: 'Bodyweight Inverted Rows',
    target_muscle: 'Upper Back & Lats',
    equipment: 'bodyweight',
    contraindicatedInjuries: [],
    substitutes: ['single_arm_dumbbell_row', 'chest_supported_row'],
  },

  // --- LEGS & GLUTES ---
  barbell_back_squat: {
    id: 'barbell_back_squat',
    name: 'Barbell Back Squat',
    target_muscle: 'Quadriceps, Glutes & Adductors',
    equipment: 'barbell',
    contraindicatedInjuries: ['lower_back', 'knee'],
    substitutes: ['goblet_squat', 'leg_press', 'bulgarian_split_squat', 'bodyweight_squats'],
  },
  goblet_squat: {
    id: 'goblet_squat',
    name: 'Dumbbell / Kettlebell Goblet Squat',
    target_muscle: 'Quadriceps & Core',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['bodyweight_squats', 'bulgarian_split_squat'],
  },
  romanian_deadlift: {
    id: 'romanian_deadlift',
    name: 'Dumbbell Romanian Deadlift (RDL)',
    target_muscle: 'Hamstrings & Gluteal Chain',
    equipment: 'dumbbell',
    contraindicatedInjuries: ['lower_back'],
    substitutes: ['lying_leg_curls', 'glute_bridges'],
  },
  leg_press: {
    id: 'leg_press',
    name: '45-Degree Incline Leg Press',
    target_muscle: 'Quadriceps & Glutes',
    equipment: 'machine',
    contraindicatedInjuries: ['knee'],
    substitutes: ['goblet_squat', 'bulgarian_split_squat', 'bodyweight_squats'],
  },
  lying_leg_curls: {
    id: 'lying_leg_curls',
    name: 'Lying Hamstring Leg Curls',
    target_muscle: 'Hamstrings',
    equipment: 'machine',
    contraindicatedInjuries: [],
    substitutes: ['romanian_deadlift', 'glute_bridges'],
  },
  bulgarian_split_squat: {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    target_muscle: 'Quadriceps, Glutes & Balance',
    equipment: 'dumbbell',
    contraindicatedInjuries: ['knee'],
    substitutes: ['goblet_squat', 'bodyweight_squats', 'lunges'],
  },
  lunges: {
    id: 'lunges',
    name: 'Walking / Reverse Dumbbell Lunges',
    target_muscle: 'Quadriceps & Glute Max',
    equipment: 'dumbbell',
    contraindicatedInjuries: ['knee'],
    substitutes: ['bodyweight_squats', 'glute_bridges'],
  },
  bodyweight_squats: {
    id: 'bodyweight_squats',
    name: 'Bodyweight Air Squats',
    target_muscle: 'Quadriceps & Mobility',
    equipment: 'bodyweight',
    contraindicatedInjuries: [],
    substitutes: ['glute_bridges'],
  },
  glute_bridges: {
    id: 'glute_bridges',
    name: 'Floor Glute Bridges',
    target_muscle: 'Glutes & Hamstrings (Spine Safe)',
    equipment: 'bodyweight',
    contraindicatedInjuries: [],
    substitutes: ['romanian_deadlift'],
  },
  standing_calf_raises: {
    id: 'standing_calf_raises',
    name: 'Standing Dumbbell Calf Raises',
    target_muscle: 'Gastrocnemius & Calves',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['bodyweight_calf_raises'],
  },
  bodyweight_calf_raises: {
    id: 'bodyweight_calf_raises',
    name: 'Single-Leg Bodyweight Calf Raises',
    target_muscle: 'Calves & Ankle Stability',
    equipment: 'bodyweight',
    contraindicatedInjuries: [],
    substitutes: ['standing_calf_raises'],
  },

  // --- ARMS ---
  barbell_bicep_curl: {
    id: 'barbell_bicep_curl',
    name: 'Standing Barbell / EZ-Bar Bicep Curl',
    target_muscle: 'Biceps Brachii',
    equipment: 'barbell',
    contraindicatedInjuries: ['wrist', 'elbow'],
    substitutes: ['dumbbell_hammer_curl', 'incline_dumbbell_curl'],
  },
  dumbbell_hammer_curl: {
    id: 'dumbbell_hammer_curl',
    name: 'Dumbbell Neutral Hammer Curl',
    target_muscle: 'Brachialis & Forearms (Wrist Safe)',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['incline_dumbbell_curl', 'inverted_rows'],
  },
  incline_dumbbell_curl: {
    id: 'incline_dumbbell_curl',
    name: 'Incline Dumbbell Bicep Curl',
    target_muscle: 'Biceps Long Head Stretch',
    equipment: 'dumbbell',
    contraindicatedInjuries: ['elbow'],
    substitutes: ['dumbbell_hammer_curl'],
  },
  triceps_rope_pushdown: {
    id: 'triceps_rope_pushdown',
    name: 'Cable Triceps Rope Pushdown',
    target_muscle: 'Lateral & Medial Triceps',
    equipment: 'cable',
    contraindicatedInjuries: ['elbow'],
    substitutes: ['overhead_dumbbell_tricep_extension', 'diamond_pushups', 'bench_dips'],
  },
  overhead_dumbbell_tricep_extension: {
    id: 'overhead_dumbbell_tricep_extension',
    name: 'Overhead Two-Arm Dumbbell Extension',
    target_muscle: 'Triceps Long Head',
    equipment: 'dumbbell',
    contraindicatedInjuries: ['elbow', 'shoulder'],
    substitutes: ['triceps_rope_pushdown', 'diamond_pushups', 'bench_dips'],
  },
  diamond_pushups: {
    id: 'diamond_pushups',
    name: 'Diamond Close-Grip Push-Ups',
    target_muscle: 'Triceps & Inner Chest',
    equipment: 'bodyweight',
    contraindicatedInjuries: ['wrist', 'elbow'],
    substitutes: ['bench_dips', 'triceps_rope_pushdown'],
  },
  bench_dips: {
    id: 'bench_dips',
    name: 'Bench Tricep Dips',
    target_muscle: 'Triceps Brachii',
    equipment: 'bodyweight',
    contraindicatedInjuries: ['shoulder'],
    substitutes: ['diamond_pushups', 'overhead_dumbbell_tricep_extension'],
  },

  // --- CORE ---
  hanging_knee_raises: {
    id: 'hanging_knee_raises',
    name: 'Hanging Knee / Leg Raises',
    target_muscle: 'Rectus Abdominis & Lower Abs',
    equipment: 'bodyweight',
    contraindicatedInjuries: ['shoulder'],
    substitutes: ['plank', 'deadbug'],
  },
  plank: {
    id: 'plank',
    name: 'Forearm Core Plank',
    target_muscle: 'Transverse Abdominis & Core Stability',
    equipment: 'bodyweight',
    contraindicatedInjuries: [],
    substitutes: ['deadbug'],
  },
  deadbug: {
    id: 'deadbug',
    name: 'Supine Dead Bug Core Stabilization',
    target_muscle: 'Deep Core (Spine Neutral)',
    equipment: 'bodyweight',
    contraindicatedInjuries: [],
    substitutes: ['plank'],
  },
};

/**
 * Checks if an exercise's required equipment is supported by the user's available equipment.
 */
export function isExerciseEquipmentAllowed(
  exEquipment: ExerciseTemplate['equipment'],
  userEquipment: EquipmentType[]
): boolean {
  if (!userEquipment || userEquipment.length === 0 || userEquipment.includes('full_gym')) {
    return true;
  }
  if (exEquipment === 'bodyweight') return true;

  if (exEquipment === 'dumbbell') {
    return (
      userEquipment.includes('dumbbells_only') ||
      userEquipment.includes('home_gym') ||
      userEquipment.includes('kettlebells')
    );
  }
  if (exEquipment === 'kettlebell') {
    return (
      userEquipment.includes('kettlebells') ||
      userEquipment.includes('home_gym') ||
      userEquipment.includes('dumbbells_only')
    );
  }
  if (exEquipment === 'barbell') {
    return userEquipment.includes('home_gym');
  }
  if (exEquipment === 'cable' || exEquipment === 'machine') {
    return userEquipment.includes('cables_machines');
  }
  return false;
}

/**
 * Master Smart Plan Generator: Scientifically periodized workout plans based on individual profile.
 */
export function generateSmartWorkoutPlan(profile: FitnessProfile): WorkoutPlan {
  const daysCount = Math.min(6, Math.max(2, profile.days_per_week || 4));
  const planId = 'plan_' + Math.random().toString(36).substring(2, 9);

  // 1. Determine periodized split architecture
  let splitName = '4-Day Upper / Lower Periodized Split';
  if (daysCount === 2) splitName = '2-Day Full Body Essentials Split';
  else if (daysCount === 3) splitName = '3-Day Full Body Undulating Periodization';
  else if (daysCount === 5) splitName = '5-Day Push / Pull / Legs + Upper / Posterior Split';
  else if (daysCount === 6) splitName = '6-Day Push / Pull / Legs (PPL x2)';

  // 2. Calibrate rep ranges, sets, and rest based on Primary Goal and Experience
  let defaultSets = 3;
  let repRange = '8–12';
  let restSeconds = 75;
  let progressionNote = 'Aim to add 1 repetition or small weight increment (1-2.5kg) every 2 weeks when target reps are cleanly achieved with good form.';

  if (profile.primary_goal === 'strength_development') {
    defaultSets = profile.experience_level === 'beginner' ? 3 : 4;
    repRange = '4–6';
    restSeconds = 120;
    progressionNote = 'Prioritize progressive barbell/dumbbell load. Increase weight only when all sets hit 6 clean reps with 2 minutes rest.';
  } else if (profile.primary_goal === 'fat_loss' || profile.primary_goal === 'muscular_endurance') {
    defaultSets = 3;
    repRange = '12–15';
    restSeconds = 50;
    progressionNote = 'Maintain high workout density with strict 45-60s rest periods. Incorporate prescribed post-workout cardio to maximize metabolic output.';
  } else if (profile.primary_goal === 'bodybuilding' || profile.physique_preference === 'bigger_muscular') {
    defaultSets = profile.experience_level === 'advanced' ? 4 : 3;
    repRange = '10–12';
    restSeconds = 70;
    progressionNote = 'Focus on maximum mind-muscle connection, full stretch under load, and deliberate 3-second eccentric tempo.';
  } else if (profile.primary_goal === 'athletic_performance') {
    defaultSets = 3;
    repRange = '6–8';
    restSeconds = 90;
    progressionNote = 'Emphasize explosive intent on the concentric phase and unilateral balance to safeguard joint integrity.';
  } else {
    // General fitness / Healthy fitness
    defaultSets = 3;
    repRange = '8–12';
    restSeconds = 75;
  }

  // 3. Exercise volume scaling based on session duration & experience level
  let maxExercisesPerSession = 5;
  if (profile.duration_minutes <= 30) {
    maxExercisesPerSession = 3;
  } else if (profile.duration_minutes <= 45) {
    maxExercisesPerSession = 4;
  } else if (profile.duration_minutes <= 60) {
    maxExercisesPerSession = profile.experience_level === 'beginner' ? 4 : 5;
  } else {
    // 75+ mins
    maxExercisesPerSession = profile.experience_level === 'advanced' ? 6 : 5;
  }

  if (profile.experience_level === 'beginner') {
    maxExercisesPerSession = Math.min(maxExercisesPerSession, 4);
  }

  // 4. Equipment & Injury Filtering System
  const filterExercise = (preferredKey: string): ExerciseTemplate => {
    const candidate = EXERCISE_CATALOG[preferredKey];
    if (!candidate) return EXERCISE_CATALOG['pushups'];

    const injuryConflict = candidate.contraindicatedInjuries.some((inj) =>
      profile.injuries.includes(inj)
    );
    const equipmentAllowed = isExerciseEquipmentAllowed(candidate.equipment, profile.equipment);

    if (!injuryConflict && equipmentAllowed) {
      return candidate;
    }

    // Try candidate substitutes
    for (const subKey of candidate.substitutes) {
      const sub = EXERCISE_CATALOG[subKey];
      if (sub) {
        const subInjuryConflict = sub.contraindicatedInjuries.some((inj) =>
          profile.injuries.includes(inj)
        );
        const subEquipAllowed = isExerciseEquipmentAllowed(sub.equipment, profile.equipment);
        if (!subInjuryConflict && subEquipAllowed) {
          return sub;
        }
      }
    }

    // Fallback: search catalog for matching muscle group
    const targetCategory = candidate.target_muscle.split(' ')[0].toLowerCase();
    for (const fbKey of Object.keys(EXERCISE_CATALOG)) {
      const fb = EXERCISE_CATALOG[fbKey];
      if (fb.target_muscle.toLowerCase().includes(targetCategory)) {
        const fbInjuryConflict = fb.contraindicatedInjuries.some((inj) =>
          profile.injuries.includes(inj)
        );
        const fbEquipAllowed = isExerciseEquipmentAllowed(fb.equipment, profile.equipment);
        if (!fbInjuryConflict && fbEquipAllowed) {
          return fb;
        }
      }
    }

    return EXERCISE_CATALOG['pushups'];
  };

  const createPlannedExercise = (
    exerciseKey: string,
    workoutId: string,
    orderIdx: number,
    customReps?: string
  ): PlannedExercise => {
    const ex = filterExercise(exerciseKey);
    return {
      id: `ex_${workoutId}_${orderIdx}`,
      planned_workout_id: workoutId,
      exercise_id: ex.id,
      name: ex.name,
      target_muscle: ex.target_muscle,
      equipment: ex.equipment,
      sets: defaultSets,
      reps_range: customReps || repRange,
      rest_seconds: restSeconds,
      order_index: orderIdx,
      notes: `Focus on controlled eccentric phase (2-3s). Rest ${restSeconds}s between sets.`,
    };
  };

  // 5. Build weekly structure
  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workouts: PlannedWorkout[] = [];

  // Tailored cardio recommendations
  const trainingDayCardio =
    profile.primary_goal === 'fat_loss' || profile.cardio_preference === 'high'
      ? '15 mins steady aerobic cooldown (incline walk or cycling)'
      : profile.cardio_preference === 'moderate'
      ? '10 mins light active cooldown'
      : undefined;

  const outdoorRecoveryCardio =
    profile.outdoor_activities && profile.outdoor_activities.length > 0
      ? `Prescribed 35-45 min outdoor session: ${profile.outdoor_activities[0].replace(/_/g, ' ')} for active recovery`
      : '30-minute low-intensity recovery walk';

  for (let i = 0; i < 7; i++) {
    const dayIndex = i + 1;
    const dayName = daysOfWeek[i];
    const workoutId = `wk_${planId}_${dayIndex}`;

    let isTrainingDay = false;
    let title = 'Rest & Recovery Day';
    let focus = 'Recovery';
    let warmup = 'Light dynamic stretching or 20-minute gentle recovery walk.';
    let cardio = profile.cardio_preference === 'high' ? outdoorRecoveryCardio : undefined;
    let rawKeys: string[] = [];

    // --- 2-DAY FULL BODY ESSENTIALS ---
    if (daysCount === 2) {
      if (i === 1) { // Tuesday: Full Body A
        isTrainingDay = true;
        title = 'Full Body Essentials (Session A)';
        focus = 'Quads, Horizontal Push & Horizontal Row';
        warmup = '5 min stationary bike + bodyweight squats & arm circles';
        cardio = trainingDayCardio;
        rawKeys = [
          'goblet_squat',
          'barbell_bench_press',
          'chest_supported_row',
          'seated_dumbbell_shoulder_press',
          'plank',
        ];
      } else if (i === 4) { // Friday: Full Body B
        isTrainingDay = true;
        title = 'Full Body Essentials (Session B)';
        focus = 'Posterior Chain, Incline Push & Vertical Pull';
        warmup = '5 min incline walk + hip openers & band pull-aparts';
        cardio = trainingDayCardio;
        rawKeys = [
          'romanian_deadlift',
          'incline_dumbbell_press',
          'lat_pulldown',
          'lateral_raises',
          'dumbbell_hammer_curl',
        ];
      }
    }

    // --- 3-DAY FULL BODY UNDULATING ---
    else if (daysCount === 3) {
      if (i === 0) { // Monday: Full Body Compound A
        isTrainingDay = true;
        title = 'Full Body Compound Foundations (A)';
        focus = 'Heavy Squat, Mid Chest & Upper Row';
        warmup = '5 min treadmill incline + dynamic bodyweight squats';
        cardio = trainingDayCardio;
        rawKeys = [
          'barbell_back_squat',
          'barbell_bench_press',
          'chest_supported_row',
          'seated_dumbbell_shoulder_press',
          'plank',
        ];
      } else if (i === 2) { // Wednesday: Full Body Hypertrophy B
        isTrainingDay = true;
        title = 'Full Body Posterior & Vertical (B)';
        focus = 'Hamstrings, Upper Chest & Lats';
        warmup = '5 min rowing machine + shoulder rotations';
        cardio = trainingDayCardio;
        rawKeys = [
          'romanian_deadlift',
          'incline_dumbbell_press',
          'lat_pulldown',
          'lateral_raises',
          'hanging_knee_raises',
        ];
      } else if (i === 4) { // Friday: Full Body Density C
        isTrainingDay = true;
        title = 'Full Body Unilateral & Arms (C)';
        focus = 'Unilateral Balance, Back & Arm Aesthetics';
        warmup = '5 min stationary bike + lunges & band dislocates';
        cardio = trainingDayCardio;
        rawKeys = [
          'bulgarian_split_squat',
          'single_arm_dumbbell_row',
          'pushups',
          'dumbbell_hammer_curl',
          'triceps_rope_pushdown',
        ];
      }
    }

    // --- 4-DAY UPPER / LOWER PERIODIZATION ---
    else if (daysCount === 4) {
      if (i === 0) { // Mon: Upper Power
        isTrainingDay = true;
        title = 'Upper Body Power & Horizontal Focus';
        focus = 'Chest, Upper Back & Heavy Pressing';
        warmup = '5 min incline walk + arm circles & band pull-aparts';
        cardio = trainingDayCardio;
        rawKeys = [
          'barbell_bench_press',
          'chest_supported_row',
          'overhead_barbell_press',
          'lat_pulldown',
          'triceps_rope_pushdown',
          'dumbbell_hammer_curl',
        ];
      } else if (i === 1) { // Tue: Lower Quad Dominant
        isTrainingDay = true;
        title = 'Lower Body Strength & Quad Dominant';
        focus = 'Quadriceps, Adductors & Abdominals';
        warmup = '5 min stationary bike + bodyweight squats & leg swings';
        cardio = trainingDayCardio;
        rawKeys = [
          'barbell_back_squat',
          'leg_press',
          'bulgarian_split_squat',
          'standing_calf_raises',
          'hanging_knee_raises',
        ];
      } else if (i === 3) { // Thu: Upper Hypertrophy
        isTrainingDay = true;
        title = 'Upper Body Hypertrophy & Incline/Vertical';
        focus = 'Upper Chest, Lats, Delts & Arms';
        warmup = '5 min rowing machine + shoulder rotations';
        cardio = trainingDayCardio;
        rawKeys = [
          'incline_dumbbell_press',
          'pullups',
          'single_arm_dumbbell_row',
          'lateral_raises',
          'face_pulls',
          'barbell_bicep_curl',
        ];
      } else if (i === 4) { // Fri: Lower Posterior
        isTrainingDay = true;
        title = 'Lower Body Posterior & Hamstrings';
        focus = 'Hamstrings, Glutes & Core Stability';
        warmup = '5 min bike + glute bridges & hip openers';
        cardio = trainingDayCardio;
        rawKeys = [
          'romanian_deadlift',
          'lying_leg_curls',
          'goblet_squat',
          'glute_bridges',
          'plank',
        ];
      }
    }

    // --- 5-DAY PUSH / PULL / LEGS + UPPER / POSTERIOR ---
    // Specifically structured so 5-day is NOT simply a 4-day plan with one extra day!
    else if (daysCount === 5) {
      if (i === 0) { // Mon: Push Day
        isTrainingDay = true;
        title = 'Push Day: Chest, Anterior Delts & Triceps';
        focus = 'Horizontal Push Mechanics & Triceps Lockout';
        warmup = '5 min incline walk + band dislocates & pushup walkouts';
        cardio = trainingDayCardio;
        rawKeys = [
          'barbell_bench_press',
          'incline_dumbbell_press',
          'cable_chest_flyes',
          'seated_dumbbell_shoulder_press',
          'triceps_rope_pushdown',
        ];
      } else if (i === 1) { // Tue: Pull Day
        isTrainingDay = true;
        title = 'Pull Day: Back Width, Thickness & Biceps';
        focus = 'Vertical Pull, Latissimus Dorsi & Biceps';
        warmup = '5 min rowing machine + band pull-aparts';
        cardio = trainingDayCardio;
        rawKeys = [
          'pullups',
          'barbell_bent_row',
          'single_arm_dumbbell_row',
          'face_pulls',
          'incline_dumbbell_curl',
        ];
      } else if (i === 2) { // Wed: Leg Day Anterior
        isTrainingDay = true;
        title = 'Leg Day: Quadriceps & Knee Dominant';
        focus = 'Quadriceps, Adductors & Calves';
        warmup = '5 min stationary bike + bodyweight squats & world-greatest-stretch';
        cardio = trainingDayCardio;
        rawKeys = [
          'barbell_back_squat',
          'leg_press',
          'bulgarian_split_squat',
          'standing_calf_raises',
          'hanging_knee_raises',
        ];
      }
      // Thursday is dedicated Rest & CNS Recovery!
      else if (i === 4) { // Fri: Upper Body Density
        isTrainingDay = true;
        title = 'Upper Body Density & Shoulder Caps';
        focus = 'Upper Chest, Mid-Back & Medial Delts';
        warmup = '5 min incline walk + shoulder dynamic rotations';
        cardio = trainingDayCardio;
        rawKeys = [
          'incline_dumbbell_press',
          'chest_supported_row',
          'lateral_raises',
          'cable_lateral_raises',
          'dumbbell_hammer_curl',
          'overhead_dumbbell_tricep_extension',
        ];
      } else if (i === 5) { // Sat: Lower Posterior & Core
        isTrainingDay = true;
        title = 'Posterior Chain, Glutes & Core Stability';
        focus = 'Hip Hinge, Hamstrings & Anti-Extension Core';
        warmup = '5 min bike + glute activation bridges';
        cardio = trainingDayCardio;
        rawKeys = [
          'romanian_deadlift',
          'lying_leg_curls',
          'goblet_squat',
          'plank',
          'deadbug',
        ];
      }
      // Sunday is dedicated Rest
    }

    // --- 6-DAY PUSH / PULL / LEGS x 2 ---
    else if (daysCount === 6) {
      if (i === 0) { // Mon: Push A
        isTrainingDay = true;
        title = 'Push (A): Heavy Horizontal & Deltoids';
        focus = 'Mid Chest & Overhead Pressing';
        warmup = '5 min walk + band pull-aparts';
        cardio = trainingDayCardio;
        rawKeys = ['barbell_bench_press', 'overhead_barbell_press', 'incline_dumbbell_press', 'lateral_raises', 'triceps_rope_pushdown'];
      } else if (i === 1) { // Tue: Pull A
        isTrainingDay = true;
        title = 'Pull (A): Vertical Lat Focus & Forearms';
        focus = 'Lats & Forearm Grip';
        warmup = '5 min row + scapular pulls';
        cardio = trainingDayCardio;
        rawKeys = ['pullups', 'single_arm_dumbbell_row', 'lat_pulldown', 'face_pulls', 'dumbbell_hammer_curl'];
      } else if (i === 2) { // Wed: Legs A
        isTrainingDay = true;
        title = 'Legs (A): Quad Dominant & Calves';
        focus = 'Knee Extension & Core';
        warmup = '5 min bike + bodyweight squats';
        cardio = trainingDayCardio;
        rawKeys = ['barbell_back_squat', 'leg_press', 'bulgarian_split_squat', 'standing_calf_raises', 'hanging_knee_raises'];
      } else if (i === 3) { // Thu: Push B
        isTrainingDay = true;
        title = 'Push (B): Upper Chest & Triceps Density';
        focus = 'Incline Vectors & Medial Delts';
        warmup = '5 min walk + rotator cuff warmups';
        cardio = trainingDayCardio;
        rawKeys = ['incline_dumbbell_press', 'seated_dumbbell_shoulder_press', 'cable_chest_flyes', 'lateral_raises', 'overhead_dumbbell_tricep_extension'];
      } else if (i === 4) { // Fri: Pull B
        isTrainingDay = true;
        title = 'Pull (B): Horizontal Thickness & Peak Biceps';
        focus = 'Mid-Back Rhomboids & Biceps';
        warmup = '5 min row + band dislocations';
        cardio = trainingDayCardio;
        rawKeys = ['barbell_bent_row', 'chest_supported_row', 'cable_seated_row', 'face_pulls', 'barbell_bicep_curl'];
      } else if (i === 5) { // Sat: Legs B
        isTrainingDay = true;
        title = 'Legs (B): Hamstrings, Glutes & Abs';
        focus = 'Hip Hinge & Posterior Chain';
        warmup = '5 min bike + glute bridges';
        cardio = trainingDayCardio;
        rawKeys = ['romanian_deadlift', 'lying_leg_curls', 'goblet_squat', 'plank', 'deadbug'];
      }
    }

    // Limit exercise count to maxExercisesPerSession for user's duration & experience
    const slicedKeys = rawKeys.slice(0, maxExercisesPerSession);

    const plannedExercises: PlannedExercise[] = isTrainingDay
      ? slicedKeys.map((key, idx) => createPlannedExercise(key, workoutId, idx))
      : [];

    workouts.push({
      id: workoutId,
      plan_id: planId,
      day_index: dayIndex,
      day_name: dayName,
      title,
      focus,
      suggested_duration_min: isTrainingDay ? profile.duration_minutes || 45 : 0,
      warmup_notes: isTrainingDay ? warmup : undefined,
      cardio_notes: cardio,
      is_rest_day: !isTrainingDay,
      exercises: plannedExercises,
    });
  }

  return {
    id: planId,
    user_id: profile.user_id,
    name: `${profile.days_per_week}-Day ${splitName}`,
    split_type: splitName,
    is_active: true,
    summary: `Scientifically calibrated for ${profile.primary_goal.replace(/_/g, ' ')} with ${profile.experience_level} volume. Filtered for ${profile.equipment.join(', ')} and injury safeguards.`,
    progression_notes: progressionNote,
    generation_source: 'sports_science_engine',
    engine_badge: 'Sports-Science Deterministic Engine (Offline & Verified)',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workouts,
  };
}
