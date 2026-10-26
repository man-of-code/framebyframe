import type { JSX } from "react";
import { FilterChips } from "@/components/library/FilterChips";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import type { Facets } from "@/lib/search";

/** Loaded on the first tap of Filters; the trigger lives in FilterSheet. */
export function FilterSheetPanel(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  facets: Facets;
  options: Record<keyof Facets, (string | number)[]>;
  onToggle: (key: keyof Facets, value: string | number) => void;
}): JSX.Element {
  const { open, onOpenChange, facets, options, onToggle } = props;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
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
