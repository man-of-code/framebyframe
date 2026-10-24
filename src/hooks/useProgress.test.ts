import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProgress } from "@/hooks/useProgress";
import { STORAGE_KEY, emptyProgress } from "@/lib/progress";

describe("useProgress", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it("reads stored progress once and does not write while idle", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ ...emptyProgress, done: { t1: true }, startDate: "2026-10-22" }),
    );
    const { result } = renderHook(() => useProgress());
    expect(result.current.status).toBe("ok");
    expect(result.current.progress.done.t1).toBe(true);
    expect(result.current.progress.startDate).toBe("2026-10-22");
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).done).toEqual({ t1: true });
  });

  it("debounces writes by 300ms and keeps the latest change", () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.status).toBe("empty");
    act(() => {
      result.current.toggle("a");
      result.current.toggle("b");
    });
    expect(result.current.progress.done).toEqual({ a: true, b: true });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    act(() => {
      vi.advanceTimersByTime(299);
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).done).toEqual({ a: true, b: true });
  });

  it("flushes a pending write on unmount", () => {
    const { result, unmount } = renderHook(() => useProgress());
    act(() => {
      result.current.toggle("t1");
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    unmount();
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).done.t1).toBe(true);
  });

  it("marks status unavailable when a debounced write throws", () => {
    const { result } = renderHook(() => useProgress());
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    act(() => {
      result.current.toggle("t1");
    });
    expect(result.current.progress.done.t1).toBe(true);
    expect(result.current.status).toBe("empty");
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.status).toBe("unavailable");
  });

  it("returns to ok after a later write succeeds", () => {
    const { result } = renderHook(() => useProgress());
    const setItem = vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota");
    });
    act(() => {
      result.current.toggle("t1");
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.status).toBe("unavailable");
    setItem.mockRestore();
    act(() => {
      result.current.toggle("t2");
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(result.current.status).toBe("ok");
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).done).toEqual({ t1: true, t2: true });
  });

  it("flushes a pending write when the page hides", () => {
    const { result } = renderHook(() => useProgress());
    act(() => {
      result.current.toggle("t1");
    });
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    act(() => {
      window.dispatchEvent(new Event("pagehide"));
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).done.t1).toBe(true);
  });

  it("reports unavailable when storage throws on read", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    const { result } = renderHook(() => useProgress());
    expect(result.current.status).toBe("unavailable");
    expect(result.current.progress).toEqual(emptyProgress);
  });

  it("persists notes, stages, start date, override, and replace", () => {
    const { result } = renderHook(() => useProgress());
    act(() => {
      result.current.note("a1", "hello");
      result.current.stage("script", "doing");
      result.current.setStartDate("2026-10-22");
      result.current.setWeekOverride(9);
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!)).toMatchObject({
      notes: { a1: "hello" },
      capstone: { script: "doing" },
      startDate: "2026-10-22",
      weekOverride: 9,
    });

    act(() => {
      result.current.setWeekOverride(undefined);
      result.current.replace({ ...emptyProgress, done: { z: true }, startDate: "2026-10-22" });
    });
    act(() => {
      vi.advanceTimersByTime(300);
    });
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(stored.done).toEqual({ z: true });
    expect(stored.weekOverride).toBeUndefined();
    expect(stored.startDate).toBe("2026-10-22");
    expect(stored.notes).toEqual({});
  });
});
