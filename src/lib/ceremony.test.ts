import { describe, expect, it, vi } from "vitest";
import { openCeremonyWhenLoaded } from "./ceremony";

describe("openCeremonyWhenLoaded", () => {
  it("records the ceremony as seen and opens it only after the chunk loads", async () => {
    const order: string[] = [];
    await openCeremonyWhenLoaded({
      load: async () => { order.push("load"); },
      see: () => { order.push("see"); return true; },
      open: () => order.push("open"),
      fail: () => order.push("fail"),
    });
    expect(order).toEqual(["load", "see", "open"]);
  });

  it("does not mark the ceremony seen when the chunk fails, and reports the failure", async () => {
    const see = vi.fn(() => true);
    const open = vi.fn();
    const fail = vi.fn();
    await openCeremonyWhenLoaded({ load: () => Promise.reject(new Error("Failed to fetch dynamically imported module")), see, open, fail });
    expect(see).not.toHaveBeenCalled();
    expect(open).not.toHaveBeenCalled();
    expect(fail).toHaveBeenCalledTimes(1);
  });

  it("does not open a ceremony that was already seen", async () => {
    const open = vi.fn();
    await openCeremonyWhenLoaded({ load: async () => {}, see: () => false, open, fail: vi.fn() });
    expect(open).not.toHaveBeenCalled();
  });
});
