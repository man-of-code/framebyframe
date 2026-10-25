import { describe, expect, it } from "vitest";
import { content } from "@/content";
import { checkResources, failureLine, shouldSkip, type LinkTarget } from "./check-links";

function resource(id: string): LinkTarget {
  const found = content.resources.find((item) => item.id === id);
  if (!found) throw new Error(`missing ${id}`);
  return found;
}

describe("shouldSkip", () => {
  it("skips a bare site root whose why states a search term", () => {
    for (const id of [
      "mcpro24fps",
      "google-camera-ae-af-lock",
      "digital-camera-world-addon-lenses",
      "no-film-school-three-point-lighting",
      "ifilmthings-low-key-lighting",
      "no-film-school-diy-gimbal",
      "blendernation-sci-fi-vfx",
    ]) {
      expect(shouldSkip(resource(id))).toBe(true);
    }
  });

  it("checks a real page and a bare homepage that is not a search term", () => {
    expect(shouldSkip(resource("lessons-from-the-screenplay"))).toBe(false);
    expect(shouldSkip(resource("shotdeck"))).toBe(false);
    expect(shouldSkip(resource("open-camera"))).toBe(false);
  });
});

describe("failureLine", () => {
  it("reports the earliest week, id, url, and status", () => {
    expect(failureLine(resource("open-camera"), "404")).toBe(
      "week 7 · open-camera · https://opencamera.sourceforge.io · 404",
    );
  });
});

describe("checkResources", () => {
  const targets: LinkTarget[] = [
    { id: "ok", url: "https://example.com/ok", why: "A real page.", weeks: [1] },
    { id: "missing", url: "https://example.com/missing", why: "A real page.", weeks: [3, 2] },
    { id: "head-blocked", url: "https://example.com/get", why: "A real page.", weeks: [4] },
    { id: "search-root", url: "https://example.com", why: "Search term: example.", weeks: [5] },
  ];

  it("flags non-2xx results, falls back from HEAD 405 to GET, and skips search roots", async () => {
    const fetchImpl = (async (input: RequestInfo | URL, init?: RequestInit) => {
      const url = String(input);
      const method = init?.method ?? "GET";
      if (url.endsWith("/missing")) return new Response(null, { status: 404 });
      if (url.endsWith("/get") && method === "HEAD") return new Response(null, { status: 405 });
      if (url.endsWith("/get") && method === "GET") return new Response("ok", { status: 200 });
      return new Response(null, { status: 200 });
    }) as typeof fetch;

    const failures = await checkResources(targets, fetchImpl);
    expect(failures).toEqual([
      "week 2 · missing · https://example.com/missing · 404",
    ]);
  });

  it("keeps at most four probes in flight", async () => {
    let active = 0;
    let max = 0;
    const fetchImpl = (async () => {
      active += 1;
      max = Math.max(max, active);
      await new Promise((resolve) => setTimeout(resolve, 20));
      active -= 1;
      return new Response(null, { status: 200 });
    }) as typeof fetch;
    const many = Array.from({ length: 8 }, (_, index) => ({
      id: `r${index}`,
      url: `https://example.com/${index}`,
      why: "A real page.",
      weeks: [1],
    }));
    await checkResources(many, fetchImpl);
    expect(max).toBeLessThanOrEqual(4);
    expect(max).toBeGreaterThan(1);
  });
});
