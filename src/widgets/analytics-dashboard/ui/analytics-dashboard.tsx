"use client";

import { Suspense } from "react";
import { BottomNav } from "@/widgets/bottom-navigation";
import { AnalyticsDashboardContent } from "./analytics-dashboard-content";
import { AnalyticsSkeleton } from "./analytics-skeleton";

export function AnalyticsDashboard() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <header className="flex items-center justify-center px-4 py-3 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-30">
        <h1 className="text-sm font-bold tracking-wide">Анализ</h1>
      </header>

      <Suspense fallback={<AnalyticsSkeleton />}>
        <AnalyticsDashboardContent />
      </Suspense>

      <BottomNav />
    </div>
  );
}
