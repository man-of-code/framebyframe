import { mkdtempSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { normalizeOrigin, stampServiceWorker, writeSeo, SW_PLACEHOLDER } from "./finalize-dist";

function dist(): string {
  const root = mkdtempSync(join(tmpdir(), "fbf-final-"));
  writeFileSync(join(root, "index.html"), '<script src="/assets/index-abc.js"></script>');
  writeFileSync(join(root, "sw.js"), `const CACHE = "fbf-${SW_PLACEHOLDER}";`);
  return root;
}

describe("stampServiceWorker", () => {
  it("replaces the placeholder with a hash of index.html", () => {
    const root = dist();
    const id = stampServiceWorker(root);
    expect(id).toMatch(/^[0-9a-f]{12}$/);
    expect(readFileSync(join(root, "sw.js"), "utf8")).toBe(`const CACHE = "fbf-${id}";`);
  });

  it("changes when index.html changes", () => {
    const a = dist();
    const b = dist();
    writeFileSync(join(b, "index.html"), '<script src="/assets/index-def.js"></script>');
    expect(stampServiceWorker(a)).not.toBe(stampServiceWorker(b));
  });
});

describe("writeSeo", () => {
  it("writes absolute sitemap URLs and an absolute Sitemap line", () => {
    const root = dist();
    writeSeo(root, "https://framebyframe.example/");
    expect(readFileSync(join(root, "robots.txt"), "utf8")).toContain("Sitemap: https://framebyframe.example/sitemap.xml");
    const xml = readFileSync(join(root, "sitemap.xml"), "utf8");
    expect(xml).toContain("<loc>https://framebyframe.example/</loc>");
    expect(xml).toContain("<loc>https://framebyframe.example/week/16</loc>");
    expect(xml).not.toMatch(/<loc>\//);
  });

  it("ships no sitemap rather than an invalid one when no origin is set", () => {
    const root = dist();
    writeSeo(root, undefined);
    expect(readFileSync(join(root, "robots.txt"), "utf8")).not.toContain("Sitemap");
    expect(existsSync(join(root, "sitemap.xml"))).toBe(false);
  });

  it("rejects an origin that is not an absolute http(s) URL", () => {
    expect(() => normalizeOrigin("framebyframe.example")).toThrow();
    expect(() => normalizeOrigin("ftp://framebyframe.example")).toThrow();
  });
});
