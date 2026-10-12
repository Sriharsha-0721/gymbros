import { DailyAvailability, StreakStats, WorkoutLog } from '../types';
import { getTodayKey, parseDateKey } from './dateUtils';

/**
 * Calculates current streak, best streak, and monthly/weekly stats.
 * - Workouts are distinct from plans.
 * - Rest days marked by the user do NOT break the streak!
 */
export function calculateStreakStats(
  logs: WorkoutLog[],
  availabilities: DailyAvailability[],
  userId: string,
  weeklyGoal: number = 4
): StreakStats {
  const userLogs = logs.filter((l) => l.user_id === userId);
  const userAvail = availabilities.filter((a) => a.user_id === userId);

  const completedDates = new Set(userLogs.map((l) => l.date));
  const restDates = new Set(
    userAvail.filter((a) => a.status === 'rest').map((a) => a.date)
  );

  const todayKey = getTodayKey();
  const todayDate = parseDateKey(todayKey);

  // 1. Completed this week (Monday to Sunday of current week)
  const currentWeekStart = new Date(todayDate);
  const dayOfWeek = (currentWeekStart.getDay() + 6) % 7;
  currentWeekStart.setDate(currentWeekStart.getDate() - dayOfWeek);
  currentWeekStart.setHours(0, 0, 0, 0);

  const currentWeekEnd = new Date(currentWeekStart);
  currentWeekEnd.setDate(currentWeekStart.getDate() + 6);
  currentWeekEnd.setHours(23, 59, 59, 999);

  let completedThisWeek = 0;
  for (const log of userLogs) {
    const logDate = parseDateKey(log.date);
    if (logDate >= currentWeekStart && logDate <= currentWeekEnd) {
      completedThisWeek++;
    }
  }

  // 2. Completed this month
  const currentMonth = todayDate.getMonth();
  const currentYear = todayDate.getFullYear();
  let completedThisMonth = 0;
  for (const log of userLogs) {
    const logDate = parseDateKey(log.date);
    if (logDate.getMonth() === currentMonth && logDate.getFullYear() === currentYear) {
      completedThisMonth++;
    }
  }

  // 3. Current streak calculation:
  // Step backwards from today (or yesterday if today isn't logged yet)
  // Each day is valid if either:
  // a) User completed a workout
  // b) User marked it as a Rest day
  let currentStreak = 0;
  let checkDate = new Date(todayDate);
  
  // If today hasn't been logged yet and isn't rest, we can check starting from today or yesterday
  const checkKey = todayKey;
  let hasCheckedToday = false;
  if (!completedDates.has(checkKey) && !restDates.has(checkKey)) {
    // User hasn't logged today yet; check starting from yesterday so an ongoing streak doesn't immediately show 0
    checkDate.setDate(checkDate.getDate() - 1);
  } else {
    hasCheckedToday = true;
  }

  // Iterate backwards up to 365 days
  for (let i = 0; i < 365; i++) {
    const year = checkDate.getFullYear();
    const month = String(checkDate.getMonth() + 1).padStart(2, '0');
    const day = String(checkDate.getDate()).padStart(2, '0');
    const key = `${year}-${month}-${day}`;

    if (completedDates.has(key)) {
      currentStreak++;
    } else if (restDates.has(key)) {
      // Rest day preserves streak, but only counts towards streak if there were preceding workouts
      // We don't break the streak!
    } else {
      // Day had no workout and no rest marked -> streak ends
      break;
    }

    checkDate.setDate(checkDate.getDate() - 1);
  }

  // Best streak (historical consecutive workout days ignoring rest days)
  let bestStreak = currentStreak;

  return {
    currentStreak,
    bestStreak: Math.max(bestStreak, currentStreak),
    completedThisWeek,
    weeklyGoal,
    completedThisMonth,
    totalCompleted: userLogs.length,
  };
}
