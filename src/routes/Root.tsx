import { useEffect, useState, type ComponentType } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { BottomTabs } from "@/components/nav/BottomTabs";
import { LeftRail } from "@/components/nav/LeftRail";
import "@/components/nav/shell.css";
import { PageMeta } from "@/components/PageMeta";
import { SkipLink } from "@/components/SkipLink";
import { WeekNumeral } from "@/components/nav/WeekNumeral";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { ProgressProvider, useProgressContext } from "@/hooks/ProgressProvider";
import type { Progress } from "@/lib/types";
import "@/routes/launch.css";
import "@/routes/pages.css";

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
  if (pathname.startsWith("/contact")) return "Contact";
  if (pathname.startsWith("/privacy")) return "Privacy";
  if (pathname.startsWith("/terms")) return "Terms";
  if (pathname.startsWith("/thank-you")) return "Thank you";
  return "Today";
}

export function Root() {
  return (
    <ProgressProvider>
      <RootLayout />
    </ProgressProvider>
  );
}

function DeferredChrome({ progress }: { progress: Progress }) {
  const [Chrome, setChrome] = useState<ComponentType<{ progress: Progress }> | null>(null);

  useEffect(() => {
    let live = true;
    void import("@/components/LaunchChrome").then((mod) => {
      if (live) setChrome(() => mod.LaunchChrome);
    });
    return () => {
      live = false;
    };
  }, []);

  if (!Chrome) return null;
  return <Chrome progress={progress} />;
}

function RootLayout() {
  const { progress, status, replace } = useProgressContext();
  const { week } = useCurrentWeek(progress);
  const rail = useRailLayout();
  const { pathname } = useLocation();

  return (
    <div className="shell">
      <PageMeta />
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
      <DeferredChrome progress={progress} />
    </div>
  );
}
