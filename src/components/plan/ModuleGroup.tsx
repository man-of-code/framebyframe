import { useId, type JSX } from "react";
import { Letterbox } from "@/components/atmosphere/Letterbox";
import { WeekFrame, type FrameState } from "@/components/filmstrip/WeekFrame";
import { capstone } from "@/content/capstone";
import type { Progress, Week } from "@/lib/types";
import { formatHours, weekCompletion, weekMinutes } from "@/lib/week";

function frameState(n: number, current: number, complete: boolean): FrameState {
  if (n === current) return "current";
  return complete ? "exposed" : "unexposed";
}

function stageLabel(id: string | undefined): string | undefined {
  if (!id) return undefined;
  return capstone.find((stage) => stage.id === id)?.label;
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
          const ratio = weekCompletion(week, progress);
          return (
            <li key={week.n}>
              <WeekFrame
                n={week.n}
                module={week.module}
                moduleLabel={week.module === 0 ? "Buffer" : undefined}
                title={week.title}
                state={frameState(week.n, current, ratio.complete)}
                ratio={ratio}
                hours={formatHours(weekMinutes(week))}
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
