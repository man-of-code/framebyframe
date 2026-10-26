import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { resources } from "@/content";
import { Library } from "./Library";

function installMatchMedia(matches: (query: string) => boolean) {
  window.matchMedia = ((query: string) => ({
    matches: matches(query),
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

function LocationEcho() {
  const { search } = useLocation();
  return <p data-testid="url">{search}</p>;
}

function renderLibrary(path = "/library") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/library"
          element={
            <>
              <Library />
              <LocationEcho />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

async function openMore() {
  await userEvent.click(screen.getByRole("button", { name: /Week and language/ }));
}

describe("Library", () => {
  // The panels are React.lazy chunks. Warming them keeps findBy* inside its timeout when the
  // whole suite is transforming in parallel; the lazy boundary itself is unchanged.
  beforeAll(async () => {
    await Promise.all([import("@/components/library/SearchPalette"), import("@/components/library/FilterSheetPanel")]);
  });

  beforeEach(() => {
    installMatchMedia((query) => query.includes("768"));
    Element.prototype.scrollIntoView = () => {};
    window.ResizeObserver = class {
      observe() {}
      unobserve() {}
      disconnect() {}
    } as typeof ResizeObserver;
  });

  it("filters from the inline search and writes the query into the URL", async () => {
    renderLibrary();
    await userEvent.type(screen.getByRole("searchbox", { name: "Search the library" }), "Cursa");
    expect(screen.getByRole("link", { name: /Cursa/i })).toBeTruthy();
    expect(screen.getByTestId("url").textContent).toContain("q=Cursa");
    expect(screen.getByRole("status").textContent).not.toBe(`${resources.length} results`);
  });

  it("leaves a slash in the search field instead of opening the palette", async () => {
    renderLibrary();
    const field = screen.getByRole("searchbox", { name: "Search the library" });
    await userEvent.type(field, "/");
    expect((field as HTMLInputElement).value).toBe("/");
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("opens the command palette from /", async () => {
    renderLibrary();
    await userEvent.keyboard("/");
    expect(await screen.findByRole("dialog", { name: "Search the library" })).toBeTruthy();
  });

  it("opens the command palette from meta+k", async () => {
    renderLibrary();
    await userEvent.keyboard("{Meta>}k{/Meta}");
    expect(await screen.findByRole("dialog", { name: "Search the library" })).toBeTruthy();
  });

  it("shows the Indian-language gap card for Tamil and no zero count", async () => {
    renderLibrary();
    await openMore();
    await userEvent.click(screen.getByRole("button", { name: "Tamil" }));
    expect(screen.getByRole("heading", { name: /zero verified hindi\/tamil/i })).toBeTruthy();
    expect(screen.getByText("Help wanted")).toBeTruthy();
    expect(screen.queryByText("0 results")).toBeNull();
    expect(screen.getByRole("status").textContent).not.toContain("0 results");
    expect(screen.getByTestId("url").textContent).toContain("language=ta");
  });

  it("keeps the verified Hindi course on the Hindi facet", async () => {
    renderLibrary();
    await openMore();
    await userEvent.click(screen.getByRole("button", { name: "Hindi" }));
    expect(screen.getByRole("link", { name: /Cursa/i })).toBeTruthy();
    expect(screen.getByRole("status").textContent).toBe("1 result");
    expect(screen.queryByRole("heading", { name: /zero verified hindi\/tamil/i })).toBeNull();
  });

  it("restores a Tamil link as the gap card", () => {
    renderLibrary("/library?language=ta");
    expect(screen.getByRole("button", { name: "Tamil" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("heading", { name: /zero verified hindi\/tamil/i })).toBeTruthy();
    expect(screen.queryByText("0 results")).toBeNull();
  });

  it("removes one active facet and clears the rest", async () => {
    renderLibrary();
    await openMore();
    await userEvent.click(screen.getByRole("button", { name: "Tamil" }));
    await userEvent.click(screen.getByRole("button", { name: "Free" }));
    await userEvent.click(screen.getByRole("button", { name: "Remove Tamil" }));
    expect(screen.getByTestId("url").textContent ?? "").not.toContain("language=ta");
    expect(screen.getByTestId("url").textContent).toContain("cost=free");
    await userEvent.click(screen.getByRole("button", { name: "Clear all" }));
    expect(screen.getByRole("status").textContent).toBe(`${resources.length} results`);
    expect(screen.getByTestId("url").textContent ?? "").not.toContain("cost=");
  });

  it("uses a table for the same results and records that view", async () => {
    renderLibrary("/library?q=Cursa&language=hi&type=course");
    await userEvent.click(screen.getByRole("radio", { name: "Table" }));
    const table = screen.getByRole("table");
    expect(within(table).getByRole("link", { name: /Cursa/i })).toBeTruthy();
    expect(screen.getAllByRole("article").every((node) => node.classList.contains("library"))).toBe(true);
    expect(screen.getByTestId("url").textContent).toContain("view=table");
  });

  it("folds Week and Language behind a collapsed disclosure by default", async () => {
    renderLibrary();
    const trigger = screen.getByRole("button", { name: /Week and language/ });
    expect(trigger.getAttribute("aria-expanded")).toBe("false");
    expect(screen.queryByRole("button", { name: "Tamil" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Week 3" })).toBeNull();
    // The other facets stay visible.
    expect(screen.getByRole("button", { name: "YouTube" })).toBeTruthy();
    await userEvent.click(trigger);
    expect(trigger.getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("button", { name: "Tamil" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Week 3" })).toBeTruthy();
  });

  it("opens the disclosure when a language value is selected", () => {
    renderLibrary("/library?language=ta");
    expect(screen.getByRole("button", { name: /Week and language/ }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("button", { name: "Tamil" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("opens the disclosure when a week value is selected", () => {
    renderLibrary("/library?week=3");
    expect(screen.getByRole("button", { name: /Week and language/ }).getAttribute("aria-expanded")).toBe("true");
    expect(screen.getByRole("button", { name: "Week 3" }).getAttribute("aria-pressed")).toBe("true");
  });

  it("shows an empty query as 0 results", async () => {
    renderLibrary();
    await userEvent.type(screen.getByRole("searchbox", { name: "Search the library" }), "zzzz-no-such-resource");
    expect(screen.getByText("0 results")).toBeTruthy();
    expect(screen.queryByRole("heading", { name: /zero verified hindi\/tamil/i })).toBeNull();
  });

  it("keeps facets in a sheet below 768px and badges the applied count", async () => {
    installMatchMedia(() => false);
    renderLibrary();
    expect(screen.queryByRole("button", { name: "Tamil" })).toBeNull();
    await userEvent.click(screen.getByRole("button", { name: "Filters" }));
    await userEvent.click(await screen.findByRole("button", { name: /Week and language/ }));
    await userEvent.click(await screen.findByRole("button", { name: "Tamil" }));
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(document.activeElement).toBe(screen.getByRole("button", { name: /filters/i })));
    expect(screen.getByRole("button", { name: /filters/i }).textContent).toContain("1");
    expect(screen.getByRole("heading", { name: /zero verified hindi\/tamil/i })).toBeTruthy();
  });
});
