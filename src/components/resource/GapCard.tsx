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
      <p className="gap-copy">{gap.note}</p>
    </article>
  );
}
