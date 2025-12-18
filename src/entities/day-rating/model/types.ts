export interface DayRating {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD
  score: number; // 1-10
  title: string;
  comment: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateRatingInput {
  date: string;
  score: number;
  title: string;
  comment?: string;
}

export interface UpdateRatingInput {
  score?: number;
  title?: string;
  comment?: string;
}

export interface CalendarDay {
  date: Date;
  day: number;
  dateStr: string;
  isCurrentMonth: boolean;
  isToday: boolean;
  rating?: DayRating;
}
