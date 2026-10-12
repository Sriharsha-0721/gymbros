import { DailyAvailability, GymGroup, GroupMember, UserProfile, WorkoutLog } from '../types';
import { getTodayKey, parseDateKey, formatDateKey } from './dateUtils';

export const INITIAL_USER: UserProfile = {
  id: 'usr_me_01',
  email: 'sriharsha@gymbros.app',
  username: 'iron_harsha',
  display_name: 'Sriharsha B.',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  bio: 'Chasing 4-plate deadlifts & morning gym discipline 💪',
  weekly_goal_days: 5,
  created_at: '2026-01-15T08:00:00Z',
};

export const MOCK_FRIENDS: UserProfile[] = [
  {
    id: 'usr_marcus_02',
    email: 'marcus@gymbros.app',
    username: 'marcus_iron',
    display_name: 'Marcus Vance',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Heavy bench & 6 AM crew only.',
    weekly_goal_days: 5,
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'usr_dave_03',
    email: 'dave@gymbros.app',
    username: 'dave_chen',
    display_name: 'Dave Chen',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Post-work evening sessions. Push pull legs.',
    weekly_goal_days: 4,
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'usr_sarah_04',
    email: 'sarah@gymbros.app',
    username: 'sarah_lifts',
    display_name: 'Sarah Connor',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Strength & conditioning enthusiast.',
    weekly_goal_days: 4,
    created_at: '2026-02-05T08:00:00Z',
  },
  {
    id: 'usr_alex_05',
    email: 'alex@gymbros.app',
    username: 'alex_night',
    display_name: 'Alex Rivera',
    avatar_url: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    bio: 'Late night 9 PM quiet gym sessions.',
    weekly_goal_days: 4,
    created_at: '2026-02-10T08:00:00Z',
  },
  {
    id: 'usr_jake_06',
    email: 'jake@gymbros.app',
    username: 'jake_p',
    display_name: 'Jake Peralta',
    avatar_url: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    bio: 'Taking rest days seriously for max hypertrophy.',
    weekly_goal_days: 3,
    created_at: '2026-03-01T08:00:00Z',
  },
];

export const INITIAL_GROUPS: GymGroup[] = [
  {
    id: 'grp_morning_crew_01',
    name: 'Morning Gym Crew',
    description: 'Gold’s Gym Downtown • 6:30 AM grind squad',
    invite_code: 'BRO-6942',
    created_by: 'usr_me_01',
    created_at: '2026-01-16T10:00:00Z',
    member_count: 6,
  },
  {
    id: 'grp_weekend_beasts_02',
    name: 'Iron Brotherhood',
    description: 'Weekend heavy compound lifters & PR hunters',
    invite_code: 'IRON-9921',
    created_by: 'usr_marcus_02',
    created_at: '2026-02-12T14:00:00Z',
    member_count: 4,
  },
];

export const INITIAL_GROUP_MEMBERS: GroupMember[] = [
  {
    id: 'mem_1',
    group_id: 'grp_morning_crew_01',
    user_id: INITIAL_USER.id,
    role: 'admin',
    joined_at: '2026-01-16T10:00:00Z',
    profile: INITIAL_USER,
  },
  ...MOCK_FRIENDS.map((f, idx) => ({
    id: `mem_${idx + 2}`,
    group_id: 'grp_morning_crew_01',
    user_id: f.id,
    role: 'member' as const,
    joined_at: f.created_at,
    profile: f,
  })),
];

