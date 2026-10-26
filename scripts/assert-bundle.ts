import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, normalize, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

/** design-system §7.3: app shell + any learning route, 160KB gzipped. */
export const ENTRY_GZIP_LIMIT = 160 * 1024;

/** Each is measured as the entry graph plus that route's static chunk graph. */
export const LEARNING_ROUTES = [
  "src/routes/Plan.tsx",
  "src/routes/Week.tsx",
  "src/routes/Library.tsx",
  "src/routes/Toolkit.tsx",
  "src/routes/Capstone.tsx",
];

const THREE_IMPORT = /(?:\bfrom\s*|\bimport\s*(?:\(\s*)?)["']three(?:\/[^"']*)?["']/;

export function assertDist(
  distDir: string,
  limit = ENTRY_GZIP_LIMIT,
): { ok: true; gzipBytes: number } | { ok: false; gzipBytes: number; reasons: string[] } {
  const htmlPath = join(distDir, "index.html");
  if (!existsSync(htmlPath)) {
    return { ok: false, gzipBytes: 0, reasons: ["dist/index.html is missing"] };
  }
  const html = readFileSync(htmlPath, "utf8");
  const entrySrc = moduleEntrySrc(html);
  if (!entrySrc) {
    return { ok: false, gzipBytes: 0, reasons: ["no module entry script in index.html"] };
  }

  const { files, reasons } = walkGraph(entryStarts(distDir, html, entrySrc));
  const gzipBytes = gzipSize(files);
  if (gzipBytes > limit) reasons.push(`entry graph ${gzipBytes} bytes gzipped exceeds ${limit}`);
  if (reasons.length > 0) return { ok: false, gzipBytes, reasons };
  return { ok: true, gzipBytes };
}

export type RouteSize = { route: string; gzipBytes: number };

/** Reads dist/.vite/manifest.json to find each route's chunk. */
export function assertRoutes(
  distDir: string,
  limit = ENTRY_GZIP_LIMIT,
  routes = LEARNING_ROUTES,
): { ok: boolean; sizes: RouteSize[]; reasons: string[] } {
  const sizes: RouteSize[] = [];
  const htmlPath = join(distDir, "index.html");
  const manifestPath = join(distDir, ".vite", "manifest.json");
  if (!existsSync(htmlPath) || !existsSync(manifestPath)) {
    return { ok: false, sizes, reasons: ["dist/index.html or dist/.vite/manifest.json is missing"] };
  }
  const html = readFileSync(htmlPath, "utf8");
  const entrySrc = moduleEntrySrc(html);
  if (!entrySrc) return { ok: false, sizes, reasons: ["no module entry script in index.html"] };
  const manifest = JSON.parse(readFileSync(manifestPath, "utf8")) as Record<string, { file?: string }>;

  const reasons: string[] = [];
  for (const route of routes) {
    const chunk = manifest[route]?.file;
    if (!chunk) {
      reasons.push(`${route} has no chunk in the manifest`);
      continue;
    }
    const graph = walkGraph([...entryStarts(distDir, html, entrySrc), join(distDir, chunk)]);
    for (const reason of graph.reasons) reasons.push(`${route}: ${reason}`);
    const gzipBytes = gzipSize(graph.files);
    sizes.push({ route, gzipBytes });
    if (gzipBytes > limit) reasons.push(`${route} graph ${gzipBytes} bytes gzipped exceeds ${limit}`);
  }
  return { ok: reasons.length === 0, sizes, reasons };
}

function entryStarts(distDir: string, html: string, entrySrc: string): string[] {
  const starts = [resolvePublic(distDir, entrySrc)];
  for (const href of modulePreloads(html)) starts.push(resolvePublic(distDir, href));
  return starts;
}

function walkGraph(starts: string[]): { files: Set<string>; reasons: string[] } {
  const files = new Set<string>();
  const queue = [...starts];
  const reasons: string[] = [];

  while (queue.length > 0) {
    const file = normalize(queue.pop()!);
    if (files.has(file)) continue;
    files.add(file);
    if (basename(file).includes("atmosphere")) {
      reasons.push(`${basename(file)} is in the static graph`);
    }
    if (!existsSync(file)) {
      reasons.push(`missing ${file}`);
      continue;
    }
    const code = readFileSync(file, "utf8");
    for (const hit of forbidden(code)) reasons.push(`${basename(file)} ${hit}`);
    for (const spec of staticImportSpecifiers(code)) queue.push(resolve(dirname(file), spec));
  }
  return { files, reasons };
}

function gzipSize(files: Set<string>): number {
  let bytes = 0;
  for (const file of files) {
    if (existsSync(file)) bytes += gzipSync(readFileSync(file)).length;
  }
  return bytes;
}

export function staticImportSpecifiers(code: string): string[] {
  const specs = /\b(?:import\s*(?:[^"'();]*?\bfrom\s*)?|export\s*(?:\{[^}]*\}|\*(?:\s*as\s*\w+)?)\s*from\s*)["'](\.[^"']+)["']/g;
  return [...code.matchAll(specs)].map((match) => match[1]!);
}

function forbidden(code: string): string[] {
  const hits: string[] = [];
  if (code.includes("crtRenderer")) hits.push("contains crtRenderer");
  if (code.includes("CRT_FRAGMENT")) hits.push("contains CRT_FRAGMENT");
  if (THREE_IMPORT.test(code)) hits.push("imports three");
  return hits;
}

function moduleEntrySrc(html: string): string | null {
  for (const tag of tags(html, "script")) {
    if ((attr(tag, "type") ?? "").toLowerCase() !== "module") continue;
    const src = attr(tag, "src");
    if (src) return src;
  }
  return null;
}

function modulePreloads(html: string): string[] {
  const hrefs: string[] = [];
  for (const tag of tags(html, "link")) {
    if ((attr(tag, "rel") ?? "").toLowerCase() !== "modulepreload") continue;
    const href = attr(tag, "href");
    if (href?.endsWith(".js")) hrefs.push(href);
  }
  return hrefs;
}

function tags(html: string, name: string): string[] {
  return html.match(new RegExp(`<${name}\\b[^>]*>`, "gi")) ?? [];
}

function attr(tag: string, name: string): string | null {
  const match = tag.match(new RegExp(`\\b${name}\\s*=\\s*["']([^"']+)["']`, "i"));
  return match?.[1] ?? null;
}

function resolvePublic(distDir: string, src: string): string {
  const relative = src.startsWith("/") ? src.slice(1) : src;
  return join(distDir, relative);
}

function isDirectRun(): boolean {
  const entry = process.argv[1];
  if (!entry) return false;
  return import.meta.url === pathToFileURL(entry).href;
}

if (isDirectRun()) {
  const result = assertDist(join(process.cwd(), "dist"));
  const kb = (result.gzipBytes / 1024).toFixed(1);
  console.log(`entry graph: ${result.gzipBytes} bytes gzipped (${kb} KB), limit ${ENTRY_GZIP_LIMIT}`);
  const routes = assertRoutes(join(process.cwd(), "dist"));
  for (const { route, gzipBytes } of routes.sizes) {
    console.log(`${route}: ${gzipBytes} bytes gzipped (${(gzipBytes / 1024).toFixed(1)} KB)`);
  }
  const reasons = [...(result.ok ? [] : result.reasons), ...routes.reasons];
  if (reasons.length > 0) {
    for (const reason of reasons) console.error(reason);
    process.exit(1);
  }
}
