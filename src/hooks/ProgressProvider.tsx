import { createContext, useContext, type ReactNode } from "react";
import { useProgress } from "@/hooks/useProgress";

export type ProgressApi = ReturnType<typeof useProgress>;

const ProgressContext = createContext<ProgressApi | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const api = useProgress();
  return <ProgressContext.Provider value={api}>{children}</ProgressContext.Provider>;
}

export function useProgressContext(): ProgressApi {
  const api = useContext(ProgressContext);
  if (api === null) throw new Error("useProgressContext requires ProgressProvider");
  return api;
}

export function WithProgress({ children }: { children: (api: ProgressApi) => ReactNode }) {
  const api = useContext(ProgressContext);
  if (api) return children(api);
  return <ProgressFallback>{children}</ProgressFallback>;
}

function ProgressFallback({ children }: { children: (api: ProgressApi) => ReactNode }) {
  const api = useProgress();
  return children(api);
}
