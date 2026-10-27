import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { emptyProgress } from "@/lib/progress";
import { StickyCta } from "./StickyCta";
import { stickyCtaRoute } from "./stickyRoute";

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
