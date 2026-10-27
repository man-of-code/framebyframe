import { render, screen, within } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { weeks } from "@/content/weeks";
import { emptyProgress } from "@/lib/progress";
import { Root } from "@/routes/Root";
import { applyViewportCss } from "@/testing/viewport-css";
import { LeftRail } from "./LeftRail";

function stubMatchMedia(matchesMin768: boolean) {
  window.matchMedia = ((query: string) => ({
    matches: query === "(min-width: 768px)" ? matchesMin768 : false,
    media: query,
    onchange: null,
    addEventListener: () => {},
    removeEventListener: () => {},
    addListener: () => {},
    removeListener: () => {},
    dispatchEvent: () => false,
  })) as typeof window.matchMedia;
}

describe("LeftRail", () => {
  beforeEach(() => stubMatchMedia(true));

  const renderRail = () =>
    render(
      <MemoryRouter>
        <LeftRail week={1} progress={emptyProgress} />
      </MemoryRouter>,
    );

  it("opts out of Lenis and orders brand, readout, nav, theme, then the filmstrip", () => {
    const { container } = renderRail();
    const rail = container.querySelector("aside.left-rail")!;
    expect(rail.hasAttribute("data-lenis-prevent")).toBe(true);

    const primary = screen.getByRole("navigation", { name: "Primary" });
    const theme = screen.getByLabelText("Color theme");
    const strip = screen.getByRole("navigation", { name: "Weeks" });
    const before = (a: Element, b: Element) =>
      Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);
    expect(before(screen.getByText("Frame by Frame"), screen.getByLabelText(/^Week 1 of/))).toBe(true);
    expect(before(screen.getByLabelText(/^Week 1 of/), primary)).toBe(true);
    expect(before(primary, theme)).toBe(true);
    expect(before(theme, strip)).toBe(true);
  });

  it("labels every frame with title and progress and marks the current week", () => {
    renderRail();
    const strip = screen.getByRole("navigation", { name: "Weeks" });
    const links = within(strip).getAllByRole("link");
    expect(links).toHaveLength(weeks.length);
    const first = weeks[0]!;
    expect(links[0]!.getAttribute("aria-label")).toMatch(
      new RegExp(`^Week 1: ${first.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}, 0 of \\d+ done$`),
    );
    const current = links.filter((link) => link.getAttribute("aria-current") === "step");
    expect(current).toHaveLength(1);
    expect(current[0]!.getAttribute("aria-label")).toMatch(/^Week 1: /);
  });

  it("shows the current week title as visible text under the grid", () => {
    renderRail();
    expect(screen.getByText("Now showing")).toBeTruthy();
    const title = weeks.find((w) => w.n === 1)!.title;
    const link = screen.getAllByRole("link", { name: title }).find((a) => a.className.includes("now-showing-link"));
    expect(link?.getAttribute("href")).toBe("/week/1");
  });

  it("does not carry the legal links", () => {
    renderRail();
    expect(screen.queryByRole("link", { name: "Privacy" })).toBeNull();
  });
});

describe.each([
  ["desktop", true, 1280],
  ["phone", false, 390],
])("shell footer on %s layout", (_name, rail, width) => {
  let removeCss = () => {};
  afterEach(() => removeCss());

  it("renders Contact, Privacy and Terms under main", () => {
    stubMatchMedia(rail);
    // Root renders the rail and the tabs; shell.css hides the inactive set at this width.
    removeCss = applyViewportCss("src/components/nav/shell.css", width);
    const { container } = render(
      <MemoryRouter initialEntries={["/x"]}>
        <Routes>
          <Route element={<Root />}>
            <Route path="/x" element={<p>page</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    const legal = screen.getByRole("navigation", { name: "Legal" });
    for (const name of ["Contact", "Privacy", "Terms"]) {
      expect(within(legal).getByRole("link", { name })).toBeTruthy();
    }
    const main = container.querySelector("main")!;
    expect(main.compareDocumentPosition(legal) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    // The cookie banner is a complementary landmark too (rendered by Root), so pick out the rail.
    expect(screen.queryAllByRole("complementary").some((el) => el.classList.contains("left-rail"))).toBe(rail);
    expect(screen.queryByRole("button", { name: "More" }) !== null).toBe(!rail);
    expect(screen.getAllByRole("navigation", { name: "Primary" })).toHaveLength(1);
  });
});
