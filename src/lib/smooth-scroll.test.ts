import { describe, expect, it } from "vitest";
import { shouldSmoothScroll, type SmoothScrollEnv } from "./smooth-scroll";

const desktop: SmoothScrollEnv = { reducedMotion: false, narrow: false, coarsePointer: false, saveData: false };

describe("shouldSmoothScroll", () => {
  it("runs on a desktop with no restrictions", () => {
    expect(shouldSmoothScroll(desktop)).toBe(true);
  });

  it.each(["reducedMotion", "narrow", "coarsePointer", "saveData"] as const)(
    "does not run when %s is set",
    (key) => {
      expect(shouldSmoothScroll({ ...desktop, [key]: true })).toBe(false);
    },
  );
});
