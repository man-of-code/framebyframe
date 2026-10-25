import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ExportImport } from "./ExportImport";
import { emptyProgress } from "@/lib/progress";
import type { Progress } from "@/lib/types";

const saved: Progress = {
  ...emptyProgress,
  startDate: "2026-10-25",
  done: { "w1-watch": true },
  notes: { "w1-assignment": "a note" },
};

describe("ExportImport", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it("downloads the current progress as frame-by-frame-progress.json", async () => {
    const user = userEvent.setup();
    vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:progress");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => {});
    const click = vi.spyOn(HTMLAnchorElement.prototype, "click").mockImplementation(() => {});

    render(<ExportImport progress={saved} replace={() => {}} />);
    await user.click(screen.getByRole("button", { name: "Export progress" }));

    expect(click).toHaveBeenCalledOnce();
    const link = click.mock.contexts[0] as HTMLAnchorElement;
    expect(link.download).toBe("frame-by-frame-progress.json");
    expect(link.href).toContain("blob:progress");
    expect(URL.createObjectURL).toHaveBeenCalledOnce();
    const blob = vi.mocked(URL.createObjectURL).mock.calls[0][0] as Blob;
    expect(blob.type).toBe("application/json");
    expect(await blob.text()).toBe(JSON.stringify(saved));
  });

  it("shows the import reason and leaves the current progress untouched", async () => {
    const user = userEvent.setup();
    const replace = vi.fn();
    const { toast } = await import("sonner");
    const error = vi.spyOn(toast, "error").mockImplementation(() => "");

    render(<ExportImport progress={saved} replace={replace} />);
    const input = screen.getByLabelText("Import progress");
    await user.upload(input, new File(["not json"], "bad.json", { type: "application/json" }));

    expect(error).toHaveBeenCalledWith("invalid JSON");
    expect(replace).not.toHaveBeenCalled();
  });

  it("replaces progress when the file imports", async () => {
    const user = userEvent.setup();
    const replace = vi.fn();
    render(<ExportImport progress={emptyProgress} replace={replace} />);
    await user.upload(
      screen.getByLabelText("Import progress"),
      new File([JSON.stringify(saved)], "frame-by-frame-progress.json", { type: "application/json" }),
    );
    expect(replace).toHaveBeenCalledWith(saved);
  });
});
