"use client";

import { Badge } from "@/shared/ui";
import { ScoreButton, getScoreLabel } from "@/entities/day-rating";

interface ScoreSelectorProps {
  selectedScore: number | null;
  onScoreSelect: (score: number) => void;
}

export function ScoreSelector({
  selectedScore,
  onScoreSelect,
}: ScoreSelectorProps) {
  const scoreLabel = selectedScore !== null ? getScoreLabel(selectedScore) : null;

  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-500 delay-100">
      <div className="flex justify-between items-center mb-3 px-1">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Плохо
        </span>
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Отлично
        </span>
      </div>

      <div className="grid grid-cols-5 gap-3">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((score) => (
          <ScoreButton
            key={score}
            score={score}
            isSelected={selectedScore === score}
            onClick={() => onScoreSelect(score)}
          />
        ))}
      </div>

      {scoreLabel && (
        <div className="mt-4 text-center animate-in fade-in duration-300">
          <Badge variant="default" className="px-3 py-1 text-sm font-semibold">
            {scoreLabel.label}
          </Badge>
        </div>
      )}
    </div>
  );
}
