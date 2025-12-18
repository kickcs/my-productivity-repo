import type { DayRating } from "@/entities/day-rating";

export interface CalendarDayData {
  date: Date;
  day: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  rating?: DayRating;
}
