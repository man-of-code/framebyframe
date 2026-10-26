import { act, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { ProgressProvider, useProgressContext, type ProgressApi } from "@/hooks/ProgressProvider";
import { emptyProgress, setNote } from "@/lib/progress";
import { NotesField } from "./NotesField";

let api: ProgressApi | null = null;

function Capture() {
  api = useProgressContext();
  return null;
}

describe("NotesField", () => {
  beforeEach(() => {
    localStorage.clear();
    api = null;
  });

  it("shows a note that an import replaced while the field was open", () => {
    render(
      <ProgressProvider>
        <Capture />
        <NotesField assignmentId="a1" />
      </ProgressProvider>,
    );
    expect((screen.getByLabelText("Notes") as HTMLTextAreaElement).value).toBe("");
    act(() => api?.replace(setNote(emptyProgress, "a1", "imported note")));
    expect((screen.getByLabelText("Notes") as HTMLTextAreaElement).value).toBe("imported note");
  });
});
