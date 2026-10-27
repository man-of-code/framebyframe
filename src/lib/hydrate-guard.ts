/**
 * Decides whether the HTML in #root may be hydrated (main.tsx) or must be replaced by a fresh client render.
 * Hydration is only safe when the markup was prerendered for exactly this URL with a neutral snapshot:
 * - another path's HTML (the service worker's offline `/` fallback, Vercel's 404.html for an unknown path),
 * - any query string (`/library?language=ta`, `/?intro=1`): the prerender saw none,
 * - `/` for a returning learner (a stored start date): the HTML is the landing, the learner gets the dashboard.
 */
export function shouldHydrate(
  prerendered: string | null,
  location: { pathname: string; search: string },
  storedProgress: string | null,
): boolean {
  if (prerendered === null) return false;
  if (location.search !== "") return false;
  const path = normalizePath(location.pathname);
  if (normalizePath(prerendered) !== path) return false;
  if (path === "/" && hasStartDate(storedProgress)) return false;
  return true;
}

function normalizePath(path: string): string {
  const trimmed = path.replace(/\/+$/, "");
  return trimmed === "" ? "/" : trimmed;
}

/** Mirrors the pre-paint script in index.html: any truthy `startDate`, so both pick the same branch. */
function hasStartDate(raw: string | null): boolean {
  if (raw === null) return false;
  try {
    const parsed: unknown = JSON.parse(raw);
    return typeof parsed === "object" && parsed !== null && Boolean((parsed as { startDate?: unknown }).startDate);
  } catch {
    return false;
  }
}
