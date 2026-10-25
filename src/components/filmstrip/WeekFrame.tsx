import { useId, type JSX } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
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
  moduleLabel?: string;
  extension?: boolean;
  heavy?: boolean;
  orientation: "rail" | "card";
}): JSX.Element {
  const { n, module, title, state, ratio, hours, stage, moduleLabel, extension, heavy, orientation } = props;
  const uid = useId();
  const codeId = `${uid}-code`;
  const moduleId = `${uid}-module`;
  const titleId = `${uid}-title`;
  const hoursId = `${uid}-hours`;
  const ratioId = `${uid}-ratio`;
  const stageId = `${uid}-stage`;
  const heavyId = `${uid}-heavy`;
  const pad = String(n).padStart(2, "0");
  const total = String(TOTAL_WEEKS).padStart(2, "0");
  const card = orientation === "card";
  const moduleText = moduleLabel ?? (module > 0 ? `Module ${module}` : "");
  const labelledBy = [
    codeId,
    card && moduleText ? moduleId : "",
    titleId,
    card && hours ? hoursId : "",
    card && ratio ? ratioId : "",
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
      aria-labelledby={labelledBy}
    >
      <span id={codeId} className="week-frame-code">
        WK {pad}
        {orientation === "card" ? ` / ${total}` : ""}
      </span>
      {card && moduleText ? (
        <span id={moduleId} className="week-frame-module">{moduleText}</span>
      ) : null}
      <span id={titleId} className={card ? "week-frame-title" : "filmstrip-sr"}>
        {title}
      </span>
      {card && (hours || ratio || stage) ? (
        <span className="week-frame-meta">
          {hours ? <span id={hoursId}>{hours}</span> : null}
          {ratio ? (
            <span id={ratioId} className="week-frame-ratio">
              {ratio.done}/{ratio.total}
            </span>
          ) : null}
          {stage ? <span id={stageId}>{stage}</span> : null}
        </span>
      ) : null}
      {!card && ratio ? (
        <span className="filmstrip-sr">
          {ratio.done}/{ratio.total}
        </span>
      ) : null}
      {heavy ? (
        <span id={heavyId} className="week-frame-chip">
          Heavy
        </span>
      ) : null}
      {state === "exposed" ? <Check className="week-frame-check" aria-label="Complete" size={20} /> : null}
    </Link>
  );
}
