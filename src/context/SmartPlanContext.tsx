import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  FitnessProfile, 
  WorkoutPlan, 
  WorkoutSession, 
  OutdoorActivityLog, 
  CrewAchievement,
  PlannedWorkout 
} from '../types/smartPlan';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { generateSmartWorkoutPlan } from '../lib/smartPlanEngine';

interface SmartPlanContextType {
  profile: FitnessProfile | null;
  activePlan: WorkoutPlan | null;
  sessions: WorkoutSession[];
  activeSession: WorkoutSession | null;
  activityLogs: OutdoorActivityLog[];
  achievements: CrewAchievement[];
  loading: boolean;
  saveProfileAndGeneratePlan: (profileData: FitnessProfile) => Promise<WorkoutPlan>;
  regeneratePlan: () => Promise<WorkoutPlan | null>;
  startWorkoutSession: (plannedWorkout: PlannedWorkout) => Promise<WorkoutSession>;
  logExerciseSet: (sessionId: string, exerciseName: string, weightKg: number, reps: number) => Promise<void>;
  completeWorkoutSession: (sessionId: string, durationMinutes: number, notes?: string) => Promise<boolean>;
  recordMissedOrRescheduledSession: (sessionId: string, status: 'missed' | 'rescheduled', rescheduledTo?: string) => Promise<boolean>;
  logOutdoorActivity: (log: Omit<OutdoorActivityLog, 'id' | 'user_id' | 'completed_at'>) => Promise<boolean>;
  deleteOutdoorActivity: (activityId: string) => Promise<boolean>;
  refreshData: () => Promise<void>;
  syncStatus: 'synced' | 'local_only' | 'syncing';
}

const SmartPlanContext = createContext<SmartPlanContextType | undefined>(undefined);

const STORAGE_KEY_PROFILE = 'gymcrew_fitness_profile';
const STORAGE_KEY_PLAN = 'gymcrew_active_plan';
const STORAGE_KEY_SESSIONS = 'gymcrew_workout_sessions';
const STORAGE_KEY_ACTIVITIES = 'gymcrew_activity_logs';
const STORAGE_KEY_ACHIEVEMENTS = 'gymcrew_achievements';

const isUUID = (str?: string): boolean =>
  Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

