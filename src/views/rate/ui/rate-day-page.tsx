"use client";

import { RatingForm } from "@/widgets/rating-form";

interface RateDayPageProps {
  date: string;
}

export function RateDayPage({ date }: RateDayPageProps) {
  const dateObj = new Date(date + "T00:00:00");

  return <RatingForm date={dateObj} />;
}
