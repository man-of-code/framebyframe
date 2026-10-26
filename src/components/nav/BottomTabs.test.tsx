import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { beforeAll, beforeEach, describe, expect, it } from "vitest";
import { emptyProgress } from "@/lib/progress";
import { BottomTabs } from "./BottomTabs";

describe("BottomTabs", () => {
  // The panels are React.lazy chunks. Warming them keeps findBy* inside its timeout when the
  // whole suite is transforming in parallel; the lazy boundary itself is unchanged.
  beforeAll(async () => {
    await Promise.all([import("./MoreSheet")]);
  });

  beforeEach(() => {
    window.matchMedia = ((query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addEventListener: () => {},
      removeEventListener: () => {},
      addListener: () => {},
      removeListener: () => {},
      dispatchEvent: () => false,
    })) as typeof window.matchMedia;
  });

  it("opens the lazily loaded More sheet and returns focus to More on close", async () => {
    render(
      <MemoryRouter>
        <BottomTabs progress={emptyProgress} replace={() => {}} />
      </MemoryRouter>,
    );
    const more = screen.getByRole("button", { name: "More" });
    await userEvent.click(more);
    expect(await screen.findByRole("dialog", { name: "More" })).toBeTruthy();
    expect(more.getAttribute("aria-expanded")).toBe("true");
    await userEvent.keyboard("{Escape}");
    await waitFor(() => expect(screen.queryByRole("dialog", { name: "More" })).toBeNull());
    expect(document.activeElement).toBe(more);
  });
});
