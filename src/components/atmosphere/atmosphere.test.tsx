import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { MemoryRouter } from "react-router-dom";
import { ModuleGroup } from "@/components/plan/ModuleGroup";
import { ResourceCard } from "@/components/resource/ResourceCard";
import { AssignmentCard } from "@/components/week/AssignmentCard";
import { WeekHeader } from "@/components/week/WeekHeader";
import { useProgress } from "@/hooks/useProgress";
import { emptyProgress } from "@/lib/progress";
import type { Resource, Week } from "@/lib/types";
import { Landing } from "@/routes/Landing";
import { GrainSurface } from "./GrainSurface";

function LandingFrame() {
  const api = useProgress();
  return <Landing api={api} replay={false} />;
}

const week: Week = {
  n: 1,
  module: 1,
  title: "Open on an image",
  topics: ["shot"],
  tasks: [],
  assignment: { id: "w1-assignment", text: "Shoot one frame.", checks: ["It exists.", "It is one shot."] },
  community: "none",
};

const resource: Resource = {
  id: "r1",
  title: "A ledger row",
  url: "https://example.com",
  type: "article",
  topics: ["writing"],
  weeks: [1],
  level: "beginner",
  cost: "free",
  language: "en",
  why: "Because the test needs a card.",
  verified: "2026-10-22",
};

function frameOf(text: string): HTMLElement {
  const node = screen.getByText(text);
  const frame = node.closest(".grain");
  if (!(frame instanceof HTMLElement)) throw new Error(`${text} is not inside a grain surface`);
  return frame;
}

describe("static atmosphere", () => {
  it("keeps grain text in the upper layer", () => {
    render(<GrainSurface className="week-header"><p>Frame</p></GrainSurface>);
    const frame = frameOf("Frame");
    expect(frame.classList.contains("grain")).toBe(true);
    expect(frame.classList.contains("week-header")).toBe(true);
    expect(frame.textContent).toContain("Frame");
  });

  it("puts the landing title in a playbill frame beside a film-grain screen, and the week header and a plan module in playbill frames", () => {
    render(
      <MemoryRouter>
        <LandingFrame />
        <WeekHeader week={week} moduleTitle="Writing" stageLabel={null} hoursLabel="1h" />
        <ModuleGroup eyebrow="Module I" title="Writing" weeks={[week]} current={1} progress={emptyProgress} />
      </MemoryRouter>,
    );

    const heroTitle = screen.getByRole("heading", { name: "Frame by Frame" });
    expect(heroTitle.closest(".playbill-frame")).toBeTruthy();
    expect(heroTitle.closest(".hero-screen")).toBeNull();
    const hero = heroTitle.closest(".hero");
    expect(hero?.classList.contains("aurora")).toBe(true);
    expect(hero?.classList.contains("grain")).toBe(false);
    const heroScreen = hero?.querySelector(".hero-screen");
    expect(heroScreen?.classList.contains("grain--film")).toBe(true);
    expect(heroScreen?.textContent).toBe("");
    expect(hero?.querySelector(".halftone")).toBeTruthy();
    const weekTitle = screen.getByRole("heading", { name: "Open on an image" });
    expect(weekTitle.closest(".playbill-frame")).toBeTruthy();
    expect(weekTitle.closest(".aurora")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Writing", level: 2 }).closest(".playbill-frame")).toBeTruthy();
  });

  it("leaves library cards ungained and marks the assignment with the clapper stripe", () => {
    render(
      <>
        <ResourceCard resource={resource} />
        <AssignmentCard assignment={week.assignment} />
      </>,
    );
    expect(screen.getByText("A ledger row").closest(".grain")).toBeNull();
    expect(screen.getByText("Shoot one frame.").closest("article")?.classList.contains("clapper-stripe")).toBe(true);
  });
});
