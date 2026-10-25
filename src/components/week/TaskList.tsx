import { useState, type JSX } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { WithProgress, type ProgressApi } from "@/hooks/ProgressProvider";
import type { Task } from "@/lib/types";
import "./week.css";

export function TaskList(props: { kind: "watch" | "read" | "do"; tasks: Task[] }): JSX.Element {
  return (
    <WithProgress>
      {(api) => <TaskListBody {...props} api={api} />}
    </WithProgress>
  );
}

function TaskListBody({
  kind,
  tasks,
  api,
}: {
  kind: "watch" | "read" | "do";
  tasks: Task[];
  api: ProgressApi;
}): JSX.Element {
  const [announcement, setAnnouncement] = useState("");
  const stretchAt = tasks.findIndex((task) => !task.core);

  return (
    <>
      <ul className="task-list" aria-label={`${kind} tasks`}>
        {tasks.map((task, index) => {
          const done = api.progress.done[task.id] === true;
          return (
            <li key={task.id}>
              {index === stretchAt ? <p className="stretch-divider">Stretch</p> : null}
              <label className="task-row">
                <Checkbox
                  className="task-checkbox"
                  checked={done}
                  aria-label={task.text}
                  onCheckedChange={() => {
                    const next = !done;
                    api.toggle(task.id);
                    setAnnouncement(`${task.text} ${next ? "marked done" : "marked not done"}`);
                  }}
                />
                <span className="task-copy">
                  <span>{task.text}</span>
                  <span className="mono">{task.minutes} min</span>
                </span>
              </label>
            </li>
          );
        })}
      </ul>
      <p className="visually-hidden" aria-live="polite">{announcement}</p>
    </>
  );
}
