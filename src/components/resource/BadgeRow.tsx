import { BadgeCheck, CircleDollarSign, FlaskConical, Gauge, Mail, Star, TriangleAlert } from "lucide-react";
import type { JSX } from "react";
import type { Resource } from "@/lib/types";
import "./resource.css";

const COST_LABEL = { free: "Free", freemium: "Freemium", paid: "Paid" } as const;

export function BadgeRow({ resource }: { resource: Resource }): JSX.Element {
  const costTone = resource.cost === "paid" ? "paid" : undefined;

  return (
    <ul className="badge-row">
      <li>
        <span className="meta-badge" data-tone={costTone}>
          {resource.cost === "free" ? (
            <BadgeCheck aria-hidden="true" size={16} />
          ) : (
            <CircleDollarSign aria-hidden="true" size={16} />
          )}
          {COST_LABEL[resource.cost]}
        </span>
      </li>
      <li>
        <span className="meta-badge">
          <Gauge aria-hidden="true" size={16} />
          {resource.level.charAt(0).toUpperCase() + resource.level.slice(1)}
        </span>
      </li>
      {resource.grayArea ? (
        <li>
          <span className="meta-badge" data-tone="warn">
            <TriangleAlert aria-hidden="true" size={16} />
            Gray area
          </span>
        </li>
      ) : null}
      {resource.benchmarkOnly ? (
        <li>
          <span className="meta-badge" data-tone="paid">
            <Star aria-hidden="true" size={16} />
            Benchmark
          </span>
        </li>
      ) : null}
      {resource.experimental ? (
        <li>
          <span className="meta-badge">
            <FlaskConical aria-hidden="true" size={16} />
            Experimental
          </span>
        </li>
      ) : null}
      {resource.emailGated ? (
        <li>
          <span className="meta-badge" data-tone="warn">
            <Mail aria-hidden="true" size={16} />
            Email required
          </span>
        </li>
      ) : null}
    </ul>
  );
}
