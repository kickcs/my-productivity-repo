"use client";

import { useMemo } from "react";
import { IconChartBar, IconMoodEmpty } from "@tabler/icons-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/shared/ui";
import { cn } from "@/shared/lib";
import { useRatings } from "@/entities/day-rating";
import { BottomNav } from "@/widgets/bottom-navigation";

const scoreRanges = [
  { label: "1-2", color: "bg-red-500" },
  { label: "3-4", color: "bg-orange-500" },
  { label: "5-6", color: "bg-yellow-500" },
  { label: "7-8", color: "bg-lime-500" },
  { label: "9-10", color: "bg-emerald-500" },
];

function pluralizeDays(count: number): string {
  const lastTwo = count % 100;
  const lastOne = count % 10;

  if (lastTwo >= 11 && lastTwo <= 19) {
    return "дней";
  }
  if (lastOne === 1) {
    return "день";
  }
  if (lastOne >= 2 && lastOne <= 4) {
    return "дня";
  }
  return "дней";
}

export function AnalyticsDashboard() {
  const { data: ratings = [], isLoading } = useRatings();

  const stats = useMemo(() => {
    if (ratings.length === 0) {
      return { average: 0, distribution: [0, 0, 0, 0, 0], counts: [0, 0, 0, 0, 0], totalDays: 0 };
    }

    const total = ratings.reduce((sum, r) => sum + r.score, 0);
    const average = total / ratings.length;

    // Calculate distribution (1-2, 3-4, 5-6, 7-8, 9-10)
    const counts = [0, 0, 0, 0, 0];
    ratings.forEach((r) => {
      if (r.score <= 2) counts[0]++;
      else if (r.score <= 4) counts[1]++;
      else if (r.score <= 6) counts[2]++;
      else if (r.score <= 8) counts[3]++;
      else counts[4]++;
    });

    // Convert to percentages relative to max
    const maxCount = Math.max(...counts, 1);
    const distribution = counts.map((c) => (c / maxCount) * 100);

    return { average, distribution, counts, totalDays: ratings.length };
  }, [ratings]);

  const isEmpty = !isLoading && ratings.length === 0;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="flex items-center justify-center px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <h1 className="text-sm font-bold tracking-wide">Анализ</h1>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        <div className="p-4 space-y-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-muted-foreground text-sm">Загрузка...</div>
            </div>
          ) : isEmpty ? (
            <Card>
              <CardContent className="p-8">
                <div className="flex flex-col items-center text-center gap-3">
                  <IconMoodEmpty className="size-12 text-muted-foreground/50" />
                  <div>
                    <p className="font-medium">Нет данных для анализа</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Начните оценивать свои дни, чтобы увидеть статистику
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Stats Card */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>Статистика</CardTitle>
                      <CardDescription>Обзор за все время</CardDescription>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold tracking-tighter">
                        {stats.average.toFixed(1)}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium mt-1">
                        Средний балл
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between h-28 gap-3 pt-4 border-t border-border/50">
                    {scoreRanges.map((range, index) => (
                      <div
                        key={range.label}
                        className="flex flex-col items-center gap-2 flex-1 group"
                      >
                        <div className="w-full bg-secondary rounded-md h-full flex items-end relative overflow-hidden">
                          {stats.counts[index] > 0 && (
                            <div
                              className={cn("w-full transition-all rounded-t-sm", range.color)}
                              style={{
                                height: `${stats.distribution[index]}%`,
                              }}
                            />
                          )}
                        </div>
                        <span className="text-[10px] text-muted-foreground font-semibold">
                          {range.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Summary Card */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <IconChartBar className="size-5 text-primary" />
                    </div>
                    <div>
                      <div className="font-semibold">
                        {stats.totalDays} {pluralizeDays(stats.totalDays)}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Всего записей в журнале
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
}
