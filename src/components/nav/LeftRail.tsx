import { Link, NavLink } from "react-router-dom";
import { NAV_ITEMS } from "@/components/nav/items";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { WeekNumeral } from "@/components/nav/WeekNumeral";

export function LeftRail({ week }: { week: number }) {
  return (
    <aside className="left-rail">
      <WeekNumeral week={week} />
      <Link to="/" className="brand">
        Frame by Frame
      </Link>
      <div data-slot="filmstrip" />
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
    </aside>
  );
}
