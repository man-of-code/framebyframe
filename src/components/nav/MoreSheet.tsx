import { Link } from "react-router-dom";
import { Ellipsis } from "lucide-react";
import { ExportImport } from "@/components/ExportImport";
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
          <ExportImport progress={progress} replace={replace} />
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