// Generate dynamic availabilities centered around today
export function generateSeedAvailabilities(): DailyAvailability[] {
  const todayKey = getTodayKey();
  const today = parseDateKey(todayKey);
  const result: DailyAvailability[] = [];

  // Helper to get date string offset by days
  const getDateOffset = (offset: number): string => {
    const d = new Date(today);
    d.setDate(today.getDate() + offset);
    return formatDateKey(d);
  };

  const groupId = 'grp_morning_crew_01';

  // Today
  result.push({
    id: 'av_today_me',
    group_id: groupId,
    user_id: INITIAL_USER.id,
    date: todayKey,
    status: 'morning',
    preferred_time: '06:30 AM',
    notes: 'Upper Body Power & Arms',
    updated_at: new Date().toISOString(),
    profile: INITIAL_USER,
  });

  result.push({
    id: 'av_today_marcus',
    group_id: groupId,
    user_id: MOCK_FRIENDS[0].id,
    date: todayKey,
    status: 'morning',
    preferred_time: '06:30 AM',
    notes: 'Heavy Bench Press & Incline DB',
    updated_at: new Date().toISOString(),
    profile: MOCK_FRIENDS[0],
  });

  result.push({
    id: 'av_today_sarah',
    group_id: groupId,
    user_id: MOCK_FRIENDS[2].id,
    date: todayKey,
    status: 'morning',
    preferred_time: '07:00 AM',
    notes: 'Back & Core session',
    updated_at: new Date().toISOString(),
    profile: MOCK_FRIENDS[2],
  });

  result.push({
    id: 'av_today_dave',
    group_id: groupId,
    user_id: MOCK_FRIENDS[1].id,
    date: todayKey,
    status: 'evening',
    preferred_time: '06:00 PM',
    notes: 'Push Day 1 - Shoulder focus',
    updated_at: new Date().toISOString(),
    profile: MOCK_FRIENDS[1],
  });

  result.push({
    id: 'av_today_alex',
    group_id: groupId,
    user_id: MOCK_FRIENDS[3].id,
    date: todayKey,
    status: 'night',
    preferred_time: '09:00 PM',
    notes: 'Deadlifts & lats',
    updated_at: new Date().toISOString(),
    profile: MOCK_FRIENDS[3],
  });

  result.push({
    id: 'av_today_jake',
    group_id: groupId,
    user_id: MOCK_FRIENDS[4].id,
    date: todayKey,
    status: 'rest',
    notes: 'Recovery day & sauna. Legs fried.',
    updated_at: new Date().toISOString(),
    profile: MOCK_FRIENDS[4],
  });

  // Tomorrow (+1)
  const tomorrowKey = getDateOffset(1);
  result.push({
    id: 'av_tom_me',
    group_id: groupId,
    user_id: INITIAL_USER.id,
    date: tomorrowKey,
    status: 'morning',
    preferred_time: '07:00 AM',
    notes: 'Leg Day Squats',
    updated_at: new Date().toISOString(),
    profile: INITIAL_USER,
  });
  result.push({
    id: 'av_tom_marcus',
    group_id: groupId,
    user_id: MOCK_FRIENDS[0].id,
    date: tomorrowKey,
    status: 'rest',
    notes: 'Resting before Friday heavy day',
    updated_at: new Date().toISOString(),
    profile: MOCK_FRIENDS[0],
  });
  result.push({
    id: 'av_tom_dave',
    group_id: groupId,
    user_id: MOCK_FRIENDS[1].id,
    date: tomorrowKey,
    status: 'evening',
    preferred_time: '06:30 PM',
    notes: 'Pull day & pull-ups',
    updated_at: new Date().toISOString(),
    profile: MOCK_FRIENDS[1],
  });

  // Yesterday (-1)
  const yesterdayKey = getDateOffset(-1);
  result.push({
    id: 'av_yest_me',
    group_id: groupId,
    user_id: INITIAL_USER.id,
    date: yesterdayKey,
    status: 'morning',
    preferred_time: '06:30 AM',
    notes: 'Chest & shoulders',
    updated_at: new Date().toISOString(),
    profile: INITIAL_USER,
  });

  return result;
}

// Generate sample workout logs for Sriharsha to demonstrate consistency streaks
export function generateSeedWorkoutLogs(): WorkoutLog[] {
  const todayKey = getTodayKey();
  const today = parseDateKey(todayKey);
  const logs: WorkoutLog[] = [];

  // Helper for dates in the past
  const getPastDate = (daysAgo: number): string => {
    const d = new Date(today);
    d.setDate(today.getDate() - daysAgo);
    return formatDateKey(d);
  };

  // Recent completed sessions
  logs.push({
    id: 'log_01',
    user_id: INITIAL_USER.id,
    date: getPastDate(1),
    completed_at: `${getPastDate(1)}T07:45:00Z`,
    workout_type: 'Push Strength',
    duration_minutes: 65,
    notes: 'Hit 225 lbs bench for 5 reps! Feeling strong.',
    intensity: 'heavy',
  });

  logs.push({
    id: 'log_02',
    user_id: INITIAL_USER.id,
    date: getPastDate(2),
    completed_at: `${getPastDate(2)}T08:00:00Z`,
    workout_type: 'Pull Hypertrophy',
    duration_minutes: 70,
    notes: 'Heavy barbell rows and weighted pullups.',
    intensity: 'moderate',
  });

  logs.push({
    id: 'log_03',
    user_id: INITIAL_USER.id,
    date: getPastDate(4),
    completed_at: `${getPastDate(4)}T07:30:00Z`,
    workout_type: 'Leg Day & Calves',
    duration_minutes: 75,
    notes: 'Squats 315 lbs x 4 sets. Hamstrings lit up.',
    intensity: 'pr_beast',
  });

  logs.push({
    id: 'log_04',
    user_id: INITIAL_USER.id,
    date: getPastDate(5),
    completed_at: `${getPastDate(5)}T07:15:00Z`,
    workout_type: 'Upper Body & Arms',
    duration_minutes: 60,
    notes: 'Biceps curls superset with triceps dips.',
    intensity: 'moderate',
  });

  return logs;
}
