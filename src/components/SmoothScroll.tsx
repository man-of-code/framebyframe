import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import "lenis/dist/lenis.css";

type LenisInstance = {
  destroy: () => void;
  scrollTo: (target: number | string, options?: { immediate?: boolean }) => void;
};

export function SmoothScroll() {
  const { pathname, hash } = useLocation();
  const lenisRef = useRef<LenisInstance | null>(null);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cancelled = false;
    let instance: LenisInstance | null = null;

    async function mount() {
      if (media.matches || cancelled) return;
      const { default: Lenis } = await import("lenis");
      if (cancelled || media.matches) return;
      instance = new Lenis({ autoRaf: true, respectReducedMotion: true });
      lenisRef.current = instance;
    }

    void mount();

    function onChange() {
      if (!media.matches) {
        void mount();
        return;
      }
      instance?.destroy();
      instance = null;
      lenisRef.current = null;
    }

    media.addEventListener("change", onChange);
    return () => {
      cancelled = true;
      media.removeEventListener("change", onChange);
      instance?.destroy();
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
