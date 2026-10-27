import type { Progress, Task, Week } from "@/lib/types";

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

/** Done-when check ids; the export format depends on this exact shape. */
export function checkId(assignmentId: string, index: number): string {
  return `${assignmentId}:check:${index}`;
}

/** A week is complete when every core task and every done-when check is done. */
export function weekCompletion(week: Week, progress: Progress): { done: number; total: number; complete: boolean } {
  const ids = [
    ...week.tasks.filter((task) => task.core).map((task) => task.id),
    ...week.assignment.checks.map((_, index) => checkId(week.assignment.id, index)),
  ];
  let done = 0;
  for (const id of ids) if (progress.done[id] === true) done += 1;
  return { done, total: ids.length, complete: ids.length > 0 && done === ids.length };
}

/** All task minutes, stretch included: the ledger's stated estimate for the week. */
export function weekMinutes(week: Week): number {
  return week.tasks.reduce((sum, task) => sum + task.minutes, 0);
}

export function formatHours(minutes: number): string {
  if (minutes <= 0) return "0h";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

export function nextIncompleteTasks(week: Week, progress: Progress, limit: number): Task[] {
  if (limit <= 0) return [];
  const pending: Task[] = [];
  for (const task of week.tasks) {
    if (progress.done[task.id] === true) continue;
    pending.push(task);
    if (pending.length === limit) break;
  }
  return pending;
}
