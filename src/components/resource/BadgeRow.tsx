import type { JSX } from "react";
import { Badge } from "@/components/ui/badge";
import type { Resource } from "@/lib/types";
import { resourceBadges } from "./badges";
import "./resource.css";

export function BadgeRow({ resource }: { resource: Resource }): JSX.Element {
  return (
    <ul className="badge-row">
      {resourceBadges(resource).map(({ key, label, tone, icon: Icon }) => (
        <li key={key}>
          <Badge variant={tone}>
            <Icon aria-hidden="true" />
            {label}
          </Badge>
        </li>
      ))}
    </ul>
  );
}
