import { QueryClient } from "@tanstack/react-query";

// Lazy import to avoid circular dependencies
const getRatingsApi = () =>
  import("@/entities/day-rating/api/ratings-api").then(m => m.ratingsApi);

export const ratingsKeys = {
  all: ["ratings"] as const,
  byMonth: (year: number, month: number) => ["ratings", "month", year, month] as const,
  byDate: (date: string) => ["ratings", date] as const,
};

export async function prefetchRatings(queryClient: QueryClient) {
  const ratingsApi = await getRatingsApi();
  return queryClient.prefetchQuery({
    queryKey: ratingsKeys.all,
    queryFn: ratingsApi.getAll,
    staleTime: 1000 * 60 * 5,
  });
}

export async function prefetchRatingsForMonth(
  queryClient: QueryClient,
  year: number,
  month: number
) {
  const ratingsApi = await getRatingsApi();
  return queryClient.prefetchQuery({
    queryKey: ratingsKeys.byMonth(year, month),
    queryFn: () => ratingsApi.getForMonth(year, month),
    staleTime: 1000 * 60 * 5,
  });
}
