import {
  CalendarRange,
  Film,
  House,
  Info,
  LayoutDashboard,
  Library,
  Wrench,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
};

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/plan", label: "Plan", icon: CalendarRange },
  { to: "/library", label: "Library", icon: Library },
  { to: "/capstone", label: "Capstone", icon: Film },
  { to: "/toolkit", label: "Toolkit", icon: Wrench },
  { to: "/about", label: "About", icon: Info },
];

export const BOTTOM_TABS: NavItem[] = [
  { to: "/", label: "Today", icon: House },
  { to: "/plan", label: "Plan", icon: CalendarRange },
  { to: "/library", label: "Library", icon: Library },
  { to: "/capstone", label: "Capstone", icon: Film },
];
