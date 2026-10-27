// @vitest-environment node
import { describe, expect, it } from "vitest";
import { expectedH1 } from "../e2e/expected-headings";
import { buildPage, NOT_FOUND_PATH, PRERENDER_ROUTES, routeAssets, splitHead, type Manifest } from "../scripts/prerender";
import { render } from "./entry-server";

function decode(text: string): string {
  return text
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&");
}

/** The h1's accessible name: its aria-label when it has one (DecodeHeading), else its text. */
function h1Name(html: string): string | null {
  const match = /<h1\b([^>]*)>([\s\S]*?)<\/h1>/.exec(html);
  if (!match) return null;
  const label = /aria-label="([^"]*)"/.exec(match[1]!);
  return decode(label ? label[1]! : match[2]!.replace(/<[^>]+>/g, ""));
}

describe("prerender (Node, no window)", () => {
  it("runs without browser globals", () => {
    expect(typeof window).toBe("undefined");
    expect(typeof document).toBe("undefined");
  });

  it.each([...PRERENDER_ROUTES, NOT_FOUND_PATH])("renders %s with its own h1 and the neutral snapshot", async (path) => {
    const html = await render(path);
    const { head, body } = splitHead(html);
    expect(h1Name(body)).toBe(expectedH1(path));
    // Neutral progress snapshot: never "unavailable", so no read-only banner ships in any page.
    expect(body).not.toMatch(/read-only/i);
    expect(body).not.toContain("readonly-banner");
    // The route is inline, not outlined behind the RouteFallback skeleton and revealed by an inline script.
    expect(body).not.toContain("route-fallback");
    expect(body).not.toContain("<template");
    expect(body).not.toContain("$RC(");
    // Consent and the deferred chrome are client-only.
    expect(body).not.toContain("cookie-banner");
    // Learning routes and the landing ship no canvas markup.
    expect(body).not.toContain("<canvas");
    expect(head.some((tag) => tag.startsWith("<title>"))).toBe(true);
    expect(head.join("")).toContain(`<link rel="canonical" href="https://framebyframe.manofcode.fyi${path}"/>`);
    // Both layouts are in the HTML; CSS picks one.
    expect(body).toContain('class="left-rail"');
    expect(body).toContain('class="bottom-tabs"');
  });

  it("renders the first-run landing on / with the static aurora and an empty date", async () => {
    const html = await render("/");
    expect(html).toContain('class="hero aurora"');
    expect(html).not.toContain("aurora--live");
    expect(html).toMatch(/<input type="date" value=""/);
  });
});

const TEMPLATE = `<head>
    <title>Frame by Frame</title>
    <script type="module" crossorigin src="/assets/index-a.js"></script>
    <link rel="modulepreload" crossorigin href="/assets/react-a.js">
    <link rel="stylesheet" crossorigin href="/assets/index-a.css">
  </head>
  <body>
    <div id="root"></div>
  </body>`;

const MANIFEST: Manifest = {
  "index.html": { file: "assets/index-a.js", css: ["assets/index-a.css"], imports: ["_react-a.js"] },
  "_react-a.js": { file: "assets/react-a.js" },
  "_card-a.js": { file: "assets/card-a.js", css: ["assets/card-a.css"], imports: ["_react-a.js"] },
  "src/routes/Plan.tsx": { file: "assets/Plan-a.js", css: ["assets/Plan-a.css"], imports: ["_react-a.js", "_card-a.js", "index.html"] },
};

describe("buildPage", () => {
  it("adds only the route's own chunks and CSS, and replaces the template title", () => {
    const assets = routeAssets(MANIFEST, "src/routes/Plan.tsx", TEMPLATE);
    expect(assets).toEqual({
      scripts: ["/assets/Plan-a.js", "/assets/card-a.js"],
      styles: ["/assets/Plan-a.css", "/assets/card-a.css"],
    });
    const page = buildPage(TEMPLATE, {
      path: "/plan",
      html: '<title>Plan · Frame by Frame</title><meta name="description" content="x"/><div class="shell">$& kept</div>',
      ...assets,
    });
    expect(page).toContain('<title data-prerendered-head="">Plan · Frame by Frame</title>');
    expect(page).not.toContain("<title>Frame by Frame</title>");
    expect(page).toContain('<meta data-prerendered-head="" name="description" content="x"/>');
    expect(page).toContain('<link rel="modulepreload" crossorigin href="/assets/Plan-a.js">');
    expect(page).toContain('<link rel="stylesheet" crossorigin href="/assets/Plan-a.css">');
    expect(page).toContain('<div id="root" data-prerendered="/plan"><div class="shell">$& kept</div></div>');
  });

  it("drops React's image preload from the head", () => {
    const { head } = splitHead('<link rel="preload" as="image" href="/posters/hero-crt.webp" fetchPriority="high"/><title>t</title><p>x</p>');
    expect(head).toEqual(["<title>t</title>"]);
  });
});
