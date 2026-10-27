import { startTransition, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import {
  emptyProgress,
  loadProgress,
  saveProgress,
  setCapstoneStage,
  setNote,
  setStartDate as writeStartDate,
  setWeekOverride as writeWeekOverride,
  toggleDone,
  type LoadStatus,
} from "@/lib/progress";
import type { Progress } from "@/lib/types";

const SAVE_MS = 300;

export function useProgress(): {
  progress: Progress;
  status: LoadStatus;
  toggle: (id: string) => void;
  note: (id: string, text: string) => void;
  stage: (id: string, s: "todo" | "doing" | "done") => void;
  setStartDate: (startDate: string) => void;
  setWeekOverride: (week: number | undefined) => void;
  replace: (progress: Progress) => void;
  seeCeremony: () => boolean;
} {
  const hydrated = useHydrated();
  // The prerender and the hydration render use a neutral snapshot ("empty", never "unavailable", so no read-only
  // banner ships in the HTML); storage is read right after hydration. A plain client render reads it at once.
  const [state, setState] = useState<{ progress: Progress; status: LoadStatus }>(() =>
    hydrated ? loadProgress() : { progress: emptyProgress, status: "empty" },
  );
  const progressRef = useRef(state.progress);
  const loaded = useRef(hydrated);
  const pending = useRef<Progress | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loaded.current) return;
    loaded.current = true;
    const stored = loadProgress();
    progressRef.current = stored.progress;
    // A transition, so a route boundary still waiting for its lazy chunk finishes hydrating before this update
    // reaches it; an urgent update there would throw the server HTML away and client-render the boundary.
    startTransition(() => setState(stored));
  }, []);

  const reportSave = useCallback((result: "ok" | "unavailable") => {
    setState((current) => {
      if (result === "unavailable") {
        return current.status === "unavailable"
          ? current
          : { progress: current.progress, status: "unavailable" };
      }
      return current.status === "unavailable"
        ? { progress: current.progress, status: "ok" }
        : current;
    });
  }, []);

  const flush = useCallback((report: boolean) => {
    if (timer.current !== null) {
      clearTimeout(timer.current);
      timer.current = null;
    }
    const queued = pending.current;
    pending.current = null;
    if (!queued) return;
    const result = saveProgress(queued);
    if (report) reportSave(result);
  }, [reportSave]);

  const write = useCallback((next: Progress) => {
    progressRef.current = next;
    pending.current = next;
    setState((current) => ({ status: current.status, progress: next }));
    if (timer.current !== null) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      flush(true);
    }, SAVE_MS);
  }, [flush]);

  useEffect(() => {
    const onHide = () => flush(true);
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      flush(false);
    };
  }, [flush]);

  const toggle = useCallback((id: string) => {
    write(toggleDone(progressRef.current, id));
  }, [write]);

  const note = useCallback((id: string, text: string) => {
    write(setNote(progressRef.current, id, text));
  }, [write]);

  const stage = useCallback((id: string, s: "todo" | "doing" | "done") => {
    write(setCapstoneStage(progressRef.current, id, s));
  }, [write]);

  const setStartDate = useCallback((startDate: string) => {
    write(writeStartDate(progressRef.current, startDate));
  }, [write]);

  const setWeekOverride = useCallback((week: number | undefined) => {
    write(writeWeekOverride(progressRef.current, week));
  }, [write]);

  const replace = useCallback((progress: Progress) => {
    write(progress);
  }, [write]);

  const seeCeremony = useCallback(() => {
    const current = progressRef.current;
    if (current.ceremonySeen) return false;
    write({ ...current, ceremonySeen: true });
    return true;
  }, [write]);

  // Stable while nothing changed, so the re-render when hydration ends (useHydrated) is not a context update.
  return useMemo(
    () => ({
      progress: state.progress,
      status: state.status,
      toggle,
      note,
      stage,
      setStartDate,
      setWeekOverride,
      replace,
      seeCeremony,
    }),
    [state, toggle, note, stage, setStartDate, setWeekOverride, replace, seeCeremony],
  );
}
