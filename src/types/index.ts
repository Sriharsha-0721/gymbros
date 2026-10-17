export type TimeSlot = 'morning' | 'afternoon' | 'evening';
export type GymStatus = TimeSlot | 'rest' | 'undecided' | 'night';

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  weekly_goal_days?: number;
  created_at: string;
}

export interface GymGroup {
  id: string;
  name: string;
  description?: string;
  invite_code: string;
  created_by: string;
  created_at: string;
  member_count?: number;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string;
  role: 'admin' | 'member';
  joined_at: string;
  profile?: UserProfile;
}

export interface DailyAvailability {
  id: string;
  group_id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format (local date)
  status: GymStatus;
  preferred_time?: string; // e.g. "6:30 AM" or "6:00 PM"
  notes?: string; // e.g. "Chest & Triceps"
  updated_at: string;
  profile?: UserProfile;
}

export interface WorkoutLog {
  id: string;
  user_id: string;
  group_id?: string;
  date: string; // YYYY-MM-DD
  completed_at: string;
  workout_type?: string; // e.g. "Push Day", "Leg Day", "Cardio"
  duration_minutes?: number;
  notes?: string;
  intensity?: 'light' | 'moderate' | 'heavy' | 'pr_beast';
}

export interface StreakStats {
  currentStreak: number;
  bestStreak: number;
  completedThisWeek: number;
  weeklyGoal: number;
  completedThisMonth: number;
  totalCompleted: number;
}

export * from './smartPlan';

