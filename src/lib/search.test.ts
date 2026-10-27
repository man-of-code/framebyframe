import { describe, expect, it } from "vitest";
import { emptyFacets, facetOptions, filterResources, searchResources, statusOf } from "@/lib/search";
import { createIndex } from "@/lib/search-index";
import type { Resource } from "@/lib/types";

const r = (over: Partial<Resource>): Resource => ({
  id: "x", title: "Thing", url: "https://e.com", type: "article", topics: ["editing"],
  weeks: [9], level: "beginner", cost: "free", language: "en", why: "reason",
  verified: "2026-10-21", ...over,
});

const all = [
  r({ id: "a", title: "Blocking and Staging", type: "article", topics: ["directing"], weeks: [5], language: "en" }),
  r({ id: "b", title: "Cursa Screenwriting Hindi", type: "course", topics: ["writing"], weeks: [1], language: "hi" }),
  r({ id: "c", title: "ShotDeck", type: "tool", cost: "paid", benchmarkOnly: true, weeks: [7] }),
  r({ id: "d", title: "ArtCraft", type: "tool", experimental: true, weeks: [11] }),
  r({ id: "e", title: "Actor Release Form", type: "template", emailGated: true, weeks: [3] }),
];

describe("statusOf", () => {
  it("reports clean when no flag is set", () => expect(statusOf(all[0])).toEqual(["clean"]));
  it("reports every flag that is set", () => {
    expect(statusOf(all[2])).toContain("benchmark");
    expect(statusOf(all[3])).toContain("experimental");
    expect(statusOf(all[4])).toContain("email-gated");
  });
});

describe("filterResources", () => {
  it("returns everything for empty facets", () => {
    expect(filterResources(all, emptyFacets)).toHaveLength(5);
  });

  it("ORs within a facet", () => {
    expect(filterResources(all, { ...emptyFacets, type: ["tool", "course"] })).toHaveLength(3);
  });

  it("ANDs across facets", () => {
    expect(filterResources(all, { ...emptyFacets, type: ["tool"], cost: ["paid"] })).toHaveLength(1);
  });

  it("filters by week membership", () => {
    expect(filterResources(all, { ...emptyFacets, week: [5] }).map((x) => x.id)).toEqual(["a"]);
  });

  it("filters by language", () => {
    expect(filterResources(all, { ...emptyFacets, language: ["hi"] }).map((x) => x.id)).toEqual(["b"]);
  });

  it("returns nothing for a language with no resources", () => {
    expect(filterResources(all, { ...emptyFacets, language: ["ta"] })).toHaveLength(0);
  });

  it("filters by derived status", () => {
    expect(filterResources(all, { ...emptyFacets, status: ["experimental"] }).map((x) => x.id)).toEqual(["d"]);
  });
});

describe("searchResources", () => {
  it("finds by fuzzy title", () => {
    const hits = searchResources(createIndex(all), all, "blockng", emptyFacets);
    expect(hits[0]?.id).toBe("a");
  });

  it("intersects the query with the facets", () => {
    const hits = searchResources(createIndex(all), all, "screenwriting", { ...emptyFacets, language: ["en"] });
    expect(hits).toHaveLength(0);
  });

  it("returns the filtered set for an empty query", () => {
    expect(searchResources(createIndex(all), all, "  ", { ...emptyFacets, type: ["tool"] })).toHaveLength(2);
  });
});

describe("searchResources before the index loads", () => {
  it("falls back to a substring match inside the facets", () => {
    expect(searchResources(null, all, "cursa", emptyFacets).map((x) => x.id)).toEqual(["b"]);
    expect(searchResources(null, all, "cursa", { ...emptyFacets, language: ["en"] })).toHaveLength(0);
  });
});

describe("facetOptions", () => {
  it("keeps options with zero matches so gaps stay visible", () => {
    expect(facetOptions(all).type).toContain("template");
  });
});
