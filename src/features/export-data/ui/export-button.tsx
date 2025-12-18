"use client";

import { useCallback } from "react";
import { IconDownload } from "@tabler/icons-react";
import { Button } from "@/shared/ui";
import { useRatings } from "@/entities/day-rating";

export function ExportButton() {
  const { data: ratings, isLoading } = useRatings();

  const handleExport = useCallback(() => {
    if (!ratings || ratings.length === 0) return;

    const data = JSON.stringify(ratings, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `day-ratings-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [ratings]);

  return (
    <Button
      variant="outline"
      className="w-full justify-start gap-3"
      onClick={handleExport}
      disabled={isLoading || !ratings || ratings.length === 0}
    >
      <IconDownload className="size-4" />
      Экспорт данных
    </Button>
  );
}
