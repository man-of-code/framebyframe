import type { Progress } from "@/lib/types";

export const STORAGE_KEY = "fbf:progress:v1";

function blankProgress(): Progress {
  return { version: 1, done: {}, notes: {}, capstone: {} };
}

export const emptyProgress: Progress = blankProgress();

export type LoadStatus = "ok" | "empty" | "corrupt" | "unavailable";

function storageOf(storage: Storage | null | undefined): Storage | null {
  if (storage !== undefined) return storage;
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Object.prototype.toString.call(value) === "[object Object]";
}

function isStage(value: unknown): value is "todo" | "doing" | "done" {
  return value === "todo" || value === "doing" || value === "done";
}

function copyProgress(raw: Record<string, unknown>): Progress {
  const progress: Progress = {
    version: 1,
    done: {},
    notes: {},
    capstone: {},
  };
  for (const [id, value] of Object.entries(raw.done as Record<string, unknown>)) {
    if (typeof value === "boolean") progress.done[id] = value;
  }
  for (const [id, value] of Object.entries(raw.notes as Record<string, unknown>)) {
    if (typeof value === "string") progress.notes[id] = value;
  }
  for (const [id, value] of Object.entries(raw.capstone as Record<string, unknown>)) {
    if (isStage(value)) progress.capstone[id] = value;
  }
  if (typeof raw.startDate === "string") progress.startDate = raw.startDate;
  if (typeof raw.weekOverride === "number" && Number.isFinite(raw.weekOverride)) {
    progress.weekOverride = raw.weekOverride;
  }
  if (raw.theme === "dark" || raw.theme === "light" || raw.theme === "system") {
    progress.theme = raw.theme;
  }
  if (typeof raw.ceremonySeen === "boolean") progress.ceremonySeen = raw.ceremonySeen;
  return progress;
}

export function loadProgress(storage?: Storage | null): { progress: Progress; status: LoadStatus } {
  const store = storageOf(storage);
  if (!store) return { progress: blankProgress(), status: "unavailable" };
  let raw: string | null;
  try {
    raw = store.getItem(STORAGE_KEY);
  } catch {
    return { progress: blankProgress(), status: "unavailable" };
  }
  if (raw === null) return { progress: blankProgress(), status: "empty" };
  const imported = importProgress(raw);
  if (!imported.ok) return { progress: blankProgress(), status: "corrupt" };
  return { progress: imported.progress, status: "ok" };
}

export function saveProgress(p: Progress, storage?: Storage | null): "ok" | "unavailable" {
  const store = storageOf(storage);
  if (!store) return "unavailable";
  try {
    store.setItem(STORAGE_KEY, exportProgress(p));
    return "ok";
  } catch {
    return "unavailable";
  }
}

export function toggleDone(p: Progress, id: string): Progress {
  return { ...p, done: { ...p.done, [id]: p.done[id] !== true } };
}

export function setNote(p: Progress, id: string, text: string): Progress {
  return { ...p, notes: { ...p.notes, [id]: text } };
}

export function setCapstoneStage(
  p: Progress,
  id: string,
  stage: "todo" | "doing" | "done",
): Progress {
  return { ...p, capstone: { ...p.capstone, [id]: stage } };
}

export function setStartDate(p: Progress, startDate: string): Progress {
  return { ...p, startDate };
}

export function setWeekOverride(p: Progress, week: number | undefined): Progress {
  if (week === undefined) {
    const next: Progress = { ...p };
    delete next.weekOverride;
    return next;
  }
  return { ...p, weekOverride: week };
}

export function exportProgress(p: Progress): string {
  return JSON.stringify(p);
}

export function importProgress(
  json: string,
): { ok: true; progress: Progress } | { ok: false; reason: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    return { ok: false, reason: "invalid JSON" };
  }
  if (!isRecord(parsed)) return { ok: false, reason: "progress must be an object" };
  if (parsed.version !== 1) {
    return { ok: false, reason: `expected version 1, got ${String(parsed.version)}` };
  }
  if (!isRecord(parsed.done)) return { ok: false, reason: "done must be an object" };
  if (!isRecord(parsed.notes)) return { ok: false, reason: "notes must be an object" };
  if (!isRecord(parsed.capstone)) return { ok: false, reason: "capstone must be an object" };
  return { ok: true, progress: copyProgress(parsed) };
}

export function countDone(p: Progress, ids: string[]): number {
  let count = 0;
  for (const id of ids) if (p.done[id] === true) count += 1;
  return count;
}
