"use client";

import { Button } from "@/shared/ui";
import { Calendar } from "@/entities/calendar";
import { RatingList } from "@/entities/day-rating";
import { DayDetailSheet } from "@/features/view-rating-detail";
import { PageHeader } from "@/widgets/page-header";
import { useHistoryView } from "../model/use-history-view";

export function HistoryViewContent() {
  const {
    currentDate,
    selectedDate,
    selectedRating,
    showDetail,
    monthRatings,
    handlePrevMonth,
    handleNextMonth,
    handleDateSelect,
    handleRatingSelect,
    handleCloseDetail,
    handleEditRating,
    handleToday,
    handleBack,
  } = useHistoryView();

  return (
    <>
      <PageHeader
        title="История"
        onBack={handleBack}
        rightAction={
          <Button
            variant="outline"
            size="sm"
            onClick={handleToday}
            className="text-xs"
          >
            Сегодня
          </Button>
        }
      />

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-6">
          {/* Calendar */}
          <Calendar
            currentDate={currentDate}
            ratings={monthRatings}
            selectedDate={selectedDate}
            onDateSelect={handleDateSelect}
            onPrevMonth={handlePrevMonth}
            onNextMonth={handleNextMonth}
          />

          {/* Ratings List */}
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Записи за месяц
              </h3>
            </div>
            <RatingList
              ratings={monthRatings}
              selectedDate={selectedDate}
              onSelect={handleRatingSelect}
            />
          </div>

          <div className="h-6" />
        </div>
      </main>

      {/* Day Detail Sheet */}
      {selectedRating && (
        <DayDetailSheet
          rating={selectedRating}
          isOpen={showDetail}
          onClose={handleCloseDetail}
          onEdit={handleEditRating}
        />
      )}
    </>
  );
}
