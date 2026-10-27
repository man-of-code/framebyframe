import { ChevronDown } from "lucide-react";
import { useState, type JSX } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { Facets } from "@/lib/search";
import { FACET_LABEL, FACET_ORDER, facetValueLabel } from "./labels";

type FacetKey = (typeof FACET_ORDER)[number];

// Type, Level and Cost stay visible; the long chip walls fold behind a disclosure (design-system.md 6).
const FOLDED: readonly FacetKey[] = ["topic", "status", "week", "language"];
const ALWAYS = FACET_ORDER.filter((key) => !FOLDED.includes(key));

type Options = Record<keyof Facets, (string | number)[]>;

function FacetGroup(props: {
  facetKey: FacetKey;
  facets: Facets;
  options: Options;
  onToggle: (key: keyof Facets, value: string | number) => void;
}): JSX.Element {
  const { facetKey: key, facets, options, onToggle } = props;
  const selected = facets[key].map(String);
  return (
    <fieldset className="filter-facet">
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
          <ToggleGroupItem key={String(value)} value={String(value)} className="filter-chip pop--chip">
            {facetValueLabel(key, value)}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </fieldset>
  );
}

export function FilterChips(props: {
  facets: Facets;
  options: Options;
  onToggle: (key: keyof Facets, value: string | number) => void;
  /** Every facet in the open (the Filters sheet): no disclosure. */
  flat?: boolean;
}): JSX.Element {
  const { facets, options, onToggle, flat = false } = props;
  const foldedSelected = FOLDED.reduce((sum, key) => sum + facets[key].length, 0);
  // Follows the selection until the learner opens or closes the disclosure themselves.
  const [chosen, setChosen] = useState<boolean | undefined>(undefined);
  const open = chosen ?? foldedSelected > 0;

  if (flat) {
    return (
      <div className="filter-chips">
        {FACET_ORDER.map((key) => (
          <FacetGroup key={key} facetKey={key} facets={facets} options={options} onToggle={onToggle} />
        ))}
      </div>
    );
  }

  return (
    <div className="filter-chips">
      {ALWAYS.map((key) => (
        <FacetGroup key={key} facetKey={key} facets={facets} options={options} onToggle={onToggle} />
      ))}
      <Collapsible open={open} onOpenChange={setChosen} className="filter-more">
        <CollapsibleTrigger className="filter-more-trigger pop pop--outline">
          More filters
          {foldedSelected > 0 ? <span className="filter-more-count">{foldedSelected} selected</span> : null}
          <ChevronDown aria-hidden="true" size={16} />
        </CollapsibleTrigger>
        <CollapsibleContent className="filter-more-body">
          {FOLDED.map((key) => (
            <FacetGroup key={key} facetKey={key} facets={facets} options={options} onToggle={onToggle} />
          ))}
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
