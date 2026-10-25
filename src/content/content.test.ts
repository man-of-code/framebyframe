import { describe, expect, it } from "vitest";
import { content } from "@/content";

describe("content integrity", () => {
  it("has all sixteen weeks exactly once", () => {
    const ns = content.weeks.map((w) => w.n).sort((a, b) => a - b);
    expect(ns).toEqual(Array.from({ length: 16 }, (_, i) => i + 1));
  });

  it("gives every assignment at least two checks", () => {
    for (const w of content.weeks) expect(w.assignment.checks.length).toBeGreaterThanOrEqual(2);
  });

  it("gives every core week watch, read and do work", () => {
    for (const w of content.weeks.filter((x) => !x.extension)) {
      for (const kind of ["watch", "read", "do"] as const) {
        const has = w.tasks.some((t) => t.kind === kind) || (w.gapIds ?? []).length > 0;
        expect(has, `week ${w.n} is missing ${kind}`).toBe(true);
      }
    }
  });

  it("gives every resource a cost and a verified date", () => {
    for (const r of content.resources) {
      expect(r.cost, r.id).toBeTruthy();
      expect(r.verified, r.id).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it("marks weeks 3 and 8 heavy", () => {
    for (const n of [3, 8]) expect(content.weeks.find((w) => w.n === n)?.heavy).toBe(true);
  });

  it("names a first week for every tool", () => {
    for (const t of content.tools) expect(t.firstWeek).toBeGreaterThanOrEqual(1);
  });

  it("does not ship HitFilm", () => {
    const all = JSON.stringify(content).toLowerCase();
    expect(all.includes("hitfilm")).toBe(false);
  });
});
