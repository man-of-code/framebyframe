import { describe, expect, it } from "vitest";
import type { Resource } from "@/lib/types";
import { costBadge, resourceBadges } from "./badges";

const base: Resource = {
  id: "r",
  title: "T",
  url: "https://example.com",
  type: "article",
  topics: [],
  weeks: [1],
  level: "beginner",
  cost: "free",
  language: "en",
  why: "w",
  verified: "2026-10-22",
};

const tones = (resource: Resource) => Object.fromEntries(resourceBadges(resource).map((b) => [b.label, b.tone]));

describe("pop badge mapping (design-system.md 2.1)", () => {
  it("maps cost to lime, yellow and magenta", () => {
    expect(costBadge("free").tone).toBe("ok");
    expect(costBadge("freemium").tone).toBe("warn");
    expect(costBadge("paid").tone).toBe("paid");
  });

  it("keeps level neutral", () => {
    expect(tones(base).Beginner).toBe("outline");
  });

  it("maps gray area and email-gated to yellow, benchmark to magenta, experimental to violet", () => {
    const all = tones({ ...base, grayArea: true, benchmarkOnly: true, experimental: true, emailGated: true });
    expect(all["Gray area"]).toBe("warn");
    expect(all["Email required"]).toBe("warn");
    expect(all.Benchmark).toBe("paid");
    expect(all.Experimental).toBe("exp");
  });

  it("gives every badge an icon and a word", () => {
    for (const badge of resourceBadges({ ...base, grayArea: true, benchmarkOnly: true, experimental: true, emailGated: true })) {
      expect(badge.label.length).toBeGreaterThan(0);
      expect(badge.icon).toBeTruthy();
    }
  });
});
