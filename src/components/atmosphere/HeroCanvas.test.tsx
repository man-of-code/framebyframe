import { render } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { releaseWebglSlot } from "@/lib/webgl-guard";
import { HeroCanvas } from "./HeroCanvas";

describe("HeroCanvas", () => {
  afterEach(() => {
    releaseWebglSlot("hero");
    vi.unstubAllGlobals();
  });

  it("keeps the poster and skips the canvas on a narrow viewport", () => {
    vi.stubGlobal("innerWidth", 390);
    vi.stubGlobal("matchMedia", (query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    const { container } = render(<HeroCanvas enabled />);
    const poster = container.querySelector("img");
    expect(poster?.getAttribute("src")).toBe("/posters/hero-crt.webp");
    expect(poster?.getAttribute("alt")).toBe(
      "Still of a film countdown leader on a CRT screen, beside the landing title.",
    );
    expect(poster?.getAttribute("aria-hidden")).toBe("true");
    expect(container.querySelector("canvas")).toBeNull();
  });

  it("does not mount a canvas when the hero is only a replay", () => {
    vi.stubGlobal("innerWidth", 1440);
    const { container } = render(<HeroCanvas enabled={false} />);
    expect(container.querySelector("img")?.getAttribute("src")).toBe("/posters/hero-crt.webp");
    expect(container.querySelector("canvas")).toBeNull();
  });
});
