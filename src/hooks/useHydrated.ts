import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * False in the build-time prerender and during the hydration render; true for every other client render,
 * including the first render of a `createRoot` app. Per-user state (storage, viewport) is read only when true,
 * so the server HTML and the hydration render agree. React re-renders hydrated components once with `true`.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
}
