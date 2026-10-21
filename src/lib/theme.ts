export type Theme = "dark" | "light" | "system";
export const THEME_KEY = "fbf:theme";

export function resolveTheme(pref: Theme, prefersDark: boolean): "dark" | "light" {
  if (pref === "system") return prefersDark ? "dark" : "light";
  return pref;
}

export function applyTheme(resolved: "dark" | "light", root: HTMLElement): void {
  root.classList.toggle("light", resolved === "light");
  root.style.colorScheme = resolved;
}
