import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Slot } from "radix-ui"

const POP =
  "pop group/button inline-flex shrink-0 items-center justify-center gap-2 text-sm font-semibold whitespace-nowrap select-none outline-none [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4"

// Every size keeps the 48px touch target (design-system.md section 8); only padding changes.
const buttonVariants = cva("", {
  variants: {
    variant: {
      default: `${POP} pop--teal`,
      outline: `${POP} pop--outline`,
      secondary: `${POP} pop--outline`,
      ghost: `${POP} pop--ghost`,
      destructive: `${POP} pop--red`,
      link: "inline-flex shrink-0 items-center justify-center gap-2 text-sm font-semibold text-[var(--accent-primary)] underline-offset-4 hover:underline [&_svg]:shrink-0",
    },
    size: {
      default: "min-h-12 px-5",
      xs: "min-h-12 px-3 text-xs [&_svg:not([class*='size-'])]:size-3",
      sm: "min-h-12 px-4",
      lg: "min-h-12 px-6 text-base",
      icon: "size-12 p-0",
      "icon-xs": "size-12 p-0 [&_svg:not([class*='size-'])]:size-3",
      "icon-sm": "size-12 p-0",
      "icon-lg": "size-12 p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

/** The light-leak span (design-system.md 5.2). Button renders it for the primary variant; an `asChild` link places it as its first child. */
function ButtonSheen() {
  return <span className="sheen" aria-hidden="true" />
}

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  children,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot.Root : "button"

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    >
      {asChild ? (
        children
      ) : (
        <>
          {variant === "default" ? <ButtonSheen /> : null}
          {children}
        </>
      )}
    </Comp>
  )
}

export { Button, ButtonSheen, buttonVariants }
