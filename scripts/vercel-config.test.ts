import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

// `vite preview` ignores vercel.json, so the rewrite pattern itself is what gets checked.
// Vercel matches `source` with path-to-regexp, which accepts this regex group as written.
const config = JSON.parse(readFileSync("vercel.json", "utf8")) as { rewrites: { source: string }[] };
const pattern = new RegExp(`^${config.rewrites[0]!.source}$`);

describe("vercel SPA rewrite", () => {
  it("sends app routes to index.html", () => {
    for (const path of ["/", "/plan", "/week/7", "/library", "/about"]) expect(pattern.test(path)).toBe(true);
  });

  it("leaves /assets alone, so a missing chunk is a real 404 instead of index.html", () => {
    expect(pattern.test("/assets/index-old.js")).toBe(false);
    expect(pattern.test("/assets/Week-old.css")).toBe(false);
  });
});
