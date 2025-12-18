"use client";

import { IconEdit } from "@tabler/icons-react";
import { Button, Card, CardContent } from "@/shared/ui";
import { cn } from "@/shared/lib";
import type { DayRating } from "@/entities/day-rating";
import {
  getScoreLabel,
  getScoreColor,
  formatWeekdayRu,
} from "@/entities/day-rating";

interface DayDetailSheetProps {
  rating: DayRating;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export function DayDetailSheet({
  rating,
  isOpen,
  onClose,
  onEdit,
}: DayDetailSheetProps) {
  if (!isOpen) return null;

  const date = new Date(rating.date + "T00:00:00");
  const day = date.getDate();
  const month = date.toLocaleDateString("ru-RU", { month: "long" });
  const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
  const weekday = formatWeekdayRu(date);
  const scoreLabel = getScoreLabel(rating.score);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 z-40 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 flex flex-col rounded-t-[10px] border border-border bg-background px-6 pb-6 pt-4 shadow-xl sm:max-w-lg sm:mx-auto animate-in slide-in-from-bottom duration-300">
        {/* Handle */}
        <div className="mx-auto mb-6 h-1.5 w-12 shrink-0 rounded-full bg-muted" />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="space-y-1">
            <h3 className="text-2xl font-semibold tracking-tight leading-none">
              {day} {capitalizedMonth}
            </h3>
            <p className="text-sm text-muted-foreground">{weekday}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end">
              <span className={cn("text-2xl font-bold", scoreLabel.colorClass)}>
                {rating.score}
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {scoreLabel.label.split(" ")[0]}
              </span>
            </div>
            <div
              className={cn(
                "h-10 w-1 rounded-full",
                getScoreColor(rating.score)
              )}
            />
          </div>
        </div>

        {/* Comment */}
        {rating.comment && (
          <div className="space-y-4 mb-6">
            <Card className="shadow-sm">
              <CardContent className="p-4">
                <p className="text-sm leading-relaxed">{rating.comment}</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={onClose} className="h-11">
            Закрыть
          </Button>
          <Button onClick={onEdit} className="h-11">
            <IconEdit className="size-4 mr-2" />
            Изменить
          </Button>
        </div>
      </div>
    </>
  );
}
