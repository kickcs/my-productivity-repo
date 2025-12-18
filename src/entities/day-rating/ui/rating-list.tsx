"use client";

import type { DayRating } from "../model/types";
import { RatingCard } from "./rating-card";

interface RatingListProps {
  ratings: DayRating[];
  selectedDate?: string;
  onSelect: (rating: DayRating) => void;
}

export function RatingList({
  ratings,
  selectedDate,
  onSelect,
}: RatingListProps) {
  // Sort by date descending
  const sortedRatings = [...ratings].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedRatings.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">Нет записей за этот месяц</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {sortedRatings.map((rating) => (
        <RatingCard
          key={rating.id}
          rating={rating}
          isSelected={selectedDate === rating.date}
          onClick={() => onSelect(rating)}
        />
      ))}
    </div>
  );
}
