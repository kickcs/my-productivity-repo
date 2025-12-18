"use client";

import { cn } from "@/shared/lib";
import { getScoreColor } from "@/entities/day-rating";
import type { CalendarDayData } from "../model/types";

interface CalendarDayProps {
  day: CalendarDayData;
  isSelected: boolean;
  onClick: () => void;
}

export function CalendarDay({ day, isSelected, onClick }: CalendarDayProps) {
  const hasRating = !!day.rating;

  if (!day.isCurrentMonth) {
    return (
      <div className="aspect-square flex flex-col items-center justify-center opacity-20 text-xs text-muted-foreground">
        {day.day}
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "aspect-square rounded-md flex flex-col items-center justify-center relative transition-colors group",
        isSelected
          ? "bg-muted ring-1 ring-primary shadow-lg"
          : "hover:bg-muted/50",
        day.isToday && !isSelected && "ring-1 ring-primary/50"
      )}
    >
      <span
        className={cn(
          "text-xs font-medium z-10",
          hasRating ? "mb-1" : "",
          isSelected ? "font-bold text-foreground" : "text-muted-foreground",
          day.isToday && "text-primary font-bold"
        )}
      >
        {day.day}
      </span>
      {hasRating && (
        <div
          className={cn(
            "w-6 h-1 rounded-full",
            getScoreColor(day.rating!.score)
          )}
        />
      )}
    </button>
  );
}
