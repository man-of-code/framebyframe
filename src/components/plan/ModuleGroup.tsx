import { useId, type JSX } from "react";
import { Letterbox } from "@/components/atmosphere/Letterbox";
import { WeekFrame, type FrameState } from "@/components/filmstrip/WeekFrame";
import { content } from "@/content";
import { countDone } from "@/lib/progress";
import type { Progress, Week } from "@/lib/types";

function coreRatio(week: Week, progress: Progress): { done: number; total: number } {
  const ids = week.tasks.filter((task) => task.core).map((task) => task.id);
  return { done: countDone(progress, ids), total: ids.length };
}

function frameState(n: number, current: number, done: number, total: number): FrameState {
  if (n === current) return "current";
  if (total > 0 && done === total) return "exposed";
  return "unexposed";
}

function hoursLabel(week: Week): string {
  const minutes = week.tasks.reduce((sum, task) => sum + task.minutes, 0);
  const hours = minutes / 60;
  return Number.isInteger(hours) ? `${hours}h` : `${hours.toFixed(1)}h`;
}

function stageLabel(id: string | undefined): string | undefined {
  if (!id) return undefined;
  return content.capstone.find((stage) => stage.id === id)?.label;
}

export function ModuleGroup(props: {
  eyebrow: string;
  title: string;
  note?: string;
  spliced?: boolean;
  weeks: Week[];
  current: number;
  progress: Progress;
}): JSX.Element {
  const { eyebrow, title, note, spliced = false, weeks, current, progress } = props;
  const titleId = useId();

  return (
    <section className="module-group" aria-labelledby={titleId} data-spliced={spliced ? "true" : undefined}>
      {spliced ? <div className="plan-splice" aria-hidden="true" /> : null}
      <Letterbox>
        <div className="module-head">
          <p className="eyebrow">{eyebrow}</p>
          <h2 id={titleId}>{title}</h2>
          {note ? <p className="module-note">{note}</p> : null}
        </div>
      </Letterbox>
      <ol className="module-frames filmstrip" data-orientation="vertical">
        {weeks.map((week) => {
          const ratio = coreRatio(week, progress);
          return (
            <li key={week.n}>
              <WeekFrame
                n={week.n}
                module={week.module}
                moduleLabel={week.module === 0 ? "Buffer" : undefined}
                title={week.title}
                state={frameState(week.n, current, ratio.done, ratio.total)}
                ratio={ratio}
                hours={hoursLabel(week)}
                stage={stageLabel(week.capstoneStage)}
                extension={week.extension}
                heavy={week.heavy}
                orientation="card"
              />
            </li>
          );
        })}
      </ol>
    </section>
  );
}
