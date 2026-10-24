import { useState, type JSX } from "react";
import { FilterChips } from "@/components/library/FilterChips";
import { FilterSheet } from "@/components/library/FilterSheet";
import { facetValueLabel } from "@/components/library/labels";
import "@/components/library/library.css";
import { ResultsGrid } from "@/components/library/ResultsGrid";
import { ResultsTable } from "@/components/library/ResultsTable";
import { SearchPalette } from "@/components/library/SearchPalette";
import { useMediaQuery } from "@/components/library/useMediaQuery";
import { GapCard } from "@/components/resource/GapCard";
import { content, resources } from "@/content";
import { selectedEmptyLanguages, useLibraryFilters } from "@/hooks/useLibraryFilters";
import type { Facets } from "@/lib/search";

const languageGap = content.gaps.find((gap) => gap.id === "indian-language-craft");

function appliedCount(facets: Facets): number {
  return (Object.keys(facets) as (keyof Facets)[]).reduce((sum, key) => sum + facets[key].length, 0);
}

function resultLabel(count: number): string {
  return `${count} ${count === 1 ? "result" : "results"}`;
}

export function Library(): JSX.Element {
  const { query, facets, setQuery, toggleFacet, clearAll, results, options, view, setView } = useLibraryFilters();
  const wide = useMediaQuery("(min-width: 768px)");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const showGap = languageGap !== undefined && selectedEmptyLanguages(facets, resources).length > 0;
  const countLabel = showGap && results.length === 0 ? "No verified resources in this language" : resultLabel(results.length);
  const active = (Object.keys(facets) as (keyof Facets)[]).flatMap((key) =>
    facets[key].map((value) => ({ key, value, label: facetValueLabel(key, value) })),
  );

  const table = view === "table";

  return (
    <article className="library">
      <header>
        <p className="eyebrow">Library</p>
        <h1>Library</h1>
      </header>
      <SearchPalette
        open={paletteOpen}
        onOpenChange={setPaletteOpen}
        query={query}
        results={results}
        onQuery={setQuery}
      />
      <div className="library-toolbar">
        <input
          type="search"
          className="library-search"
          aria-label="Search the library"
          placeholder="Search title, why, topics"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <p className="library-hint">
          <kbd>⌘K</kbd> or <kbd>/</kbd>
        </p>
        <div className="view-toggle" role="group" aria-label="Result layout">
          <button type="button" className="view-button" aria-pressed={!table} onClick={() => setView("cards")}>
            Cards
          </button>
          <button type="button" className="view-button" aria-pressed={table} onClick={() => setView("table")}>
            Table
          </button>
        </div>
      </div>
      {wide ? (
        <FilterChips facets={facets} options={options} onToggle={toggleFacet} />
      ) : (
        <FilterSheet applied={appliedCount(facets)} facets={facets} options={options} onToggle={toggleFacet} />
      )}
      {active.length > 0 || query.trim() !== "" ? (
        <div className="active-filters">
          {query.trim() !== "" ? (
            <button type="button" className="active-chip" aria-label={`Remove search ${query}`} onClick={() => setQuery("")}>
              {query}
            </button>
          ) : null}
          {active.map((chip) => (
            <button
              key={`${chip.key}:${String(chip.value)}`}
              type="button"
              className="active-chip"
              aria-label={`Remove ${chip.label}`}
              onClick={() => toggleFacet(chip.key, chip.value)}
            >
              {chip.label}
            </button>
          ))}
          <button type="button" className="clear-all" onClick={clearAll}>
            Clear all
          </button>
        </div>
      ) : null}
      <p className="library-count" role="status" aria-live="polite">
        {countLabel}
      </p>
      {showGap && languageGap ? <GapCard gap={languageGap} /> : null}
      {results.length > 0 ? table ? <ResultsTable resources={results} /> : <ResultsGrid resources={results} /> : null}
    </article>
  );
}
