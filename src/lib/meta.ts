import { SITE } from "@/content/site";
import { TOTAL_WEEKS } from "@/lib/week";

export type PageMeta = {
  title: string;
  description: string;
  noindex: boolean;
};

const PAGES: Record<string, PageMeta> = {
  "/": {
    title: "Frame by Frame",
    description: SITE.description,
    noindex: false,
  },
  "/plan": {
    title: "Plan · Frame by Frame",
    description: "The sixteen-week filmmaking plan, grouped into modules, with a buffer for weeks 13 to 16.",
    noindex: false,
  },
  "/library": {
    title: "Library · Frame by Frame",
    description: "Filter the verified resource ledger by type, topic, week, cost, and language.",
    noindex: false,
  },
  "/capstone": {
    title: "Capstone · Frame by Frame",
    description: "The short-film capstone: the stages left after the weekly curriculum.",
    noindex: false,
  },
  "/toolkit": {
    title: "Toolkit · Frame by Frame",
    description: "The free-path tools for the curriculum, including the limits of Resolve and ArtCraft.",
    noindex: false,
  },
  "/about": {
    title: "About · Frame by Frame",
    description: "How the curriculum was researched, what is still unverified, and how to get in touch.",
    noindex: false,
  },
  "/contact": {
    title: "Contact · Frame by Frame",
    description: `Write to Frame by Frame at ${SITE.email}. This site does not store the message.`,
    noindex: false,
  },
  "/privacy": {
    title: "Privacy · Frame by Frame",
    description: "What Frame by Frame stores in the browser, and when Vercel Web Analytics is allowed to run.",
    noindex: false,
  },
  "/terms": {
    title: "Terms · Frame by Frame",
    description: "The terms for using this curriculum: education, not legal advice, and not a LevelUp course.",
    noindex: false,
  },
  "/thank-you": {
    title: "Thank you · Frame by Frame",
    description: "The note was handed to your mail app. Frame by Frame did not store it.",
    noindex: true,
  },
};

export function pageMeta(pathname: string): PageMeta {
  const known = PAGES[pathname];
  if (known) return known;
  const week = /^\/week\/(\d+)\/?$/.exec(pathname);
  if (week) {
    const n = Number(week[1]);
    if (n >= 1 && n <= TOTAL_WEEKS) {
      return {
        title: `Week ${n} · Frame by Frame`,
        description: `Week ${n} of ${TOTAL_WEEKS}: what to watch, read, and make on the way to a short film.`,
        noindex: false,
      };
    }
  }
  return {
    title: "Page not found · Frame by Frame",
    description: "That address is not part of Frame by Frame.",
    noindex: true,
  };
}