export const SmartPlanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const configured = isSupabaseConfigured();

  const [profile, setProfile] = useState<FitnessProfile | null>(null);
  const [activePlan, setActivePlan] = useState<WorkoutPlan | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [activeSession, setActiveSession] = useState<WorkoutSession | null>(null);
  const [activityLogs, setActivityLogs] = useState<OutdoorActivityLog[]>([]);
  const [achievements, setAchievements] = useState<CrewAchievement[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [syncStatus, setSyncStatus] = useState<'synced' | 'local_only' | 'syncing'>('local_only');

  // Load and synchronize data from both local cache and Supabase cloud
  const initSmartPlanData = useCallback(async (isBackground = false) => {
    if (!user) {
      setLoading(false);
      return;
    }

    if (!isBackground) setLoading(true);

    // 1. Try loading cached local data (with legacy key fallback)
    let cachedProfile: FitnessProfile | null = null;
    let cachedPlan: WorkoutPlan | null = null;
    let cachedSessions: WorkoutSession[] = [];
    let cachedActivities: OutdoorActivityLog[] = [];

    try {
      const localProf = localStorage.getItem(`${STORAGE_KEY_PROFILE}_${user?.id}`);
      if (localProf) cachedProfile = JSON.parse(localProf);

      const localPlan = localStorage.getItem(`${STORAGE_KEY_PLAN}_${user?.id}`);
      if (localPlan) cachedPlan = JSON.parse(localPlan);

      const localSess = localStorage.getItem(`${STORAGE_KEY_SESSIONS}_${user?.id}`);
      if (localSess) cachedSessions = JSON.parse(localSess);

      // Support user-specific key and legacy shared key
      const localAct =
        localStorage.getItem(`${STORAGE_KEY_ACTIVITIES}_${user?.id}`) ||
        localStorage.getItem(STORAGE_KEY_ACTIVITIES);
      if (localAct) cachedActivities = JSON.parse(localAct);
    } catch (err) {
      console.warn('Error reading smart plan local storage:', err);
    }

    if (cachedProfile) setProfile(cachedProfile);
    if (cachedPlan) setActivePlan(cachedPlan);
    if (cachedSessions.length > 0) setSessions(cachedSessions);
    if (cachedActivities.length > 0) setActivityLogs(cachedActivities);

    // Check for any session currently in_progress
    const currentInProgress = cachedSessions.find((s) => s.status === 'in_progress');
    if (currentInProgress) {
      setActiveSession(currentInProgress);
    }

    // 2. If Supabase is connected and user is live UUID, sync from DB
    if (configured && supabase && isUUID(user?.id)) {
      try {
        setSyncStatus('syncing');

        // Fetch profile
        const { data: dbProfile, error: profErr } = await supabase
          .from('fitness_profiles')
          .select('*')
          .eq('user_id', user!.id)
          .maybeSingle();

        if (!profErr && dbProfile) {
          setProfile(dbProfile);
          localStorage.setItem(`${STORAGE_KEY_PROFILE}_${user!.id}`, JSON.stringify(dbProfile));
        }

        // Fetch active workout plan
        const { data: dbPlan, error: planErr } = await supabase
          .from('workout_plans')
          .select('*, planned_workouts(*, planned_exercises(*))')
          .eq('user_id', user!.id)
          .eq('is_active', true)
          .maybeSingle();

        if (!planErr && dbPlan) {
          const mappedPlan: WorkoutPlan = {
            id: dbPlan.id,
            user_id: dbPlan.user_id,
            name: dbPlan.name,
            split_type: dbPlan.split_type,
            is_active: dbPlan.is_active,
            summary: dbPlan.summary || '',
            progression_notes: dbPlan.progression_notes,
            created_at: dbPlan.created_at,
            updated_at: dbPlan.updated_at,
            workouts: (dbPlan.planned_workouts || []).map((w: any) => ({
              id: w.id,
              plan_id: w.plan_id,
              day_index: w.day_index,
              day_name: w.day_name,
              title: w.title,
              focus: w.focus,
              suggested_duration_min: w.suggested_duration_min,
              warmup_notes: w.warmup_notes,
              cardio_notes: w.cardio_notes,
              is_rest_day: w.is_rest_day,
              exercises: (w.planned_exercises || []).sort((a: any, b: any) => a.order_index - b.order_index),
            })).sort((a: any, b: any) => a.day_index - b.day_index),
          };

          setActivePlan(mappedPlan);
          localStorage.setItem(`${STORAGE_KEY_PLAN}_${user!.id}`, JSON.stringify(mappedPlan));
        }

        // Fetch logged outdoor activities from Supabase
        const { data: dbActivities, error: actErr } = await supabase
          .from('activity_logs')
          .select('*')
          .eq('user_id', user!.id)
          .order('activity_date', { ascending: false });

        let mergedActivities: OutdoorActivityLog[] = dbActivities ? [...dbActivities] : [];

        // Backfill / sync any local cached activities that aren't yet in Supabase
        for (const localAct of cachedActivities) {
          const alreadyInDb = mergedActivities.some(
            (da) =>
              da.id === localAct.id ||
              (da.activity_date === localAct.activity_date &&
                da.activity_type === localAct.activity_type &&
                da.duration_minutes === localAct.duration_minutes)
          );

          if (!alreadyInDb) {
            try {
              let insertPayload: any = {
                user_id: user!.id,
                group_id: isUUID(localAct.group_id) ? localAct.group_id : null,
                activity_date: localAct.activity_date,
                activity_type: localAct.activity_type,
                duration_minutes: localAct.duration_minutes,
                distance_km: localAct.distance_km || null,
                notes: localAct.notes || null,
              };

              let { data: syncedRow, error: syncInsErr } = await supabase
                .from('activity_logs')
                .insert(insertPayload)
                .select()
                .single();

              if (syncInsErr && insertPayload.group_id) {
                insertPayload.group_id = null;
                const retry = await supabase.from('activity_logs').insert(insertPayload).select().single();
                syncedRow = retry.data;
              }

              if (syncedRow) {
                mergedActivities.unshift(syncedRow);
              } else {
                mergedActivities.unshift(localAct);
              }
            } catch (err) {
              console.warn('Auto-sync local activity to Supabase error:', err);
              mergedActivities.unshift(localAct);
            }
          }
        }

        // Sort descending by activity date
        mergedActivities.sort((a, b) => (b.activity_date > a.activity_date ? 1 : -1));
        setActivityLogs(mergedActivities);
        localStorage.setItem(`${STORAGE_KEY_ACTIVITIES}_${user!.id}`, JSON.stringify(mergedActivities));
        localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(mergedActivities));

        // Fetch past workout sessions from Supabase
        const { data: dbSessions, error: sessErr } = await supabase
          .from('workout_sessions')
          .select('*, exercise_set_logs(*)')
          .eq('user_id', user!.id)
          .order('session_date', { ascending: false });

        if (!sessErr && dbSessions) {
          const mappedSessions: WorkoutSession[] = dbSessions.map((s: any) => ({
            id: s.id,
            user_id: s.user_id,
            planned_workout_id: s.planned_workout_id,
            session_date: s.session_date,
            title: s.title,
            status: s.status,
            duration_minutes: s.duration_minutes || 0,
            started_at: s.started_at,
            completed_at: s.completed_at,
            notes: s.notes || '',
            rescheduled_to: s.rescheduled_to,
            sets: (s.exercise_set_logs || [])
              .map((st: any) => ({
                id: st.id,
                session_id: st.session_id,
                exercise_name: st.exercise_name,
                set_number: st.set_number,
                weight_kg: st.weight_kg,
                reps: st.reps,
                completed: st.completed,
                notes: st.notes,
              }))
              .sort((a: any, b: any) => a.set_number - b.set_number),
          }));

          setSessions(mappedSessions);
          localStorage.setItem(`${STORAGE_KEY_SESSIONS}_${user!.id}`, JSON.stringify(mappedSessions));
          const inProg = mappedSessions.find((s) => s.status === 'in_progress');
          if (inProg) {
            setActiveSession(inProg);
          }
        }

        setSyncStatus('synced');
      } catch (syncErr) {
        console.warn('Smart plan remote fetch error, using local data:', syncErr);
        setSyncStatus('local_only');
      }
    }

    setLoading(false);
  }, [user, configured]);

  useEffect(() => {
    initSmartPlanData();
  }, [initSmartPlanData]);

  // Set up Supabase Realtime subscription & Visibility/Focus listeners
  useEffect(() => {
    if (!configured || !supabase || !user || !isUUID(user.id)) return;

    // Realtime channel for instant cross-device updates
    const channel = supabase
      .channel(`realtime:activity_logs:${user.id}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'activity_logs',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          initSmartPlanData(true);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workout_sessions',
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          initSmartPlanData(true);
        }
      )
      .subscribe();

    // Re-sync whenever user returns to the mobile app or browser tab
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        initSmartPlanData(true);
      }
    };

    window.addEventListener('visibilitychange', handleVisibility);
    window.addEventListener('focus', handleVisibility);

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
      window.removeEventListener('visibilitychange', handleVisibility);
      window.removeEventListener('focus', handleVisibility);
    };
  }, [configured, user, initSmartPlanData]);

  // Save profile and generate new plan
  const saveProfileAndGeneratePlan = useCallback(
    async (profileData: FitnessProfile): Promise<WorkoutPlan> => {
      if (!user) throw new Error('Must be signed in to save profile');

      const fullProfile: FitnessProfile = {
        ...profileData,
        user_id: user.id,
        updated_at: new Date().toISOString(),
      };

      setProfile(fullProfile);
      localStorage.setItem(`${STORAGE_KEY_PROFILE}_${user.id}`, JSON.stringify(fullProfile));

      // Generate deterministic workout plan
      const newPlan = generateSmartWorkoutPlan(fullProfile);
      newPlan.user_id = user.id;

      setActivePlan(newPlan);
      localStorage.setItem(`${STORAGE_KEY_PLAN}_${user.id}`, JSON.stringify(newPlan));

      // Attempt remote save if Supabase is connected
      if (configured && supabase && isUUID(user.id)) {
        try {
          await supabase.from('fitness_profiles').upsert(fullProfile, { onConflict: 'user_id' });
          
          // Deactivate prior plans
          await supabase
            .from('workout_plans')
            .update({ is_active: false })
            .eq('user_id', user.id);

          // Insert new plan
          const { data: insertedPlan } = await supabase
            .from('workout_plans')
            .insert({
              user_id: user.id,
              name: newPlan.name,
              split_type: newPlan.split_type,
              is_active: true,
              summary: newPlan.summary,
              progression_notes: newPlan.progression_notes,
            })
            .select()
            .single();

          if (insertedPlan) {
            newPlan.id = insertedPlan.id;
            for (const wk of newPlan.workouts) {
              const { data: insertedWk } = await supabase
                .from('planned_workouts')
                .insert({
                  plan_id: insertedPlan.id,
                  user_id: user.id,
                  day_index: wk.day_index,
                  day_name: wk.day_name,
                  title: wk.title,
                  focus: wk.focus,
                  suggested_duration_min: wk.suggested_duration_min,
                  warmup_notes: wk.warmup_notes,
                  cardio_notes: wk.cardio_notes,
                  is_rest_day: wk.is_rest_day,
                })
                .select()
                .single();

              if (insertedWk && wk.exercises.length > 0) {
                await supabase.from('planned_exercises').insert(
                  wk.exercises.map((ex, idx) => ({
                    planned_workout_id: insertedWk.id,
                    user_id: user.id,
                    exercise_id: ex.exercise_id,
                    name: ex.name,
                    target_muscle: ex.target_muscle,
                    equipment: ex.equipment,
                    sets: ex.sets,
                    reps_range: ex.reps_range,
                    rest_seconds: ex.rest_seconds,
                    order_index: idx,
                  }))
                );
              }
            }
          }
          setSyncStatus('synced');
        } catch (remoteErr) {
          console.warn('Could not sync plan to Supabase, saved locally:', remoteErr);
          setSyncStatus('local_only');
        }
      }

      return newPlan;
    },
    [user, configured]
  );

  // Regenerate plan from existing profile
  const regeneratePlan = useCallback(async (): Promise<WorkoutPlan | null> => {
    if (!profile) return null;
    return await saveProfileAndGeneratePlan(profile);
  }, [profile, saveProfileAndGeneratePlan]);

  // Start workout session
  const startWorkoutSession = useCallback(
    async (plannedWorkout: PlannedWorkout): Promise<WorkoutSession> => {
      const today = new Date().toISOString().split('T')[0];
      const newSession: WorkoutSession = {
        id: 'sess_' + Math.random().toString(36).substring(2, 9),
        user_id: user?.id || '',
        planned_workout_id: plannedWorkout.id,
        session_date: today,
        title: plannedWorkout.title,
        status: 'in_progress', // Default status is in_progress per requirements
        duration_minutes: 0,
        started_at: new Date().toISOString(),
        completed_at: null, // Nullable! Only set when explicitly finished
        notes: '',
        sets: [],
      };

      const updated = [newSession, ...sessions.filter((s) => s.id !== newSession.id)];
      setSessions(updated);
      setActiveSession(newSession);

      if (user) {
        localStorage.setItem(`${STORAGE_KEY_SESSIONS}_${user.id}`, JSON.stringify(updated));
      }

      // Persist session to Supabase
      if (configured && supabase && isUUID(user?.id)) {
        try {
          const { data: dbSess } = await supabase
            .from('workout_sessions')
            .insert({
              user_id: user!.id,
              planned_workout_id: isUUID(plannedWorkout.id) ? plannedWorkout.id : null,
              session_date: today,
              title: plannedWorkout.title,
              status: 'in_progress',
              duration_minutes: 0,
            })
            .select()
            .single();

          if (dbSess) {
            newSession.id = dbSess.id;
          }
        } catch (e) {
          console.warn('Could not sync session to Supabase:', e);
        }
      }

      return newSession;
    },
    [user, sessions, configured]
  );

  // Log set in active session
  const logExerciseSet = useCallback(
    async (sessionId: string, exerciseName: string, weightKg: number, reps: number) => {
      setSessions((prev) =>
        prev.map((s) => {
          if (s.id !== sessionId) return s;
          const newSet = {
            id: 'set_' + Math.random().toString(36).substring(2, 9),
            session_id: sessionId,
            exercise_name: exerciseName,
            set_number: s.sets.filter((x) => x.exercise_name === exerciseName).length + 1,
            weight_kg: weightKg,
            reps,
            completed: true,
          };
          const updatedSession = { ...s, sets: [...s.sets, newSet] };
          if (activeSession?.id === sessionId) {
            setActiveSession(updatedSession);
          }
          return updatedSession;
        })
      );
    },
    [activeSession]
  );

  // Complete workout session
  const completeWorkoutSession = useCallback(
    async (sessionId: string, durationMinutes: number, notes?: string): Promise<boolean> => {
      const now = new Date().toISOString();
      let completedSession: WorkoutSession | null = null;

      const updated = sessions.map((s) => {
        if (s.id !== sessionId) return s;
        completedSession = {
          ...s,
          status: 'completed' as const,
          duration_minutes: durationMinutes,
          completed_at: now, // Set ONLY upon completion
          notes: notes || s.notes,
        };
        return completedSession;
      });

      setSessions(updated);
      setActiveSession(null);

      if (user) {
        localStorage.setItem(`${STORAGE_KEY_SESSIONS}_${user.id}`, JSON.stringify(updated));
      }

      // Update session in Supabase
      if (configured && supabase && isUUID(user?.id) && isUUID(sessionId)) {
        try {
          await supabase
            .from('workout_sessions')
            .update({
              status: 'completed',
              duration_minutes: durationMinutes,
              completed_at: now,
              notes: notes || undefined,
            })
            .eq('id', sessionId);
        } catch (e) {
          console.warn('Could not update completed session in Supabase:', e);
        }
      }

      return true;
    },
    [user, sessions, configured]
  );

  // Missed or Rescheduled session
  const recordMissedOrRescheduledSession = useCallback(
    async (sessionId: string, status: 'missed' | 'rescheduled', rescheduledTo?: string): Promise<boolean> => {
      const updated = sessions.map((s) => {
        if (s.id !== sessionId) return s;
        return {
          ...s,
          status,
          rescheduled_to: rescheduledTo,
        };
      });

      setSessions(updated);
      if (activeSession?.id === sessionId) setActiveSession(null);

      if (user) {
        localStorage.setItem(`${STORAGE_KEY_SESSIONS}_${user.id}`, JSON.stringify(updated));
      }

      return true;
    },
    [user, sessions, activeSession]
  );

  // Log Outdoor / Activity Day
  const logOutdoorActivity = useCallback(
    async (log: Omit<OutdoorActivityLog, 'id' | 'user_id' | 'completed_at'>): Promise<boolean> => {
      if (!user) return false;

      const newLog: OutdoorActivityLog = {
        ...log,
        id: 'act_' + Math.random().toString(36).substring(2, 9),
        user_id: user.id,
        completed_at: new Date().toISOString(),
      };

      const updated = [newLog, ...activityLogs];
      setActivityLogs(updated);
      localStorage.setItem(`${STORAGE_KEY_ACTIVITIES}_${user.id}`, JSON.stringify(updated));

      // Persist outdoor activity to Supabase
      if (configured && supabase && isUUID(user.id)) {
        try {
          let insertPayload: any = {
            user_id: user.id,
            group_id: isUUID(log.group_id) ? log.group_id : null,
            activity_date: log.activity_date,
            activity_type: log.activity_type,
            duration_minutes: log.duration_minutes,
            distance_km: log.distance_km || null,
            notes: log.notes || null,
          };

          let { data: dbAct, error: actErr } = await supabase
            .from('activity_logs')
            .insert(insertPayload)
            .select()
            .single();

          if (actErr && insertPayload.group_id) {
            insertPayload.group_id = null;
            const retry = await supabase.from('activity_logs').insert(insertPayload).select().single();
            dbAct = retry.data;
          }

          if (dbAct) {
            newLog.id = dbAct.id;
          }
        } catch (e) {
          console.warn('Could not sync outdoor activity to Supabase:', e);
        }
      }

      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updated));
      return true;
    },
    [user, activityLogs, configured]
  );

  // Delete an outdoor activity log
  const deleteOutdoorActivity = useCallback(
    async (activityId: string): Promise<boolean> => {
      const updated = activityLogs.filter((a) => a.id !== activityId);
      setActivityLogs(updated);

      if (user) {
        localStorage.setItem(`${STORAGE_KEY_ACTIVITIES}_${user.id}`, JSON.stringify(updated));
      }
      localStorage.setItem(STORAGE_KEY_ACTIVITIES, JSON.stringify(updated));

      if (configured && supabase && user && isUUID(user.id)) {
        try {
          if (isUUID(activityId)) {
            await supabase.from('activity_logs').delete().eq('id', activityId).eq('user_id', user.id);
          } else {
            const target = activityLogs.find((a) => a.id === activityId);
            if (target) {
              await supabase
                .from('activity_logs')
                .delete()
                .eq('user_id', user.id)
                .eq('activity_date', target.activity_date)
                .eq('activity_type', target.activity_type)
                .eq('duration_minutes', target.duration_minutes);
            }
          }
        } catch (e) {
          console.warn('Failed deleting outdoor activity from Supabase:', e);
        }
      }

      return true;
    },
    [user, activityLogs, configured]
  );

  return (
    <SmartPlanContext.Provider
      value={{
        profile,
        activePlan,
        sessions,
        activeSession,
        activityLogs,
        achievements,
        loading,
        saveProfileAndGeneratePlan,
        regeneratePlan,
        startWorkoutSession,
        logExerciseSet,
        completeWorkoutSession,
        recordMissedOrRescheduledSession,
        logOutdoorActivity,
        deleteOutdoorActivity,
        refreshData: () => initSmartPlanData(false),
        syncStatus,
      }}
    >
      {children}
    </SmartPlanContext.Provider>
  );
};

export const useSmartPlan = (): SmartPlanContextType => {
  const context = useContext(SmartPlanContext);
  if (!context) {
    throw new Error('useSmartPlan must be used within a SmartPlanProvider');
  }
  return context;
};
