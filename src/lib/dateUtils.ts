/**
 * GymBros Date Utilities
 * Handles timezone-safe local date calculation, week formatting, and day labels.
 */

// Formats a Date object as YYYY-MM-DD using local time
export function formatDateKey(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Parse YYYY-MM-DD safely into a local Date object
export function parseDateKey(dateKey: string): Date {
  const [year, month, day] = dateKey.split('-').map(Number);
  return new Date(year, month - 1, day);
}

// Get today's local date key
export function getTodayKey(): string {
  return formatDateKey(new Date());
}

// Get tomorrow's local date key
export function getTomorrowKey(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return formatDateKey(d);
}

// Format date key into friendly string e.g. "Monday, Oct 12"
export function formatFriendlyDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

// Format full date e.g. "Monday, October 12, 2026"
export function formatFullDate(dateKey: string): string {
  const date = parseDateKey(dateKey);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

export interface WeekDayInfo {
  dateKey: string;
  dayName: string; // 'Mon', 'Tue'
  dayNumber: number; // 12
  isToday: boolean;
  isPast: boolean;
  date: Date;
}

// Get 7 days of the current week (Monday through Sunday) based on an offset or target date
export function getWeekDates(referenceDate: Date = new Date()): WeekDayInfo[] {
  const todayKey = getTodayKey();
  const target = new Date(referenceDate);
  target.setHours(0, 0, 0, 0);

  // Day of week: 0 is Sun, 1 is Mon, etc.
  const dayOfWeek = target.getDay();
  // We want Monday as day 0
  const distanceToMonday = (dayOfWeek + 6) % 7;
  
  const monday = new Date(target);
  monday.setDate(target.getDate() - distanceToMonday);

  const days: WeekDayInfo[] = [];
  for (let i = 0; i < 7; i++) {
    const current = new Date(monday);
    current.setDate(monday.getDate() + i);
    const dateKey = formatDateKey(current);
    
    days.push({
      dateKey,
      dayName: current.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNumber: current.getDate(),
      isToday: dateKey === todayKey,
      isPast: dateKey < todayKey,
      date: current,
    });
  }

  return days;
}

// Helper to add or subtract weeks
export function addWeeks(date: Date, weeks: number): Date {
  const newDate = new Date(date);
  newDate.setDate(newDate.getDate() + (weeks * 7));
  return newDate;
}

// Format week header e.g. "Oct 12 - Oct 18, 2026"
export function formatWeekRange(days: WeekDayInfo[]): string {
  if (days.length === 0) return '';
  const first = days[0].date;
  const last = days[days.length - 1].date;

  const firstMonth = first.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const lastMonth = last.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  
  return `${firstMonth} – ${lastMonth}`;
}
