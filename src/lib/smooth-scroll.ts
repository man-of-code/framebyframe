export type SmoothScrollEnv = {
  reducedMotion: boolean;
  /** `(max-width: 767px)` */
  narrow: boolean;
  /** `(pointer: coarse)` */
  coarsePointer: boolean;
  /** `navigator.connection.saveData` */
  saveData: boolean;
};

/** design-system §7.4 rules 2 and 6: Lenis runs only on desktop-class, motion-tolerant, data-unrestricted devices. */
export function shouldSmoothScroll(env: SmoothScrollEnv): boolean {
  return !(env.reducedMotion || env.narrow || env.coarsePointer || env.saveData);
}
