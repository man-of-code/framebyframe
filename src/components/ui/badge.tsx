import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

// Pop badge (design-system.md 5.2): fill per meaning, --pop-ink text, 1.5px --pop-ink border, no shadow.
// Pair every badge with a Lucide icon and a word; colour is never the only signal.
const FILLED = "border-[var(--pop-ink)] text-[var(--pop-ink)]"
const badgeVariants = cva(
  "group/badge inline-flex min-h-6 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-sm border-[1.5px] px-2 py-0.5 text-xs font-semibold whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3!",
  {
    variants: {
      variant: {
        default: "border-[var(--border-strong)] bg-[var(--bg-inset)] text-[var(--text-primary)]",
        secondary: "border-[var(--border-strong)] bg-[var(--bg-inset)] text-[var(--text-primary)]",
        outline: "border-[var(--border-strong)] bg-transparent text-[var(--text-primary)]",
        ghost: "border-transparent bg-transparent text-[var(--text-secondary)]",
        link: "border-transparent text-[var(--accent-primary)] underline-offset-4 hover:underline",
        ok: `${FILLED} bg-[var(--pop-lime)]`,
        warn: `${FILLED} bg-[var(--pop-yellow)]`,
        danger: `${FILLED} bg-[var(--pop-red)]`,
        destructive: `${FILLED} bg-[var(--pop-red)]`,
        paid: `${FILLED} bg-[var(--pop-magenta)]`,
        exp: `${FILLED} bg-[var(--pop-violet)]`,
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
