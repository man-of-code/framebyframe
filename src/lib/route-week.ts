import { TOTAL_WEEKS } from "@/lib/week";

export function parseWeekParam(n: string | undefined): number | null {
  if (!n || !/^\d+$/.test(n)) return null;
  const week = Number(n);
  if (week < 1 || week > TOTAL_WEEKS) return null;
  return week;
}
