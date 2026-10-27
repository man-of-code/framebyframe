import { useId, type JSX } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { exportProgress, importProgress } from "@/lib/progress";
import type { Progress } from "@/lib/types";

export function ExportImport({
  progress,
  replace,
}: {
  progress: Progress;
  replace: (progress: Progress) => void;
}): JSX.Element {
  const inputId = useId();

  return (
    <div className="more-actions">
      <Button
        type="button"
        variant="outline"
        className="min-h-12"
        onClick={() => {
          const blob = new Blob([exportProgress(progress)], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "frame-by-frame-progress.json";
          link.click();
          URL.revokeObjectURL(url);
        }}
      >
        Export progress
      </Button>
      <div className="import-control">
        <label className="nav-link" htmlFor={inputId}>
          Import progress
        </label>
        <input
          id={inputId}
          type="file"
          accept="application/json,.json"
          onChange={(event) => {
            const input = event.currentTarget;
            const file = input.files?.[0];
            if (!file) return;
            void file.text().then((text) => {
              const result = importProgress(text);
              if (!result.ok) {
                toast.error("That file isn't a Frame by Frame progress export.", {
                  description: `Reason: ${result.reason}`,
                });
              } else {
                replace(result.progress);
                toast.success("Progress imported");
              }
              input.value = "";
            });
          }}
        />
      </div>
    </div>
  );
}
