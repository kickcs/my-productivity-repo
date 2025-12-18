"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ratingsApi } from "./ratings-api";
import type { CreateRatingInput, UpdateRatingInput } from "../model/types";

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
  });
}

export function useRatingByDate(date: string) {
  return useQuery({
    queryKey: ratingsKeys.byDate(date),
    queryFn: () => ratingsApi.getByDate(date),
    enabled: !!date,
  });
}

export function useRatingsForMonth(year: number, month: number) {
  return useQuery({
    queryKey: ratingsKeys.byMonth(year, month),
    queryFn: () => ratingsApi.getForMonth(year, month),
  });
}

export function useCreateRating() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CreateRatingInput) => ratingsApi.create(input),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ratingsKeys.all });
      const date = new Date(data.date);
      queryClient.invalidateQueries({
        queryKey: ratingsKeys.byMonth(date.getFullYear(), date.getMonth()),
      });
      queryClient.invalidateQueries({
        queryKey: ratingsKeys.byDate(data.date),
      });
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
