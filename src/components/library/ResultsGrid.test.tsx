import { render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Resource } from "@/lib/types";
import { ResultsGrid } from "./ResultsGrid";

function resource(n: number): Resource {
  return {
    id: `r${n}`,
    title: `Title ${n}`,
    url: "https://example.com",
    type: "article",
    topics: ["writing"],
    weeks: [1],
    level: "beginner",
    cost: "free",
    language: "en",
    why: "because",
    verified: "2026-10-21",
  };
}

describe("ResultsGrid", () => {
  beforeEach(() => {
    window.scrollTo = () => {};
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  });

  it("renders every card through 200 items", () => {
    render(<ResultsGrid resources={Array.from({ length: 200 }, (_, index) => resource(index))} />);
    expect(screen.getAllByRole("article")).toHaveLength(200);
  });

  it("virtualizes once the grid exceeds 200 items", async () => {
    render(<ResultsGrid resources={Array.from({ length: 201 }, (_, index) => resource(index))} />);
    await waitFor(() => expect(screen.queryAllByRole("article").length).toBeLessThan(201));
    expect(screen.queryAllByRole("article").length).toBeGreaterThan(0);
  });
});
