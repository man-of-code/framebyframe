import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { TaskList } from "./TaskList";
import { STORAGE_KEY } from "@/lib/progress";

const tasks = [
  { id: "t1", kind: "read" as const, text: "Read the thing", resourceIds: [], minutes: 30, core: true },
  { id: "t2", kind: "read" as const, text: "Stretch goal", resourceIds: [], minutes: 20, core: false },
];

describe("TaskList", () => {
  beforeEach(() => localStorage.clear());

  it("separates stretch tasks from core tasks", () => {
    render(<MemoryRouter><TaskList kind="read" tasks={tasks} /></MemoryRouter>);
    expect(screen.getByText(/^stretch$/i)).toBeTruthy();
  });

  it("persists a ticked task to storage", async () => {
    render(<MemoryRouter><TaskList kind="read" tasks={tasks} /></MemoryRouter>);
    await userEvent.click(screen.getByRole("checkbox", { name: /Read the thing/ }));
    await new Promise((r) => setTimeout(r, 400));
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY)!).done.t1).toBe(true);
  });
});
