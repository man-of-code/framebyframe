import { describe, expect, it } from "vitest";
import { pageMeta } from "@/lib/meta";

describe("pageMeta", () => {
  it("gives each fixed route its own title and description", () => {
    const plan = pageMeta("/plan");
    const library = pageMeta("/library");
    expect(plan.title).not.toBe(library.title);
    expect(plan.description).not.toBe(library.description);
    expect(plan.title).toContain("Plan");
    expect(plan.noindex).toBe(false);
  });

  it("numbers a real week and refuses a week outside the curriculum", () => {
    expect(pageMeta("/week/7").title).toBe("Week 7 · Frame by Frame");
    expect(pageMeta("/week/99").title).toBe("Page not found · Frame by Frame");
    expect(pageMeta("/week/99").noindex).toBe(true);
  });

  it("keeps the thank-you page out of the index", () => {
    expect(pageMeta("/thank-you").noindex).toBe(true);
  });
});
