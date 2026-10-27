/** The single constrained-device list of design-system.md 7.2 rule 1. */
export type CanvasEnv = {
  reducedMotion: boolean;
  width: number;
  coarse?: boolean;
  cores?: number;
  memory?: number;
  saveData?: boolean;
};

let holder: string | null = null;

export function acquireWebglSlot(name: string): boolean {
  if (holder !== null && holder !== name) {
    if (import.meta.env.DEV) {
      console.warn(`WebGL surface "${holder}" is mounted; refused "${name}".`);
    }
    return false;
  }
  holder = name;
  return true;
}

export function releaseWebglSlot(name: string): void {
  if (holder === name) holder = null;
}

/** True only when none of the 7.2 rule 1 conditions holds: live surfaces (CRT, SparkBadge, live aurora) may run. */
export function shouldRenderCanvas(env: CanvasEnv): boolean {
  if (env.reducedMotion) return false;
  if (env.width < 768) return false;
  if (env.coarse === true) return false;
  if (env.cores !== undefined && env.cores <= 4) return false;
  if (env.memory !== undefined && env.memory <= 4) return false;
  if (env.saveData === true) return false;
  return true;
}

function matches(query: string): boolean {
  return typeof window.matchMedia === "function" && window.matchMedia(query).matches;
}

/** Reads the 7.2 rule 1 conditions from the browser. */
export function readCanvasEnv(): CanvasEnv {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  return {
    reducedMotion: matches("(prefers-reduced-motion: reduce)"),
    width: window.innerWidth,
    coarse: matches("(pointer: coarse)"),
    cores: typeof navigator.hardwareConcurrency === "number" ? navigator.hardwareConcurrency : undefined,
    memory: typeof nav.deviceMemory === "number" ? nav.deviceMemory : undefined,
    saveData: nav.connection?.saveData,
  };
}
