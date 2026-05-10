import { format, differenceInDays, isAfter, isBefore, parseISO, eachDayOfInterval } from "date-fns";

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d, yyyy");
}

export function formatDateShort(date: string | Date | null | undefined): string {
  if (!date) return "—";
  const d = typeof date === "string" ? parseISO(date) : date;
  return format(d, "MMM d");
}

export function formatDateRange(
  start: string | Date | null | undefined,
  end: string | Date | null | undefined
): string {
  if (!start && !end) return "Dates not set";
  if (start && !end) return `From ${formatDateShort(start)}`;
  if (!start && end) return `Until ${formatDateShort(end)}`;
  return `${formatDateShort(start)} → ${formatDateShort(end)}`;
}

export function formatDayLabel(date: string | Date, dayNumber: number): string {
  const d = typeof date === "string" ? parseISO(date) : date;
  return `Day ${dayNumber} — ${format(d, "EEE, MMM d")}`;
}

export function getTripDays(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): number {
  if (!startDate || !endDate) return 0;
  return differenceInDays(parseISO(endDate), parseISO(startDate)) + 1;
}

export function getDaysInRange(
  startDate: string | Date | null | undefined,
  endDate: string | Date | null | undefined
): Date[] {
  if (!startDate || !endDate) return [];
  const start = typeof startDate === "string" ? parseISO(startDate) : startDate;
  const end = typeof endDate === "string" ? parseISO(endDate) : endDate;
  try {
    return eachDayOfInterval({ start, end });
  } catch {
    return [];
  }
}

export function getTripStatus(
  startDate: string | null | undefined,
  endDate: string | null | undefined
): "upcoming" | "ongoing" | "completed" {
  const now = new Date();
  if (!startDate) return "upcoming";

  const start = parseISO(startDate);
  if (isBefore(now, start)) return "upcoming";
  if (endDate && isAfter(now, parseISO(endDate))) return "completed";
  return "ongoing";
}

export function isDateInRange(
  date: string | Date,
  start: string | Date | null | undefined,
  end: string | Date | null | undefined
): boolean {
  if (!start || !end) return true; // No constraints if bounds not set
  const d = typeof date === "string" ? parseISO(date) : date;
  const s = typeof start === "string" ? parseISO(start) : start;
  const e = typeof end === "string" ? parseISO(end) : end;
  return !isBefore(d, s) && !isAfter(d, e);
}
