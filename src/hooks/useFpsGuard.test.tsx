import { renderHook, act } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useFpsGuard } from "@/hooks/useFpsGuard";

function installClock() {
  const queue: FrameRequestCallback[] = [];
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    queue.push(cb);
    return queue.length;
  });
  vi.stubGlobal("cancelAnimationFrame", vi.fn());
  return {
    step(delta: number, clock: { t: number }) {
      const cb = queue.shift();
      if (!cb) throw new Error("no frame was scheduled");
      clock.t += delta;
      cb(clock.t);
    },
    queued() {
      return queue.length;
    },
  };
}

describe("useFpsGuard", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  function pump(clock: ReturnType<typeof installClock>, delta: number, now: { t: number }) {
    let spins = 0;
    while (clock.queued() > 0 && spins < 400) {
      clock.step(delta, now);
      spins += 1;
    }
  }

  it("stays true when the 2s mean is at least 30fps", () => {
    const clock = installClock();
    const now = { t: 0 };
    const { result } = renderHook(() => useFpsGuard(true));
    expect(result.current).toBe(true);

    act(() => pump(clock, 16, now));

    expect(now.t).toBeGreaterThanOrEqual(2000);
    expect(result.current).toBe(true);
    expect(clock.queued()).toBe(0);
  });

  it("returns false once the 2s mean falls below 30fps", () => {
    const clock = installClock();
    const now = { t: 0 };
    const { result } = renderHook(() => useFpsGuard(true));

    act(() => pump(clock, 50, now));

    expect(now.t).toBeGreaterThanOrEqual(2000);
    expect(result.current).toBe(false);
    expect(clock.queued()).toBe(0);
  });

  it("does not sample while disabled", () => {
    const clock = installClock();
    renderHook(() => useFpsGuard(false));
    expect(clock.queued()).toBe(0);
  });

  it("does not treat a hidden-tab gap as a slow frame", () => {
    const clock = installClock();
    const now = { t: 0 };
    const hidden = { value: false };
    Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden.value });
    const { result } = renderHook(() => useFpsGuard(true));

    act(() => {
      clock.step(16, now);
      hidden.value = true;
      clock.step(5000, now);
      hidden.value = false;
      let spins = 0;
      while (clock.queued() > 0 && spins < 400) {
        clock.step(16, now);
        spins += 1;
      }
    });

    expect(result.current).toBe(true);
    expect(clock.queued()).toBe(0);
  });
});
