import type { JSX } from "react";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { afterEach, describe, expect, it } from "vitest";
import { STORAGE_KEY, emptyProgress } from "@/lib/progress";
import { Home } from "@/routes/Dashboard";
import { StickyCta } from "./StickyCta";
import { PAGE_CTA, stickyCtaRoute } from "./stickyRoute";

describe("StickyCta route rule", () => {
  it("allows only / and /plan", () => {
    expect(stickyCtaRoute("/")).toBe(true);
    expect(stickyCtaRoute("/plan")).toBe(true);
    for (const path of ["/week/3", "/library", "/toolkit", "/capstone", "/privacy", "/terms", "/about", "/contact", "/thank-you"]) {
      expect(stickyCtaRoute(path)).toBe(false);
    }
  });

  it("renders on /plan and nothing on /week/3 or /library", () => {
    const at = (path: string) =>
      render(
        <MemoryRouter initialEntries={[path]}>
          <StickyCta progress={emptyProgress} />
        </MemoryRouter>,
      ).container;
    expect(at("/plan").querySelector(".sticky-cta")).not.toBeNull();
    expect(at("/week/3").querySelector(".sticky-cta")).toBeNull();
    expect(at("/library").querySelector(".sticky-cta")).toBeNull();
  });
});

describe("StickyCta page-CTA selector", () => {
  afterEach(() => localStorage.clear());

  const inMain = (node: JSX.Element) =>
    render(<MemoryRouter><main id="main">{node}</main></MemoryRouter>).container;

  it("finds the landing hero CTA and the start-date button", () => {
    const found = [...inMain(<Home />).querySelectorAll(PAGE_CTA)].map((node) => node.textContent);
    expect(found).toContain("Start week 1");
    expect(found).toContain("Set start date");
  });

  it("finds the dashboard's Open this week", () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...emptyProgress, startDate: "2026-10-22" }));
    const found = [...inMain(<Home />).querySelectorAll(PAGE_CTA)].map((node) => node.textContent);
    expect(found).toEqual(["Open this week"]);
  });
});
