import { useState, type JSX } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { WithProgress, type ProgressApi } from "@/hooks/ProgressProvider";
import { checkId } from "@/lib/week";

export function DoneWhenChecklist(props: { assignmentId: string; checks: string[] }): JSX.Element {
  return (
    <WithProgress>
      {(api) => <ChecklistBody {...props} api={api} />}
    </WithProgress>
  );
}

function ChecklistBody({
  assignmentId,
  checks,
  api,
}: {
  assignmentId: string;
  checks: string[];
  api: ProgressApi;
}): JSX.Element {
  const [announcement, setAnnouncement] = useState("");

  return (
    <>
      <ul className="check-list" aria-label="Done when">
        {checks.map((check, index) => {
          const id = checkId(assignmentId, index);
          const done = api.progress.done[id] === true;
          return (
            <li key={id}>
              <label className="task-row">
                <Checkbox
                  className="task-checkbox"
                  checked={done}
                  aria-label={check}
                  onCheckedChange={() => {
                    const next = !done;
                    api.toggle(id);
                    setAnnouncement(`${check} ${next ? "marked done" : "marked not done"}`);
                  }}
                />
                <span>{check}</span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="visually-hidden" aria-live="polite">{announcement}</p>
    </>
  );
}
