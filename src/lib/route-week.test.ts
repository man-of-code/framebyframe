import { describe, expect, it } from "vitest";
import { parseWeekParam } from "@/lib/route-week";

describe("parseWeekParam", () => {
  it("accepts weeks 1 through 16", () => {
    expect(parseWeekParam("1")).toBe(1);
    expect(parseWeekParam("16")).toBe(16);
  });

  it("rejects a week outside 1–16", () => {
    expect(parseWeekParam("0")).toBeNull();
    expect(parseWeekParam("17")).toBeNull();
  });

  it("rejects a non-integer segment", () => {
    expect(parseWeekParam("foo")).toBeNull();
    expect(parseWeekParam("1.5")).toBeNull();
    expect(parseWeekParam(undefined)).toBeNull();
  });
});
