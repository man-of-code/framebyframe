import { Link, NavLink } from "react-router-dom";
import { FilmstripRail } from "@/components/filmstrip/FilmstripRail";
import { NAV_ITEMS } from "@/components/nav/items";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { WeekNumeral } from "@/components/nav/WeekNumeral";
import type { Progress } from "@/lib/types";

export function LeftRail({ week, progress }: { week: number; progress: Progress }) {
  return (
    <aside className="left-rail">
      <WeekNumeral week={week} />
      <Link to="/" className="brand">
        Frame by Frame
      </Link>
      <div data-slot="filmstrip">
        <FilmstripRail orientation="vertical" compact progress={progress} />
      </div>
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
      <nav aria-label="Legal">
        <ul className="nav-list">
          <li><Link className="nav-link" to="/contact">Contact</Link></li>
          <li><Link className="nav-link" to="/privacy">Privacy</Link></li>
          <li><Link className="nav-link" to="/terms">Terms</Link></li>
        </ul>
      </nav>
    </aside>
  );
}
