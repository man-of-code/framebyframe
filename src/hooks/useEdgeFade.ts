import { useEffect, type RefObject } from "react";

/**
 * Marks which ends of a horizontal scroller still have content beyond them (`data-fade-start`, `data-fade-end`),
 * so CSS can fade only the overflowing side(s) (design-system.md 6, R4 critique: landing module strip).
 */
export function useEdgeFade(ref: RefObject<HTMLElement | null>): void {
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const update = () => {
      const max = el.scrollWidth - el.clientWidth;
      el.dataset.fadeStart = String(el.scrollLeft > 1);
      el.dataset.fadeEnd = String(el.scrollLeft < max - 1);
    };
    update();
    el.addEventListener("scroll", update, { passive: true });
    const resize = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(update);
    resize?.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      resize?.disconnect();
    };
  }, [ref]);
}
