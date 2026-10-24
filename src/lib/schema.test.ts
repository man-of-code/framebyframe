import { describe, expect, it } from "vitest";
import { validateContent } from "@/lib/schema";
import type { Content } from "@/lib/types";

const base: Content = { resources: [], weeks: [], gaps: [], tools: [], capstone: [] };

const resource = {
  id: "r1", title: "T", url: "https://example.com", type: "article" as const,
  topics: ["x"], weeks: [1], level: "beginner" as const, cost: "free" as const,
  language: "en", why: "because", verified: "2026-10-21",
};

const week = {
  n: 1, module: 1, title: "W1", topics: ["x"],
  tasks: [{ id: "t1", kind: "read" as const, text: "read it", resourceIds: ["r1"], minutes: 30, core: true }],
  assignment: { id: "a1", text: "do it", checks: ["check one", "check two"] },
  community: "r/Screenwriting",
};

describe("validateContent", () => {
  it("accepts well-formed content", () => {
    expect(validateContent({ ...base, resources: [resource], weeks: [week] })).toEqual([]);
  });

  it("rejects a resource with no verified date", () => {
    const bad = { ...resource, verified: "" };
    const issues = validateContent({ ...base, resources: [bad], weeks: [] });
    expect(issues.some((i) => i.where.includes("r1") && /verified/.test(i.message))).toBe(true);
  });

  it("rejects duplicate resource ids", () => {
    const issues = validateContent({ ...base, resources: [resource, { ...resource, title: "Other" }], weeks: [] });
    expect(issues.some((i) => i.kind === "duplicate-id")).toBe(true);
  });

  it("rejects a task referencing an unknown resource id", () => {
    const bad = { ...week, tasks: [{ ...week.tasks[0], resourceIds: ["nope"] }] };
    const issues = validateContent({ ...base, resources: [resource], weeks: [bad] });
    expect(issues.some((i) => i.kind === "unknown-resource" && i.where.includes("week 1"))).toBe(true);
  });

  it("rejects an assignment with fewer than two checks", () => {
    const bad = { ...week, assignment: { id: "a1", text: "do it", checks: ["only one"] } };
    const issues = validateContent({ ...base, resources: [resource], weeks: [bad] });
    expect(issues.some((i) => /two checks/.test(i.message))).toBe(true);
  });

  it("rejects a week outside 1-16", () => {
    const issues = validateContent({ ...base, resources: [resource], weeks: [{ ...week, n: 17 }] });
    expect(issues.length).toBeGreaterThan(0);
  });

  it("rejects an empty week with no declared gap", () => {
    const bad = { ...week, tasks: [], gapIds: undefined };
    const issues = validateContent({ ...base, resources: [resource], weeks: [bad] });
    expect(issues.some((i) => i.kind === "empty-week")).toBe(true);
  });

  it("accepts an empty week that declares a gap", () => {
    const gap = { id: "g1", scope: "week" as const, ref: "1", missing: "m", attempted: ["q"], note: "n" };
    const bad = { ...week, tasks: [], gapIds: ["g1"] };
    expect(validateContent({ ...base, resources: [resource], weeks: [bad], gaps: [gap] })).toEqual([]);
  });
});
