/** The sticky mobile CTA belongs to the landing / dashboard route and the plan only (design-system.md 6). */
export function stickyCtaRoute(pathname: string): boolean {
  return pathname === "/" || pathname === "/plan";
}

/** The page's own primary CTA: a `data-page-cta` element, or the landing hero's Lumen CTA (vendored, so no attribute). */
export const PAGE_CTA = "#main [data-page-cta], #main .lumen-cta__button";
