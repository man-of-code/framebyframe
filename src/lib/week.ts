import type { Progress } from "@/lib/types";

export const TOTAL_WEEKS = 16;
export const CORE_WEEKS = 12;

function localDay(d: Date): number {
  return Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
}

export function rawWeekNumber(startDate: string, now: Date): number {
  const [y, m, d] = startDate.split("-").map(Number);
  const start = Date.UTC(y, m - 1, d);
  const days = Math.floor((localDay(now) - start) / 86_400_000);
  return Math.floor(days / 7) + 1;
}

export function clampWeek(n: number): number {
  return Math.min(TOTAL_WEEKS, Math.max(1, n));
}

export function resolveCurrentWeek(
  p: Progress,
  now: Date,
): { week: number; source: "override" | "derived" | "unset"; complete: boolean } {
  if (!p.startDate) {
    if (p.weekOverride == null) return { week: 1, source: "unset", complete: false };
    return { week: clampWeek(p.weekOverride), source: "override", complete: false };
  }

  const raw = rawWeekNumber(p.startDate, now);
  const complete = raw > TOTAL_WEEKS;
  if (p.weekOverride != null) return { week: clampWeek(p.weekOverride), source: "override", complete };
  return { week: clampWeek(raw), source: "derived", complete };
}
