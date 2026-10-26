import { gzipSync } from "node:zlib";
import { mkdtempSync, mkdirSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { assertDist, assertRoutes } from "./assert-bundle";

function distWith(files: Record<string, string>, html: string): string {
  const root = mkdtempSync(join(tmpdir(), "fbf-dist-"));
  mkdirSync(join(root, "assets"));
  writeFileSync(join(root, "index.html"), html);
  for (const [name, source] of Object.entries(files)) {
    writeFileSync(join(root, "assets", name), source);
  }
  return root;
}

const html = `<script type="module" crossorigin src="/assets/index-abc.js"></script>
<link rel="modulepreload" crossorigin href="/assets/react-def.js">`;

describe("assertDist", () => {
  it("measures the static entry graph and ignores a dynamic atmosphere chunk", () => {
    const root = distWith(
      {
        "index-abc.js": 'import"./react-def.js";import("./atmosphere-xyz.js");',
        "react-def.js": "console.log('shell');",
        "atmosphere-xyz.js": "crtRenderer CRT_FRAGMENT",
      },
      html,
    );
    const result = assertDist(root);
    const expected =
      gzipSync(Buffer.from('import"./react-def.js";import("./atmosphere-xyz.js");')).length +
      gzipSync(Buffer.from("console.log('shell');")).length;
    expect(result.ok).toBe(true);
    if (result.ok) expect(result.gzipBytes).toBe(expected);
  });

  it("fails when the entry graph contains the canvas renderer or a three import", () => {
    const markers = [
      'import"./react-def.js";crtRenderer();',
      'import"./react-def.js";const CRT_FRAGMENT = 1;',
      'import"./react-def.js";import{x}from"three";',
    ];
    for (const entry of markers) {
      const root = distWith(
        { "index-abc.js": entry, "react-def.js": "console.log('shell');" },
        html,
      );
      const result = assertDist(root);
      expect(result.ok).toBe(false);
    }
  });

  it("fails when a statically imported chunk is the atmosphere bundle", () => {
    const root = distWith(
      {
        "index-abc.js": 'import"./atmosphere-xyz.js";',
        "atmosphere-xyz.js": "console.log('canvas');",
        "react-def.js": "console.log('shell');",
      },
      `<script type="module" src="/assets/index-abc.js"></script>`,
    );
    const result = assertDist(root);
    expect(result.ok).toBe(false);
  });

  it("follows export-from into a chunk that contains the canvas marker", () => {
    const root = distWith(
      {
        "index-abc.js": 'export{x}from"./vendor-xyz.js";',
        "vendor-xyz.js": "crtRenderer();",
        "react-def.js": "console.log('shell');",
      },
      html,
    );
    expect(assertDist(root).ok).toBe(false);
  });

  it("does not follow import.meta into the next string literal", () => {
    const root = distWith(
      {
        "index-abc.js": 'import.meta.env;const hidden="./missing.js";import"./react-def.js";',
        "react-def.js": "console.log('shell');",
      },
      html,
    );
    const result = assertDist(root);
    expect(result.ok).toBe(true);
  });

  it("measures each route as the entry graph plus its chunk, and refuses canvas code there", () => {
    const root = distWith(
      {
        "index-abc.js": 'import"./react-def.js";',
        "react-def.js": "console.log('shell');",
        "Plan-1.js": 'import"./shared-2.js";',
        "shared-2.js": "console.log('shared');",
        "Week-3.js": 'import"./atmosphere-xyz.js";',
        "atmosphere-xyz.js": "console.log('canvas');",
      },
      html,
    );
    mkdirSync(join(root, ".vite"));
    writeFileSync(
      join(root, ".vite", "manifest.json"),
      JSON.stringify({
        "src/routes/Plan.tsx": { file: "assets/Plan-1.js" },
        "src/routes/Week.tsx": { file: "assets/Week-3.js" },
      }),
    );
    const sizeOf = (...sources: string[]) =>
      sources.reduce((sum, source) => sum + gzipSync(Buffer.from(source)).length, 0);

    const result = assertRoutes(root, 160 * 1024, ["src/routes/Plan.tsx", "src/routes/Week.tsx"]);
    expect(result.sizes[0]).toEqual({
      route: "src/routes/Plan.tsx",
      gzipBytes: sizeOf('import"./react-def.js";', "console.log('shell');", 'import"./shared-2.js";', "console.log('shared');"),
    });
    expect(result.ok).toBe(false);
    expect(result.reasons.some((reason) => reason.startsWith("src/routes/Week.tsx: atmosphere"))).toBe(true);
    expect(assertRoutes(root, 1, ["src/routes/Plan.tsx"]).ok).toBe(false);
  });

  it("fails when the gzipped entry graph exceeds the limit", () => {
    const root = distWith(
      {
        "index-abc.js": "console.log('entry');",
        "react-def.js": "console.log('shell');",
      },
      html,
    );
    const result = assertDist(root, 1);
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.gzipBytes).toBeGreaterThan(1);
  });
});
