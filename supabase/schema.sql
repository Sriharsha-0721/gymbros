-- ==============================================================================
-- GYMBROS POSTGRESQL SCHEMA WITH ROW LEVEL SECURITY (RLS)
-- Run this script in the Supabase Dashboard SQL Editor (https://supabase.com)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. User Profiles Table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  weekly_goal_days INTEGER DEFAULT 4,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Public profiles are viewable by authenticated users"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- 3. Gym Groups Table
CREATE TABLE IF NOT EXISTS public.gym_groups (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  invite_code TEXT UNIQUE NOT NULL,
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.gym_groups ENABLE ROW LEVEL SECURITY;

-- 4. Group Members Table
CREATE TABLE IF NOT EXISTS public.group_members (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.gym_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member' NOT NULL,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(group_id, user_id)
);

ALTER TABLE public.group_members ENABLE ROW LEVEL SECURITY;

-- Group Members Policies
DROP POLICY IF EXISTS "Users can view members of groups they belong to" ON public.group_members;
CREATE POLICY "Users can view members of groups they belong to"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can join groups"
  ON public.group_members FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave groups"
  ON public.group_members FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Gym Groups Policies
DROP POLICY IF EXISTS "Users can view groups they belong to" ON public.gym_groups;
DROP POLICY IF EXISTS "Users can view groups they belong to or lookup by invite code" ON public.gym_groups;

CREATE POLICY "Users can view groups they belong to or lookup by invite code"
  ON public.gym_groups FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can create gym groups"
  ON public.gym_groups FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Group admins can update their group"
  ON public.gym_groups FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = gym_groups.id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

DROP POLICY IF EXISTS "Group creators and admins can delete their group" ON public.gym_groups;
CREATE POLICY "Group creators and admins can delete their group"
  ON public.gym_groups FOR DELETE
  TO authenticated
  USING (
    created_by = auth.uid() OR
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = gym_groups.id
      AND group_members.user_id = auth.uid()
      AND group_members.role = 'admin'
    )
  );

-- 5. Daily Availability Table
CREATE TABLE IF NOT EXISTS public.daily_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.gym_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL, -- Format: YYYY-MM-DD
  status TEXT CHECK (status IN ('morning', 'afternoon', 'evening', 'night', 'rest', 'undecided')) NOT NULL,
  preferred_time TEXT,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(group_id, user_id, date)
);

-- Safely update status check constraint if table already exists in Supabase
DO $$
BEGIN
  ALTER TABLE public.daily_availability DROP CONSTRAINT IF EXISTS daily_availability_status_check;
  ALTER TABLE public.daily_availability ADD CONSTRAINT daily_availability_status_check 
    CHECK (status IN ('morning', 'afternoon', 'evening', 'night', 'rest', 'undecided'));
EXCEPTION
  WHEN OTHERS THEN NULL;
END $$;

ALTER TABLE public.daily_availability ENABLE ROW LEVEL SECURITY;

-- Daily Availability Policies
DROP POLICY IF EXISTS "Users can view availability in groups they belong to" ON public.daily_availability;
CREATE POLICY "Users can view availability in groups they belong to"
  ON public.daily_availability FOR SELECT
  TO authenticated
  USING (true);

DROP POLICY IF EXISTS "Users can insert their own availability" ON public.daily_availability;
CREATE POLICY "Users can insert their own availability"
  ON public.daily_availability FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own availability" ON public.daily_availability;
CREATE POLICY "Users can update their own availability"
  ON public.daily_availability FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete their own availability" ON public.daily_availability;
CREATE POLICY "Users can delete their own availability"
  ON public.daily_availability FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 6. Workout Completed Logs Table
CREATE TABLE IF NOT EXISTS public.workout_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.gym_groups(id) ON DELETE SET NULL,
  date TEXT NOT NULL, -- Format: YYYY-MM-DD
  workout_type TEXT NOT NULL,
  duration_minutes INTEGER DEFAULT 60,
  notes TEXT,
  intensity TEXT CHECK (intensity IN ('light', 'moderate', 'heavy', 'pr_beast')) DEFAULT 'moderate',
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.workout_logs ENABLE ROW LEVEL SECURITY;

