import { generateSmartWorkoutPlan } from '../smartPlanEngine';
import { FitnessProfile } from '../../types/smartPlan';

function assert(condition: boolean, msg: string) {
  if (!condition) {
    throw new Error(`FAIL: ${msg}`);
  }
}

console.log('Running Smart Plan Engine Unit Tests...');

// Test 1: 4-Day Split with Lower Back Injury
const profileLowerBack: FitnessProfile = {
  user_id: 'user_test_1',
  height_cm: 180,
  weight_kg: 80,
  experience_level: 'intermediate',
  equipment: ['full_gym'],
  primary_goal: 'muscle_building',
  secondary_goals: [],
  physique_preference: 'lean_muscular',
  days_per_week: 4,
  duration_minutes: 45,
  workout_style: ['hypertrophy'],
  schedule_flexibility: 'structured',
  cardio_preference: 'moderate',
  outdoor_activities: ['walking'],
  injuries: ['lower_back'],
  target_goal: 'Consistency',
  target_review_date: '2026-12-01',
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

const plan1 = generateSmartWorkoutPlan(profileLowerBack);
assert(plan1.workouts.length === 7, 'Plan must contain exactly 7 days');
const trainingDays1 = plan1.workouts.filter(w => !w.is_rest_day);
assert(trainingDays1.length === 4, 'Must have exactly 4 training days for 4-day plan');
const restDays1 = plan1.workouts.filter(w => w.is_rest_day);
assert(restDays1.length === 3, 'Must have exactly 3 rest days for 4-day plan');

// Verify that Barbell Back Squat and Barbell Bent Row are replaced due to lower back injury
for (const day of plan1.workouts) {
  for (const ex of day.exercises) {
    assert(ex.exercise_id !== 'barbell_back_squat', 'Must NOT prescribe Barbell Back Squat with lower back injury');
    assert(ex.exercise_id !== 'barbell_bent_row', 'Must NOT prescribe Barbell Bent Row with lower back injury');
  }
}
console.log('✔ Test 1 Passed: 4-day split generated with proper injury substitution (lower back)');

// Test 2: 3-Day Strength Plan with Rep Range Verification
const profileStrength: FitnessProfile = {
  ...profileLowerBack,
  user_id: 'user_test_2',
  days_per_week: 3,
  primary_goal: 'strength_development',
  injuries: [],
};

const plan2 = generateSmartWorkoutPlan(profileStrength);
const trainingDays2 = plan2.workouts.filter(w => !w.is_rest_day);
assert(trainingDays2.length === 3, 'Must have exactly 3 training days for 3-day plan');
assert(plan2.workouts.filter(w => w.is_rest_day).length === 4, 'Must have 4 rest days');

// Verify strength reps & sets
const firstExercise = trainingDays2[0].exercises[0];
assert(firstExercise.sets === 4, 'Strength focus should use 4 sets');
assert(firstExercise.reps_range === '4–6', 'Strength focus should calibrate rep range to 4–6 reps');
console.log('✔ Test 2 Passed: 3-day strength split with calibrated 4x(4-6) progression');

// Test 3: Shoulder Impingement Check
const profileShoulder: FitnessProfile = {
  ...profileLowerBack,
  user_id: 'user_test_3',
  days_per_week: 5,
  injuries: ['shoulder'],
};

const plan3 = generateSmartWorkoutPlan(profileShoulder);
const trainingDays3 = plan3.workouts.filter(w => !w.is_rest_day);
assert(trainingDays3.length === 5, 'Must have 5 training days for 5-day plan');

for (const day of plan3.workouts) {
  for (const ex of day.exercises) {
    assert(ex.exercise_id !== 'overhead_barbell_press', 'Must NOT prescribe Barbell Overhead Press with shoulder injury');
    assert(ex.exercise_id !== 'cable_chest_flyes', 'Must NOT prescribe Cable Chest Flyes with shoulder injury');
  }
}
console.log('✔ Test 3 Passed: 5-day split properly excludes contraindicated shoulder exercises');

// Test 4: 2-day and 6-day split bounds
const plan2Day = generateSmartWorkoutPlan({ ...profileLowerBack, days_per_week: 2 });
assert(plan2Day.workouts.filter(w => !w.is_rest_day).length === 2, '2-day plan has 2 training days');

const plan6Day = generateSmartWorkoutPlan({ ...profileLowerBack, days_per_week: 6 });
assert(plan6Day.workouts.filter(w => !w.is_rest_day).length === 6, '6-day plan has 6 training days');
console.log('✔ Test 4 Passed: 2-day and 6-day split boundaries work accurately');

console.log('\nAll Smart Plan Engine unit tests PASSED successfully! 🚀');
