export type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced';

export type EquipmentType = 
  | 'full_gym' 
  | 'home_gym' 
  | 'dumbbells_only' 
  | 'bodyweight' 
  | 'cables_machines'
  | 'kettlebells';

export type PrimaryGoal = 
  | 'fat_loss'
  | 'lean_muscle_gain'
  | 'lean_bulk'
  | 'muscle_building'
  | 'strength_development'
  | 'bodybuilding'
  | 'general_fitness'
  | 'muscular_endurance'
  | 'athletic_performance'
  | 'cardio_health'
  | 'maintain_fitness';

export type PhysiqueAspiration = 
  | 'lean_athletic'
  | 'lean_muscular'
  | 'bigger_muscular'
  | 'bodybuilding'
  | 'strength_focused'
  | 'healthy_fitness';

export type WorkoutDuration = '20_30' | '30_45' | '45_60' | '60_90' | 'flexible';

export type WorkoutStyle = 
  | 'basic_simple'
  | 'hypertrophy'
  | 'heavy_strength'
  | 'bodybuilding'
  | 'machines'
  | 'free_weights'
  | 'bodyweight'
  | 'functional'
  | 'athletic_conditioning';

export type CardioPreference = 
  | 'minimal'
  | 'light'
  | 'moderate'
  | 'high'
  | 'combined'
  | 'planner_recommend';

export type OutdoorActivityType = 
  | 'walking'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'hiking'
  | 'football'
  | 'cricket'
  | 'basketball'
  | 'badminton'
  | 'tennis'
  | 'other_sports'
  | 'active_recovery';

export interface FitnessProfile {
  user_id: string;
  height_cm: number;
  weight_kg: number;
  age?: number;
  experience_level: ExperienceLevel;
  equipment: EquipmentType[];
  primary_goal: PrimaryGoal;
  secondary_goals: PrimaryGoal[];
  custom_goal?: string;
  physique_preference: PhysiqueAspiration;
  days_per_week: number; // 2 to 6
  duration_minutes: number;
  workout_style: WorkoutStyle[];
  schedule_flexibility: 'structured' | 'flexible';
  cardio_preference: CardioPreference;
  outdoor_activities: OutdoorActivityType[];
  injuries: string[];
  limitations_notes?: string;
  target_goal: string;
  target_weight_kg?: number;
  target_review_date: string; // YYYY-MM-DD
  created_at: string;
  updated_at: string;
}

export interface PlannedExercise {
  id: string;
  planned_workout_id: string;
  exercise_id: string;
  name: string;
  target_muscle: string;
  equipment: string;
  sets: number;
  reps_range: string;
  rest_seconds: number;
  order_index: number;
  notes?: string;
}

export interface PlannedWorkout {
  id: string;
  plan_id: string;
  day_index: number; // 1 to 7
  day_name: string; // e.g. "Monday"
  title: string;
  focus: string;
  suggested_duration_min: number;
  warmup_notes?: string;
  cardio_notes?: string;
  is_rest_day: boolean;
  exercises: PlannedExercise[];
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  name: string;
  split_type: string;
  is_active: boolean;
  summary: string;
  progression_notes?: string;
  created_at: string;
  updated_at: string;
  workouts: PlannedWorkout[];
}

export type SessionStatus = 'in_progress' | 'completed' | 'missed' | 'rescheduled';

export interface ExerciseSetLog {
  id: string;
  session_id: string;
  exercise_name: string;
  set_number: number;
  weight_kg: number;
  reps: number;
  completed: boolean;
  notes?: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  planned_workout_id?: string;
  session_date: string; // YYYY-MM-DD
  title: string;
  status: SessionStatus;
  duration_minutes: number;
  started_at: string;
  completed_at?: string | null; // Nullable! Only set when status is 'completed'
  notes?: string;
  rescheduled_to?: string;
  sets: ExerciseSetLog[];
}

export interface OutdoorActivityLog {
  id: string;
  user_id: string;
  group_id?: string;
  activity_date: string; // YYYY-MM-DD
  activity_type: OutdoorActivityType;
  duration_minutes: number;
  distance_km?: number;
  notes?: string;
  completed_at: string;
}

export interface CrewAchievement {
  id: string;
  user_id: string;
  group_id: string;
  badge_type: string;
  title: string;
  message: string;
  created_at: string;
  user_display_name?: string;
}
