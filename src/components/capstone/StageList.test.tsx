import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it, vi } from "vitest";
import type { CapstoneStage, Progress } from "@/lib/types";
import { StageList } from "./StageList";

const stages: CapstoneStage[] = [
  { id: "premise", label: "Premise", order: 1, weeks: [1], criteria: ["c"] },
];

function Harness({ onCeremony = () => {} }: { onCeremony?: () => void }) {
  const [capstone, setCapstone] = useState<Progress["capstone"]>({});
  return (
    <StageList
      stages={stages}
      capstone={capstone}
      onStage={(id, status) => setCapstone((current) => ({ ...current, [id]: status }))}
      onCeremony={onCeremony}
    />
  );
}

describe("StageList status radiogroup", () => {
  it("is one tab stop, and arrow keys move focus and selection", async () => {
    render(<Harness />);
    const todo = screen.getByRole("radio", { name: "To do" });
    expect(todo.getAttribute("tabindex")).toBe("0");
    expect(screen.getByRole("radio", { name: "Doing" }).getAttribute("tabindex")).toBe("-1");

    todo.focus();
    await userEvent.keyboard("{ArrowRight}");
    const doing = screen.getByRole("radio", { name: "Doing" });
    expect(document.activeElement).toBe(doing);
    expect(doing.getAttribute("aria-checked")).toBe("true");

    await userEvent.keyboard("{ArrowRight}");
    expect(screen.getByRole("radio", { name: "Done" }).getAttribute("aria-checked")).toBe("true");
  });

  it("does not wrap, so ArrowLeft on To do cannot reach Done or fire the ceremony", async () => {
    const onCeremony = vi.fn();
    render(<Harness onCeremony={onCeremony} />);
    screen.getByRole("radio", { name: "To do" }).focus();
    await userEvent.keyboard("{ArrowLeft}{ArrowUp}");
    expect(screen.getByRole("radio", { name: "To do" }).getAttribute("aria-checked")).toBe("true");
    expect(onCeremony).not.toHaveBeenCalled();
  });
});
