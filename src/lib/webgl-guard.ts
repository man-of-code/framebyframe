export type CanvasEnv = {
  reducedMotion: boolean;
  width: number;
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

export function shouldRenderCanvas(env: CanvasEnv): boolean {
  if (env.reducedMotion) return false;
  if (env.width < 768) return false;
  if (env.cores !== undefined && env.cores <= 4) return false;
  if (env.memory !== undefined && env.memory <= 4) return false;
  if (env.saveData === true) return false;
  return true;
}
