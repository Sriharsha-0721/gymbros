import { generateSmartWorkoutPlan } from '../smartPlanEngine';
import { FitnessProfile } from '../../types/smartPlan';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`FAIL: ${msg}`);
  }
}

console.log('--- RUNNING COMPREHENSIVE SMART PLAN PERSONALIZATION TESTS ---\n');

const baseProfile: FitnessProfile = {
  user_id: 'test_user_master',
  height_cm: 178,
  weight_kg: 75,
  experience_level: 'intermediate',
  equipment: ['full_gym'],
  primary_goal: 'muscle_building',
  secondary_goals: [],
  physique_preference: 'lean_muscular',
  days_per_week: 4,
  duration_minutes: 60,
  workout_style: ['hypertrophy'],
  schedule_flexibility: 'structured',
  cardio_preference: 'moderate',
  outdoor_activities: ['running'],
  injuries: [],
  target_goal: 'Build muscle and consistency',
  target_review_date: '2026-12-01',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

// =========================================================================
// TEST 1: 3-Day General Fitness Beginner Plan
// =========================================================================
const profile3DayBeginner: FitnessProfile = {
  ...baseProfile,
  days_per_week: 3,
  experience_level: 'beginner',
  primary_goal: 'general_fitness',
  duration_minutes: 45,
};
const plan3Day = generateSmartWorkoutPlan(profile3DayBeginner);
const activeDays3 = plan3Day.workouts.filter(w => !w.is_rest_day);
assert(activeDays3.length === 3, '3-Day plan must have exactly 3 training days');
assert(plan3Day.workouts.filter(w => w.is_rest_day).length === 4, '3-Day plan must have 4 rest days');
// Beginner volume constraint: max 4 exercises per session
for (const day of activeDays3) {
  assert(day.exercises.length <= 4, 'Beginner sessions must have <= 4 exercises to prioritize motor control');
}
console.log('✔ Scenario 1 Passed: 3-day general-fitness beginner plan has 3 days and calibrated beginner volume.');

// =========================================================================
// TEST 2: 4-Day Hypertrophy Plan vs 5-Day Hypertrophy Plan (Distinct Splits!)
// =========================================================================
const profile4DayHypertrophy: FitnessProfile = {
  ...baseProfile,
  days_per_week: 4,
  primary_goal: 'muscle_building',
  duration_minutes: 60,
};
const profile5DayHypertrophy: FitnessProfile = {
  ...baseProfile,
  days_per_week: 5,
  primary_goal: 'muscle_building',
  duration_minutes: 60,
};

const plan4Day = generateSmartWorkoutPlan(profile4DayHypertrophy);
const plan5Day = generateSmartWorkoutPlan(profile5DayHypertrophy);

const activeDays4 = plan4Day.workouts.filter(w => !w.is_rest_day);
const activeDays5 = plan5Day.workouts.filter(w => !w.is_rest_day);

assert(activeDays4.length === 4, '4-Day plan must have 4 training days');
assert(activeDays5.length === 5, '5-Day plan must have 5 training days');

// Verify split names differ
assert(plan4Day.split_type.includes('Upper / Lower'), '4-day split should be an Upper / Lower periodization');
assert(plan5Day.split_type.includes('Push / Pull / Legs'), '5-day split should be a Push / Pull / Legs architecture');

// Verify 4-day and 5-day have different Day 1 focus & exercises
assert(activeDays4[0].focus !== activeDays5[0].focus || activeDays4[0].title !== activeDays5[0].title, '4-day and 5-day Day 1 must have distinct focus');

// Check that 5-day rest days include mid-week recovery (Thursday)
assert(plan5Day.workouts[3].is_rest_day === true, '5-day plan must place a rest day between training blocks (Day 4 Thursday)');
console.log('✔ Scenario 2 Passed: 4-day and 5-day plans have distinct splits, rest cadence, and exercise architecture.');

// =========================================================================
// TEST 3: Strength-Focused Plan (Low Reps, High Rest)
// =========================================================================
const profileStrength: FitnessProfile = {
  ...baseProfile,
  days_per_week: 4,
  primary_goal: 'strength_development',
  experience_level: 'intermediate',
};
const planStrength = generateSmartWorkoutPlan(profileStrength);
const firstStrengthEx = planStrength.workouts.find(w => !w.is_rest_day)!.exercises[0];
assert(firstStrengthEx.sets >= 4, 'Strength focus must prescribe 4 sets');
assert(firstStrengthEx.reps_range === '4–6', 'Strength focus must calibrate to 4–6 reps');
assert(firstStrengthEx.rest_seconds >= 120, 'Strength focus must require >= 120s rest');
console.log('✔ Scenario 3 Passed: Strength plan enforces 4x(4-6) reps and 120s rest for neural recovery.');

// =========================================================================
// TEST 4: Fat-Loss-Oriented Plan (High Reps, Short Rest, Cardio Integration)
// =========================================================================
const profileFatLoss: FitnessProfile = {
  ...baseProfile,
  days_per_week: 4,
  primary_goal: 'fat_loss',
  cardio_preference: 'high',
};
const planFatLoss = generateSmartWorkoutPlan(profileFatLoss);
const firstFatLossEx = planFatLoss.workouts.find(w => !w.is_rest_day)!.exercises[0];
assert(firstFatLossEx.reps_range === '12–15', 'Fat loss focus must calibrate to 12–15 metabolic reps');
assert(firstFatLossEx.rest_seconds <= 60, 'Fat loss focus must have short 45-60s rest periods for workout density');
const trainingDayWithCardio = planFatLoss.workouts.find(w => !w.is_rest_day && w.cardio_notes);
assert(Boolean(trainingDayWithCardio), 'Fat loss plan must include prescribed cardio notes');
console.log('✔ Scenario 4 Passed: Fat loss plan enforces metabolic reps (12-15), 50s rest, and cardio prescription.');

// =========================================================================
// TEST 5: Limited Equipment Plan (Dumbbells Only)
// =========================================================================
const profileDumbbellsOnly: FitnessProfile = {
  ...baseProfile,
  equipment: ['dumbbells_only'],
};
const planDumbbells = generateSmartWorkoutPlan(profileDumbbellsOnly);
for (const day of planDumbbells.workouts) {
  for (const ex of day.exercises) {
    assert(
      ex.equipment === 'dumbbell' || ex.equipment === 'bodyweight',
      `Dumbbells-only plan must NEVER prescribe ${ex.equipment} (Found: ${ex.name})`
    );
  }
}
console.log('✔ Scenario 5 Passed: Dumbbells-only plan strictly excludes barbells and cable/machine exercises.');

// =========================================================================
// TEST 6: Home Bodyweight Plan (No Weights)
// =========================================================================
const profileBodyweight: FitnessProfile = {
  ...baseProfile,
  equipment: ['bodyweight'],
};
const planBodyweight = generateSmartWorkoutPlan(profileBodyweight);
for (const day of planBodyweight.workouts) {
  for (const ex of day.exercises) {
    assert(
      ex.equipment === 'bodyweight',
      `Bodyweight-only plan must ONLY prescribe bodyweight movements (Found ${ex.name} with ${ex.equipment})`
    );
  }
}
console.log('✔ Scenario 6 Passed: Bodyweight-only plan strictly prescribes 100% bodyweight movements.');

// =========================================================================
// TEST 7: Injury Contraindication Filter (Lower Back & Shoulder)
// =========================================================================
const profileInjured: FitnessProfile = {
  ...baseProfile,
  injuries: ['lower_back', 'shoulder'],
};
const planInjured = generateSmartWorkoutPlan(profileInjured);
for (const day of planInjured.workouts) {
  for (const ex of day.exercises) {
    assert(ex.exercise_id !== 'barbell_back_squat', 'Must NOT prescribe Barbell Back Squat with lower back injury');
    assert(ex.exercise_id !== 'barbell_bent_row', 'Must NOT prescribe Bent-Over Row with lower back injury');
    assert(ex.exercise_id !== 'overhead_barbell_press', 'Must NOT prescribe Overhead Press with shoulder injury');
    assert(ex.exercise_id !== 'cable_chest_flyes', 'Must NOT prescribe Cable Chest Flyes with shoulder injury');
  }
}
console.log('✔ Scenario 7 Passed: Lower back & shoulder injuries properly exclude all contraindicated exercises.');

// =========================================================================
// TEST 8: Session Duration Scaling (30 mins vs 75 mins)
// =========================================================================
const profile30Min: FitnessProfile = {
  ...baseProfile,
  duration_minutes: 30,
};
const profile75Min: FitnessProfile = {
  ...baseProfile,
  duration_minutes: 75,
  experience_level: 'advanced',
};
const plan30Min = generateSmartWorkoutPlan(profile30Min);
const plan75Min = generateSmartWorkoutPlan(profile75Min);

const active30ExCount = plan30Min.workouts.find(w => !w.is_rest_day)!.exercises.length;
const active75ExCount = plan75Min.workouts.find(w => !w.is_rest_day)!.exercises.length;

assert(active30ExCount === 3, `30-minute plan must prescribe 3 exercises for time feasibility (Got: ${active30ExCount})`);
assert(active75ExCount >= 5, `75-minute advanced plan must prescribe 5-6 exercises (Got: ${active75ExCount})`);
assert(active75ExCount > active30ExCount, '75-minute plan must contain more exercises than 30-minute plan');
console.log('✔ Scenario 8 Passed: Duration correctly scales exercise volume (30 mins = 3 moves, 75 mins = 5-6 moves).');

// =========================================================================
// TEST 9: Plan Source & Engine Verification
// =========================================================================
assert(plan4Day.generation_source === 'sports_science_engine', 'Must tag plan with generation_source sports_science_engine');
assert(Boolean(plan4Day.engine_badge), 'Must include user-facing engine_badge explaining generator');
console.log('✔ Scenario 9 Passed: Plan metadata transparently identifies verified sports-science engine.');

console.log('\n=============================================================');
console.log('ALL 9 COMPREHENSIVE PERSONALIZATION TEST SCENARIOS PASSED! 🚀');
console.log('=============================================================');
