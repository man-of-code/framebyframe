import { Link } from "react-router-dom";
import { toast } from "sonner";
import { Ellipsis } from "lucide-react";
import { NAV_ITEMS } from "@/components/nav/items";
import { ThemeToggle } from "@/components/nav/ThemeToggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { exportProgress, importProgress } from "@/lib/progress";
import type { Progress } from "@/lib/types";

const MORE_LINKS = NAV_ITEMS.filter((item) => item.to === "/toolkit" || item.to === "/about");

export function MoreSheet({
  progress,
  replace,
}: {
  progress: Progress;
  replace: (progress: Progress) => void;
}) {
  return (
    <Sheet>
      <SheetTrigger className="nav-link bottom-tab">
        <Ellipsis aria-hidden="true" size={20} />
        <span>More</span>
      </SheetTrigger>
      <SheetContent side="bottom" className="more-sheet" showCloseButton={false}>
        <SheetHeader>
          <SheetTitle>More</SheetTitle>
        </SheetHeader>
        <div className="more-actions">
          {MORE_LINKS.map((item) => (
            <SheetClose asChild key={item.to}>
              <Link to={item.to} className="nav-link">
                <item.icon aria-hidden="true" size={20} />
                <span>{item.label}</span>
              </Link>
            </SheetClose>
          ))}
          <ThemeToggle />
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
            <label className="nav-link" htmlFor="import-progress">
              Import progress
            </label>
            <input
              id="import-progress"
              type="file"
              accept="application/json,.json"
              onChange={(event) => {
                const input = event.currentTarget;
                const file = input.files?.[0];
                if (!file) return;
                void file.text().then((text) => {
                  const result = importProgress(text);
                  if (!result.ok) {
                    toast.error(result.reason);
                  } else {
                    replace(result.progress);
                    toast.success("Progress imported");
                  }
                  input.value = "";
                });
              }}
            />
          </div>
          <SheetClose asChild>
            <Button type="button" variant="ghost" className="min-h-12">
              Close
            </Button>
          </SheetClose>
        </div>
      </SheetContent>
    </Sheet>
  );
}
