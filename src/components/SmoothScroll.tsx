import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { shouldSmoothScroll } from "@/lib/smooth-scroll";
import "lenis/dist/lenis.css";

type LenisInstance = {
  destroy: () => void;
  scrollTo: (target: number | string, options?: { immediate?: boolean }) => void;
};

export function SmoothScroll() {
  const { pathname, hash } = useLocation();
  const lenisRef = useRef<LenisInstance | null>(null);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const narrow = window.matchMedia("(max-width: 767px)");
    const coarse = window.matchMedia("(pointer: coarse)");
    const connection = (navigator as Navigator & {
      connection?: EventTarget & { saveData?: boolean };
    }).connection;
    let cancelled = false;
    let instance: LenisInstance | null = null;

    const allowed = () =>
      shouldSmoothScroll({
        reducedMotion: reduced.matches,
        narrow: narrow.matches,
        coarsePointer: coarse.matches,
        saveData: connection?.saveData === true,
      });

    async function mount() {
      if (instance || !allowed() || cancelled) return;
      const { default: Lenis } = await import("lenis");
      if (instance || cancelled || !allowed()) return;
      instance = new Lenis({ autoRaf: true, respectReducedMotion: true });
      lenisRef.current = instance;
    }

    function onChange() {
      if (allowed()) {
        void mount();
        return;
      }
      instance?.destroy();
      instance = null;
      lenisRef.current = null;
    }

    void mount();
    const sources: EventTarget[] = [reduced, narrow, coarse];
    if (connection) sources.push(connection);
    for (const source of sources) source.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      for (const source of sources) source.removeEventListener("change", onChange);
      instance?.destroy();
      instance = null;
      lenisRef.current = null;
    };
  }, []);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (hash) {
      if (lenis) lenis.scrollTo(hash, { immediate: true });
      else document.querySelector(hash)?.scrollIntoView();
      return;
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}
