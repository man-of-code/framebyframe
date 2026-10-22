import { beforeEach, describe, expect, it } from "vitest";
import {
  STORAGE_KEY, emptyProgress, loadProgress, saveProgress, toggleDone,
  setNote, setCapstoneStage, exportProgress, importProgress, countDone,
} from "@/lib/progress";

function memoryStorage(): Storage {
  const map = new Map<string, string>();
  return {
    get length() { return map.size; },
    clear: () => map.clear(),
    getItem: (k) => map.get(k) ?? null,
    key: (i) => [...map.keys()][i] ?? null,
    removeItem: (k) => { map.delete(k); },
    setItem: (k, v) => { map.set(k, v); },
  } as Storage;
}

describe("progress", () => {
  let store: Storage;
  beforeEach(() => { store = memoryStorage(); });

  it("reports empty when nothing is stored", () => {
    expect(loadProgress(store)).toEqual({ progress: emptyProgress, status: "empty" });
  });

  it("round-trips through storage", () => {
    const p = toggleDone(emptyProgress, "t1");
    expect(saveProgress(p, store)).toBe("ok");
    expect(loadProgress(store)).toEqual({ progress: p, status: "ok" });
  });

  it("reports unavailable instead of throwing when storage fails", () => {
    const broken = { ...memoryStorage(), setItem() { throw new Error("quota"); } } as Storage;
    expect(saveProgress(emptyProgress, broken)).toBe("unavailable");
    expect(loadProgress(null).status).toBe("unavailable");
  });

  it("reports corrupt and falls back to empty on bad JSON", () => {
    store.setItem(STORAGE_KEY, "{not json");
    const { progress, status } = loadProgress(store);
    expect(status).toBe("corrupt");
    expect(progress).toEqual(emptyProgress);
  });

  it("toggles a task on and off without mutating the input", () => {
    const on = toggleDone(emptyProgress, "t1");
    expect(on.done.t1).toBe(true);
    expect(emptyProgress.done.t1).toBeUndefined();
    expect(toggleDone(on, "t1").done.t1).toBe(false);
  });

  it("stores notes and capstone stages", () => {
    expect(setNote(emptyProgress, "a1", "hello").notes.a1).toBe("hello");
    expect(setCapstoneStage(emptyProgress, "script", "doing").capstone.script).toBe("doing");
  });

  it("counts only ids that are currently true", () => {
    const p = toggleDone(toggleDone(emptyProgress, "a"), "b");
    expect(countDone(p, ["a", "b", "c"])).toBe(2);
    expect(countDone(toggleDone(p, "b"), ["a", "b"])).toBe(1);
  });

  it("imports what it exports", () => {
    const p = setNote(toggleDone(emptyProgress, "t1"), "a1", "note");
    const result = importProgress(exportProgress(p));
    expect(result).toEqual({ ok: true, progress: p });
  });

  it("rejects an import with the wrong version, naming both versions", () => {
    const result = importProgress(JSON.stringify({ ...emptyProgress, version: 2 }));
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.reason).toMatch(/2.*1|1.*2/);
  });

  it("rejects malformed import without throwing", () => {
    expect(importProgress("[]").ok).toBe(false);
    expect(importProgress("{bad").ok).toBe(false);
  });

  it("ignores orphan keys rather than failing", () => {
    const p = toggleDone(emptyProgress, "removed-task");
    expect(countDone(p, ["still-here"])).toBe(0);
  });
});
