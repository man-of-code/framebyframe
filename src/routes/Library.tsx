import { lazy, Suspense, useCallback, useState, type JSX } from "react";
import { WorkingHeader } from "@/components/PageHeader";
import { FilterChips } from "@/components/library/FilterChips";
import { FilterSheet } from "@/components/library/FilterSheet";
import { facetValueLabel } from "@/components/library/labels";
import "@/components/library/library.css";
import { ResultsGrid } from "@/components/library/ResultsGrid";
import { ResultsTable } from "@/components/library/ResultsTable";
import { useMediaQuery } from "@/components/library/useMediaQuery";
import { usePaletteShortcut } from "@/components/library/usePaletteShortcut";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { GapCard } from "@/components/resource/GapCard";
import { gaps } from "@/content/gaps";
import { resources } from "@/content/resources";
import { selectedEmptyLanguages, useLibraryFilters } from "@/hooks/useLibraryFilters";
import type { Facets } from "@/lib/search";

const SearchPalette = lazy(() =>
  import("@/components/library/SearchPalette").then((m) => ({ default: m.SearchPalette })),
);

const languageGap = gaps.find((gap) => gap.id === "indian-language-craft");

function appliedCount(facets: Facets): number {
  return (Object.keys(facets) as (keyof Facets)[]).reduce((sum, key) => sum + facets[key].length, 0);
}

export function Library(): JSX.Element {
  const { query, facets, setQuery, toggleFacet, clearAll, results, options, view, setView } = useLibraryFilters();
  const wide = useMediaQuery("(min-width: 1024px)");
  const [paletteOpen, setPaletteOpen] = useState(false);
  // Mounted on first open and kept, so the dialog's close animation still runs.
  const [paletteMounted, setPaletteMounted] = useState(false);
  const openPalette = useCallback(() => {
    setPaletteMounted(true);
    setPaletteOpen(true);
  }, []);
  usePaletteShortcut(openPalette);
  const showGap = languageGap !== undefined && selectedEmptyLanguages(facets, resources).length > 0;
  const gapEmpty = showGap && results.length === 0;
  const active = (Object.keys(facets) as (keyof Facets)[]).flatMap((key) =>
    facets[key].map((value) => ({ key, value, label: facetValueLabel(key, value) })),
  );

  const table = view === "table";

  return (
    <article className="library">
      <WorkingHeader
        eyebrow="Verified resources"
        title="Library"
        note="Search by title or topic, or filter by type, level, cost and status."
      />
      {paletteMounted ? (
        <Suspense fallback={null}>
          <SearchPalette
            open={paletteOpen}
            onOpenChange={setPaletteOpen}
            query={query}
            results={results}
            onQuery={setQuery}
          />
        </Suspense>
      ) : null}
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
        <ToggleGroup
          type="single"
          spacing={0}
          aria-label="Result layout"
          value={table ? "table" : "cards"}
          onValueChange={(next) => {
            if (next === "cards" || next === "table") setView(next);
          }}
        >
          <ToggleGroupItem value="cards">Cards</ToggleGroupItem>
          <ToggleGroupItem value="table">Table</ToggleGroupItem>
        </ToggleGroup>
      </div>
      {wide ? (
        <FilterChips facets={facets} options={options} onToggle={toggleFacet} />
      ) : (
        <FilterSheet applied={appliedCount(facets)} facets={facets} options={options} onToggle={toggleFacet} />
      )}
      {active.length > 0 || query.trim() !== "" ? (
        <div className="active-filters">
          {query.trim() !== "" ? (
            <button type="button" className="active-chip pop pop--chip" aria-label={`Remove search ${query}`} onClick={() => setQuery("")}>
              {query}
            </button>
          ) : null}
          {active.map((chip) => (
            <button
              key={`${chip.key}:${String(chip.value)}`}
              type="button"
              className="active-chip pop pop--chip"
              aria-label={`Remove ${chip.label}`}
              onClick={() => toggleFacet(chip.key, chip.value)}
            >
              {chip.label}
            </button>
          ))}
          <button type="button" className="clear-all pop pop--outline" onClick={clearAll}>
            Clear all
          </button>
        </div>
      ) : null}
      <div className="hud-frame library-count-frame">
        <p className="hud-readout library-count" role="status" aria-live="polite">
          {gapEmpty ? (
            "No verified resources in this language"
          ) : (
            <>
              <strong>{results.length}</strong> {results.length === 1 ? "result" : "results"}
            </>
          )}
        </p>
      </div>
      {showGap && languageGap ? <GapCard gap={languageGap} /> : null}
      {results.length > 0 ? table ? <ResultsTable resources={results} /> : <ResultsGrid resources={results} /> : null}
    </article>
  );
}
