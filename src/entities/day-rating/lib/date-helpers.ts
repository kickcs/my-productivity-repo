export function formatDateRu(date: Date): string {
  return date.toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
  });
}

export function formatMonthYearRu(date: Date): string {
  const formatted = date.toLocaleDateString("ru-RU", {
    month: "long",
    year: "numeric",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatWeekdayRu(date: Date): string {
  const formatted = date.toLocaleDateString("ru-RU", {
    weekday: "long",
  });
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function formatShortMonthRu(date: Date): string {
  const formatted = date
    .toLocaleDateString("ru-RU", { month: "short" })
    .replace(".", "");
  return formatted.charAt(0).toUpperCase() + formatted.slice(1);
}

export function toDateString(date: Date): string {
  return date.toISOString().split("T")[0];
}

export function fromDateString(dateStr: string): Date {
  return new Date(dateStr + "T00:00:00");
}