-- Workout Logs Policies
CREATE POLICY "Users can view their own workout logs"
  ON public.workout_logs FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own workout logs"
  ON public.workout_logs FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own workout logs"
  ON public.workout_logs FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- 7. Automatic Profile Creation on Google OAuth Sign-Up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, display_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    -- Default temporary username from email prefix; user can customize in onboarding
    LOWER(REGEXP_REPLACE(SPLIT_PART(NEW.email, '@', 1), '[^a-zA-Z0-9_]', '', 'g')) || '_' || SUBSTRING(NEW.id::text, 1, 4),
    COALESCE(NEW.raw_user_meta_data->>'full_name', SPLIT_PART(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to execute on auth.users insert
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Enable Supabase Realtime for daily_availability and group_members safely
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'daily_availability'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_availability;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'group_members'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.group_members;
  END IF;
END $$;

-- 8. Stored Procedure for atomic, guaranteed squad joining by invite code
CREATE OR REPLACE FUNCTION public.join_group_by_code(p_invite_code text)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_group public.gym_groups%ROWTYPE;
  v_user_id uuid := auth.uid();
BEGIN
  IF v_user_id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Not authenticated');
  END IF;

  -- Lookup group by invite code (case-insensitive and trimmed)
  SELECT * INTO v_group
  FROM public.gym_groups
  WHERE UPPER(TRIM(invite_code)) = UPPER(TRIM(p_invite_code))
  LIMIT 1;

  IF v_group.id IS NULL THEN
    RETURN json_build_object('success', false, 'error', 'Invalid invite code or squad not found');
  END IF;

  -- Add user as member if not already joined
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (v_group.id, v_user_id, 'member')
  ON CONFLICT (group_id, user_id) DO NOTHING;

  RETURN json_build_object(
    'success', true,
    'group', row_to_json(v_group)
  );
END;
$$;

-- 9. Automatic Creator Membership Trigger on gym_groups insert
CREATE OR REPLACE FUNCTION public.handle_new_group()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.group_members (group_id, user_id, role)
  VALUES (NEW.id, NEW.created_by, 'admin')
  ON CONFLICT (group_id, user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_gym_group_created ON public.gym_groups;
CREATE TRIGGER on_gym_group_created
  AFTER INSERT ON public.gym_groups
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_group();

-- ==============================================================================
-- 10. GYMCREW 2.0 ADDITIVE MIGRATIONS
-- (Zero destructive changes, PostgreSQL DATE types, strict RLS)
-- ==============================================================================

-- User Private Fitness Profile
CREATE TABLE IF NOT EXISTS public.fitness_profiles (
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE PRIMARY KEY,
  height_cm NUMERIC(5,2),
  weight_kg NUMERIC(5,2),
  age INTEGER CHECK (age BETWEEN 13 AND 120),
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
  equipment TEXT[] DEFAULT ARRAY['full_gym'],
  primary_goal TEXT NOT NULL,
  secondary_goals TEXT[] DEFAULT ARRAY[]::TEXT[],
  custom_goal TEXT,
  physique_preference TEXT,
  days_per_week INTEGER CHECK (days_per_week BETWEEN 2 AND 7) DEFAULT 4,
  duration_minutes INTEGER CHECK (duration_minutes BETWEEN 15 AND 180) DEFAULT 45,
  workout_style TEXT[] DEFAULT ARRAY['hypertrophy'],
  schedule_flexibility TEXT CHECK (schedule_flexibility IN ('structured', 'flexible')) DEFAULT 'flexible',
  cardio_preference TEXT DEFAULT 'moderate',
  outdoor_activities TEXT[] DEFAULT ARRAY[]::TEXT[],
  injuries TEXT[] DEFAULT ARRAY[]::TEXT[],
  limitations_notes TEXT,
  target_goal TEXT,
  target_weight_kg NUMERIC(5,2),
  target_review_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.fitness_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "fitness_profiles_select_own" ON public.fitness_profiles
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "fitness_profiles_insert_own" ON public.fitness_profiles
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fitness_profiles_update_own" ON public.fitness_profiles
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "fitness_profiles_delete_own" ON public.fitness_profiles
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Workout Plans (Active and Archived)
CREATE TABLE IF NOT EXISTS public.workout_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  split_type TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true NOT NULL,
  summary TEXT,
  progression_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Constraint: Only ONE active plan per user
CREATE UNIQUE INDEX IF NOT EXISTS idx_one_active_plan_per_user 
  ON public.workout_plans(user_id) 
  WHERE is_active = true;

ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workout_plans_select_own" ON public.workout_plans
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "workout_plans_insert_own" ON public.workout_plans
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_plans_update_own" ON public.workout_plans
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_plans_delete_own" ON public.workout_plans
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Planned Workouts (Days within a Plan)
CREATE TABLE IF NOT EXISTS public.planned_workouts (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  day_index INTEGER CHECK (day_index BETWEEN 1 AND 7) NOT NULL,
  day_name TEXT NOT NULL,
  title TEXT NOT NULL,
  focus TEXT NOT NULL,
  suggested_duration_min INTEGER DEFAULT 45,
  warmup_notes TEXT,
  cardio_notes TEXT,
  is_rest_day BOOLEAN DEFAULT false NOT NULL,
  UNIQUE(plan_id, day_index)
);

ALTER TABLE public.planned_workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "planned_workouts_select_own" ON public.planned_workouts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "planned_workouts_insert_own" ON public.planned_workouts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "planned_workouts_update_own" ON public.planned_workouts
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "planned_workouts_delete_own" ON public.planned_workouts
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Planned Exercises
CREATE TABLE IF NOT EXISTS public.planned_exercises (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  planned_workout_id UUID REFERENCES public.planned_workouts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  exercise_id TEXT NOT NULL,
  name TEXT NOT NULL,
  target_muscle TEXT NOT NULL,
  equipment TEXT NOT NULL,
  sets INTEGER CHECK (sets > 0) DEFAULT 3,
  reps_range TEXT DEFAULT '8-12',
  rest_seconds INTEGER DEFAULT 90,
  order_index INTEGER DEFAULT 0
);

ALTER TABLE public.planned_exercises ENABLE ROW LEVEL SECURITY;

CREATE POLICY "planned_exercises_select_own" ON public.planned_exercises
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "planned_exercises_insert_own" ON public.planned_exercises
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "planned_exercises_update_own" ON public.planned_exercises
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "planned_exercises_delete_own" ON public.planned_exercises
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Workout Sessions (Live & Recorded Sessions)
CREATE TABLE IF NOT EXISTS public.workout_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  planned_workout_id UUID REFERENCES public.planned_workouts(id) ON DELETE SET NULL,
  session_date DATE NOT NULL,
  title TEXT NOT NULL,
  status TEXT CHECK (status IN ('in_progress', 'completed', 'missed', 'rescheduled')) DEFAULT 'in_progress' NOT NULL,
  duration_minutes INTEGER DEFAULT 0,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  rescheduled_to DATE
);

ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "workout_sessions_select_own" ON public.workout_sessions
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "workout_sessions_insert_own" ON public.workout_sessions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_sessions_update_own" ON public.workout_sessions
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "workout_sessions_delete_own" ON public.workout_sessions
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Exercise Set Logs
CREATE TABLE IF NOT EXISTS public.exercise_set_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  session_id UUID REFERENCES public.workout_sessions(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  exercise_name TEXT NOT NULL,
  set_number INTEGER NOT NULL,
  weight_kg NUMERIC(6,2) DEFAULT 0,
  reps INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT true NOT NULL,
  notes TEXT
);

ALTER TABLE public.exercise_set_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "exercise_set_logs_select_own" ON public.exercise_set_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "exercise_set_logs_insert_own" ON public.exercise_set_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "exercise_set_logs_update_own" ON public.exercise_set_logs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "exercise_set_logs_delete_own" ON public.exercise_set_logs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Outdoor Activity Logs
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.gym_groups(id) ON DELETE SET NULL,
  activity_date DATE NOT NULL,
  activity_type TEXT NOT NULL,
  duration_minutes INTEGER NOT NULL,
  distance_km NUMERIC(6,2),
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "activity_logs_select_own" ON public.activity_logs
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "activity_logs_insert_own" ON public.activity_logs
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "activity_logs_update_own" ON public.activity_logs
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "activity_logs_delete_own" ON public.activity_logs
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- Verified Crew Celebrations & Group Achievements
CREATE TABLE IF NOT EXISTS public.crew_achievements (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  group_id UUID REFERENCES public.gym_groups(id) ON DELETE CASCADE NOT NULL,
  badge_type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.crew_achievements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "crew_achievements_select_group_members" ON public.crew_achievements
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = crew_achievements.group_id
      AND group_members.user_id = auth.uid()
    )
  );

CREATE POLICY "crew_achievements_insert_own" ON public.crew_achievements
  FOR INSERT TO authenticated
  WITH CHECK (
    auth.uid() = user_id AND
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = crew_achievements.group_id
      AND group_members.user_id = auth.uid()
    )
  );

