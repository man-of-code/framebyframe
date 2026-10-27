import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { weeks } from "@/content/weeks";
import { WeekHeader } from "@/components/week/WeekHeader";
import { splitAtSlashes } from "@/lib/title";
import { BreakableTitle } from "./BreakableTitle";

describe("BreakableTitle", () => {
  it("puts a <wbr> after every slash and leaves the text unchanged", () => {
    const { container } = render(<h1><BreakableTitle text="movement/angles/framing, lenses" /></h1>);
    expect(container.querySelectorAll("wbr")).toHaveLength(2);
    expect(container.textContent).toBe("movement/angles/framing, lenses");
    expect(container.querySelector("h1")?.innerHTML).toBe("movement/<wbr>angles/<wbr>framing, lenses");
  });

  it("renders no <wbr> for a title without slashes", () => {
    const { container } = render(<BreakableTitle text="Open on an image" />);
    expect(container.querySelectorAll("wbr")).toHaveLength(0);
  });

  it("breaks the real week titles at their slashes", () => {
    const week = weeks.find((item) => splitAtSlashes(item.title).length > 1);
    if (!week) throw new Error("no slash-joined week title in content");
    const { container } = render(
      <MemoryRouter>
        <WeekHeader week={week} moduleTitle="Module" stageLabel={null} hoursLabel="1h" />
      </MemoryRouter>,
    );
    const heading = container.querySelector("h1");
    expect(heading?.querySelectorAll("wbr").length).toBe(splitAtSlashes(week.title).length - 1);
    expect(heading?.textContent).toBe(week.title);
  });
});
