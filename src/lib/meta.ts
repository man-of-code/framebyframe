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
    description: "The sixteen-week filmmaking plan, grouped by topic, with four spare weeks at the end to catch up.",
    noindex: false,
  },
  "/library": {
    title: "Library · Frame by Frame",
    description: "Browse free videos, articles and tools for making your film. Filter by type, topic, week, cost and language.",
    noindex: false,
  },
  "/capstone": {
    title: "Capstone · Frame by Frame",
    description: "Your short film, step by step: from the first idea to sending it to festivals.",
    noindex: false,
  },
  "/toolkit": {
    title: "Toolkit · Frame by Frame",
    description: "The free software you need for the course, with what each tool can and cannot do.",
    noindex: false,
  },
  "/about": {
    title: "About · Frame by Frame",
    description: "What Frame by Frame is, what to check before using music or footage in your film, and how to get in touch.",
    noindex: false,
  },
  "/contact": {
    title: "Contact · Frame by Frame",
    description: `Write to Frame by Frame at ${SITE.email}. This site does not store the message.`,
    noindex: false,
  },
  "/privacy": {
    title: "Privacy · Frame by Frame",
    description: "What Frame by Frame saves on your device, and when it is allowed to count visits.",
    noindex: false,
  },
  "/terms": {
    title: "Terms · Frame by Frame",
    description: "The simple terms for using this course: it is for learning, and it is not legal advice.",
    noindex: false,
  },
  "/thank-you": {
    title: "Thank you · Frame by Frame",
    description: "Your note was handed to your email app. Frame by Frame did not keep a copy.",
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
        description: `Week ${n} of ${TOTAL_WEEKS}: what to watch, read and make on the way to your short film.`,
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
