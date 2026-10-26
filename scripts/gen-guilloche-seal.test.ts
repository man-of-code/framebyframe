// @vitest-environment node
import { readFileSync, statSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const file = fileURLToPath(new URL("../src/assets/ornaments/guilloche-seal.svg", import.meta.url));

describe("guilloche seal asset", () => {
  it("exists, stays under 16KB and holds exactly 32 <use> elements", () => {
    expect(statSync(file).size).toBeLessThan(16 * 1024);
    const svg = readFileSync(file, "utf8");
    expect(svg.match(/<use/g)).toHaveLength(32);
    expect(svg).toContain('viewBox="0 0 1000 1000"');
    expect(svg).toContain("68802d5428071ada5c20db8094b1649e6bb770ed");
  });
});
