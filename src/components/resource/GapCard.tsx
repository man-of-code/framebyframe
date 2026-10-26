import { LifeBuoy } from "lucide-react";
import type { JSX } from "react";
import { Badge } from "@/components/ui/badge";
import type { Gap } from "@/lib/types";
import "./resource.css";

export function GapCard({ gap }: { gap: Gap }): JSX.Element {
  return (
    <article className="gap-card">
      <Badge variant="warn" className="help-badge">
        <LifeBuoy aria-hidden="true" />
        Help wanted
      </Badge>
      <h3>{gap.missing}</h3>
      <p className="gap-copy">Searched for across three research passes.</p>
      {gap.attempted.length > 0 ? (
        <ul>
          {gap.attempted.map((term) => (
            <li key={term}>{term}</li>
          ))}
        </ul>
      ) : (
        <p className="gap-copy">No search terms were recorded.</p>
      )}
      <p className="gap-copy">{gap.note}</p>
    </article>
  );
}
