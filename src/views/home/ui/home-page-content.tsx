"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { IconPlus } from "@tabler/icons-react";
import { Button } from "@/shared/ui";
import { routes } from "@/shared/config/routes";
import { useRatings, toDateString, RatingList } from "@/entities/day-rating";

export function HomePageContent() {
  const router = useRouter();
  const { data: ratings = [], isLoading } = useRatings();
  const today = toDateString(new Date());

  const handleRateToday = useCallback(() => {
    router.push(routes.rate(today));
  }, [router, today]);

  const handleRatingSelect = useCallback(
    (rating: { date: string }) => {
      router.push(routes.rate(rating.date));
    },
    [router]
  );

  const recentRatings = ratings.slice(0, 5);

  return (
    <main className="flex-1 overflow-y-auto pb-24">
      <div className="p-4 space-y-6">
        {/* Hero Section */}
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold tracking-tight mb-2">
            Как прошел ваш день?
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Оцените свой день от 1 до 10
          </p>
          <Button
            onClick={handleRateToday}
            size="lg"
            className="gap-2 rounded-xl shadow-lg shadow-primary/20"
          >
            <IconPlus className="size-5" />
            Оценить сегодня
          </Button>
        </div>

        {/* Recent Ratings */}
        {recentRatings.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4 px-1">
              <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                Последние записи
              </h3>
            </div>
            <RatingList
              ratings={recentRatings}
              onSelect={handleRatingSelect}
            />
          </div>
        )}

        {isLoading && (
          <div className="text-center text-muted-foreground text-sm py-8">
            Загрузка...
          </div>
        )}

        {!isLoading && ratings.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-8">
            У вас пока нет записей. Начните оценивать свои дни!
          </div>
        )}
      </div>
    </main>
  );
}
