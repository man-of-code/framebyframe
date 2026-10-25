import { useEffect, useId, useRef, useState, type JSX } from "react";
import { Textarea } from "@/components/ui/textarea";
import { WithProgress, type ProgressApi } from "@/hooks/ProgressProvider";

const SAVE_MS = 500;

export function NotesField({ assignmentId }: { assignmentId: string }): JSX.Element {
  return (
    <WithProgress>
      {(api) => <NotesBody assignmentId={assignmentId} api={api} />}
    </WithProgress>
  );
}

function NotesBody({ assignmentId, api }: { assignmentId: string; api: ProgressApi }): JSX.Element {
  const fieldId = useId();
  const { note } = api;
  const stored = api.progress.notes[assignmentId] ?? "";
  const [value, setValue] = useState(stored);
  const [saved, setSaved] = useState(false);
  const valueRef = useRef(value);
  const savedText = useRef(stored);

  useEffect(() => {
    valueRef.current = value;
    if (value === savedText.current) return;
    setSaved(false);
    const timer = window.setTimeout(() => {
      note(assignmentId, value);
      savedText.current = value;
      setSaved(true);
    }, SAVE_MS);
    return () => window.clearTimeout(timer);
  }, [assignmentId, note, value]);

  useEffect(() => {
    return () => {
      if (valueRef.current !== savedText.current) note(assignmentId, valueRef.current);
    };
  }, [assignmentId, note]);

  return (
    <div className="notes-field">
      <label htmlFor={fieldId}>Notes</label>
      <Textarea
        id={fieldId}
        value={value}
        onChange={(event) => setValue(event.target.value)}
      />
      <p className="notes-saved" aria-live="polite">
        {value !== savedText.current ? "Saving" : saved ? "Saved" : ""}
      </p>
    </div>
  );
}
