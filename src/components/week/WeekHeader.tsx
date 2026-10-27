import { ChevronLeft, ChevronRight, TriangleAlert } from "lucide-react";
import type { JSX } from "react";
import { Link } from "react-router-dom";
import { BreakableTitle } from "@/components/BreakableTitle";
import { PlaybillHeader } from "@/components/PageHeader";
import { Badge } from "@/components/ui/badge";
import { toRoman } from "@/lib/title";
import { TOTAL_WEEKS } from "@/lib/week";
import type { Week } from "@/lib/types";

export function WeekHeader(props: {
  week: Week;
  moduleTitle: string;
  stageLabel: string | null;
  hoursLabel: string | null;
  /** This week is the learner's current week: its number is brass (design-system.md 3.3). */
  current?: boolean;
}): JSX.Element {
  const { week, moduleTitle, stageLabel, hoursLabel, current = false } = props;
  const pad = String(week.n).padStart(2, "0");
  const total = String(TOTAL_WEEKS).padStart(2, "0");
  const eyebrow = week.module > 0 ? `Module ${toRoman(week.module)} · ${moduleTitle}` : "Buffer";

  return (
    <PlaybillHeader className="week-header" framed eyebrow={eyebrow} title={<BreakableTitle text={week.title} />}>
      <div className="week-header-extras">
        <div className="hud-frame">
          <p className="hud-readout">
            WK <strong className={current ? "hud-current" : undefined}>{pad}</strong> / {total}
            {hoursLabel ? (
              <>
                {" · "}
                <strong>{hoursLabel}</strong>
              </>
            ) : null}
            {stageLabel ? ` · Capstone ${stageLabel}` : ""}
          </p>
        </div>
        {week.heavy ? (
          <Badge variant="warn">
            <TriangleAlert aria-hidden="true" />
            Heavy
          </Badge>
        ) : null}
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
    </PlaybillHeader>
  );
}
