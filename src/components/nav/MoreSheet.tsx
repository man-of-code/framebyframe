import type { RefObject } from "react";
import { Link } from "react-router-dom";
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
} from "@/components/ui/sheet";
import type { Progress } from "@/lib/types";

const MORE_LINKS = NAV_ITEMS.filter((item) => item.to === "/toolkit" || item.to === "/about");

/** Loaded on the first tap of More; the trigger lives in BottomTabs. */
export function MoreSheet({
  open,
  onOpenChange,
  returnFocus,
  progress,
  replace,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocus: RefObject<HTMLButtonElement | null>;
  progress: Progress;
  replace: (progress: Progress) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="more-sheet"
        showCloseButton={false}
        onCloseAutoFocus={(event) => {
          // No SheetTrigger, so Radix has no element to return focus to.
          event.preventDefault();
          returnFocus.current?.focus();
        }}
      >
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
            <Link to="/contact" className="nav-link">Contact</Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/privacy" className="nav-link">Privacy</Link>
          </SheetClose>
          <SheetClose asChild>
            <Link to="/terms" className="nav-link">Terms</Link>
          </SheetClose>
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
