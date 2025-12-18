"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  useRatingByDate,
  useCreateRating,
  getScoreLabel,
} from "@/entities/day-rating";
import { routes } from "@/shared/config/routes";

export function useRatingForm(dateStr: string) {
  const router = useRouter();
  const { data: existingRating, isLoading } = useRatingByDate(dateStr);
  const createRating = useCreateRating();

  const [selectedScore, setSelectedScore] = useState<number | null>(null);
  const [comment, setComment] = useState("");

  // Initialize with existing rating data
  useEffect(() => {
    if (existingRating) {
      setSelectedScore(existingRating.score);
      setComment(existingRating.comment || "");
    }
  }, [existingRating]);

  const handleSave = useCallback(() => {
    if (selectedScore === null) return;

    const label = getScoreLabel(selectedScore);
    createRating.mutate(
      {
        date: dateStr,
        score: selectedScore,
        title: label.label,
        comment: comment.trim(),
      },
      {
        onSuccess: () => {
          router.push(routes.home);
        },
      }
    );
  }, [selectedScore, comment, dateStr, createRating, router]);

  const handleClose = useCallback(() => {
    router.push(routes.home);
  }, [router]);

  return {
    selectedScore,
    setSelectedScore,
    comment,
    setComment,
    handleSave,
    handleClose,
    isLoading,
    isSaving: createRating.isPending,
    isExistingRating: !!existingRating,
  };
}
