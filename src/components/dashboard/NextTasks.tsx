import { BookOpen, Clapperboard, Eye, type LucideIcon } from "lucide-react";
import { useState, type JSX } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import type { ProgressApi } from "@/hooks/ProgressProvider";
import type { Task } from "@/lib/types";

const ICONS: Record<Task["kind"], LucideIcon> = {
  watch: Eye,
  read: BookOpen,
  do: Clapperboard,
};

const KIND: Record<Task["kind"], string> = {
  watch: "Watch",
  read: "Read",
  do: "Do",
};

export function NextTasks(props: { tasks: Task[]; api: ProgressApi }): JSX.Element {
  const { tasks, api } = props;
  const [announcement, setAnnouncement] = useState("");

  return (
    <section className="stack" aria-labelledby="next-up-heading">
      <h2 id="next-up-heading">Next up</h2>
      {tasks.length === 0 ? (
        <p className="page-copy">Nothing in this week is still open.</p>
      ) : (
        <ul className="task-list">
          {tasks.map((task) => {
            const done = api.progress.done[task.id] === true;
            const Icon = ICONS[task.kind];
            return (
              <li key={task.id}>
                <label className="task-row">
                  <Checkbox
                    checked={done}
                    aria-label={`${KIND[task.kind]}: ${task.text}`}
                    onCheckedChange={() => {
                      const next = !done;
                      api.toggle(task.id);
                      setAnnouncement(`${task.text} ${next ? "marked done" : "marked not done"}`);
                    }}
                  />
                  <Icon aria-hidden="true" size={16} />
                  <span className="task-copy">
                    <span>{task.text}</span>
                    <span className="mono">{task.minutes} min</span>
                  </span>
                </label>
              </li>
            );
          })}
        </ul>
      )}
      <p className="visually-hidden" aria-live="polite">{announcement}</p>
    </section>
  );
}
