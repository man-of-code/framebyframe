import type { JSX } from "react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Facets } from "@/lib/search";
import { FACET_LABEL, FACET_ORDER, facetValueLabel } from "./labels";

export function FilterChips(props: {
  facets: Facets;
  options: Record<keyof Facets, (string | number)[]>;
  onToggle: (key: keyof Facets, value: string | number) => void;
}): JSX.Element {
  const { facets, options, onToggle } = props;

  return (
    <div className="filter-chips">
      {FACET_ORDER.map((key) => {
        const selected = facets[key].map(String);
        return (
          <fieldset key={key} className="filter-facet">
            <legend>{FACET_LABEL[key]}</legend>
            <ToggleGroup
              type="multiple"
              variant="outline"
              spacing={2}
              className="filter-group"
              aria-label={FACET_LABEL[key]}
              value={selected}
              onValueChange={(next) => {
                const values = Array.isArray(next) ? next : [next];
                const added = values.find((value) => !selected.includes(value));
                const removed = selected.find((value) => !values.includes(value));
                const changed = added ?? removed;
                if (changed === undefined) return;
                onToggle(key, key === "week" ? Number(changed) : changed);
              }}
            >
              {options[key].map((value) => (
                <ToggleGroupItem key={String(value)} value={String(value)} className="filter-chip">
                  {facetValueLabel(key, value)}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </fieldset>
        );
      })}
    </div>
  );
}
