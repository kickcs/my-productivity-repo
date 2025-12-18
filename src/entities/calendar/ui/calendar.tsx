"use client";

import { useMemo, useCallback } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { Button, Card, CardContent, CardHeader } from "@/shared/ui";
import type { DayRating } from "@/entities/day-rating";
import { formatMonthYearRu } from "@/entities/day-rating";
import { getCalendarDays } from "../model/calendar-helpers";
import { CalendarDay } from "./calendar-day";
import { WEEKDAYS_RU } from "@/shared/config";

interface CalendarProps {
  currentDate: Date;
  ratings: DayRating[];
  selectedDate?: string;
  onDateSelect: (date: string) => void;
  onPrevMonth: () => void;
  onNextMonth: () => void;
}

export function Calendar({
  currentDate,
  ratings,
  selectedDate,
  onDateSelect,
  onPrevMonth,
  onNextMonth,
}: CalendarProps) {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const days = useMemo(
    () => getCalendarDays(year, month, ratings),
    [year, month, ratings]
  );

  const handleDayClick = useCallback(
    (dateStr: string, isCurrentMonth: boolean) => {
      if (isCurrentMonth) {
        onDateSelect(dateStr);
      }
    },
    [onDateSelect]
  );

  const monthYear = formatMonthYearRu(currentDate);

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-center justify-between p-4 border-b border-border/50">
        <h2 className="font-bold text-base">{monthYear}</h2>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onPrevMonth}
            className="text-muted-foreground hover:text-foreground"
          >
            <IconChevronLeft className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onNextMonth}
            className="text-muted-foreground hover:text-foreground"
          >
            <IconChevronRight className="size-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4">
        {/* Weekday headers */}
        <div className="grid grid-cols-7 mb-3">
          {WEEKDAYS_RU.map((day) => (
            <div
              key={day}
              className="text-muted-foreground text-[10px] uppercase tracking-widest font-bold text-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((day, index) => (
            <CalendarDay
              key={index}
              day={day}
              isSelected={selectedDate === day.dateStr}
              onClick={() => handleDayClick(day.dateStr, day.isCurrentMonth)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
