import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import { resources } from "@/content";
import { emptyFacets } from "@/lib/search";
import { selectedEmptyLanguages, useLibraryFilters } from "@/hooks/useLibraryFilters";

function LocationEcho() {
  const { search } = useLocation();
  return <p data-testid="url">{search}</p>;
}

function Probe() {
  const { query, facets, setQuery, toggleFacet, clearAll, results, options } = useLibraryFilters();
  return (
    <div>
      <p data-testid="query">{query}</p>
      <p data-testid="count">{results.length}</p>
      <p data-testid="languages">{options.language.join(",")}</p>
      <p data-testid="selected-language">{facets.language.join(",")}</p>
      <p data-testid="selected-type">{facets.type.join(",")}</p>
      <button type="button" onClick={() => setQuery("Cursa")}>
        search cursa
      </button>
      <button type="button" onClick={() => setQuery("")}>
        clear query
      </button>
      <button type="button" onClick={() => toggleFacet("language", "ta")}>
        toggle tamil
      </button>
      <button type="button" onClick={() => toggleFacet("type", "course")}>
        toggle course
      </button>
      <button
        type="button"
        onClick={() => {
          toggleFacet("type", "youtube");
          toggleFacet("language", "ta");
        }}
      >
        toggle two
      </button>
      <button type="button" onClick={() => clearAll()}>
        clear all
      </button>
      <ul>
        {results.map((resource) => (
          <li key={resource.id}>{resource.title}</li>
        ))}
      </ul>
    </div>
  );
}

function renderAt(path = "/library") {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <Routes>
        <Route
          path="/library"
          element={
            <>
              <Probe />
              <LocationEcho />
            </>
          }
        />
      </Routes>
    </MemoryRouter>,
  );
}

describe("selectedEmptyLanguages", () => {
  it("keeps a language that has a verified resource and reports one that does not", () => {
    expect(selectedEmptyLanguages({ ...emptyFacets, language: ["ta", "hi"] }, resources)).toEqual(["ta"]);
  });
});

describe("useLibraryFilters", () => {
  it("starts from the full catalog and keeps empty language options", () => {
    renderAt();
    expect(screen.getByTestId("count").textContent).toBe(String(resources.length));
    expect(screen.getByTestId("query").textContent).toBe("");
    for (const code of ["ta", "te", "ml", "mr", "bn"]) {
      expect(screen.getByTestId("languages").textContent?.split(",")).toContain(code);
    }
  });

  it("writes the query into the URL and narrows the results", async () => {
    renderAt();
    await userEvent.click(screen.getByRole("button", { name: "search cursa" }));
    expect(screen.getByTestId("query").textContent).toBe("Cursa");
    expect(screen.getByTestId("url").textContent).toContain("q=Cursa");
    expect(Number(screen.getByTestId("count").textContent)).toBeLessThan(resources.length);
    expect(screen.getAllByRole("listitem").some((item) => /Cursa/i.test(item.textContent ?? ""))).toBe(true);
  });

  it("toggles a facet in the URL and clears query plus facets together", async () => {
    renderAt();
    await userEvent.click(screen.getByRole("button", { name: "toggle tamil" }));
    expect(screen.getByTestId("selected-language").textContent).toBe("ta");
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("url").textContent).toContain("language=ta");

    await userEvent.click(screen.getByRole("button", { name: "toggle course" }));
    await userEvent.click(screen.getByRole("button", { name: "search cursa" }));
    await userEvent.click(screen.getByRole("button", { name: "clear all" }));
    expect(screen.getByTestId("query").textContent).toBe("");
    expect(screen.getByTestId("selected-language").textContent).toBe("");
    expect(screen.getByTestId("selected-type").textContent).toBe("");
    expect(screen.getByTestId("count").textContent).toBe(String(resources.length));
    expect(screen.getByTestId("url").textContent ?? "").not.toContain("language=");
    expect(screen.getByTestId("url").textContent ?? "").not.toContain("q=");
  });

  it("keeps both facets when two toggles happen in one click", async () => {
    renderAt();
    await userEvent.click(screen.getByRole("button", { name: "toggle two" }));
    const url = screen.getByTestId("url").textContent ?? "";
    expect(url).toContain("type=youtube");
    expect(url).toContain("language=ta");
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  it("restores a shared link", () => {
    renderAt("/library?q=Cursa&language=hi&type=course");
    expect(screen.getByTestId("query").textContent).toBe("Cursa");
    expect(screen.getByTestId("selected-language").textContent).toBe("hi");
    expect(screen.getByTestId("selected-type").textContent).toBe("course");
    expect(screen.getByRole("listitem").textContent).toMatch(/Cursa/i);
  });
});
