import { ExternalLink } from "lucide-react";
import type { JSX } from "react";
import type { Resource } from "@/lib/types";
import { BadgeRow } from "./BadgeRow";
import "./resource.css";

export function ResourceCard(props: { resource: Resource; minutes?: number }): JSX.Element {
  const { resource, minutes } = props;
  const typeLabel = resource.type.replaceAll("-", " ");

  return (
    <article className="resource-card">
      <p className="eyebrow">{typeLabel}</p>
      <h3>
        <a className="resource-link" href={resource.url} target="_blank" rel="noopener noreferrer">
          {resource.title}
          <ExternalLink aria-hidden="true" size={16} />
          <span className="visually-hidden"> (opens in a new tab)</span>
        </a>
      </h3>
      <BadgeRow resource={resource} />
      <p className="resource-why">{resource.why}</p>
      {resource.licenseNote ? <p className="license-note">{resource.licenseNote}</p> : null}
      <p className="mono">Verified {resource.verified}</p>
      {minutes !== undefined ? <p className="mono">{minutes} min</p> : null}
    </article>
  );
}
