import * as React from "react"
import { cn } from "@/lib/utils"
import { Switch as SwitchPrimitive } from "radix-ui"

function Switch({
  className,
  size = "default",
  ...props
}: React.ComponentProps<typeof SwitchPrimitive.Root> & {
  size?: "sm" | "default"
}) {
  return (
    <SwitchPrimitive.Root
      data-slot="switch"
      data-size={size}
      className={cn(
        "peer group/switch relative inline-flex shrink-0 items-center rounded-full border-2 outline-none after:absolute after:-inset-x-2 after:-inset-y-3 data-[size=default]:h-6 data-[size=default]:w-11 data-[size=sm]:h-[18px] data-[size=sm]:w-8 data-[state=checked]:border-[var(--pop-ink)] data-[state=checked]:bg-[var(--pop-teal)] data-[state=unchecked]:border-[var(--border-strong)] data-[state=unchecked]:bg-[var(--bg-inset)] data-[disabled]:cursor-not-allowed data-[disabled]:opacity-60",
        className
      )}
      {...props}
    >
      <SwitchPrimitive.Thumb
        data-slot="switch-thumb"
        className="pointer-events-none block rounded-full ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-2.5 group-data-[size=default]/switch:data-[state=checked]:translate-x-[22px] group-data-[size=sm]/switch:data-[state=checked]:translate-x-[16px] group-data-[size=default]/switch:data-[state=unchecked]:translate-x-[2px] group-data-[size=sm]/switch:data-[state=unchecked]:translate-x-[2px] data-[state=checked]:bg-[var(--pop-ink)] data-[state=unchecked]:bg-[var(--text-secondary)]"
      />
    </SwitchPrimitive.Root>
  )
}

export { Switch }
