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
CREATE POLICY "Users can view members of groups they belong to"
  ON public.group_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members gm
      WHERE gm.group_id = group_members.group_id
      AND gm.user_id = auth.uid()
    )
  );

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

-- 5. Daily Availability Table
CREATE TABLE IF NOT EXISTS public.daily_availability (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  group_id UUID REFERENCES public.gym_groups(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date TEXT NOT NULL, -- Format: YYYY-MM-DD
  status TEXT CHECK (status IN ('morning', 'evening', 'night', 'rest', 'undecided')) NOT NULL,
  preferred_time TEXT,
  notes TEXT,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(group_id, user_id, date)
);

ALTER TABLE public.daily_availability ENABLE ROW LEVEL SECURITY;

-- Daily Availability Policies
DROP POLICY IF EXISTS "Users can view availability in groups they belong to" ON public.daily_availability;
CREATE POLICY "Users can view availability in groups they belong to"
  ON public.daily_availability FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM public.group_members
      WHERE group_members.group_id = daily_availability.group_id
      AND group_members.user_id = auth.uid()
    )
    OR
    user_id = auth.uid()
  );

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

-- Enable Supabase Realtime for daily_availability
ALTER PUBLICATION supabase_realtime ADD TABLE public.daily_availability;

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
