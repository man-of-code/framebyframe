import { Fragment, type JSX } from "react";
import { weeks } from "@/content/weeks";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useProgress } from "@/hooks/useProgress";
import { countDone } from "@/lib/progress";
import type { Progress, Week } from "@/lib/types";
import { WeekFrame, type FrameState } from "./WeekFrame";

function coreRatio(week: Week, progress: Progress): { done: number; total: number } {
  const ids = week.tasks.filter((task) => task.core).map((task) => task.id);
  return { done: countDone(progress, ids), total: ids.length };
}

function frameState(n: number, current: number, done: number, total: number): FrameState {
  if (n === current) return "current";
  if (total > 0 && done === total) return "exposed";
  return "unexposed";
}

export function FilmstripRail(props: {
  orientation: "vertical" | "horizontal";
  compact?: boolean;
  progress?: Progress;
}): JSX.Element {
  const { orientation, compact = false } = props;
  const stored = useProgress();
  const progress = props.progress ?? stored.progress;
  const { week: current } = useCurrentWeek(progress);
  const firstExtension = weeks.findIndex((week) => week.extension);

  return (
    <nav className="filmstrip-nav" aria-label="Weeks">
      <ol
        className="filmstrip"
        data-orientation={orientation}
        data-compact={compact ? "true" : "false"}
      >
        {weeks.map((week, index) => {
          const ratio = coreRatio(week, progress);
          return (
            <Fragment key={week.n}>
              {index === firstExtension ? <li className="filmstrip-splice" aria-hidden="true" /> : null}
              <li>
                <WeekFrame
                  n={week.n}
                  module={week.module}
                  title={week.title}
                  state={frameState(week.n, current, ratio.done, ratio.total)}
                  ratio={ratio.total > 0 ? ratio : undefined}
                  extension={week.extension}
                  heavy={week.heavy}
                  orientation="rail"
                />
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
