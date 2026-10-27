import { useId, type JSX } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { BreakableTitle } from "@/components/BreakableTitle";
import { TOTAL_WEEKS } from "@/lib/week";
import "./filmstrip.css";

export type FrameState = "exposed" | "current" | "unexposed";

export function WeekFrame(props: {
  n: number;
  module: number;
  title: string;
  state: FrameState;
  ratio?: { done: number; total: number };
  hours?: string;
  stage?: string;
  extension?: boolean;
  heavy?: boolean;
  orientation: "rail" | "card" | "cell";
}): JSX.Element {
  const { n, title, state, ratio, hours, stage, extension, heavy, orientation } = props;
  const uid = useId();
  const codeId = `${uid}-code`;
  const titleId = `${uid}-title`;
  const hoursId = `${uid}-hours`;
  const ratioId = `${uid}-ratio`;
  const stageId = `${uid}-stage`;
  const heavyId = `${uid}-heavy`;
  const pad = String(n).padStart(2, "0");
  const total = String(TOTAL_WEEKS).padStart(2, "0");
  const card = orientation === "card";
  const cell = orientation === "cell";
  const cellLabel =
    cell && ratio ? `Week ${n}: ${title}, ${ratio.done} of ${ratio.total} done` : undefined;
  const labelledBy = [
    codeId,
    titleId,
    card && hours ? hoursId : "",
    ratio ? ratioId : "",
    card && stage ? stageId : "",
    heavy ? heavyId : "",
  ].filter(Boolean).join(" ");

  return (
    <Link
      to={`/week/${n}`}
      className="week-frame"
      data-state={state}
      data-orientation={orientation}
      data-extension={extension ? "true" : undefined}
      aria-current={state === "current" ? "step" : undefined}
      aria-label={cellLabel}
      aria-labelledby={cell ? undefined : labelledBy}
    >
      <span id={codeId} className="week-frame-code" aria-hidden={cell ? true : undefined}>
        {cell ? pad : `WK ${pad}`}
        {card ? ` / ${total}` : ""}
      </span>
      {/* Whitespace between the parts: flex and grid drop it from layout, but it keeps the link's visible text spaced like its accessible name. */}
      {card ? " " : null}
      {cell ? null : (
        <span id={titleId} className={card ? "week-frame-title" : "filmstrip-sr"}>
          {card ? <BreakableTitle text={title} /> : title}
        </span>
      )}
      {card ? " " : null}
      {card && (hours || ratio || stage) ? (
        <span className="week-frame-meta">
          {hours ? <span id={hoursId}>{hours}</span> : null}
          {hours ? " " : null}
          {ratio ? (
            <span id={ratioId} className="week-frame-ratio">
              {ratio.done}/{ratio.total}
            </span>
          ) : null}
          {ratio ? " " : null}
          {stage ? <span id={stageId}>{stage}</span> : null}
        </span>
      ) : null}
      {!card && !cell && ratio ? (
        <span id={ratioId} className="filmstrip-sr">
          {ratio.done}/{ratio.total}
        </span>
      ) : null}
      {card && heavy ? " " : null}
      {heavy && !cell ? (
        <span id={heavyId} className="week-frame-chip">
          Heavy
        </span>
      ) : null}
      {state === "exposed" ? <Check className="week-frame-check" aria-label="Complete" size={cell ? 14 : 20} /> : null}
    </Link>
  );
}
