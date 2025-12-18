import type { DayRating } from "@/entities/day-rating";
import type { CalendarDayData } from "./types";

export function getCalendarDays(
  year: number,
  month: number,
  ratings: DayRating[]
): CalendarDayData[] {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Get the day of week (0-6, where 0 is Sunday)
  // Convert to Monday-based (0-6, where 0 is Monday)
  let startDayOfWeek = firstDay.getDay() - 1;
  if (startDayOfWeek < 0) startDayOfWeek = 6;

  const days: CalendarDayData[] = [];

  // Add days from previous month
  const prevMonth = new Date(year, month, 0);
  for (let i = startDayOfWeek - 1; i >= 0; i--) {
    const day = prevMonth.getDate() - i;
    const date = new Date(year, month - 1, day);
    const dateStr = date.toISOString().split("T")[0];
    days.push({
      date,
      day,
      dateStr,
      isCurrentMonth: false,
      isToday: false,
      rating: ratings.find((r) => r.date === dateStr),
    });
  }

  // Add days from current month
  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(year, month, day);
    const dateStr = date.toISOString().split("T")[0];
    days.push({
      date,
      day,
      dateStr,
      isCurrentMonth: true,
      isToday: date.getTime() === today.getTime(),
      rating: ratings.find((r) => r.date === dateStr),
    });
  }

  // Add days from next month to complete the grid
  const remainingDays = 42 - days.length; // 6 rows * 7 days
  for (let day = 1; day <= remainingDays; day++) {
    const date = new Date(year, month + 1, day);
    const dateStr = date.toISOString().split("T")[0];
    days.push({
      date,
      day,
      dateStr,
      isCurrentMonth: false,
      isToday: false,
      rating: ratings.find((r) => r.date === dateStr),
    });
  }

  return days;
}
