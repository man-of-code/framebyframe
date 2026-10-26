import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"
import { Checkbox as CheckboxPrimitive } from "radix-ui"

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer relative flex size-5 shrink-0 items-center justify-center rounded-sm border-2 border-[var(--pop-outline)] bg-transparent outline-none after:absolute after:-inset-3 disabled:cursor-not-allowed disabled:border-[var(--border-subtle)] disabled:bg-[var(--bg-inset)] data-[state=checked]:border-[var(--pop-ink)] data-[state=checked]:bg-[var(--brass-fill)] data-[state=checked]:text-[var(--pop-ink)] data-[state=checked]:disabled:opacity-60",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="grid place-content-center text-current transition-none [&>svg]:size-3.5 [&>svg]:stroke-[3]"
      >
        <Check />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
