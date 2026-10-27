// @vitest-environment node
/// <reference types="node" />
import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";

/**
 * Asserts every row of docs/design-system.md section 2.8 for both themes. Nothing here is a hard-coded
 * ratio: every colour is parsed from src/styles/tokens.css and every composite (aurora stack, wash,
 * sheen, band grain, film grain) is computed by this file.
 */

const css = readFileSync(new URL("./tokens.css", import.meta.url), "utf8").replace(/\/\*[\s\S]*?\*\//g, "");

type Theme = Record<string, string>;
type Rgb = [number, number, number];
type Rgba = { rgb: Rgb; a: number };

/** Splits a declaration block on `;` at paren depth 0, outside quotes (the grain tile is a data URI containing `;`). */
function declarations(block: string): Theme {
  const out: Theme = {};
  let depth = 0;
  let quote = "";
  let start = 0;
  const push = (end: number) => {
    const decl = block.slice(start, end).trim();
    const colon = decl.indexOf(":");
    if (decl.startsWith("--") && colon > 0) out[decl.slice(0, colon).trim()] = decl.slice(colon + 1).trim();
    start = end + 1;
  };
  for (let i = 0; i < block.length; i += 1) {
    const ch = block[i];
    if (quote) {
      if (ch === quote) quote = "";
    } else if (ch === '"' || ch === "'") quote = ch;
    else if (ch === "(") depth += 1;
    else if (ch === ")") depth -= 1;
    else if (ch === ";" && depth === 0) push(i);
  }
  return out;
}

function topLevelBlock(selector: string): string {
  const open = css.search(new RegExp(`^${selector.replace(".", "\\.")}\\b[^{]*\\{`, "m"));
  if (open < 0) throw new Error(`${selector} block not found in tokens.css`);
  const body = css.indexOf("{", open) + 1;
  let depth = 1;
  let i = body;
  while (depth > 0 && i < css.length) {
    if (css[i] === "{") depth += 1;
    else if (css[i] === "}") depth -= 1;
    i += 1;
  }
  return css.slice(body, i - 1);
}

const root = declarations(topLevelBlock(":root"));
const themes: Record<"dark" | "light", Theme> = {
  dark: root,
  light: { ...root, ...declarations(topLevelBlock(".light")) },
};

function value(theme: Theme, name: string): string {
  const raw = theme[name];
  if (raw === undefined) throw new Error(`${name} is not defined in tokens.css`);
  return raw.replace(/var\((--[\w-]+)\)/g, (_, ref: string) => value(theme, ref));
}

function parseColor(text: string): Rgba {
  const s = text.trim();
  const hex = /^#([0-9a-f]{6})$/i.exec(s);
  if (hex?.[1]) {
    const n = parseInt(hex[1], 16);
    return { rgb: [(n >> 16) & 255, (n >> 8) & 255, n & 255], a: 1 };
  }
  const rgba = /^rgba?\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*([\d.]+)\s*)?\)$/.exec(s);
  if (rgba) return { rgb: [Number(rgba[1]), Number(rgba[2]), Number(rgba[3])], a: rgba[4] === undefined ? 1 : Number(rgba[4]) };
  const mix = /^color-mix\(\s*in srgb\s*,\s*(#[0-9a-f]{6})\s+([\d.]+)%\s*,\s*transparent\s*\)$/i.exec(s);
  if (mix?.[1] && mix[2]) {
    const base = parseColor(mix[1]);
    return { rgb: base.rgb, a: (Number(mix[2]) / 100) * base.a };
  }
  throw new Error(`cannot parse colour: ${text}`);
}

const color = (theme: Theme, name: string): Rgba => parseColor(value(theme, name));
const solid = (theme: Theme, name: string): Rgb => {
  const c = color(theme, name);
  if (c.a !== 1) throw new Error(`${name} is not opaque`);
  return c.rgb;
};

const clamp8 = (x: number) => Math.max(0, Math.min(255, Math.round(x)));

/** Source-over of a translucent colour on an opaque backdrop, rounded to 8 bits like the compositor. */
function over(fg: Rgba, bg: Rgb): Rgb {
  return [0, 1, 2].map((i) => clamp8(fg.rgb[i]! * fg.a + bg[i]! * (1 - fg.a))) as Rgb;
}

function luminance([r, g, b]: Rgb): number {
  const lin = (v: number) => {
    const c = v / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
}

function ratio(a: Rgb, b: Rgb): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Three aurora fields at full strength stacked over the base: the first listed field is on top (section 2.5). */
function auroraStack(theme: Theme): Rgb {
  const fields = [...value(theme, "--aurora-fields").matchAll(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*([\d.]+)\s*\)/g)];
  if (fields.length !== 3) throw new Error(`expected 3 aurora fields, found ${fields.length}`);
  let pixel = solid(theme, "--bg-base");
  for (const f of [...fields].reverse()) {
    pixel = over({ rgb: [Number(f[1]), Number(f[2]), Number(f[3])], a: Number(f[4]) }, pixel);
  }
  return pixel;
}

/** Overlay blend of a pure-white noise pixel (the worst case for light text) at the layer's opacity. */
function overlayWhiteGrain(pixel: Rgb, opacity: number): Rgb {
  return pixel.map((v) => {
    const b = v / 255;
    const blended = b <= 0.5 ? 2 * b : 1;
    return clamp8(255 * ((1 - opacity) * b + opacity * blended));
  }) as Rgb;
}

/** Normal blend of a white noise pixel at the layer's opacity. */
const normalWhiteGrain = (pixel: Rgb, opacity: number): Rgb => over({ rgb: [255, 255, 255], a: opacity }, pixel);

const SURFACES = ["--bg-base", "--bg-raised", "--bg-overlay", "--bg-hover", "--bg-inset"] as const;
const POP_FILLS = ["--pop-teal", "--pop-lime", "--pop-yellow", "--pop-red", "--pop-magenta", "--pop-violet", "--brass-fill"] as const;

describe.each(["dark", "light"] as const)("contrast (section 2.8), %s theme", (name) => {
  const theme = themes[name];

  function expectAll(fgs: readonly string[], bgs: readonly string[], min: number) {
    for (const fg of fgs) {
      for (const bg of bgs) {
        const r = ratio(solid(theme, fg), solid(theme, bg));
        expect(r, `${fg} on ${bg}: ${r.toFixed(2)}`).toBeGreaterThanOrEqual(min);
      }
    }
  }

  it("text tokens meet 4.5 on every surface", () => {
    expectAll(["--text-primary", "--text-secondary", "--text-tertiary"], SURFACES, 4.5);
  });

  it("action, brass and status text meet 4.5 on base, raised, overlay and hover", () => {
    expectAll(
      ["--accent-primary", "--accent-warm", "--status-ok", "--status-warn", "--status-danger", "--status-paid", "--status-exp"],
      ["--bg-base", "--bg-raised", "--bg-overlay", "--bg-hover"],
      4.5,
    );
  });

  it("brass text meets 4.5 on the exposed-frame wash over inset and over raised", () => {
    const wash = color(theme, "--accent-warm-wash");
    for (const surface of ["--bg-inset", "--bg-raised"]) {
      const bg = over(wash, solid(theme, surface));
      const r = ratio(solid(theme, "--accent-warm"), bg);
      expect(r, `--accent-warm on wash over ${surface}: ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("ink meets 4.5 on every pop fill and the brass fill", () => {
    expectAll(["--pop-ink"], POP_FILLS, 4.5);
  });

  it("title and eyebrow text meet 4.5 on the three-field aurora stack", () => {
    const stack = auroraStack(theme);
    for (const fg of ["--text-primary", "--text-secondary"]) {
      const r = ratio(solid(theme, fg), stack);
      expect(r, `${fg} on aurora stack: ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });

  it("control boundaries and the focus ring meet 3.0 on every surface", () => {
    expectAll(["--border-strong", "--accent-primary"], SURFACES, 3);
  });

  it("the unfilled pop outline meets 3.0 on base, raised and overlay", () => {
    expectAll(["--pop-outline"], ["--bg-base", "--bg-raised", "--bg-overlay"], 3);
  });

  it("ink on the primary button meets 4.5 at the peak of the sheen", () => {
    const peak = over(color(theme, "--sheen-color"), solid(theme, "--pop-teal"));
    const r = ratio(solid(theme, "--pop-ink"), peak);
    expect(r, `--pop-ink on sheened teal: ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
  });

  it("film grain worst pixel on base keeps tertiary text at 4.5 and boundaries at 3.0", () => {
    const pixel = normalWhiteGrain(solid(theme, "--bg-base"), Number(value(theme, "--grain-film-opacity")));
    for (const [fg, min] of [["--text-tertiary", 4.5], ["--border-strong", 3], ["--pop-outline", 3]] as const) {
      const r = ratio(solid(theme, fg), pixel);
      expect(r, `${fg} on film-grain pixel: ${r.toFixed(2)}`).toBeGreaterThanOrEqual(min);
    }
  });

  it("band grain worst pixel on the aurora stack keeps title and eyebrow text at 4.5", () => {
    const pixel = overlayWhiteGrain(auroraStack(theme), Number(value(theme, "--grain-opacity")));
    for (const fg of ["--text-primary", "--text-secondary"]) {
      const r = ratio(solid(theme, fg), pixel);
      expect(r, `${fg} on grained aurora stack: ${r.toFixed(2)}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});

describe("tokens.css structure", () => {
  it("defines the dark grain at 0.03 and no grain in light", () => {
    expect(Number(value(themes.dark, "--grain-opacity"))).toBe(0.03);
    expect(Number(value(themes.light, "--grain-opacity"))).toBe(0);
    expect(Number(value(themes.light, "--grain-film-opacity"))).toBe(0);
  });
});
