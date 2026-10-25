import { useEffect, useState } from "react";

const SAMPLE_MS = 2000;
const MIN_FPS = 30;

export function useFpsGuard(enabled: boolean): boolean {
  const [healthy, setHealthy] = useState(true);

  useEffect(() => {
    if (!enabled) return undefined;
    let raf = 0;
    let last = 0;
    let elapsed = 0;
    let frames = 0;

    const tick = (now: number) => {
      if (document.hidden) {
        last = 0;
        raf = requestAnimationFrame(tick);
        return;
      }
      if (last !== 0) {
        elapsed += now - last;
        frames += 1;
      }
      last = now;
      if (elapsed >= SAMPLE_MS) {
        const fps = frames > 0 ? (frames * 1000) / elapsed : 0;
        if (fps < MIN_FPS) setHealthy(false);
        return;
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [enabled]);

  return healthy;
}
