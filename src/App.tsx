import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { GroupProvider, useGroup } from './context/GroupContext';
import { Header } from './components/layout/Header';
import { MobileNav } from './components/layout/MobileNav';
import { AuthPromptBanner } from './components/auth/AuthPromptBanner';
import { PersonalStatusCard } from './components/dashboard/PersonalStatusCard';
import { SlotSummaryCards } from './components/dashboard/SlotSummaryCards';
import { MatchingPartnersList } from './components/dashboard/MatchingPartnersList';
import { RestDayBuddiesList } from './components/dashboard/RestDayBuddiesList';
import { UpcomingSchedulePreview } from './components/dashboard/UpcomingSchedulePreview';
import { WeeklyCalendarView } from './components/calendar/WeeklyCalendarView';
import { ConsistencyStreakCard } from './components/progress/ConsistencyStreakCard';
import { AttendanceHistoryList } from './components/progress/AttendanceHistoryList';
import { GroupMembersList } from './components/group/GroupMembersList';
import { QuickAvailabilityModal } from './components/dashboard/QuickAvailabilityModal';
import { WorkoutCheckInModal } from './components/progress/WorkoutCheckInModal';
import { CreateGroupModal } from './components/group/CreateGroupModal';
import { JoinGroupModal } from './components/group/JoinGroupModal';
import { InviteShareModal } from './components/group/InviteShareModal';
import { GroupSwitcherModal } from './components/group/GroupSwitcherModal';
import { EditProfileModal } from './components/profile/EditProfileModal';
import { OnboardingModal } from './components/profile/OnboardingModal';
import { SignInLanding } from './components/auth/SignInLanding';
import { calculateStreakStats } from './lib/streakUtils';
import { getTodayKey, formatFullDate } from './lib/dateUtils';
import { GymStatus } from './types';
import { Sparkles, Calendar, Flame, Users, Dumbbell, ShieldCheck } from 'lucide-react';
import { SmartPlanProvider } from './context/SmartPlanContext';
import { SmartPlanView } from './components/smartPlan/SmartPlanView';

