"use client";

import { Card, CardContent } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { DayRating } from "../model/types";
import { getScoreLabel, getScoreBadgeClasses, formatShortMonthRu } from "../lib";

interface RatingCardProps {
  rating: DayRating;
  isSelected?: boolean;
  onClick?: () => void;
}

export function RatingCard({ rating, isSelected, onClick }: RatingCardProps) {
  const date = new Date(rating.date + "T00:00:00");
  const day = date.getDate().toString().padStart(2, "0");
  const month = formatShortMonthRu(date);

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all overflow-hidden group",
        isSelected
          ? "border-primary/40 shadow-lg"
          : "hover:border-muted-foreground/20"
      )}
      onClick={onClick}
    >
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
      )}
      <CardContent className="p-4 flex gap-4 items-start">
        {/* Date Badge */}
        <div
          className={cn(
            "flex flex-col items-center justify-center rounded-md h-12 w-12 shrink-0 border border-border",
            isSelected ? "bg-muted" : "bg-muted/30 group-hover:bg-muted/50"
          )}
        >
          <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
            {month}
          </span>
          <span
            className={cn(
              "text-lg font-bold leading-none",
              isSelected
                ? "text-foreground"
                : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {day}
          </span>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-1 gap-2">
            <h4
              className={cn(
                "font-bold text-sm truncate transition-colors",
                isSelected
                  ? "text-foreground"
                  : "text-muted-foreground group-hover:text-foreground"
              )}
            >
              {rating.title}
            </h4>
            <span
              className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap border",
                getScoreBadgeClasses(rating.score)
              )}
            >
              {rating.score} / 10
            </span>
          </div>
          {rating.comment && (
            <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
              {rating.comment}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
