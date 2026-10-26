import { Link, NavLink } from "react-router-dom";
import { FilmstripRail } from "@/components/filmstrip/FilmstripRail";
import { NAV_ITEMS } from "@/components/nav/items";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { WeekNumeral } from "@/components/nav/WeekNumeral";
import { weeks } from "@/content/weeks";
import type { Progress } from "@/lib/types";

export function LeftRail({ week, progress }: { week: number; progress: Progress }) {
  const nowShowing = weeks.find((entry) => entry.n === week);
  return (
    <aside className="left-rail" data-lenis-prevent>
      <Link to="/" className="brand">
        Frame by Frame
      </Link>
      <WeekNumeral week={week} />
      <nav aria-label="Primary">
        <ul className="nav-list">
          {NAV_ITEMS.map((item) => (
            <li key={item.to}>
              <NavLink to={item.to} end={item.to === "/"} className="nav-link">
                {({ isActive }) => (
                  <>
                    <item.icon aria-hidden="true" size={20} strokeWidth={isActive ? 2.5 : 1.75} />
                    <span>{item.label}</span>
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <ThemeToggle />
      <hr className="rail-rule" />
      <div data-slot="filmstrip">
        <FilmstripRail orientation="grid" progress={progress} />
      </div>
      {nowShowing ? (
        <div className="now-showing">
          <p className="eyebrow">Now showing</p>
          <Link to={`/week/${nowShowing.n}`} className="now-showing-link">
            {nowShowing.title}
          </Link>
        </div>
      ) : null}
    </aside>
  );
}
