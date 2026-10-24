import { ChevronLeft, ChevronRight, TriangleAlert } from "lucide-react";
import type { JSX } from "react";
import { Link } from "react-router-dom";
import { TOTAL_WEEKS } from "@/lib/week";
import type { Week } from "@/lib/types";

export function WeekHeader(props: {
  week: Week;
  moduleTitle: string;
  stageLabel: string | null;
  hoursLabel: string | null;
}): JSX.Element {
  const { week, moduleTitle, stageLabel, hoursLabel } = props;
  const pad = String(week.n).padStart(2, "0");
  const total = String(TOTAL_WEEKS).padStart(2, "0");
  const moduleBit = week.module > 0
    ? `Module ${String(week.module).padStart(2, "0")} · ${moduleTitle}`
    : "Buffer";

  return (
    <header className="week-header grain">
      <div className="week-header-body">
        <p className="eyebrow">WK {pad} / {total} · {moduleBit}</p>
        <h1>{week.title}</h1>
        <ul className="topic-row">
          {week.topics.map((topic) => (
            <li key={topic} className="topic-chip">{topic}</li>
          ))}
        </ul>
        <p className="week-meta">
          {hoursLabel ? <span className="mono">{hoursLabel}</span> : null}
          {stageLabel ? <span>Capstone · {stageLabel}</span> : null}
          {week.heavy ? (
            <span className="heavy-chip">
              <TriangleAlert aria-hidden="true" size={16} />
              Heavy
            </span>
          ) : null}
        </p>
        <nav className="week-nav" aria-label="Adjacent weeks">
          {week.n > 1 ? (
            <Link to={`/week/${week.n - 1}`}>
              <ChevronLeft aria-hidden="true" size={16} />
              Previous week
            </Link>
          ) : (
            <span aria-disabled="true">Previous week</span>
          )}
          {week.n < TOTAL_WEEKS ? (
            <Link to={`/week/${week.n + 1}`}>
              Next week
              <ChevronRight aria-hidden="true" size={16} />
            </Link>
          ) : (
            <span aria-disabled="true">Next week</span>
          )}
        </nav>
      </div>
    </header>
  );
}
