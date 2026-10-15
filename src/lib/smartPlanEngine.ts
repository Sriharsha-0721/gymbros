import { FitnessProfile, WorkoutPlan, PlannedWorkout, PlannedExercise } from '../types/smartPlan';

interface ExerciseTemplate {
  id: string;
  name: string;
  target_muscle: string;
  equipment: 'barbell' | 'dumbbell' | 'machine' | 'cable' | 'bodyweight' | 'kettlebell';
  contraindicatedInjuries: string[];
  substitutes: string[];
}

const EXERCISE_CATALOG: Record<string, ExerciseTemplate> = {
  // Chest
  barbell_bench_press: {
    id: 'barbell_bench_press',
    name: 'Barbell Bench Press',
    target_muscle: 'Chest (Mid/Lower)',
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
    target_muscle: 'Upper Chest',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['dumbbell_bench_press', 'machine_chest_press'],
  },
  cable_chest_flyes: {
    id: 'cable_chest_flyes',
    name: 'Standing Cable Chest Flyes',
    target_muscle: 'Inner Chest & Pectorals',
    equipment: 'cable',
    contraindicatedInjuries: ['shoulder'],
    substitutes: ['dumbbell_flyes', 'pushups'],
  },
  pushups: {
    id: 'pushups',
    name: 'Standard Push-Ups',
    target_muscle: 'Chest & Triceps',
    equipment: 'bodyweight',
    contraindicatedInjuries: ['wrist'],
    substitutes: ['machine_chest_press'],
  },

  // Shoulders
  overhead_barbell_press: {
    id: 'overhead_barbell_press',
    name: 'Standing Barbell Overhead Press',
    target_muscle: 'Anterior Deltoids & Shoulders',
    equipment: 'barbell',
    contraindicatedInjuries: ['shoulder', 'lower_back'],
    substitutes: ['seated_dumbbell_shoulder_press', 'lateral_raises'],
  },
  seated_dumbbell_shoulder_press: {
    id: 'seated_dumbbell_shoulder_press',
    name: 'Seated Dumbbell Shoulder Press',
    target_muscle: 'Shoulders (Anterior & Medial)',
    equipment: 'dumbbell',
    contraindicatedInjuries: ['shoulder'],
    substitutes: ['lateral_raises'],
  },
  lateral_raises: {
    id: 'lateral_raises',
    name: 'Dumbbell Lateral Raises',
    target_muscle: 'Lateral Deltoids (Side Shoulders)',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['cable_lateral_raises'],
  },
  face_pulls: {
    id: 'face_pulls',
    name: 'Cable Face Pulls',
    target_muscle: 'Rear Deltoids & Rotator Cuff',
    equipment: 'cable',
    contraindicatedInjuries: [],
    substitutes: ['dumbbell_rear_delt_flyes'],
  },

  // Back
  pullups: {
    id: 'pullups',
    name: 'Wide-Grip Pull-Ups / Chin-Ups',
    target_muscle: 'Latissimus Dorsi & Upper Back',
    equipment: 'bodyweight',
    contraindicatedInjuries: ['shoulder', 'elbow'],
    substitutes: ['lat_pulldown', 'inverted_rows'],
  },
  lat_pulldown: {
    id: 'lat_pulldown',
    name: 'Lat Pulldown (Neutral/Wide Grip)',
    target_muscle: 'Latissimus Dorsi (Lats)',
    equipment: 'cable',
    contraindicatedInjuries: [],
    substitutes: ['pullups', 'single_arm_dumbbell_row'],
  },
  barbell_bent_row: {
    id: 'barbell_bent_row',
    name: 'Bent-Over Barbell Row',
    target_muscle: 'Mid-Back & Rhomboids',
    equipment: 'barbell',
    contraindicatedInjuries: ['lower_back'],
    substitutes: ['chest_supported_row', 'single_arm_dumbbell_row'],
  },
  chest_supported_row: {
    id: 'chest_supported_row',
    name: 'Chest-Supported Incline Dumbbell Row',
    target_muscle: 'Upper & Mid Back (Spine Safe)',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['single_arm_dumbbell_row', 'cable_seated_row'],
  },
  single_arm_dumbbell_row: {
    id: 'single_arm_dumbbell_row',
    name: 'Single-Arm Dumbbell Row',
    target_muscle: 'Lats & Rhomboids',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['chest_supported_row'],
  },
  cable_seated_row: {
    id: 'cable_seated_row',
    name: 'Seated Cable Row',
    target_muscle: 'Mid Back & Traps',
    equipment: 'cable',
    contraindicatedInjuries: [],
    substitutes: ['chest_supported_row'],
  },

  // Legs & Glutes
  barbell_back_squat: {
    id: 'barbell_back_squat',
    name: 'Barbell Back Squat',
    target_muscle: 'Quadriceps, Glutes & Adductors',
    equipment: 'barbell',
    contraindicatedInjuries: ['lower_back', 'knee'],
    substitutes: ['goblet_squat', 'leg_press', 'bulgarian_split_squat'],
  },
  goblet_squat: {
    id: 'goblet_squat',
    name: 'Dumbbell / Kettlebell Goblet Squat',
    target_muscle: 'Quadriceps & Core',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['bodyweight_box_squats'],
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
    substitutes: ['goblet_squat'],
  },
  lying_leg_curls: {
    id: 'lying_leg_curls',
    name: 'Lying Hamstring Leg Curls',
    target_muscle: 'Hamstrings',
    equipment: 'machine',
    contraindicatedInjuries: [],
    substitutes: ['romanian_deadlift'],
  },
  standing_calf_raises: {
    id: 'standing_calf_raises',
    name: 'Standing Calf Raises',
    target_muscle: 'Gastrocnemius & Calves',
    equipment: 'dumbbell',
    contraindicatedInjuries: [],
    substitutes: ['bodyweight_calf_raises'],
  },

  // Arms (Biceps & Triceps)
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
    substitutes: ['cable_rope_curls'],
  },
  triceps_rope_pushdown: {
    id: 'triceps_rope_pushdown',
    name: 'Cable Triceps Rope Pushdown',
    target_muscle: 'Lateral & Medial Triceps',
    equipment: 'cable',
    contraindicatedInjuries: ['elbow'],
    substitutes: ['overhead_dumbbell_tricep_extension', 'diamond_pushups'],
  },
  overhead_dumbbell_tricep_extension: {
    id: 'overhead_dumbbell_tricep_extension',
    name: 'Overhead Two-Arm Dumbbell Extension',
    target_muscle: 'Triceps Long Head',
    equipment: 'dumbbell',
    contraindicatedInjuries: ['elbow', 'shoulder'],
    substitutes: ['triceps_rope_pushdown'],
  },

  // Core
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
};

