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
  extension?: boolean;
  heavy?: boolean;
  orientation: "rail" | "card";
}): JSX.Element {
  const { n, module, title, state, ratio, extension, heavy, orientation } = props;
  const uid = useId();
  const codeId = `${uid}-code`;
  const titleId = `${uid}-title`;
  const heavyId = `${uid}-heavy`;
  const pad = String(n).padStart(2, "0");
  const total = String(TOTAL_WEEKS).padStart(2, "0");
  const labelledBy = [codeId, titleId, heavy ? heavyId : ""].filter(Boolean).join(" ");

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
      {orientation === "card" && module > 0 ? (
        <span className="week-frame-module">Module {module}</span>
      ) : null}
      <span id={titleId} className={orientation === "card" ? "week-frame-title" : "filmstrip-sr"}>
        {title}
      </span>
      {ratio ? (
        <span className={orientation === "card" ? "week-frame-ratio" : "filmstrip-sr"}>
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
