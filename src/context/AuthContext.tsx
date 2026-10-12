import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile } from '../types';
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { INITIAL_USER } from '../lib/mockData';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  needsOnboarding: boolean;
  completeOnboarding: (username: string, displayName: string) => Promise<boolean>;
  error: string | null;
  clearError: () => void;
  enableDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_USER = 'gymbros_user_profile';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [needsOnboarding, setNeedsOnboarding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const configured = isSupabaseConfigured();

  useEffect(() => {
    async function initAuth() {
      setLoading(true);
      setError(null);

      if (configured && supabase) {
        try {
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (sessionError) throw sessionError;

          if (session?.user) {
            let { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (!profile) {
              const defaultUsername =
                (session.user.email?.split('@')[0] || 'bro').toLowerCase().replace(/[^a-z0-9_]/g, '') +
                '_' +
                session.user.id.slice(0, 4);

              const initialProfile: UserProfile = {
                id: session.user.id,
                email: session.user.email || '',
                username: defaultUsername,
                display_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Gym Bro',
                avatar_url: session.user.user_metadata?.avatar_url,
                created_at: new Date().toISOString(),
              };

              try {
                await supabase.from('profiles').upsert(initialProfile);
                profile = initialProfile;
              } catch (upsertErr) {
                console.error('Failed to create initial profile in database:', upsertErr);
              }

              setNeedsOnboarding(true);
            }

            if (profile) {
              setUser(profile);
              localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(profile));
            }
          } else {
            setUser(null);
            localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
          }
        } catch (err: any) {
          console.error('Supabase auth initialization error:', err);
          setError(err.message || 'Failed to authenticate');
          setUser(null);
        } finally {
          setLoading(false);
        }

        // Listen for auth state changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          async (_event, session) => {
            if (session?.user && supabase) {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();
              if (profile) {
                setUser(profile);
                setNeedsOnboarding(false);
              }
            } else {
              setUser(null);
              localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
            }
          }
        );

        return () => {
          authListener?.subscription.unsubscribe();
        };
      } else {
        setUser(null);
        setLoading(false);
      }
    }

    initAuth();
  }, [configured]);

  const signInWithGoogle = async () => {
    setError(null);
    if (configured && supabase) {
      try {
        const params = new URLSearchParams(window.location.search);
        const joinFromUrl = params.get('join');
        const pendingCode = joinFromUrl || localStorage.getItem('pending_join_code');
        if (pendingCode) {
          localStorage.setItem('pending_join_code', pendingCode.trim().toUpperCase());
        }

        const redirectUrl = pendingCode
          ? `${window.location.origin}/?join=${encodeURIComponent(pendingCode.trim().toUpperCase())}`
          : `${window.location.origin}/`;

        const { error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: redirectUrl,
          },
        });
        if (error) throw error;
      } catch (err: any) {
        setError(err.message || 'Google Sign-in failed');
      }
    } else {
      // Demo mode sign in simulation
      setUser(INITIAL_USER);
      localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(INITIAL_USER));
    }
  };

  const signOut = async () => {
    if (configured && supabase) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_KEY_USER);
  };

  const updateProfile = async (updates: Partial<UserProfile>): Promise<boolean> => {
    if (!user) return false;
    const updated = { ...user, ...updates };

    if (configured && supabase) {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', user.id);
      if (error) {
        setError(error.message);
        return false;
      }
    }

    setUser(updated);
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(updated));
    return true;
  };

  const completeOnboarding = async (username: string, displayName: string): Promise<boolean> => {
    if (!user) return false;
    const cleanUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, '');
    
    if (cleanUsername.length < 3) {
      setError('Username must be at least 3 characters');
      return false;
    }

    const newProfile: UserProfile = {
      ...user,
      username: cleanUsername,
      display_name: displayName.trim() || cleanUsername,
    };

    if (configured && supabase) {
      // Check username uniqueness
      const { data: existing } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', cleanUsername)
        .neq('id', user.id)
        .maybeSingle();

      if (existing) {
        setError('Username is already taken. Please choose another.');
        return false;
      }

      const { error } = await supabase.from('profiles').upsert(newProfile);
      if (error) {
        setError(error.message);
        return false;
      }
    }

    setUser(newProfile);
    setNeedsOnboarding(false);
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(newProfile));
    return true;
  };

  const enableDemoMode = () => {
    setUser(INITIAL_USER);
    localStorage.setItem(LOCAL_STORAGE_KEY_USER, JSON.stringify(INITIAL_USER));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isConfigured: configured,
        signInWithGoogle,
        signOut,
        updateProfile,
        needsOnboarding,
        completeOnboarding,
        error,
        clearError: () => setError(null),
        enableDemoMode,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
