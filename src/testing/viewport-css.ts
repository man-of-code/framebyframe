/// <reference types="node" />
import { readFileSync } from "node:fs";

/**
 * Test-only. jsdom loads no CSS files and evaluates no media queries, so layout that is switched by CSS alone
 * (rail vs tabs, chips vs sheet) is emulated here: the bodies of the real stylesheet's `@media` blocks whose
 * min-/max-width conditions hold at `width` are injected unwrapped. Testing Library then treats
 * `display: none` elements as inaccessible, exactly as a browser's a11y tree does. `cssPath` is relative to
 * the repository root (where vitest runs).
 */
export function applyViewportCss(cssPath: string, width: number): () => void {
  const source = readFileSync(cssPath, "utf8").replace(/\/\*[\s\S]*?\*\//g, "");
  const bodies: string[] = [];
  const media = /@media\s*([^{]+)\{/g;
  for (let match = media.exec(source); match; match = media.exec(source)) {
    const start = match.index + match[0].length;
    let depth = 1;
    let end = start;
    while (end < source.length && depth > 0) {
      if (source[end] === "{") depth += 1;
      else if (source[end] === "}") depth -= 1;
      end += 1;
    }
    if (conditionHolds(match[1]!, width)) bodies.push(source.slice(start, end - 1));
    media.lastIndex = end;
  }
  const style = document.createElement("style");
  style.textContent = bodies.join("\n");
  document.head.append(style);
  return () => style.remove();
}

function conditionHolds(condition: string, width: number): boolean {
  const parts = [...condition.matchAll(/\((min|max)-width:\s*([\d.]+)px\)/g)];
  if (parts.length === 0) return false;
  return parts.every(([, kind, value]) => (kind === "min" ? width >= Number(value) : width <= Number(value)));
}
