import { act, render, screen, waitFor } from "@testing-library/react";
import { hydrateRoot } from "react-dom/client";
import { renderToString } from "react-dom/server";
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

  it("server-renders the first page only and hydrates it into the full grid without a mismatch", async () => {
    const all = Array.from({ length: 138 }, (_, index) => resource(index));
    const container = document.createElement("div");
    container.innerHTML = renderToString(<ResultsGrid resources={all} />);
    expect(container.querySelectorAll("article")).toHaveLength(9);

    document.body.append(container);
    const errors: unknown[] = [];
    const root = await act(async () =>
      hydrateRoot(container, <ResultsGrid resources={all} />, { onRecoverableError: (error) => errors.push(error) }),
    );
    await waitFor(() => expect(container.querySelectorAll("article")).toHaveLength(138));
    expect(errors).toEqual([]);
    act(() => root.unmount());
    container.remove();
  });
});
