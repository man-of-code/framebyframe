import { describe, expect, it } from "vitest";
import { shouldHydrate } from "./hydrate-guard";

const at = (pathname: string, search = "") => ({ pathname, search });
const seeded = JSON.stringify({ version: 1, done: {}, notes: {}, capstone: {}, startDate: "2026-10-15" });

describe("shouldHydrate", () => {
  it("hydrates the page prerendered for this exact path", () => {
    expect(shouldHydrate("/plan", at("/plan"), null)).toBe(true);
    expect(shouldHydrate("/week/7", at("/week/7"), seeded)).toBe(true);
    expect(shouldHydrate("/", at("/"), null)).toBe(true);
  });

  it("treats a trailing slash as the same path", () => {
    expect(shouldHydrate("/plan", at("/plan/"), null)).toBe(true);
  });

  it("client-renders markup prerendered for another path (SW offline fallback, 404.html)", () => {
    expect(shouldHydrate("/", at("/week/7"), null)).toBe(false);
    expect(shouldHydrate("/404", at("/week/99"), null)).toBe(false);
  });

  it("client-renders when there is no prerendered markup", () => {
    expect(shouldHydrate(null, at("/plan"), null)).toBe(false);
  });

  it("client-renders any query string", () => {
    expect(shouldHydrate("/library", at("/library", "?language=ta"), null)).toBe(false);
    expect(shouldHydrate("/", at("/", "?intro=1"), null)).toBe(false);
  });

  it("client-renders the landing for a returning learner, and only on /", () => {
    expect(shouldHydrate("/", at("/"), seeded)).toBe(false);
    expect(shouldHydrate("/plan", at("/plan"), seeded)).toBe(true);
  });

  it("parses stored progress defensively", () => {
    expect(shouldHydrate("/", at("/"), "{not json")).toBe(true);
    expect(shouldHydrate("/", at("/"), "null")).toBe(true);
    expect(shouldHydrate("/", at("/"), JSON.stringify({ startDate: "" }))).toBe(true);
  });
});
