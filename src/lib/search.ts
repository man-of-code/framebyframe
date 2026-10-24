import Fuse, { type IFuseOptions } from "fuse.js";
import type { Resource } from "@/lib/types";

export type StatusFlag = "clean" | "gray-area" | "benchmark" | "experimental" | "email-gated";

export type Facets = {
  type: string[];
  topic: string[];
  week: number[];
  level: string[];
  cost: string[];
  language: string[];
  status: StatusFlag[];
};

export const emptyFacets: Facets = {
  type: [],
  topic: [],
  week: [],
  level: [],
  cost: [],
  language: [],
  status: [],
};

const TYPES = [
  "youtube",
  "repo",
  "subreddit",
  "article",
  "course",
  "book",
  "tool",
  "short-film",
  "podcast",
  "forum",
  "template",
  "festival",
  "community",
  "service",
  "platform",
  "grant",
  "docs",
  "spec",
  "aggregator",
  "reading",
] as const satisfies readonly Resource["type"][];

const LEVELS = ["beginner", "intermediate", "advanced"] as const satisfies readonly Resource["level"][];
const COSTS = ["free", "freemium", "paid"] as const satisfies readonly Resource["cost"][];
const STATUSES = ["clean", "gray-area", "benchmark", "experimental", "email-gated"] as const satisfies readonly StatusFlag[];
const WEEKS = Array.from({ length: 16 }, (_, index) => index + 1);
// ISO 639-1. Empty codes stay listed so the language gap remains selectable (F16).
const LANGUAGES = ["en", "hi", "ta", "te", "ml", "mr", "bn"] as const;

const INDEX_OPTIONS: IFuseOptions<Resource> = {
  keys: [
    { name: "title", weight: 0.5 },
    { name: "why", weight: 0.3 },
    { name: "topics", weight: 0.15 },
    { name: "type", weight: 0.05 },
  ],
  threshold: 0.38,
  ignoreLocation: true,
};

export function statusOf(resource: Resource): StatusFlag[] {
  const flags: StatusFlag[] = [];
  if (resource.grayArea) flags.push("gray-area");
  if (resource.benchmarkOnly) flags.push("benchmark");
  if (resource.experimental) flags.push("experimental");
  if (resource.emailGated) flags.push("email-gated");
  return flags.length > 0 ? flags : ["clean"];
}

function matchesFacet<T>(selected: readonly T[], values: readonly T[]): boolean {
  if (selected.length === 0) return true;
  return values.some((value) => selected.includes(value));
}

export function filterResources(all: Resource[], facets: Facets): Resource[] {
  return all.filter((resource) =>
    matchesFacet(facets.type, [resource.type]) &&
    matchesFacet(facets.topic, resource.topics) &&
    matchesFacet(facets.week, resource.weeks) &&
    matchesFacet(facets.level, [resource.level]) &&
    matchesFacet(facets.cost, [resource.cost]) &&
    matchesFacet(facets.language, [resource.language]) &&
    matchesFacet(facets.status, statusOf(resource)),
  );
}

export function createIndex(all: Resource[]): Fuse<Resource> {
  return new Fuse(all, INDEX_OPTIONS);
}

export function searchResources(
  index: Fuse<Resource>,
  all: Resource[],
  query: string,
  facets: Facets,
): Resource[] {
  const filtered = filterResources(all, facets);
  const trimmed = query.trim();
  if (trimmed === "") return filtered;
  const allowed = new Set(filtered.map((resource) => resource.id));
  return index.search(trimmed).flatMap((hit) => (allowed.has(hit.item.id) ? [hit.item] : []));
}

export function facetOptions(all: Resource[]): Record<keyof Facets, (string | number)[]> {
  const topics = [...new Set(all.flatMap((resource) => resource.topics))].sort((a, b) => a.localeCompare(b));
  const weeks = new Set<number>(WEEKS);
  const language = [...LANGUAGES] as string[];
  const seenLanguages = new Set<string>(language);
  for (const resource of all) {
    for (const week of resource.weeks) weeks.add(week);
    if (!seenLanguages.has(resource.language)) {
      seenLanguages.add(resource.language);
      language.push(resource.language);
    }
  }
  return {
    type: [...TYPES],
    topic: topics,
    week: [...weeks].sort((a, b) => a - b),
    level: [...LEVELS],
    cost: [...COSTS],
    language,
    status: [...STATUSES],
  };
}
