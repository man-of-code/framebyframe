import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter, Outlet, Route, Routes } from "react-router-dom";
import { emptyProgress } from "@/lib/progress";
import type { Progress } from "@/lib/types";
import { Plan } from "./Plan";

function renderPlan(progress: Progress = emptyProgress) {
  return render(
    <MemoryRouter initialEntries={["/plan"]}>
      <Routes>
        <Route element={<Outlet context={{ progress }} />}>
          <Route path="/plan" element={<Plan />} />
        </Route>
      </Routes>
    </MemoryRouter>,
  );
}

describe("Plan", () => {
  it("groups 16 weeks under 7 modules and a spliced buffer", () => {
    renderPlan();

    const writing = screen.getByRole("region", { name: "Writing" });
    expect(within(writing).getAllByRole("link")).toHaveLength(2);
    expect(within(screen.getByRole("region", { name: "Pre-production" })).getAllByRole("link")).toHaveLength(1);
    expect(within(screen.getByRole("region", { name: "Directing" })).getAllByRole("link")).toHaveLength(3);
    expect(within(screen.getByRole("region", { name: "Cinematography" })).getAllByRole("link")).toHaveLength(2);
    expect(within(screen.getByRole("region", { name: "Editing and Sound" })).getAllByRole("link")).toHaveLength(2);
    expect(within(screen.getByRole("region", { name: "Post-production and VFX" })).getAllByRole("link")).toHaveLength(1);
    expect(within(screen.getByRole("region", { name: "Marketing, Distribution and Career" })).getAllByRole("link")).toHaveLength(1);

    const buffer = screen.getByRole("region", { name: "Buffer" });
    expect(within(buffer).getAllByRole("link")).toHaveLength(4);
    expect(within(buffer).getByText(/no mentors, no supplied footage, and thin brochure coverage in sound and VFX/i)).toBeTruthy();
    expect(buffer.compareDocumentPosition(writing) & Node.DOCUMENT_POSITION_PRECEDING).toBeTruthy();
  });

  it("shows hours, the completion ratio, and the capstone stage on a frame", () => {
    renderPlan();
    const week = within(screen.getByRole("region", { name: "Writing" })).getByRole("link", { name: /WK 01/ });
    expect(week.getAttribute("href")).toBe("/week/1");
    expect(week.textContent).toMatch(/5h/);
    expect(week.textContent).toMatch(/0\/3/);
    expect(week.textContent).toMatch(/Premise/);
  });

  it("outlines the current week and exposes a completed week", () => {
    renderPlan({
      ...emptyProgress,
      weekOverride: 7,
      done: { "w1-watch": true, "w1-read": true, "w1-do": true },
    });

    const writing = screen.getByRole("region", { name: "Writing" });
    const done = within(writing).getByRole("link", { name: /WK 01/ });
    expect(done.getAttribute("aria-current")).toBeNull();
    expect(within(writing).getByLabelText(/complete/i)).toBeTruthy();

    const current = within(screen.getByRole("region", { name: "Cinematography" })).getByRole("link", { name: /WK 07/ });
    expect(current.getAttribute("aria-current")).toBe("step");
  });
});
