"use client";

import { useState, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  useRatings,
  useRatingsForMonth,
  type DayRating,
} from "@/entities/day-rating";
import { routes } from "@/shared/config/routes";

export function useHistoryView() {
  const router = useRouter();
  const { data: ratings = [] } = useRatings();

  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState<string | undefined>();
  const [selectedRating, setSelectedRating] = useState<DayRating | undefined>();
  const [showDetail, setShowDetail] = useState(false);

  const { data: monthRatings = [] } = useRatingsForMonth(
    currentDate.getFullYear(),
    currentDate.getMonth()
  );

  const handlePrevMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  }, []);

  const handleNextMonth = useCallback(() => {
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  }, []);

  const handleDateSelect = useCallback(
    (date: string) => {
      setSelectedDate(date);
      const rating = ratings.find((r) => r.date === date);
      if (rating) {
        setSelectedRating(rating);
        setShowDetail(true);
      }
    },
    [ratings]
  );

  const handleRatingSelect = useCallback((rating: DayRating) => {
    setSelectedDate(rating.date);
    setSelectedRating(rating);
    setShowDetail(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setShowDetail(false);
    setSelectedRating(undefined);
  }, []);

  const handleEditRating = useCallback(() => {
    if (selectedRating) {
      setShowDetail(false);
      router.push(routes.rate(selectedRating.date));
    }
  }, [selectedRating, router]);

  const handleToday = useCallback(() => {
    setCurrentDate(new Date());
  }, []);

  const handleBack = useCallback(() => {
    router.push(routes.home);
  }, [router]);

  return {
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
  };
}
