import { LifeBuoy } from "lucide-react";
import type { JSX } from "react";
import type { Gap } from "@/lib/types";
import "./resource.css";

export function GapCard({ gap }: { gap: Gap }): JSX.Element {
  return (
    <article className="gap-card">
      <p className="help-chip">
        <LifeBuoy aria-hidden="true" size={16} />
        Help wanted
      </p>
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
