import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { WeekFrame } from "./WeekFrame";

const base = { n: 7, module: 4, title: "Lighting", orientation: "card" as const };
const renderFrame = (p = {}) =>
  render(<MemoryRouter><WeekFrame {...base} state="current" {...p} /></MemoryRouter>);

describe("WeekFrame", () => {
  it("renders the week number as padded timecode", () => {
    renderFrame();
    expect(screen.getByText(/WK 07/)).toBeTruthy();
  });

  it("marks the exposed state accessibly, not by colour alone", () => {
    renderFrame({ state: "exposed" });
    expect(screen.getByRole("link").getAttribute("aria-current")).toBeNull();
    expect(screen.getByLabelText(/complete/i)).toBeTruthy();
  });

  it("marks the current week with aria-current", () => {
    renderFrame({ state: "current" });
    expect(screen.getByRole("link").getAttribute("aria-current")).toBe("step");
  });

  it("shows the heavy-week chip", () => {
    renderFrame({ heavy: true });
    expect(screen.getByText(/heavy/i)).toBeTruthy();
  });
});
