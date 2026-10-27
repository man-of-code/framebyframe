import { fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { CeremonyBadge } from "./CeremonyBadge";

function stubEnv(opts: { reduced?: boolean; coarse?: boolean; width: number }) {
  vi.stubGlobal("innerWidth", opts.width);
  vi.stubGlobal("matchMedia", (query: string) => ({
    matches: (query.includes("reduce") && opts.reduced === true) || (query.includes("coarse") && opts.coarse === true),
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }));
  vi.stubGlobal("IntersectionObserver", class {
    observe = vi.fn();
    disconnect = vi.fn();
  });
  vi.spyOn(navigator, "hardwareConcurrency", "get").mockReturnValue(8);
}

describe("CeremonyBadge", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("renders nothing while closed", () => {
    stubEnv({ width: 1440 });
    const { container } = render(<CeremonyBadge open={false} onClose={() => {}} />);
    expect(container.innerHTML).toBe("");
  });

  it("shows the static seal ceremony under reduced motion, with Continue focused on the frame", () => {
    stubEnv({ width: 1440, reduced: true });
    const onClose = vi.fn();
    render(<CeremonyBadge open onClose={onClose} />);
    const dialog = screen.getByRole("dialog", { name: "Capstone complete" });
    expect(dialog.classList.contains("ceremony--static")).toBe(true);
    // The seal sits directly on the frame's raised surface: no black stage, no film grain.
    expect(dialog.querySelector(".playbill-frame > .orn-seal")).toBeTruthy();
    expect(dialog.querySelector(".ceremony-stage, .grain--film")).toBeNull();
    expect(dialog.querySelector("iframe")).toBeNull();
    expect(dialog.querySelector(".aurora--live")).toBeNull();
    const button = screen.getByRole("button", { name: "Continue" });
    expect(document.activeElement).toBe(button);
    expect(button.closest(".playbill-frame")).toBeTruthy();
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("is static on a touch phone", () => {
    stubEnv({ width: 390, coarse: true });
    render(<CeremonyBadge open onClose={() => {}} />);
    expect(screen.getByRole("dialog").classList.contains("ceremony--static")).toBe(true);
  });

  it("mounts SparkBadge on a film-grain stage under a live aurora on a capable desktop", () => {
    stubEnv({ width: 1440 });
    render(<CeremonyBadge open onClose={() => {}} />);
    const dialog = screen.getByRole("dialog", { name: "Capstone complete" });
    expect(dialog.classList.contains("ceremony--live")).toBe(true);
    expect(dialog.querySelector(".ceremony-stage.grain--film iframe")).toBeTruthy();
    expect(dialog.querySelector(".aurora--live")).toBeTruthy();
  });
});
