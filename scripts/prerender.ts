import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { pathToFileURL } from "node:url";
import { TOTAL_WEEKS } from "@/lib/week";

/** Every static route. Each becomes dist/<path>/index.html (dist/index.html for `/`). */
export const PRERENDER_ROUTES = [
  "/",
  "/plan",
  ...Array.from({ length: TOTAL_WEEKS }, (_, index) => `/week/${index + 1}`),
  "/library",
  "/toolkit",
  "/capstone",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  "/thank-you",
];

/** Rendered through the `*` route into dist/404.html, which Vercel serves (status 404) for unknown paths. */
export const NOT_FOUND_PATH = "/404";

/** The route module (manifest key) whose lazy chunk renders `path`. */
export function routeModule(path: string): string {
  if (path === "/") return "src/routes/Dashboard.tsx";
  if (path.startsWith("/week/")) return "src/routes/Week.tsx";
  const page: Record<string, string> = {
    "/plan": "Plan",
    "/library": "Library",
    "/toolkit": "Toolkit",
    "/capstone": "Capstone",
    "/about": "About",
    "/contact": "Contact",
    "/privacy": "Privacy",
    "/terms": "Terms",
    "/thank-you": "ThankYou",
  };
  return `src/routes/${page[path] ?? "NotFound"}.tsx`;
}

export function outputFile(distDir: string, path: string): string {
  if (path === "/") return join(distDir, "index.html");
  if (path === NOT_FOUND_PATH) return join(distDir, "404.html");
  return join(distDir, path.slice(1), "index.html");
}

const HOISTED = /^(?:<title>[\s\S]*?<\/title>|<meta\b[^>]*>|<link\b[^>]*>)/;

/**
 * React emits the tree's hoistable tags (PageMeta's title, meta, canonical) first when the root is not a whole
 * document. Splits them from the body markup. React's own image preload is dropped: on `/` the pre-paint script
 * adds the hero preload for first-run visitors only, and returning learners must not fetch the poster.
 */
export function splitHead(html: string): { head: string[]; body: string } {
  const head: string[] = [];
  let rest = html;
  for (let match = rest.match(HOISTED); match; match = rest.match(HOISTED)) {
    const tag = match[0];
    rest = rest.slice(tag.length);
    if (/^<link\b[^>]*\brel="preload"[^>]*\bas="image"/.test(tag)) continue;
    head.push(tag);
  }
  return { head, body: rest };
}

type ManifestChunk = { file: string; css?: string[]; imports?: string[] };
export type Manifest = Record<string, ManifestChunk>;

/**
 * The route chunk's static graph minus what the template already loads: JS for modulepreload, CSS as
 * stylesheets (Vite would inject the CSS only when the lazy import runs, after first paint).
 */
export function routeAssets(manifest: Manifest, key: string, template: string): { scripts: string[]; styles: string[] } {
  const scripts: string[] = [];
  const styles: string[] = [];
  const seen = new Set<string>();
  const queue = [key];
  while (queue.length > 0) {
    const next = queue.shift()!;
    if (seen.has(next)) continue;
    seen.add(next);
    const chunk = manifest[next];
    if (!chunk) throw new Error(`prerender: ${next} is not in the Vite manifest`);
    const href = `/${chunk.file}`;
    if (!template.includes(`"${href}"`)) scripts.push(href);
    for (const css of chunk.css ?? []) {
      const cssHref = `/${css}`;
      if (!template.includes(`"${cssHref}"`) && !styles.includes(cssHref)) styles.push(cssHref);
    }
    for (const dep of chunk.imports ?? []) queue.push(dep);
  }
  return { scripts, styles };
}

export function buildPage(
  template: string,
  page: { path: string; html: string; scripts: string[]; styles: string[] },
): string {
  const { head, body } = splitHead(page.html);
  if (!head.some((tag) => tag.startsWith("<title>"))) throw new Error(`prerender ${page.path}: no <title> rendered`);
  if (!template.includes("<title>Frame by Frame</title>")) throw new Error("prerender: template <title> not found");
  if (!template.includes('<div id="root"></div>')) throw new Error('prerender: template <div id="root"></div> not found');
  // Marked so main.tsx can drop them when it replaces this markup with another page's client render.
  const meta = head.map((tag) => tag.replace(/^<(title|meta|link)\b/, '<$1 data-prerendered-head=""')).join("\n    ");
  const links = [
    ...page.styles.map((href) => `<link rel="stylesheet" crossorigin href="${href}">`),
    ...page.scripts.map((href) => `<link rel="modulepreload" crossorigin href="${href}">`),
  ].join("\n    ");
  // Function replacements: page text may contain `$&`-style sequences.
  return template
    .replace("<title>Frame by Frame</title>", () => meta)
    .replace("</head>", () => (links ? `  ${links}\n  </head>` : "</head>"))
    .replace('<div id="root"></div>', () => `<div id="root" data-prerendered="${page.path}">${body}</div>`);
}

function isDirectRun(): boolean {
  const entry = process.argv[1];
  return entry !== undefined && import.meta.url === pathToFileURL(entry).href;
}

if (isDirectRun()) {
  const root = process.cwd();
  const dist = join(root, "dist");
  const template = readFileSync(join(dist, "index.html"), "utf8");
  const manifest = JSON.parse(readFileSync(join(dist, ".vite", "manifest.json"), "utf8")) as Manifest;
  const server = (await import(pathToFileURL(join(root, "dist-ssr", "entry-server.js")).href)) as {
    render: (path: string) => Promise<string>;
  };
  for (const path of [...PRERENDER_ROUTES, NOT_FOUND_PATH]) {
    const assets = routeAssets(manifest, routeModule(path), template);
    // dist/index.html is also what assert-bundle reads as the shell of every learning route, so `/` carries no
    // extra modulepreload: the Dashboard graph would be counted into every route's budget.
    const scripts = path === "/" ? [] : assets.scripts;
    const html = await server.render(path);
    const file = outputFile(dist, path);
    mkdirSync(dirname(file), { recursive: true });
    writeFileSync(file, buildPage(template, { path, html, scripts, styles: assets.styles }));
    console.log(`prerendered ${path} -> ${file.slice(dist.length + 1)} (${(html.length / 1024).toFixed(1)} KB markup)`);
  }
}
