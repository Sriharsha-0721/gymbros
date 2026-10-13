import React, { createContext, useContext, useEffect, useState } from 'react';
import { DailyAvailability, GymGroup, GroupMember, GymStatus, WorkoutLog } from '../types';
import { useAuth } from './AuthContext';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  INITIAL_GROUPS,
  INITIAL_GROUP_MEMBERS,
  generateSeedAvailabilities,
  generateSeedWorkoutLogs,
} from '../lib/mockData';
import { getTodayKey } from '../lib/dateUtils';

interface GroupContextType {
  groups: GymGroup[];
  activeGroup: GymGroup | null;
  setActiveGroupId: (id: string) => void;
  members: GroupMember[];
  availabilities: DailyAvailability[];
  workoutLogs: WorkoutLog[];
  loading: boolean;
  setAvailability: (
    date: string,
    status: GymStatus,
    preferredTime?: string,
    notes?: string
  ) => Promise<boolean>;
  createGroup: (name: string, description?: string) => Promise<GymGroup | null>;
  joinGroup: (inviteCode: string) => Promise<boolean>;
  leaveGroup: (groupId: string) => Promise<boolean>;
  logWorkout: (log: {
    date: string;
    workout_type: string;
    duration_minutes?: number;
    notes?: string;
    intensity?: 'light' | 'moderate' | 'heavy' | 'pr_beast';
  }) => Promise<boolean>;
  deleteWorkoutLog: (logId: string) => Promise<boolean>;
  getUserTodayAvailability: () => DailyAvailability | undefined;
}

const GroupContext = createContext<GroupContextType | undefined>(undefined);

const STORAGE_KEY_GROUPS = 'gymbros_groups';
const STORAGE_KEY_MEMBERS = 'gymbros_members';
const STORAGE_KEY_AVAILABILITIES = 'gymbros_availabilities';
const STORAGE_KEY_WORKOUT_LOGS = 'gymbros_workout_logs';
const STORAGE_KEY_ACTIVE_GROUP_ID = 'gymbros_active_group_id';

const isUUID = (str?: string): boolean =>
  Boolean(str && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str));

