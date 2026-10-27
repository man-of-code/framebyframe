import { describe, expect, it } from "vitest";
import { content } from "@/content";
import {
  checkId,
  clampWeek,
  formatHours,
  nextIncompleteTasks,
  rawWeekNumber,
  resolveCurrentWeek,
  weekCompletion,
  weekMinutes,
} from "@/lib/week";
import type { Week } from "@/lib/types";
import { emptyProgress } from "@/lib/progress";

const at = (iso: string) => new Date(`${iso}T12:00:00`);

describe("rawWeekNumber", () => {
  it("is week 1 on the start date", () => {
    expect(rawWeekNumber("2026-10-22", at("2026-10-22"))).toBe(1);
  });

  it("stays week 1 through day six", () => {
    expect(rawWeekNumber("2026-10-22", at("2026-10-28"))).toBe(1);
  });

  it("rolls to week 2 on day seven", () => {
    expect(rawWeekNumber("2026-10-22", at("2026-10-29"))).toBe(2);
  });

  it("returns below one for a future start date", () => {
    expect(rawWeekNumber("2026-11-01", at("2026-10-22"))).toBeLessThan(1);
  });

  it("returns above sixteen past the end", () => {
    expect(rawWeekNumber("2026-01-01", at("2026-10-22"))).toBeGreaterThan(16);
  });
});

describe("clampWeek", () => {
  it("clamps both ends", () => {
    expect(clampWeek(0)).toBe(1);
    expect(clampWeek(-4)).toBe(1);
    expect(clampWeek(17)).toBe(16);
    expect(clampWeek(7)).toBe(7);
  });
});

describe("resolveCurrentWeek", () => {
  it("is unset with no start date", () => {
    expect(resolveCurrentWeek(emptyProgress, at("2026-10-22"))).toEqual({ week: 1, source: "unset", complete: false });
  });

  it("derives from the start date", () => {
    const p = { ...emptyProgress, startDate: "2026-10-22" };
    expect(resolveCurrentWeek(p, at("2026-11-05"))).toEqual({ week: 3, source: "derived", complete: false });
  });

  it("lets the override win over the derived week", () => {
    const p = { ...emptyProgress, startDate: "2026-10-22", weekOverride: 9 };
    expect(resolveCurrentWeek(p, at("2026-11-05"))).toEqual({ week: 9, source: "override", complete: false });
  });

  it("flags completion past week sixteen but still returns a valid week", () => {
    const p = { ...emptyProgress, startDate: "2026-01-01" };
    const r = resolveCurrentWeek(p, at("2026-10-22"));
    expect(r.complete).toBe(true);
    expect(r.week).toBe(16);
  });

  it("clamps a future start date to week one without flagging completion", () => {
    const p = { ...emptyProgress, startDate: "2026-12-01" };
    expect(resolveCurrentWeek(p, at("2026-10-22"))).toEqual({ week: 1, source: "derived", complete: false });
  });

  it("ignores an out-of-range override", () => {
    const p = { ...emptyProgress, startDate: "2026-10-22", weekOverride: 99 };
    expect(resolveCurrentWeek(p, at("2026-10-22")).week).toBe(16);
  });
});

describe("nextIncompleteTasks", () => {
  const week = content.weeks[0];

  it("returns the first incomplete tasks in week order", () => {
    const progress = { ...emptyProgress, done: { [week.tasks[0].id]: true } };
    expect(nextIncompleteTasks(week, progress, 2).map((task) => task.id)).toEqual([
      week.tasks[1].id,
      week.tasks[2].id,
    ]);
  });

  it("stops at the limit when nothing is done", () => {
    expect(nextIncompleteTasks(week, emptyProgress, 1)).toEqual([week.tasks[0]]);
  });
});

describe("weekCompletion", () => {
  const core = { id: "c", kind: "do" as const, text: "core", resourceIds: [], minutes: 60, core: true };
  const stretch = { ...core, id: "s", core: false, minutes: 30 };
  const week: Week = {
    n: 3, module: 1, title: "W", topics: [], tasks: [core, stretch],
    assignment: { id: "a", text: "x", checks: ["one", "two"] }, community: "",
  };
  const buffer: Week = { ...week, n: 13, module: 0, tasks: [], extension: true };

  it("needs every core task and every done-when check, and ignores stretch", () => {
    const tasksOnly = { ...emptyProgress, done: { c: true, s: true } };
    expect(weekCompletion(week, tasksOnly)).toEqual({ done: 1, total: 3, complete: false });
    const all = { ...emptyProgress, done: { c: true, [checkId("a", 0)]: true, [checkId("a", 1)]: true } };
    expect(weekCompletion(week, all).complete).toBe(true);
  });

  it("completes a week with no tasks on its checks alone", () => {
    expect(weekCompletion(buffer, emptyProgress)).toEqual({ done: 0, total: 2, complete: false });
    const checks = { ...emptyProgress, done: { [checkId("a", 0)]: true, [checkId("a", 1)]: true } };
    expect(weekCompletion(buffer, checks).complete).toBe(true);
  });

  it("counts minutes across all tasks, stretch included", () => {
    expect(weekMinutes(week)).toBe(90);
    expect(formatHours(90)).toBe("1h 30m");
    expect(formatHours(480)).toBe("8h");
  });
});
