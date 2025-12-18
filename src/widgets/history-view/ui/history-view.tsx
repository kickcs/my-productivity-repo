"use client";

import { Suspense } from "react";
import { BottomNav } from "@/widgets/bottom-navigation";
import { HistoryViewContent } from "./history-view-content";
import { HistorySkeleton } from "./history-skeleton";

export function HistoryView() {
  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Suspense fallback={<HistorySkeleton />}>
        <HistoryViewContent />
      </Suspense>

      <BottomNav />
    </div>
  );
}
