import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Toggle as TogglePrimitive } from "radix-ui"

// Segmented control (design-system.md 5.2): secondary-button style at rest, latched teal with a check when on.
const toggleVariants = cva(
  "pop pop--outline pop--latch group/toggle inline-flex items-center justify-center gap-1.5 text-sm font-semibold whitespace-nowrap outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "",
        outline: "",
      },
      size: {
        default: "min-h-12 min-w-12 px-3",
        sm: "min-h-12 min-w-12 px-3",
        lg: "min-h-12 min-w-12 px-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Toggle({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: React.ComponentProps<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive.Root
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    >
      <Check aria-hidden="true" className="pop-check size-3.5" strokeWidth={3} />
      {children}
    </TogglePrimitive.Root>
  )
}

export { Toggle, toggleVariants }
