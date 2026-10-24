import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomTabs } from "@/components/nav/BottomTabs";
import { LeftRail } from "@/components/nav/LeftRail";
import "@/components/nav/shell.css";
import { WeekNumeral } from "@/components/nav/WeekNumeral";
import { SkipLink } from "@/components/SkipLink";
import { Toaster } from "@/components/ui/sonner";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useProgress } from "@/hooks/useProgress";
import type { Progress } from "@/lib/types";

const RAIL_QUERY = "(min-width: 768px)";

export type ShellOutletContext = {
  progress: Progress;
};

function useRailLayout(): boolean {
  const [matches, setMatches] = useState(() => window.matchMedia(RAIL_QUERY).matches);

  useEffect(() => {
    const query = window.matchMedia(RAIL_QUERY);
    const onChange = () => setMatches(query.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  return matches;
}

function eyebrowFor(pathname: string): string {
  if (pathname.startsWith("/week/")) return "Week";
  if (pathname.startsWith("/plan")) return "Plan";
  if (pathname.startsWith("/library")) return "Library";
  if (pathname.startsWith("/capstone")) return "Capstone";
  if (pathname.startsWith("/toolkit")) return "Toolkit";
  if (pathname.startsWith("/about")) return "About";
  return "Today";
}

export function Root() {
  const { progress, status, replace } = useProgress();
  const { week } = useCurrentWeek(progress);
  const rail = useRailLayout();
  const { pathname } = useLocation();

  return (
    <div className="shell">
      <SkipLink />
      {rail ? <LeftRail week={week} progress={progress} /> : null}
      <div className="shell-main">
        {rail ? null : (
          <header className="mobile-bar">
            <p className="eyebrow">{eyebrowFor(pathname)}</p>
            <WeekNumeral week={week} />
          </header>
        )}
        {status === "unavailable" ? (
          <p className="readonly-banner" role="status">
            Progress is read-only. This browser is not storing changes.
          </p>
        ) : null}
        <main id="main" tabIndex={-1} className="shell-content">
          <Outlet context={{ progress } satisfies ShellOutletContext} />
        </main>
      </div>
      {rail ? null : <BottomTabs progress={progress} replace={replace} />}
      <Toaster position="top-center" />
    </div>
  );
}
