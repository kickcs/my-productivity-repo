"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ratingsApi } from "./ratings-api";
import type { CreateRatingInput, UpdateRatingInput, DayRating } from "../model/types";

export const ratingsKeys = {
  all: ["ratings"] as const,
  byDate: (date: string) => ["ratings", date] as const,
  byMonth: (year: number, month: number) =>
    ["ratings", "month", year, month] as const,
};

export function useRatings() {
  return useQuery({
    queryKey: ratingsKeys.all,
    queryFn: ratingsApi.getAll,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRatingByDate(date: string) {
  return useQuery({
    queryKey: ratingsKeys.byDate(date),
    queryFn: () => ratingsApi.getByDate(date),
    enabled: !!date,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useRatingsForMonth(year: number, month: number) {
  return useQuery({
    queryKey: ratingsKeys.byMonth(year, month),
    queryFn: () => ratingsApi.getForMonth(year, month),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

export function useCreateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRatingInput) => ratingsApi.create(input),
    onMutate: async (newRating) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ratingsKeys.all });

      // Snapshot previous value
      const previousRatings = queryClient.getQueryData<DayRating[]>(ratingsKeys.all);

      // Optimistically update
      if (previousRatings) {
        const optimisticRating: DayRating = {
          id: `temp-${Date.now()}`,
          user_id: "",
          date: newRating.date,
          score: newRating.score,
          title: newRating.title,
          comment: newRating.comment || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        const existingIndex = previousRatings.findIndex(r => r.date === newRating.date);

        if (existingIndex >= 0) {
          const updated = [...previousRatings];
          updated[existingIndex] = { ...updated[existingIndex], ...optimisticRating };
          queryClient.setQueryData(ratingsKeys.all, updated);
        } else {
          queryClient.setQueryData(ratingsKeys.all, [optimisticRating, ...previousRatings]);
        }
      }

      return { previousRatings };
    },
    onError: (err, newRating, context) => {
      // Rollback on error
      if (context?.previousRatings) {
        queryClient.setQueryData(ratingsKeys.all, context.previousRatings);
      }
    },
    onSettled: (data) => {
      queryClient.invalidateQueries({ queryKey: ratingsKeys.all });
      if (data) {
        const date = new Date(data.date);
        queryClient.invalidateQueries({
          queryKey: ratingsKeys.byMonth(date.getFullYear(), date.getMonth()),
        });
        queryClient.setQueryData(ratingsKeys.byDate(data.date), data);
      }
    },
  });
}

export function useUpdateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateRatingInput }) =>
      ratingsApi.update(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingsKeys.all });
    },
  });
}

export function useDeleteRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => ratingsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingsKeys.all });
    },
  });
}

export function useDeleteAllRatings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => ratingsApi.deleteAll(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ratingsKeys.all });
    },
  });
}
