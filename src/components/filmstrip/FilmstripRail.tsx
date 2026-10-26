import { Fragment, type JSX } from "react";
import { weeks } from "@/content/weeks";
import { useCurrentWeek } from "@/hooks/useCurrentWeek";
import { useProgress } from "@/hooks/useProgress";
import type { Progress } from "@/lib/types";
import { weekCompletion } from "@/lib/week";
import { WeekFrame, type FrameState } from "./WeekFrame";

function frameState(n: number, current: number, complete: boolean): FrameState {
  if (n === current) return "current";
  return complete ? "exposed" : "unexposed";
}

export function FilmstripRail(props: {
  orientation: "vertical" | "horizontal" | "grid";
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
        data-lenis-prevent={orientation === "horizontal" ? "" : undefined}
        data-orientation={orientation}
        data-compact={compact ? "true" : "false"}
      >
        {weeks.map((week, index) => {
          const ratio = weekCompletion(week, progress);
          return (
            <Fragment key={week.n}>
              {index === firstExtension ? <li className="filmstrip-splice" aria-hidden="true" /> : null}
              <li>
                <WeekFrame
                  n={week.n}
                  module={week.module}
                  title={week.title}
                  state={frameState(week.n, current, ratio.complete)}
                  ratio={ratio}
                  extension={week.extension}
                  heavy={week.heavy}
                  orientation={orientation === "grid" ? "cell" : "rail"}
                />
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
