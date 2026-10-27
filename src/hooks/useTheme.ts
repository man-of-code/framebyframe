import { useCallback, useEffect, useMemo, useState } from "react";
import { useHydrated } from "@/hooks/useHydrated";
import { applyTheme, resolveTheme, THEME_KEY, type Theme } from "@/lib/theme";

function readStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === "dark" || stored === "light" || stored === "system") return stored;
  } catch {
    /* storage unavailable */
  }
  return "system";
}

function osPrefersDark(): boolean {
  return !window.matchMedia("(prefers-color-scheme: light)").matches;
}

export function useTheme(): {
  theme: Theme;
  resolved: "dark" | "light";
  setTheme: (theme: Theme) => void;
} {
  const hydrated = useHydrated();
  // Storage and the OS preference are read only once hydrated (the prerender and the hydration render show
  // "system"). The pre-paint script in index.html has already set the root class, so nothing is applied before.
  const initial = useMemo(
    () => (hydrated ? { theme: readStoredTheme(), osDark: osPrefersDark() } : null),
    [hydrated],
  );
  const [chosen, setChosen] = useState<Theme | null>(null);
  const [osChanged, setOsChanged] = useState<boolean | null>(null);
  const theme = chosen ?? initial?.theme ?? "system";
  const resolved = resolveTheme(theme, osChanged ?? initial?.osDark ?? true);

  useEffect(() => {
    if (hydrated) applyTheme(resolved, document.documentElement);
  }, [hydrated, resolved]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => setOsChanged(!query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setChosen(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return { theme, resolved, setTheme };
}
