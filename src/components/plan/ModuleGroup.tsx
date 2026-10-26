import { useId, type JSX } from "react";
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
  const first = weeks[0];
  const last = weeks[weeks.length - 1];
  const pad = (n: number) => String(n).padStart(2, "0");
  const range = first && last ? (first.n === last.n ? pad(first.n) : `${pad(first.n)}–${pad(last.n)}`) : "";
  const minutes = weeks.reduce((sum, week) => sum + weekMinutes(week), 0);

  return (
    <section className="module-group" aria-labelledby={titleId} data-spliced={spliced ? "true" : undefined}>
      {spliced ? <div className="plan-splice" aria-hidden="true" /> : null}
      <div className="module-head playbill-frame">
        <p className="eyebrow">{eyebrow}</p>
        <h2 id={titleId}>{title}</h2>
        {range ? (
          <p className="hud-readout">
            WK {range} · <strong>{formatHours(minutes)}</strong>
          </p>
        ) : null}
        {note ? <p className="module-note">{note}</p> : null}
      </div>
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
