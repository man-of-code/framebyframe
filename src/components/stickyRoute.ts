/** The sticky mobile CTA belongs to the landing / dashboard route and the plan only (design-system.md 6). */
export function stickyCtaRoute(pathname: string): boolean {
  return pathname === "/" || pathname === "/plan";
}
