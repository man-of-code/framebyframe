import { render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { STORAGE_KEY, emptyProgress } from "@/lib/progress";
import { Home } from "@/routes/Dashboard";

describe("dual-state home", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date("2026-10-24T12:00:00"));
  });

  afterEach(() => vi.useRealTimers());

  it("shows the landing when no start date is stored", () => {
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByRole("heading", { level: 1 })).toBeTruthy();
    expect(screen.queryByText(/next up/i)).toBeNull();
  });

  it("shows the dashboard once a start date exists", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...emptyProgress, startDate: "2026-10-22" }));
    render(<MemoryRouter><Home /></MemoryRouter>);
    expect(screen.getByText(/WK 0?1 \/ 16/)).toBeTruthy();
  });
});
