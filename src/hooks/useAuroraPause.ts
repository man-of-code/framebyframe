import { useEffect, type RefObject } from "react";

/**
 * Pauses a live aurora (`.aurora--live`) while it is off-screen or the tab is hidden, by setting
 * `data-paused` (aurora.css reads it as `animation-play-state`). Design system 5.4 and 7.4 rule 4.
 */
export function useAuroraPause(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    let visible = true;
    const apply = () => {
      el.dataset.paused = String(!visible || document.hidden);
    };
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry?.isIntersecting ?? true;
      apply();
    });
    observer.observe(el);
    document.addEventListener("visibilitychange", apply);
    return () => {
      observer.disconnect();
      document.removeEventListener("visibilitychange", apply);
    };
  }, [ref]);
}
