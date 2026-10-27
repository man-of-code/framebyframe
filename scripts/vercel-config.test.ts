import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { NOT_FOUND_PATH, outputFile, PRERENDER_ROUTES } from "./prerender";

// `vite preview` ignores vercel.json, so the config itself is what gets checked. Vercel serves a real file first
// (`/plan` -> plan/index.html), and with no rewrite it answers every unknown path with 404.html and status 404.
const config = JSON.parse(readFileSync("vercel.json", "utf8")) as {
  rewrites?: { source: string; destination: string }[];
  cleanUrls?: boolean;
  trailingSlash?: boolean;
};

describe("vercel static serving", () => {
  it("has no SPA rewrite, so unknown paths (and missing /assets chunks) are real 404s", () => {
    expect(config.rewrites ?? []).toEqual([]);
  });

  it("states the URL shape explicitly: no trailing slash, no .html stripping", () => {
    expect(config.trailingSlash).toBe(false);
    expect(config.cleanUrls).toBe(false);
  });

  it("writes every route where Vercel looks for it", () => {
    expect(outputFile("dist", "/")).toBe("dist/index.html");
    expect(outputFile("dist", "/week/7")).toBe("dist/week/7/index.html");
    expect(outputFile("dist", NOT_FOUND_PATH)).toBe("dist/404.html");
    for (const path of PRERENDER_ROUTES) {
      expect(path === "/" || !path.endsWith("/")).toBe(true);
      expect(outputFile("dist", path).endsWith("index.html")).toBe(true);
    }
  });
});
