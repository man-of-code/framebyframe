import { useCallback, useEffect, useState } from "react";
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
  const [theme, setThemeState] = useState<Theme>(readStoredTheme);
  const [prefersDark, setPrefersDark] = useState(osPrefersDark);
  const resolved = resolveTheme(theme, prefersDark);

  useEffect(() => {
    applyTheme(resolved, document.documentElement);
  }, [resolved]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: light)");
    const onChange = () => setPrefersDark(!query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_KEY, next);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return { theme, resolved, setTheme };
}