const MainAppContent: React.FC = () => {
  const {
    user,
    loading: authLoading,
    needsOnboarding,
    completeOnboarding,
    updateProfile,
    signOut,
    isConfigured,
    enableDemoMode,
  } = useAuth();
  const {
    groups,
    activeGroup,
    setActiveGroupId,
    members,
    availabilities,
    workoutLogs,
    setAvailability,
    createGroup,
    joinGroup,
    leaveGroup,
    logWorkout,
    deleteWorkoutLog,
    getUserTodayAvailability,
  } = useGroup();

  // Navigation state: 'dashboard' | 'calendar' | 'progress' | 'group'
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [dashboardDate, setDashboardDate] = useState<string>(getTodayKey());

  // Modals state
  const [isSetPlanOpen, setIsSetPlanOpen] = useState(false);
  const [selectedPlanDate, setSelectedPlanDate] = useState<string>(getTodayKey());
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isCreateGroupOpen, setIsCreateGroupOpen] = useState(false);
  const [isJoinGroupOpen, setIsJoinGroupOpen] = useState(false);
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [isGroupSwitcherOpen, setIsGroupSwitcherOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const [initialJoinCode, setInitialJoinCode] = useState('');

  // Check URL query parameters for join code (e.g. ?join=BRO-6942)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const joinCode = params.get('join');
    if (joinCode) {
      const clean = joinCode.trim().toUpperCase();
      setInitialJoinCode(clean);
      setIsJoinGroupOpen(true);
      // Clean query parameter immediately so page refreshes don't re-trigger join
      if (window.history.replaceState) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
    localStorage.removeItem('pending_join_code');
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[#090a0f] flex flex-col items-center justify-center text-white">
        <div className="w-12 h-12 rounded-2xl bg-[#12141c] border border-[#232838] p-1.5 flex items-center justify-center animate-pulse">
          <img src="/gym-icon.png" alt="GYMCREW" className="w-9 h-9 rounded-xl object-cover" />
        </div>
        <p className="mt-4 text-xs font-bold text-slate-400 tracking-wider uppercase">
          Loading GYMCREW...
        </p>
      </div>
    );
  }

  // If user is not authenticated yet, render sign in landing
  if (!user) {
    return <SignInLanding />;
  }

  const todayKey = getTodayKey();
  const activeUserAvailability = availabilities.find(
    (a) => a.date === dashboardDate && a.user_id === user?.id
  );
  const memberIdSet = new Set(members.map((m) => m.user_id));
  const activeGroupAvailabilities = availabilities.filter(
    (a) => a.date === dashboardDate && (memberIdSet.has(a.user_id) || a.user_id === user?.id)
  );

  const hasCompletedWorkoutToday = workoutLogs.some((l) => l.date === todayKey);

  // Compute streak and consistency stats
  const streakStats = calculateStreakStats(
    workoutLogs,
    availabilities,
    user?.id || '',
    user?.weekly_goal_days || 4
  );

  const handleQuickSelectStatus = async (status: GymStatus) => {
    await setAvailability(dashboardDate, status);
  };

  const handleOpenSetPlanForDate = (dateKey: string) => {
    setSelectedPlanDate(dateKey);
    setIsSetPlanOpen(true);
  };

  const getSelectedDateAvailability = () => {
    return availabilities.find(
      (a) => a.date === selectedPlanDate && a.user_id === user?.id
    );
  };

  const selectedDateAvail = getSelectedDateAvailability();

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col pb-28 lg:pb-12 overflow-x-hidden w-full max-w-full">
      {/* Demo / Cloud Status Banner */}
      <AuthPromptBanner />

      {/* Main Top Header */}
      <Header
        onOpenSetPlan={() => handleOpenSetPlanForDate(dashboardDate)}
        onOpenGroupModal={() => setIsGroupSwitcherOpen(true)}
        onOpenProfileModal={() => setIsProfileOpen(true)}
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
      />

      {/* Main Page Container */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 pt-5 pb-8 space-y-6">
        {/* TAB 1: DASHBOARD */}
        {currentTab === 'dashboard' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Friendly Greeting Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1 className="text-2xl sm:text-3xl font-black text-white font-heading tracking-tight">
                  Welcome back,{' '}
                  <span className="text-[#ccff00]">
                    {user?.display_name?.split(' ')[0] || user?.username || 'Bro'}
                  </span>
                  !
                </h1>
                <p className="text-xs sm:text-sm text-slate-400">
                  {formatFullDate(todayKey)} • Let's see who's crushing the gym today.
                </p>
              </div>

              {activeGroup && (
                <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs text-slate-400 bg-[#12141c] px-3 py-1.5 rounded-xl border border-[#1f2433]">
                  <Users size={13} className="text-[#ccff00]" />
                  <span className="font-semibold text-slate-300">{activeGroup.name}</span>
                </div>
              )}
            </div>

            {/* 1. Today & Tomorrow Personal Gym Status Card */}
            <PersonalStatusCard
              selectedDate={dashboardDate}
              onSelectDate={setDashboardDate}
              currentAvailability={activeUserAvailability}
              onOpenSetPlan={() => handleOpenSetPlanForDate(dashboardDate)}
              onQuickSelectStatus={handleQuickSelectStatus}
              hasCompletedWorkoutToday={hasCompletedWorkoutToday}
              onOpenCheckIn={() => setIsCheckInOpen(true)}
            />

            {/* 2. Three Questions Answered: Time Slot Counts (Morning, Afternoon, Evening) */}
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Squad Schedule Breakdown • {dashboardDate === todayKey ? 'Today' : 'Tomorrow'}
                </h3>
                <span className="text-[11px] text-slate-500">Tap to filter</span>
              </div>
              <SlotSummaryCards
                availabilities={activeGroupAvailabilities}
                currentUserId={user?.id}
                onSelectSlotFilter={() => setCurrentTab('calendar')}
              />
            </div>

            {/* 3. Matching Lifters (Who can I join?) */}
            <MatchingPartnersList
              todayAvailabilities={activeGroupAvailabilities}
              currentUserProfile={user!}
              currentUserAvailability={activeUserAvailability}
              onOpenSetPlan={() => handleOpenSetPlanForDate(dashboardDate)}
              onInviteFriend={() => setIsInviteOpen(true)}
            />

            {/* 4. Rest Day Friends (Separated from workouts) */}
            <RestDayBuddiesList todayAvailabilities={activeGroupAvailabilities} />

            {/* 5. Upcoming Schedule Compact Preview */}
            <UpcomingSchedulePreview
              availabilities={availabilities}
              onGoToCalendar={() => setCurrentTab('calendar')}
              onSelectDate={(d) => handleOpenSetPlanForDate(d)}
            />
          </div>
        )}

        {/* TAB 2: WEEKLY CALENDAR */}
        {currentTab === 'calendar' && (
          <div className="animate-in fade-in duration-200">
            <WeeklyCalendarView
              availabilities={availabilities}
              members={members}
              currentUser={user!}
              onOpenSetPlanForDate={handleOpenSetPlanForDate}
            />
          </div>
        )}

        {/* TAB: SMART PLAN (AI-POWERED WORKOUT PLANNER) */}
        {currentTab === 'smart-plan' && (
          <div className="animate-in fade-in duration-200">
            <SmartPlanView onOpenCheckIn={() => setIsCheckInOpen(true)} />
          </div>
        )}

        {/* TAB 3: STREAKS & PROGRESS */}
        {currentTab === 'progress' && (
          <div className="space-y-5 animate-in fade-in duration-200">
            <div>
              <span className="text-xs font-bold text-[#ccff00] uppercase tracking-wider">
                Workout Consistency & Stats
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-white font-heading mt-0.5">
                Your Progress & Streaks
              </h2>
              <p className="text-xs text-slate-400">
                Tracking completed sessions separately from plans. Rest days protect your consistency.
              </p>
            </div>

            {/* Consistency & Goal Cards */}
            <ConsistencyStreakCard
              stats={streakStats}
              onOpenCheckIn={() => setIsCheckInOpen(true)}
            />

            {/* Attendance History List */}
            <AttendanceHistoryList
              logs={workoutLogs}
              onDeleteLog={deleteWorkoutLog}
              onOpenCheckIn={() => setIsCheckInOpen(true)}
            />
          </div>
        )}

        {/* TAB 4: GROUP & CREW */}
        {currentTab === 'group' && (
          <div className="animate-in fade-in duration-200">
            <GroupMembersList
              group={activeGroup}
              members={members}
              currentUser={user!}
              allGroups={groups}
              onSelectGroup={(id) => setActiveGroupId(id)}
              onOpenGroupSwitcher={() => setIsGroupSwitcherOpen(true)}
              onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
              onOpenJoinGroup={() => setIsJoinGroupOpen(true)}
              onOpenInviteModal={() => setIsInviteOpen(true)}
              onLeaveGroup={leaveGroup}
              onOpenProfileModal={() => setIsProfileOpen(true)}
            />
          </div>
        )}
      </main>

      {/* Mobile Fixed Navigation Bar */}
      <MobileNav
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
      />

      {/* MODALS */}
      {/* 1. Quick Availability Modal */}
      <QuickAvailabilityModal
        isOpen={isSetPlanOpen}
        onClose={() => setIsSetPlanOpen(false)}
        dateKey={selectedPlanDate}
        initialStatus={selectedDateAvail?.status || 'morning'}
        initialTime={selectedDateAvail?.preferred_time || ''}
        initialNotes={selectedDateAvail?.notes || ''}
        onSave={async (d, st, tm, nt) => {
          return await setAvailability(d, st, tm, nt);
        }}
      />

      {/* 2. Workout Check-In Modal */}
      <WorkoutCheckInModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        dateKey={todayKey}
        defaultWorkoutType={activeUserAvailability?.notes || 'Gym Workout'}
        onComplete={async (data) => {
          return await logWorkout(data);
        }}
      />

      {/* 3. Create Group Modal */}
      <CreateGroupModal
        isOpen={isCreateGroupOpen}
        onClose={() => setIsCreateGroupOpen(false)}
        onCreate={async (n, desc) => {
          return await createGroup(n, desc);
        }}
      />

      {/* 4. Join Group Modal */}
      <JoinGroupModal
        isOpen={isJoinGroupOpen}
        onClose={() => {
          setIsJoinGroupOpen(false);
          setInitialJoinCode('');
        }}
        onJoin={async (code) => {
          return await joinGroup(code);
        }}
        initialCode={initialJoinCode}
      />

      {/* 5. Invite & Share Modal */}
      <InviteShareModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        group={activeGroup}
      />

      {/* 6. Group Switcher Modal */}
      <GroupSwitcherModal
        isOpen={isGroupSwitcherOpen}
        onClose={() => setIsGroupSwitcherOpen(false)}
        groups={groups}
        activeGroupId={activeGroup?.id || ''}
        onSelectGroup={(id) => setActiveGroupId(id)}
        onOpenCreateGroup={() => setIsCreateGroupOpen(true)}
        onOpenJoinGroup={() => setIsJoinGroupOpen(true)}
      />

      {/* 7. Edit Profile Modal */}
      <EditProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        user={user}
        onUpdate={updateProfile}
        onSignOut={signOut}
        isSupabaseConnected={isConfigured}
      />

      {/* 8. Onboarding Modal for first-time users */}
      <OnboardingModal
        isOpen={needsOnboarding}
        onComplete={completeOnboarding}
        initialDisplayName={user?.display_name}
      />
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <GroupProvider>
        <SmartPlanProvider>
          <MainAppContent />
        </SmartPlanProvider>
      </GroupProvider>
    </AuthProvider>
  );
}
