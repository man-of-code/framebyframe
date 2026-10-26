import { lazy, Suspense, useRef, useState } from "react";
import { Ellipsis } from "lucide-react";
import { NavLink } from "react-router-dom";
import { BOTTOM_TABS } from "@/components/nav/items";
import type { Progress } from "@/lib/types";

const MoreSheet = lazy(() => import("@/components/nav/MoreSheet").then((m) => ({ default: m.MoreSheet })));

export function BottomTabs({
  progress,
  replace,
}: {
  progress: Progress;
  replace: (progress: Progress) => void;
}) {
  const [moreOpen, setMoreOpen] = useState(false);
  // Mounted on first open and kept, so the sheet's close animation still runs.
  const [moreMounted, setMoreMounted] = useState(false);
  const moreButton = useRef<HTMLButtonElement>(null);

  return (
    <nav aria-label="Primary">
      <ul className="bottom-tabs">
        {BOTTOM_TABS.map((item) => (
          <li key={item.to}>
            <NavLink to={item.to} end={item.to === "/"} className="nav-link bottom-tab">
              {({ isActive }) => (
                <>
                  <item.icon aria-hidden="true" size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
        <li>
          <button
            ref={moreButton}
            type="button"
            className="nav-link bottom-tab"
            aria-haspopup="dialog"
            aria-expanded={moreOpen}
            onClick={() => {
              setMoreMounted(true);
              setMoreOpen(true);
            }}
          >
            <Ellipsis aria-hidden="true" size={20} />
            <span>More</span>
          </button>
          {moreMounted ? (
            <Suspense fallback={null}>
              <MoreSheet
                open={moreOpen}
                onOpenChange={setMoreOpen}
                returnFocus={moreButton}
                progress={progress}
                replace={replace}
              />
            </Suspense>
          ) : null}
        </li>
      </ul>
    </nav>
  );
}
