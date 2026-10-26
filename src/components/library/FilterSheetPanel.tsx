import type { JSX, RefObject } from "react";
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
  returnFocus: RefObject<HTMLButtonElement | null>;
  facets: Facets;
  options: Record<keyof Facets, (string | number)[]>;
  onToggle: (key: keyof Facets, value: string | number) => void;
}): JSX.Element {
  const { open, onOpenChange, returnFocus, facets, options, onToggle } = props;
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="filter-sheet"
        onCloseAutoFocus={(event) => {
          // No SheetTrigger, so Radix has no element to return focus to.
          event.preventDefault();
          returnFocus.current?.focus();
        }}
      >
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Type, topic, week, level, cost, language, and status.</SheetDescription>
        </SheetHeader>
        <FilterChips facets={facets} options={options} onToggle={onToggle} />
      </SheetContent>
    </Sheet>
  );
}
