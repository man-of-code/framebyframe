import { weeks } from "../src/content/weeks";

const PAGES: Record<string, string> = {
  "/": "Frame by Frame",
  "/plan": "The plan",
  "/library": "Library",
  "/toolkit": "Free software",
  "/capstone": "Eight stages",
  "/about": "How this was made",
  "/contact": "Write to the project",
  "/privacy": "Privacy policy",
  "/terms": "Terms of use",
  "/thank-you": "Your note is ready to send",
  "/404": "Page not found",
};

/** The accessible name of each prerendered page's <h1> (shared by the Node prerender test and the preview e2e). */
export function expectedH1(path: string): string {
  const week = /^\/week\/(\d+)$/.exec(path);
  if (week) {
    const found = weeks.find((entry) => entry.n === Number(week[1]));
    if (!found) throw new Error(`no week for ${path}`);
    return found.title;
  }
  const page = PAGES[path];
  if (page === undefined) throw new Error(`no expected heading for ${path}`);
  return page;
}