export function generateSmartWorkoutPlan(profile: FitnessProfile): WorkoutPlan {
  const daysCount = profile.days_per_week || 4;
  const planId = 'plan_' + Math.random().toString(36).substring(2, 9);

  // Determine split type based on days
  let splitName = '4-Day Upper / Lower Split';
  if (daysCount === 2) splitName = '2-Day Full Body Essentials';
  else if (daysCount === 3) splitName = '3-Day Full Body Conditioning';
  else if (daysCount === 5) splitName = '5-Day Push / Pull / Legs / Upper / Lower';
  else if (daysCount === 6) splitName = '6-Day Push / Pull / Legs (PPL x2)';

  // Calibrate rep range and sets based on primary goal
  let defaultSets = 3;
  let repRange = '8–12';
  let restSeconds = 90;

  if (profile.primary_goal === 'strength_development') {
    defaultSets = 4;
    repRange = '4–6';
    restSeconds = 120;
  } else if (profile.primary_goal === 'fat_loss' || profile.primary_goal === 'muscular_endurance') {
    defaultSets = 3;
    repRange = '12–15';
    restSeconds = 60;
  } else if (profile.primary_goal === 'bodybuilding') {
    defaultSets = 4;
    repRange = '10–12';
    restSeconds = 75;
  }

  // Filter exercises against user's stated injuries
  const filterExercise = (preferredKey: string): ExerciseTemplate => {
    const candidate = EXERCISE_CATALOG[preferredKey];
    if (!candidate) return EXERCISE_CATALOG['pushups'];

    const hasConflict = candidate.contraindicatedInjuries.some(inj => profile.injuries.includes(inj));
    if (!hasConflict) return candidate;

    // Find first safe substitute
    for (const subKey of candidate.substitutes) {
      const sub = EXERCISE_CATALOG[subKey];
      if (sub && !sub.contraindicatedInjuries.some(inj => profile.injuries.includes(inj))) {
        return sub;
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

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  const workouts: PlannedWorkout[] = [];

  // Generate 7 day schedule matching daysCount
  for (let i = 0; i < 7; i++) {
    const dayIndex = i + 1;
    const dayName = daysOfWeek[i];
    const workoutId = `wk_${planId}_${dayIndex}`;

    // 4-Day Upper / Lower (Default)
    // Mon: Upper, Tue: Lower, Wed: Rest, Thu: Upper, Fri: Lower, Sat: Outdoor Activity / Rest, Sun: Rest
    let isTrainingDay = false;
    let title = 'Rest & Recovery Day';
    let focus = 'Recovery';
    let warmup = 'Light dynamic stretching or 20-minute gentle recovery walk.';
    let cardio = profile.cardio_preference === 'high' ? '30 mins low-intensity steady cardio' : undefined;
    let exerciseKeys: string[] = [];

    if (daysCount === 4) {
      if (i === 0) { // Mon: Upper A
        isTrainingDay = true;
        title = 'Upper Body Power & Hypertrophy (A)';
        focus = 'Chest, Upper Back, Shoulders & Arms';
        warmup = '5 min treadmill incline + arm circles & band pull-aparts';
        exerciseKeys = [
          'barbell_bench_press',
          'chest_supported_row',
          'overhead_barbell_press',
          'lat_pulldown',
          'dumbbell_hammer_curl',
          'triceps_rope_pushdown',
        ];
      } else if (i === 1) { // Tue: Lower A
        isTrainingDay = true;
        title = 'Lower Body Strength & Quads (A)';
        focus = 'Quadriceps, Hamstrings & Calves';
        warmup = '5 min stationary bike + bodyweight squats & leg swings';
        exerciseKeys = [
          'barbell_back_squat',
          'romanian_deadlift',
          'leg_press',
          'standing_calf_raises',
          'hanging_knee_raises',
        ];
      } else if (i === 3) { // Thu: Upper B
        isTrainingDay = true;
        title = 'Upper Body Symmetry & Volume (B)';
        focus = 'Incline Chest, Lats & Rear Delts';
        warmup = '5 min rowing machine + shoulder rotations';
        exerciseKeys = [
          'incline_dumbbell_press',
          'single_arm_dumbbell_row',
          'lateral_raises',
          'face_pulls',
          'barbell_bicep_curl',
          'overhead_dumbbell_tricep_extension',
        ];
      } else if (i === 4) { // Fri: Lower B
        isTrainingDay = true;
        title = 'Lower Body Posterior & Core (B)';
        focus = 'Hamstrings, Glutes & Core Stability';
        warmup = '5 min bike + glute bridges & hip openers';
        exerciseKeys = [
          'goblet_squat',
          'lying_leg_curls',
          'romanian_deadlift',
          'plank',
          'hanging_knee_raises',
        ];
      }
    } else if (daysCount === 3) {
      // Mon: Full Body A, Wed: Full Body B, Fri: Full Body C
      if (i === 0) {
        isTrainingDay = true;
        title = 'Full Body Compound Foundations (A)';
        focus = 'Chest, Quads, Mid-Back';
        exerciseKeys = ['barbell_bench_press', 'barbell_back_squat', 'lat_pulldown', 'seated_dumbbell_shoulder_press', 'plank'];
      } else if (i === 2) {
        isTrainingDay = true;
        title = 'Full Body Hypertrophy (B)';
        focus = 'Hamstrings, Shoulders, Lats';
        exerciseKeys = ['romanian_deadlift', 'incline_dumbbell_press', 'chest_supported_row', 'lateral_raises', 'hanging_knee_raises'];
      } else if (i === 4) {
        isTrainingDay = true;
        title = 'Full Body Power (C)';
        focus = 'Quads, Chest, Arms';
        exerciseKeys = ['goblet_squat', 'single_arm_dumbbell_row', 'pushups', 'dumbbell_hammer_curl', 'triceps_rope_pushdown'];
      }
    } else if (daysCount === 2) {
      // Tue: Full Body 1, Sat: Full Body 2
      if (i === 1) {
        isTrainingDay = true;
        title = 'Full Body Workout (Part 1)';
        focus = 'Squats, Horizontal Push & Pull';
        exerciseKeys = ['goblet_squat', 'barbell_bench_press', 'chest_supported_row', 'seated_dumbbell_shoulder_press', 'plank'];
      } else if (i === 4) {
        isTrainingDay = true;
        title = 'Full Body Workout (Part 2)';
        focus = 'Hinges, Vertical Push & Pull';
        exerciseKeys = ['romanian_deadlift', 'incline_dumbbell_press', 'lat_pulldown', 'lateral_raises', 'dumbbell_hammer_curl'];
      }
    } else if (daysCount >= 5) {
      // 5-6 Day Push / Pull / Legs
      if (i === 0) {
        isTrainingDay = true;
        title = 'Push Session: Chest, Shoulders & Triceps';
        focus = 'Upper Body Push Mechanics';
        exerciseKeys = ['barbell_bench_press', 'incline_dumbbell_press', 'seated_dumbbell_shoulder_press', 'lateral_raises', 'triceps_rope_pushdown'];
      } else if (i === 1) {
        isTrainingDay = true;
        title = 'Pull Session: Back, Lats & Biceps';
        focus = 'Upper Body Pull Mechanics';
        exerciseKeys = ['lat_pulldown', 'chest_supported_row', 'single_arm_dumbbell_row', 'face_pulls', 'dumbbell_hammer_curl'];
      } else if (i === 2) {
        isTrainingDay = true;
        title = 'Legs & Core Session: Quads & Hamstrings';
        focus = 'Lower Body Compound Strength';
        exerciseKeys = ['barbell_back_squat', 'romanian_deadlift', 'leg_press', 'standing_calf_raises', 'hanging_knee_raises'];
      } else if (i === 3) {
        isTrainingDay = true;
        title = 'Upper Body Focus: Volume & Density';
        focus = 'Deltoid caps, Upper Chest & Arms';
        exerciseKeys = ['incline_dumbbell_press', 'pullups', 'lateral_raises', 'barbell_bicep_curl', 'overhead_dumbbell_tricep_extension'];
      } else if (i === 4) {
        isTrainingDay = true;
        title = 'Lower Body & Core: Glutes & Calves';
        focus = 'Posterior Chain & Abdominals';
        exerciseKeys = ['goblet_squat', 'lying_leg_curls', 'standing_calf_raises', 'plank', 'hanging_knee_raises'];
      } else if (i === 5 && daysCount === 6) {
        isTrainingDay = true;
        title = 'Active Athletic Conditioning & Arms';
        focus = 'Cardio interval, grip & arm volume';
        exerciseKeys = ['dumbbell_hammer_curl', 'triceps_rope_pushdown', 'lateral_raises', 'hanging_knee_raises', 'pushups'];
      }
    }

    const plannedExercises: PlannedExercise[] = isTrainingDay
      ? exerciseKeys.map((key, idx) => createPlannedExercise(key, workoutId, idx))
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
    summary: `Tailored for ${profile.primary_goal.replace(/_/g, ' ')} with ${profile.experience_level} volume. Excludes contraindicated movements for stated limitations.`,
    progression_notes: 'Aim to add 1 repetition or small weight increment (1-2.5kg) every 2 weeks when target reps are cleanly achieved with good form.',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    workouts,
  };
}
