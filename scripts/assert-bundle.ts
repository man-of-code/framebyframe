import { existsSync, readFileSync } from "node:fs";
import { basename, dirname, join, normalize, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { gzipSync } from "node:zlib";

export const ENTRY_GZIP_LIMIT = 160 * 1024;

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

  const files = new Set<string>();
  const queue = [resolvePublic(distDir, entrySrc)];
  for (const href of modulePreloads(html)) queue.push(resolvePublic(distDir, href));
  const reasons: string[] = [];

  while (queue.length > 0) {
    const file = normalize(queue.pop()!);
    if (files.has(file)) continue;
    files.add(file);
    if (basename(file).includes("atmosphere")) {
      reasons.push(`${basename(file)} is in the entry graph`);
    }
    if (!existsSync(file)) {
      reasons.push(`missing ${file}`);
      continue;
    }
    const code = readFileSync(file, "utf8");
    for (const hit of forbidden(code)) reasons.push(`${basename(file)} ${hit}`);
    for (const spec of staticImportSpecifiers(code)) queue.push(resolve(dirname(file), spec));
  }

  let gzipBytes = 0;
  for (const file of files) {
    if (!existsSync(file)) continue;
    gzipBytes += gzipSync(readFileSync(file)).length;
  }
  if (gzipBytes > limit) reasons.push(`entry graph ${gzipBytes} bytes gzipped exceeds ${limit}`);
  if (reasons.length > 0) return { ok: false, gzipBytes, reasons };
  return { ok: true, gzipBytes };
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
  if (!result.ok) {
    for (const reason of result.reasons) console.error(reason);
    process.exit(1);
  }
}
