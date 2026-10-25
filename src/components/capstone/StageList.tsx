import type { JSX } from "react";
import type { CapstoneStage, Progress } from "@/lib/types";

const STATUSES = ["todo", "doing", "done"] as const;
type StageStatus = (typeof STATUSES)[number];

const LABEL: Record<StageStatus, string> = {
  todo: "To do",
  doing: "Doing",
  done: "Done",
};

function weekRange(weeks: number[]): string {
  const sorted = [...weeks].sort((a, b) => a - b);
  if (sorted.length === 0) return "No weeks";
  if (sorted.length === 1) return `Week ${sorted[0]}`;
  return `Weeks ${sorted.join(", ")}`;
}

export function StageList(props: {
  stages: CapstoneStage[];
  capstone: Progress["capstone"];
  onStage: (id: string, status: StageStatus) => void;
  onCeremony: () => void;
}): JSX.Element {
  const { stages, capstone, onStage, onCeremony } = props;
  const finalId = stages[stages.length - 1]?.id;

  function change(id: string, status: StageStatus) {
    const previous = capstone[id] ?? "todo";
    onStage(id, status);
    if (id === finalId && status === "done" && previous !== "done") onCeremony();
  }

  return (
    <ol className="filmstrip" data-orientation="vertical" aria-label="Capstone stages">
      {stages.map((stage) => {
        const status = capstone[stage.id] ?? "todo";
        return (
          <li key={stage.id}>
            <article className="stage" data-status={status}>
              <p className="eyebrow">
                Stage {String(stage.order).padStart(2, "0")} / {String(stages.length).padStart(2, "0")}
                {" · "}
                {weekRange(stage.weeks)}
              </p>
              <h2>{stage.label}</h2>
              <ul className="criteria">
                {stage.criteria.map((criterion, index) => (
                  <li key={`${stage.id}-${index}`}>{criterion}</li>
                ))}
              </ul>
              <div className="status-row" role="radiogroup" aria-label={`${stage.label} status`}>
                {STATUSES.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className="status-choice"
                    role="radio"
                    aria-checked={status === option}
                    onClick={() => change(stage.id, option)}
                  >
                    {LABEL[option]}
                  </button>
                ))}
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
