import { useEffect, useState, type JSX } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { PAGE_CTA, stickyCtaRoute } from "@/components/stickyRoute";
import { Button, ButtonSheen } from "@/components/ui/button";
import type { Progress } from "@/lib/types";
import { resolveCurrentWeek } from "@/lib/week";

/** True while one of the page's own primary CTAs is in the viewport, so a phone never shows two primaries. */
function usePageCtaInView(active: boolean, pathname: string): boolean {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    if (!active || typeof IntersectionObserver === "undefined") return;
    const visible = new Set<Element>();
    const observer = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) visible.add(entry.target);
        else visible.delete(entry.target);
      }
      setInView(visible.size > 0);
    });
    const observe = () => document.querySelectorAll(PAGE_CTA).forEach((node) => observer.observe(node));
    observe();
    // The route chunk may paint after this effect; look again once.
    const later = window.setTimeout(observe, 400);
    return () => {
      window.clearTimeout(later);
      observer.disconnect();
      setInView(false);
    };
  }, [active, pathname]);
  return inView;
}

export function StickyCta({ progress }: { progress: Progress }): JSX.Element | null {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const allowed = stickyCtaRoute(pathname);
  const pageCtaInView = usePageCtaInView(allowed, pathname);
  if (!allowed || pageCtaInView) return null;

  const current = resolveCurrentWeek(progress, new Date());
  if (!progress.startDate) {
    return (
      <div className="sticky-cta">
        <Button
          type="button"
          onClick={() => {
            const form = document.getElementById("start-date");
            if (form instanceof HTMLFormElement) {
              form.requestSubmit();
              return;
            }
            navigate("/#start-date");
          }}
        >
          Start week 1
        </Button>
      </div>
    );
  }

  if (current.complete && current.source !== "override") {
    return (
      <div className="sticky-cta">
        <Button asChild>
          <Link to="/capstone"><ButtonSheen />Open the capstone</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="sticky-cta">
      <Button asChild>
        <Link to={`/week/${current.week}`}><ButtonSheen />Continue week {current.week}</Link>
      </Button>
    </div>
  );
}
