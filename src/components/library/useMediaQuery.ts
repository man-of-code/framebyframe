import { useEffect, useState } from "react";
import { useHydrated } from "@/hooks/useHydrated";

/** False in the prerender and during hydration (the effect corrects it right after); read at once otherwise. */
export function useMediaQuery(query: string): boolean {
  const hydrated = useHydrated();
  const [matches, setMatches] = useState(() => hydrated && window.matchMedia(query).matches);

  useEffect(() => {
    const media = window.matchMedia(query);
    const onChange = () => setMatches(media.matches);
    onChange();
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
