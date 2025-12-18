"use client";

import { cn } from "@/shared/lib";

interface ScoreButtonProps {
  score: number;
  isSelected: boolean;
  onClick: () => void;
}

export function ScoreButton({ score, isSelected, onClick }: ScoreButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "aspect-square flex items-center justify-center rounded-xl text-lg font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        isSelected
          ? "bg-primary text-primary-foreground text-xl font-bold shadow-lg shadow-primary/30 ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 z-10"
          : "border border-border bg-card hover:border-primary/50 hover:bg-muted"
      )}
    >
      <span className="relative z-10">{score}</span>
    </button>
  );
}
