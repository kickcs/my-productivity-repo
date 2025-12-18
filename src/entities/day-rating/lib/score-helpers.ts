export interface ScoreLabel {
  min: number;
  max: number;
  label: string;
  colorClass: string;
  bgClass: string;
}

export const scoreLabels: ScoreLabel[] = [
  {
    min: 1,
    max: 2,
    label: "Ужасный день",
    colorClass: "text-red-500",
    bgClass: "bg-red-500",
  },
  {
    min: 3,
    max: 4,
    label: "Плохой день",
    colorClass: "text-orange-500",
    bgClass: "bg-orange-500",
  },
  {
    min: 5,
    max: 6,
    label: "Обычный день",
    colorClass: "text-yellow-500",
    bgClass: "bg-yellow-500",
  },
  {
    min: 7,
    max: 8,
    label: "Хороший день",
    colorClass: "text-lime-500",
    bgClass: "bg-lime-500",
  },
  {
    min: 9,
    max: 10,
    label: "Отличный день",
    colorClass: "text-emerald-500",
    bgClass: "bg-emerald-500",
  },
];

export function getScoreLabel(score: number): ScoreLabel {
  return (
    scoreLabels.find((l) => score >= l.min && score <= l.max) || scoreLabels[2]
  );
}

export function getScoreColor(score: number): string {
  if (score <= 2) return "bg-red-500";
  if (score <= 4) return "bg-orange-500";
  if (score <= 6) return "bg-yellow-500";
  if (score <= 8) return "bg-lime-500";
  return "bg-emerald-500";
}

export function getScoreBadgeClasses(score: number): string {
  if (score <= 2)
    return "bg-red-500/10 text-red-500 border-red-500/20";
  if (score <= 4)
    return "bg-orange-500/10 text-orange-500 border-orange-500/20";
  if (score <= 6)
    return "bg-yellow-500/10 text-yellow-600 border-yellow-500/20";
  if (score <= 8)
    return "bg-lime-500/10 text-lime-600 border-lime-500/20";
  return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
}
