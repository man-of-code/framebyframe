import type { JSX } from "react";
import type { Week } from "@/lib/types";
import { DoneWhenChecklist } from "./DoneWhenChecklist";

export function AssignmentCard({ assignment }: { assignment: Week["assignment"] }): JSX.Element {
  return (
    <article className="assignment-card clapper-stripe">
      <h3>Assignment</h3>
      <p>{assignment.text}</p>
      <DoneWhenChecklist assignmentId={assignment.id} checks={assignment.checks} />
    </article>
  );
}
