import type { JSX } from "react";
import type { CapstoneStage, Progress } from "@/lib/types";

const STATUSES = ["todo", "doing", "done"] as const;
type StageStatus = (typeof STATUSES)[number];

const LABEL: Record<StageStatus, string> = {
  todo: "To do",
  doing: "Doing",
  done: "Done",
};

// WAI-ARIA radio group: arrows move focus and selection; Tab enters at the checked option.
const ARROW_STEP: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };

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
                {STATUSES.map((option, index) => (
                  <button
                    key={option}
                    type="button"
                    className="status-choice"
                    role="radio"
                    aria-checked={status === option}
                    tabIndex={status === option ? 0 : -1}
                    onClick={() => change(stage.id, option)}
                    onKeyDown={(event) => {
                      const step = ARROW_STEP[event.key];
                      if (step === undefined) return;
                      event.preventDefault();
                      const nextIndex = (index + step + STATUSES.length) % STATUSES.length;
                      const radios = event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
                      radios?.[nextIndex]?.focus();
                      change(stage.id, STATUSES[nextIndex]);
                    }}
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
