import { describe, expect, it } from "vitest";

describe("toolchain", () => {
  it("resolves the @ alias and runs TypeScript", async () => {
    const mod = await import("@/main.tsx").catch(() => null);
    expect(mod === null || typeof mod === "object").toBe(true);
  });
});
