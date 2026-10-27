import { createHash } from "node:crypto";
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { SITE } from "@/content/site";

export const SW_PLACEHOLDER = "__BUILD_ID__";

export const SITEMAP_PATHS = [
  "/",
  "/plan",
  "/library",
  "/capstone",
  "/toolkit",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  ...Array.from({ length: 16 }, (_, index) => `/week/${index + 1}`),
];

/** Vite copies public/sw.js unprocessed, so the cache name is stamped here from the built index.html. */
export function stampServiceWorker(distDir: string): string {
  const swPath = join(distDir, "sw.js");
  const source = readFileSync(swPath, "utf8");
  if (!source.includes(SW_PLACEHOLDER)) throw new Error(`dist/sw.js has no ${SW_PLACEHOLDER} placeholder`);
  const buildId = createHash("sha256").update(readFileSync(join(distDir, "index.html"))).digest("hex").slice(0, 12);
  writeFileSync(swPath, source.replaceAll(SW_PLACEHOLDER, buildId));
  return buildId;
}

/** Throws unless origin is an absolute http(s) URL; returns it without a trailing slash. */
export function normalizeOrigin(origin: string): string {
  const url = new URL(origin);
  if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error(`SITE_ORIGIN must be http(s): ${origin}`);
  return url.origin;
}

export function robotsTxt(origin: string | null): string {
  const lines = ["User-agent: *", "Allow: /"];
  if (origin) lines.push("", `Sitemap: ${origin}/sitemap.xml`);
  return `${lines.join("\n")}\n`;
}

export function sitemapXml(origin: string): string {
  const urls = SITEMAP_PATHS.map((path) => `  <url><loc>${origin}${path}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/** The sitemap protocol requires absolute URLs, so with no origin there is no sitemap at all. */
export function writeSeo(distDir: string, rawOrigin: string | undefined): string | null {
  const origin = rawOrigin ? normalizeOrigin(rawOrigin) : null;
  writeFileSync(join(distDir, "robots.txt"), robotsTxt(origin));
  if (origin) writeFileSync(join(distDir, "sitemap.xml"), sitemapXml(origin));
  return origin;
}

function isDirectRun(): boolean {
  const entry = process.argv[1];
  return entry !== undefined && import.meta.url === pathToFileURL(entry).href;
}

if (isDirectRun()) {
  const dist = join(process.cwd(), "dist");
  if (!existsSync(dist)) throw new Error("dist/ is missing; run vite build first");
  console.log(`service worker cache: fbf-${stampServiceWorker(dist)}`);
  // SITE_ORIGIN overrides the production origin (e.g. for a staging build).
  const origin = writeSeo(dist, process.env.SITE_ORIGIN ?? SITE.origin);
  console.log(origin ? `sitemap: ${origin}/sitemap.xml` : "sitemap: skipped (no origin)");
}