export const GroupProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const configured = isSupabaseConfigured();

  const [groups, setGroups] = useState<GymGroup[]>([]);
  const [activeGroupId, setActiveGroupIdState] = useState<string>('');
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [availabilities, setAvailabilities] = useState<DailyAvailability[]>([]);
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    async function loadData() {
      setLoading(true);

      const isLiveSupabaseUser = configured && supabase && isUUID(user?.id);

      if (isLiveSupabaseUser && supabase) {
        try {
          // Fetch user's created groups directly (bulletproof, no join failure)
          const { data: ownedGroups } = await supabase
            .from('gym_groups')
            .select('*')
            .eq('created_by', user!.id);

          // Fetch groups user has joined as a member
          const { data: memberRows } = await supabase
            .from('group_members')
            .select('group_id')
            .eq('user_id', user!.id);

          const memberGroupIds = memberRows?.map((m: any) => m.group_id).filter(Boolean) || [];
          let memberGroups: GymGroup[] = [];
          if (memberGroupIds.length > 0) {
            const { data: mgData } = await supabase
              .from('gym_groups')
              .select('*')
              .in('id', memberGroupIds);
            if (mgData) memberGroups = mgData;
          }

          // Combine and deduplicate
          const groupMap = new Map<string, GymGroup>();
          (ownedGroups || []).forEach((g: GymGroup) => groupMap.set(g.id, g));
          (memberGroups || []).forEach((g: GymGroup) => groupMap.set(g.id, g));
          let userGroups = Array.from(groupMap.values());

          // Check for pending join code from URL or pre-auth storage
          const pendingCode =
            new URLSearchParams(window.location.search).get('join')?.trim().toUpperCase() ||
            localStorage.getItem('pending_join_code')?.trim().toUpperCase();

          if (pendingCode) {
            let joinedGroup: GymGroup | null = null;
            try {
              const { data: rpcRes } = await supabase.rpc('join_group_by_code', {
                p_invite_code: pendingCode,
              });
              if (rpcRes?.success && rpcRes.group) {
                joinedGroup = rpcRes.group;
              }
            } catch (rpcErr) {
              console.warn('RPC join error:', rpcErr);
            }

            if (!joinedGroup) {
              try {
                const { data: dbGroup } = await supabase
                  .from('gym_groups')
                  .select('*')
                  .ilike('invite_code', pendingCode)
                  .maybeSingle();

                if (dbGroup) {
                  joinedGroup = dbGroup;
                  await supabase.from('group_members').upsert(
                    {
                      group_id: dbGroup.id,
                      user_id: user!.id,
                      role: 'member',
                    },
                    { onConflict: 'group_id,user_id' }
                  );
                }
              } catch (err) {
                console.error('Direct join error:', err);
              }
            }

            if (joinedGroup) {
              groupMap.set(joinedGroup.id, joinedGroup);
              userGroups = Array.from(groupMap.values());
              localStorage.setItem(STORAGE_KEY_ACTIVE_GROUP_ID, joinedGroup.id);
              localStorage.removeItem('pending_join_code');
              if (window.history.replaceState) {
                const url = new URL(window.location.href);
                url.searchParams.delete('join');
                window.history.replaceState({}, document.title, url.toString());
              }
            }
          }

          // If user truly has 0 squads in database, create ONE personal squad
          if (userGroups.length === 0) {
            const squadName = `${user!.display_name?.split(' ')[0] || user!.username}'s Gym Crew`;
            const randomCode = 'GYM-' + Math.floor(1000 + Math.random() * 9000);
            
            const { data: createdGroup } = await supabase
              .from('gym_groups')
              .insert({
                name: squadName,
                description: 'Private fitness squad',
                invite_code: randomCode,
                created_by: user!.id,
              })
              .select()
              .single();

            if (createdGroup) {
              await supabase.from('group_members').upsert(
                {
                  group_id: createdGroup.id,
                  user_id: user!.id,
                  role: 'admin',
                },
                { onConflict: 'group_id,user_id' }
              );
              userGroups = [createdGroup];
            }
          }

          setGroups(userGroups);
          localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(userGroups));

          const savedGroupId = localStorage.getItem(STORAGE_KEY_ACTIVE_GROUP_ID);
          const defaultGroupId =
            (savedGroupId && userGroups.some((g) => g.id === savedGroupId))
              ? savedGroupId
              : userGroups[0]?.id || '';
          setActiveGroupIdState(defaultGroupId);
          if (defaultGroupId) {
            localStorage.setItem(STORAGE_KEY_ACTIVE_GROUP_ID, defaultGroupId);
          }

          let loadedMembers: GroupMember[] = [];
          if (defaultGroupId && isUUID(defaultGroupId)) {
            // Fetch group members
            const { data: groupMembers } = await supabase
              .from('group_members')
              .select('*, profiles (*)')
              .eq('group_id', defaultGroupId);

            if (groupMembers && groupMembers.length > 0) {
              loadedMembers = groupMembers.map((m: any) => ({
                ...m,
                profile: m.profiles || (m.user_id === user!.id ? user : undefined),
              }));
            }

            // Guarantee creator/current user is ALWAYS included in members list
            const currentGroupObj = userGroups.find((g) => g.id === defaultGroupId);
            const isCreator = currentGroupObj?.created_by === user!.id;
            if (!loadedMembers.some((m) => m.user_id === user!.id)) {
              const selfMember: GroupMember = {
                id: `mem_${user!.id}`,
                group_id: defaultGroupId,
                user_id: user!.id,
                role: isCreator ? 'admin' : 'member',
                joined_at: new Date().toISOString(),
                profile: user!,
              };
              loadedMembers.unshift(selfMember);

              // Auto-sync self membership to Supabase in background
              supabase.from('group_members').upsert(
                {
                  group_id: defaultGroupId,
                  user_id: user!.id,
                  role: isCreator ? 'admin' : 'member',
                },
                { onConflict: 'group_id,user_id' }
              ).then(() => {});
            }

            setMembers(loadedMembers);
            localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(loadedMembers));
          }

          // Fetch availabilities: query for ALL squad members
          let loadedAvailabilities: DailyAvailability[] = [];

          if (defaultGroupId && isUUID(defaultGroupId)) {
            const memberUserIds = loadedMembers.map((m) => m.user_id).filter(Boolean);

            let avQuery = supabase.from('daily_availability').select('*, profiles (*)');
            if (memberUserIds.length > 0) {
              avQuery = avQuery.or(`group_id.eq.${defaultGroupId},user_id.in.(${memberUserIds.join(',')})`);
            } else {
              avQuery = avQuery.eq('group_id', defaultGroupId);
            }

            const { data: avData, error: avErr } = await avQuery;
            if (avErr) {
              console.warn('Availabilities query fallback:', avErr);
              const { data: fbData } = await supabase
                .from('daily_availability')
                .select('*, profiles (*)')
                .eq('group_id', defaultGroupId);
              if (fbData) {
                loadedAvailabilities = fbData.map((a: any) => ({
                  ...a,
                  profile: a.profiles || loadedMembers.find((m) => m.user_id === a.user_id)?.profile,
                }));
              }
            } else if (avData) {
              const avMap = new Map<string, DailyAvailability>();
              for (const a of avData) {
                const key = `${a.user_id}_${a.date}`;
                const prof =
                  a.profiles ||
                  loadedMembers.find((m) => m.user_id === a.user_id)?.profile ||
                  (a.user_id === user!.id ? user : undefined);
                const item: DailyAvailability = { ...a, profile: prof };
                const existing = avMap.get(key);
                if (!existing || new Date(a.updated_at).getTime() >= new Date(existing.updated_at).getTime()) {
                  avMap.set(key, item);
                }
              }
              loadedAvailabilities = Array.from(avMap.values());
            }
          }

          // Also merge user's own availability directly so personal status is never lost
          const { data: userAvData } = await supabase
            .from('daily_availability')
            .select('*, profiles (*)')
            .eq('user_id', user!.id)
            .order('updated_at', { ascending: true });

          if (userAvData) {
            for (const uAv of userAvData) {
              const idx = loadedAvailabilities.findIndex(
                (a) => a.date === uAv.date && a.user_id === uAv.user_id
              );
              if (idx >= 0) {
                const currentUpdated = new Date(loadedAvailabilities[idx].updated_at || 0).getTime();
                const newUpdated = new Date(uAv.updated_at || 0).getTime();
                if (newUpdated >= currentUpdated) {
                  loadedAvailabilities[idx] = {
                    ...uAv,
                    profile: uAv.profiles || loadedAvailabilities[idx].profile || user!,
                  };
                }
              } else {
                loadedAvailabilities.push({ ...uAv, profile: uAv.profiles || user! });
              }
            }
          }

          // Resilient cache merge from localStorage
          const localStoredAvail = localStorage.getItem(STORAGE_KEY_AVAILABILITIES);
          if (localStoredAvail) {
            try {
              const parsedLocal: DailyAvailability[] = JSON.parse(localStoredAvail);
              for (const item of parsedLocal) {
                const idx = loadedAvailabilities.findIndex(
                  (m) => m.date === item.date && m.user_id === item.user_id
                );
                if (idx >= 0) {
                  const dbUpdated = new Date(loadedAvailabilities[idx].updated_at || 0).getTime();
                  const localUpdated = new Date(item.updated_at || 0).getTime();
                  if (localUpdated > dbUpdated) {
                    loadedAvailabilities[idx] = {
                      ...loadedAvailabilities[idx],
                      ...item,
                    };
                  }
                } else {
                  loadedAvailabilities.push(item);
                }
              }
            } catch (e) {
              console.warn('Failed to parse local cached availabilities:', e);
            }
          }

          setAvailabilities(loadedAvailabilities);
          localStorage.setItem(STORAGE_KEY_AVAILABILITIES, JSON.stringify(loadedAvailabilities));

          // Fetch user workout logs
          const { data: logsData } = await supabase
            .from('workout_logs')
            .select('*')
            .eq('user_id', user!.id)
            .order('date', { ascending: false });

          if (logsData) {
            setWorkoutLogs(logsData);
          }
        } catch (err) {
          console.error('Error fetching Supabase group data:', err);
        } finally {
          setLoading(false);
        }
      } else {
        // Local/Demo Mode Persistence
        const storedGroups = localStorage.getItem(STORAGE_KEY_GROUPS);
        const storedMembers = localStorage.getItem(STORAGE_KEY_MEMBERS);
        const storedAvail = localStorage.getItem(STORAGE_KEY_AVAILABILITIES);
        const storedLogs = localStorage.getItem(STORAGE_KEY_WORKOUT_LOGS);

        const loadedGroups = storedGroups ? JSON.parse(storedGroups) : INITIAL_GROUPS;
        const loadedMembers = storedMembers ? JSON.parse(storedMembers) : INITIAL_GROUP_MEMBERS;
        const loadedAvail = storedAvail ? JSON.parse(storedAvail) : generateSeedAvailabilities();
        const loadedLogs = storedLogs ? JSON.parse(storedLogs) : generateSeedWorkoutLogs();

        setGroups(loadedGroups);
        setMembers(loadedMembers);
        setAvailabilities(loadedAvail);
        setWorkoutLogs(loadedLogs);

        const savedActiveId = localStorage.getItem(STORAGE_KEY_ACTIVE_GROUP_ID);
        const targetActiveId =
          savedActiveId && loadedGroups.some((g: GymGroup) => g.id === savedActiveId)
            ? savedActiveId
            : loadedGroups[0]?.id || '';

        setActiveGroupIdState(targetActiveId);

        if (!storedGroups) localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(loadedGroups));
        if (!storedMembers) localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(loadedMembers));
        if (!storedAvail) localStorage.setItem(STORAGE_KEY_AVAILABILITIES, JSON.stringify(loadedAvail));
        if (!storedLogs) localStorage.setItem(STORAGE_KEY_WORKOUT_LOGS, JSON.stringify(loadedLogs));

        setLoading(false);
      }
    }

    loadData();
  }, [user?.id, configured]);

  const fetchGroupDetails = async (groupId: string) => {
    if (!configured || !supabase || !isUUID(groupId) || !user) return;
    try {
      const { data: groupMembers } = await supabase
        .from('group_members')
        .select('*, profiles (*)')
        .eq('group_id', groupId);

      let loadedMembers: GroupMember[] = [];
      if (groupMembers && groupMembers.length > 0) {
        loadedMembers = groupMembers.map((m: any) => ({
          ...m,
          profile: m.profiles || (m.user_id === user.id ? user : undefined),
        }));
      }

      // Guarantee current user is always included in members list
      const currentGroupObj = groups.find((g) => g.id === groupId);
      const isCreator = currentGroupObj?.created_by === user.id;
      if (!loadedMembers.some((m) => m.user_id === user.id)) {
        const selfMember: GroupMember = {
          id: `mem_${user.id}`,
          group_id: groupId,
          user_id: user.id,
          role: isCreator ? 'admin' : 'member',
          joined_at: new Date().toISOString(),
          profile: user,
        };
        loadedMembers.unshift(selfMember);

        supabase.from('group_members').upsert(
          {
            group_id: groupId,
            user_id: user.id,
            role: isCreator ? 'admin' : 'member',
          },
          { onConflict: 'group_id,user_id' }
        ).then(() => {});
      }

      setMembers(loadedMembers);
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(loadedMembers));

      const memberUserIds = loadedMembers.map((m) => m.user_id).filter(Boolean);
      let avQuery = supabase.from('daily_availability').select('*, profiles (*)');
      if (memberUserIds.length > 0) {
        avQuery = avQuery.or(`group_id.eq.${groupId},user_id.in.(${memberUserIds.join(',')})`);
      } else {
        avQuery = avQuery.eq('group_id', groupId);
      }

      const { data: avData, error: avErr } = await avQuery;
      let groupAvail: DailyAvailability[] = [];

      if (!avErr && avData) {
        const avMap = new Map<string, DailyAvailability>();
        for (const a of avData) {
          const key = `${a.user_id}_${a.date}`;
          const prof =
            a.profiles ||
            loadedMembers.find((m) => m.user_id === a.user_id)?.profile ||
            (a.user_id === user.id ? user : undefined);
          const item: DailyAvailability = { ...a, profile: prof };
          const existing = avMap.get(key);
          if (!existing || new Date(a.updated_at).getTime() >= new Date(existing.updated_at).getTime()) {
            avMap.set(key, item);
          }
        }
        groupAvail = Array.from(avMap.values());
      } else {
        const { data: fbData } = await supabase
          .from('daily_availability')
          .select('*, profiles (*)')
          .eq('group_id', groupId);
        if (fbData) {
          groupAvail = fbData.map((a: any) => ({
            ...a,
            profile: a.profiles || loadedMembers.find((m) => m.user_id === a.user_id)?.profile,
          }));
        }
      }

      setAvailabilities((prev) => {
        const mergedMap = new Map<string, DailyAvailability>();
        groupAvail.forEach((item) => mergedMap.set(`${item.user_id}_${item.date}`, item));
        prev.forEach((item) => {
          const key = `${item.user_id}_${item.date}`;
          const existing = mergedMap.get(key);
          if (!existing) {
            mergedMap.set(key, item);
          } else {
            const existingTime = new Date(existing.updated_at || 0).getTime();
            const prevTime = new Date(item.updated_at || 0).getTime();
            if (prevTime > existingTime) {
              mergedMap.set(key, item);
            }
          }
        });
        const result = Array.from(mergedMap.values());
        localStorage.setItem(STORAGE_KEY_AVAILABILITIES, JSON.stringify(result));
        return result;
      });
    } catch (err) {
      console.error('Error fetching group details:', err);
    }
  };

  // Live Realtime synchronization for squad members and daily availability
  useEffect(() => {
    if (!configured || !supabase || !activeGroupId || !isUUID(activeGroupId)) return;

    const channel = supabase
      .channel(`squad-realtime-${activeGroupId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'group_members',
        },
        () => {
          fetchGroupDetails(activeGroupId);
        }
      )
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'daily_availability',
        },
        () => {
          fetchGroupDetails(activeGroupId);
        }
      )
      .subscribe();

    return () => {
      if (supabase) {
        supabase.removeChannel(channel);
      }
    };
  }, [activeGroupId, configured]);

  const activeGroup = groups.find((g) => g.id === activeGroupId) || groups[0] || null;

  const setActiveGroupId = (id: string) => {
    setActiveGroupIdState(id);
    localStorage.setItem(STORAGE_KEY_ACTIVE_GROUP_ID, id);
    if (configured && supabase && isUUID(id)) {
      fetchGroupDetails(id);
    }
  };

  // Set or update availability for a given date
  const setAvailability = async (
    date: string,
    status: GymStatus,
    preferredTime?: string,
    notes?: string
  ): Promise<boolean> => {
    if (!user) return false;

    // Resolve target group ID safely
    let targetGroupId = activeGroup?.id;
    if (!targetGroupId || !isUUID(targetGroupId)) {
      const validGroup = groups.find((g) => isUUID(g.id));
      if (validGroup) {
        targetGroupId = validGroup.id;
      }
    }

    // Single source of truth index by user and date
    const existingIndex = availabilities.findIndex(
      (a) => a.user_id === user.id && a.date === date
    );

    const updatedEntry: DailyAvailability = {
      id: existingIndex >= 0 ? availabilities[existingIndex].id : `av_${Date.now()}`,
      group_id: targetGroupId || 'grp_personal',
      user_id: user.id,
      date,
      status,
      preferred_time: status === 'rest' ? undefined : preferredTime,
      notes,
      updated_at: new Date().toISOString(),
      profile: user,
    };

    let newAvailabilities: DailyAvailability[];
    if (existingIndex >= 0) {
      newAvailabilities = [...availabilities];
      newAvailabilities[existingIndex] = updatedEntry;
    } else {
      newAvailabilities = [...availabilities, updatedEntry];
    }

    setAvailabilities(newAvailabilities);
    localStorage.setItem(STORAGE_KEY_AVAILABILITIES, JSON.stringify(newAvailabilities));

    // If real Supabase UUID user exists, sync to Cloud PostgreSQL
    if (configured && supabase && isUUID(user.id)) {
      let validGroupId = isUUID(targetGroupId) ? targetGroupId : null;
      if (!validGroupId && groups.length > 0) {
        const matching = groups.find((g) => isUUID(g.id));
        if (matching) validGroupId = matching.id;
      }

      if (validGroupId) {
        try {
          const payload = {
            group_id: validGroupId,
            user_id: user.id,
            date,
            status,
            preferred_time: status === 'rest' ? null : preferredTime || null,
            notes: notes || null,
            updated_at: new Date().toISOString(),
          };

          // Check if an availability row already exists in Supabase for this user and date
          const { data: existingDbRows } = await supabase
            .from('daily_availability')
            .select('id, group_id')
            .eq('user_id', user.id)
            .eq('date', date);

          if (existingDbRows && existingDbRows.length > 0) {
            // Direct UPDATE by primary key to guarantee update success
            const targetId = existingDbRows[0].id;
            const { error: updateErr } = await supabase
              .from('daily_availability')
              .update(payload)
              .eq('id', targetId);

            if (updateErr) {
              console.error('Update by ID error, attempting fallback update:', updateErr);
              await supabase
                .from('daily_availability')
                .update(payload)
                .eq('user_id', user.id)
                .eq('date', date);
            }

            // Remove any accidental legacy duplicates for this date
            if (existingDbRows.length > 1) {
              const extraIds = existingDbRows.slice(1).map((r: any) => r.id);
              await supabase.from('daily_availability').delete().in('id', extraIds);
            }
          } else {
            // Insert fresh record
            const { data: insertedRow, error: insertErr } = await supabase
              .from('daily_availability')
              .insert(payload)
              .select()
              .maybeSingle();

            if (insertErr) {
              console.warn('Insert error, attempting upsert fallback:', insertErr);
              await supabase
                .from('daily_availability')
                .upsert(payload, { onConflict: 'group_id,user_id,date' });
            } else if (insertedRow) {
              updatedEntry.id = insertedRow.id;
            }
          }
        } catch (err) {
          console.error('Supabase availability update failed:', err);
        }
      }
    }

    return true;
  };

  // Create new gym group
  const createGroup = async (name: string, description?: string): Promise<GymGroup | null> => {
    if (!user) return null;

    const randomCode = 'GYM-' + Math.floor(1000 + Math.random() * 9000);

    let newGroup: GymGroup = {
      id: `grp_${Date.now()}`,
      name: name.trim(),
      description: description?.trim(),
      invite_code: randomCode,
      created_by: user.id,
      created_at: new Date().toISOString(),
      member_count: 1,
    };

    if (configured && supabase && isUUID(user.id)) {
      try {
        const { data: dbGroup, error: groupErr } = await supabase
          .from('gym_groups')
          .insert({
            name: newGroup.name,
            description: newGroup.description,
            invite_code: newGroup.invite_code,
            created_by: user.id,
          })
          .select()
          .single();

        if (groupErr) throw groupErr;

        if (dbGroup) {
          newGroup = dbGroup;
          await supabase.from('group_members').insert({
            group_id: dbGroup.id,
            user_id: user.id,
            role: 'admin',
          });
        }
      } catch (err) {
        console.error('Failed to create group in Supabase:', err);
      }
    }

    const newMember: GroupMember = {
      id: `mem_${Date.now()}`,
      group_id: newGroup.id,
      user_id: user.id,
      role: 'admin',
      joined_at: new Date().toISOString(),
      profile: user,
    };

    const updatedGroups = [...groups, newGroup];
    const updatedMembers = [...members, newMember];

    setGroups(updatedGroups);
    setMembers(updatedMembers);
    setActiveGroupId(newGroup.id);

    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(updatedGroups));
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(updatedMembers));

    return newGroup;
  };

  // Join group via invite code
  const joinGroup = async (inviteCode: string): Promise<boolean> => {
    if (!user) return false;
    const cleanCode = inviteCode.trim().toUpperCase();

    let targetGroup: GymGroup | null =
      groups.find((g) => g.invite_code.toUpperCase() === cleanCode) || null;

    if (!targetGroup && configured && supabase && isUUID(user.id)) {
      // 1. Try secure stored procedure RPC first (bypasses any RLS constraints)
      try {
        const { data: rpcRes, error: rpcErr } = await supabase.rpc('join_group_by_code', {
          p_invite_code: cleanCode,
        });

        if (!rpcErr && rpcRes && rpcRes.success && rpcRes.group) {
          targetGroup = rpcRes.group;
        }
      } catch (rpcErr) {
        console.warn('RPC join_group_by_code fallback:', rpcErr);
      }

      // 2. Direct query fallback
      if (!targetGroup) {
        try {
          const { data: dbGroup, error: groupErr } = await supabase
            .from('gym_groups')
            .select('*')
            .ilike('invite_code', cleanCode)
            .maybeSingle();

          if (dbGroup) {
            targetGroup = dbGroup;
            await supabase.from('group_members').upsert(
              {
                group_id: dbGroup.id,
                user_id: user.id,
                role: 'member',
              },
              { onConflict: 'group_id,user_id' }
            );
          } else {
            console.warn('No group found for code:', cleanCode, groupErr);
          }
        } catch (err) {
          console.error('Failed direct Supabase join:', err);
        }
      }
    }

    if (!targetGroup) {
      return false;
    }

    // Update local state
    const alreadyMember = members.some(
      (m) => m.group_id === targetGroup!.id && m.user_id === user.id
    );

    if (!alreadyMember) {
      const newMember: GroupMember = {
        id: `mem_${Date.now()}`,
        group_id: targetGroup.id,
        user_id: user.id,
        role: 'member',
        joined_at: new Date().toISOString(),
        profile: user,
      };

      const updatedMembers = [...members, newMember];
      const updatedGroups = groups.some((g) => g.id === targetGroup!.id)
        ? groups
        : [...groups, targetGroup];

      setMembers(updatedMembers);
      setGroups(updatedGroups);
      localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(updatedMembers));
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(updatedGroups));
    } else {
      const updatedGroups = groups.some((g) => g.id === targetGroup!.id)
        ? groups
        : [...groups, targetGroup];
      setGroups(updatedGroups);
      localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(updatedGroups));
    }

    setActiveGroupId(targetGroup.id);
    return true;
  };

  // Leave group
  const leaveGroup = async (groupId: string): Promise<boolean> => {
    if (!user) return false;

    const updatedGroups = groups.filter((g) => g.id !== groupId);
    const updatedMembers = members.filter(
      (m) => !(m.group_id === groupId && m.user_id === user.id)
    );

    setGroups(updatedGroups);
    setMembers(updatedMembers);

    localStorage.setItem(STORAGE_KEY_GROUPS, JSON.stringify(updatedGroups));
    localStorage.setItem(STORAGE_KEY_MEMBERS, JSON.stringify(updatedMembers));

    if (configured && supabase && isUUID(user.id) && isUUID(groupId)) {
      try {
        await supabase
          .from('group_members')
          .delete()
          .eq('group_id', groupId)
          .eq('user_id', user.id);
      } catch (err) {
        console.error('Failed to leave group in Supabase:', err);
      }
    }

    if (updatedGroups.length > 0) {
      setActiveGroupId(updatedGroups[0].id);
    } else {
      setActiveGroupId('');
    }

    return true;
  };

  // Log a completed workout
  const logWorkout = async (logData: {
    date: string;
    workout_type: string;
    duration_minutes?: number;
    notes?: string;
    intensity?: 'light' | 'moderate' | 'heavy' | 'pr_beast';
  }): Promise<boolean> => {
    if (!user) return false;

    const newLog: WorkoutLog = {
      id: `log_${Date.now()}`,
      user_id: user.id,
      group_id: activeGroup?.id,
      date: logData.date,
      completed_at: new Date().toISOString(),
      workout_type: logData.workout_type,
      duration_minutes: logData.duration_minutes || 60,
      notes: logData.notes,
      intensity: logData.intensity || 'moderate',
    };

    const updatedLogs = [newLog, ...workoutLogs];
    setWorkoutLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEY_WORKOUT_LOGS, JSON.stringify(updatedLogs));

    if (configured && supabase && isUUID(user.id)) {
      try {
        await supabase.from('workout_logs').insert({
          user_id: user.id,
          group_id: isUUID(activeGroup?.id) ? activeGroup?.id : null,
          date: newLog.date,
          workout_type: newLog.workout_type,
          duration_minutes: newLog.duration_minutes,
          notes: newLog.notes,
          intensity: newLog.intensity,
        });
      } catch (err) {
        console.error('Failed to log workout in Supabase:', err);
      }
    }

    return true;
  };

  const deleteWorkoutLog = async (logId: string): Promise<boolean> => {
    const updatedLogs = workoutLogs.filter((l) => l.id !== logId);
    setWorkoutLogs(updatedLogs);
    localStorage.setItem(STORAGE_KEY_WORKOUT_LOGS, JSON.stringify(updatedLogs));

    if (configured && supabase && isUUID(user?.id) && isUUID(logId)) {
      try {
        await supabase.from('workout_logs').delete().eq('id', logId);
      } catch (err) {
        console.error('Failed to delete workout log in Supabase:', err);
      }
    }

    return true;
  };

  const getUserTodayAvailability = () => {
    if (!user) return undefined;
    const today = getTodayKey();
    return availabilities.find(
      (a) => a.user_id === user.id && a.date === today && (!activeGroup || a.group_id === activeGroup.id)
    );
  };

  return (
    <GroupContext.Provider
      value={{
        groups,
        activeGroup,
        setActiveGroupId,
        members,
        availabilities,
        workoutLogs,
        loading,
        setAvailability,
        createGroup,
        joinGroup,
        leaveGroup,
        logWorkout,
        deleteWorkoutLog,
        getUserTodayAvailability,
      }}
    >
      {children}
    </GroupContext.Provider>
  );
};

export const useGroup = () => {
  const context = useContext(GroupContext);
  if (!context) throw new Error('useGroup must be used within a GroupProvider');
  return context;
};
