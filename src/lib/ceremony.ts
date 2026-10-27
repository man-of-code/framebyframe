/**
 * Opens the capstone ceremony only once its lazy chunk has loaded. `ceremonySeen` is recorded after the import
 * resolves, so a failed fetch (offline, or a stale chunk after a deploy) does not use up the once-only ceremony.
 */
export async function openCeremonyWhenLoaded(steps: {
  load: () => Promise<unknown>;
  see: () => boolean;
  open: () => void;
  fail: () => void;
}): Promise<void> {
  try {
    await steps.load();
  } catch {
    steps.fail();
    return;
  }
  if (steps.see()) steps.open();
}
