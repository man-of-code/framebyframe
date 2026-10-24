import { NavLink } from "react-router-dom";
import { BOTTOM_TABS } from "@/components/nav/items";
import { MoreSheet } from "@/components/nav/MoreSheet";
import type { Progress } from "@/lib/types";

export function BottomTabs({
  progress,
  replace,
}: {
  progress: Progress;
  replace: (progress: Progress) => void;
}) {
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
          <MoreSheet progress={progress} replace={replace} />
        </li>
      </ul>
    </nav>
  );
}
