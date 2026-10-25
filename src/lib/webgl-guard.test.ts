import { beforeEach, describe, expect, it } from "vitest";
import { acquireWebglSlot, releaseWebglSlot, shouldRenderCanvas } from "@/lib/webgl-guard";

const env = { reducedMotion: false, width: 1440, cores: 8, memory: 8, saveData: false };

describe("single-surface lock", () => {
  beforeEach(() => releaseWebglSlot("hero"));

  it("grants the first claim and refuses the second", () => {
    expect(acquireWebglSlot("hero")).toBe(true);
    expect(acquireWebglSlot("ceremony")).toBe(false);
  });

  it("grants again after release", () => {
    acquireWebglSlot("hero");
    releaseWebglSlot("hero");
    expect(acquireWebglSlot("ceremony")).toBe(true);
    releaseWebglSlot("ceremony");
  });
});

describe("shouldRenderCanvas", () => {
  it("allows a capable desktop", () => expect(shouldRenderCanvas(env)).toBe(true));
  it("refuses reduced motion", () => expect(shouldRenderCanvas({ ...env, reducedMotion: true })).toBe(false));
  it("refuses narrow viewports", () => expect(shouldRenderCanvas({ ...env, width: 480 })).toBe(false));
  it("refuses low core counts", () => expect(shouldRenderCanvas({ ...env, cores: 4 })).toBe(false));
  it("refuses low memory", () => expect(shouldRenderCanvas({ ...env, memory: 4 })).toBe(false));
  it("refuses save-data", () => expect(shouldRenderCanvas({ ...env, saveData: true })).toBe(false));
  it("allows when optional hints are absent", () => {
    expect(shouldRenderCanvas({ reducedMotion: false, width: 1440 })).toBe(true);
  });
});
