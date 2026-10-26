import { lazy, Suspense, useRef, useState, type JSX } from "react";
import type { Facets } from "@/lib/search";

const FilterSheetPanel = lazy(() =>
  import("@/components/library/FilterSheetPanel").then((m) => ({ default: m.FilterSheetPanel })),
);

export function FilterSheet(props: {
  applied: number;
  facets: Facets;
  options: Record<keyof Facets, (string | number)[]>;
  onToggle: (key: keyof Facets, value: string | number) => void;
}): JSX.Element {
  const { applied, facets, options, onToggle } = props;
  const label = applied > 0 ? `Filters, ${applied} applied` : "Filters";
  const [open, setOpen] = useState(false);
  // Mounted on first open and kept, so the sheet's close animation still runs.
  const [mounted, setMounted] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);

  return (
    <>
      <button
        ref={trigger}
        type="button"
        className="filter-sheet-trigger"
        aria-label={label}
        aria-haspopup="dialog"
        aria-expanded={open}
        onClick={() => {
          setMounted(true);
          setOpen(true);
        }}
      >
        Filters
        {applied > 0 ? (
          <span className="library-badge" aria-hidden="true">
            {applied}
          </span>
        ) : null}
      </button>
      {mounted ? (
        <Suspense fallback={null}>
          <FilterSheetPanel
            open={open}
            onOpenChange={setOpen}
            returnFocus={trigger}
            facets={facets}
            options={options}
            onToggle={onToggle}
          />
        </Suspense>
      ) : null}
    </>
  );
}
