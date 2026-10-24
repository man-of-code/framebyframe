import type { JSX } from "react";
import { FilterChips } from "@/components/library/FilterChips";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import type { Facets } from "@/lib/search";

export function FilterSheet(props: {
  applied: number;
  facets: Facets;
  options: Record<keyof Facets, (string | number)[]>;
  onToggle: (key: keyof Facets, value: string | number) => void;
}): JSX.Element {
  const { applied, facets, options, onToggle } = props;
  const label = applied > 0 ? `Filters, ${applied} applied` : "Filters";

  return (
    <Sheet>
      <SheetTrigger className="filter-sheet-trigger" aria-label={label}>
        Filters
        {applied > 0 ? (
          <span className="library-badge" aria-hidden="true">
            {applied}
          </span>
        ) : null}
      </SheetTrigger>
      <SheetContent side="bottom" className="filter-sheet">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Type, topic, week, level, cost, language, and status.</SheetDescription>
        </SheetHeader>
        <FilterChips facets={facets} options={options} onToggle={onToggle} />
      </SheetContent>
    </Sheet>
  );
}
