import { useTheme } from "@/hooks/useTheme"
import { CircleCheck, Info, TriangleAlert, OctagonX, Loader } from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  const { resolved } = useTheme()

  return (
    <Sonner
      theme={resolved}
      className="toaster group"
      icons={{
        success: (
          <CircleCheck className="size-4" />
        ),
        info: (
          <Info className="size-4" />
        ),
        warning: (
          <TriangleAlert className="size-4" />
        ),
        error: (
          <OctagonX className="size-4" />
        ),
        loading: (
          <Loader className="size-4 animate-spin" />
        ),
      }}
      style={
        {
          "--normal-bg": "var(--bg-overlay)",
          "--normal-text": "var(--text-primary)",
          "--normal-border": "var(--pop-outline)",
          "--border-radius": "var(--radius-lg)",
        } as React.CSSProperties
      }
      toastOptions={{
        classNames: {
          // 2px outline, hard overlay shadow, and a 4px left bar in the status TEXT token (never a pop fill).
          toast:
            "cn-toast border-2! border-l-4! [box-shadow:var(--shadow-overlay)]! data-[type=success]:border-l-[color:var(--status-ok)]! data-[type=error]:border-l-[color:var(--status-danger)]! data-[type=warning]:border-l-[color:var(--status-warn)]! data-[type=info]:border-l-[color:var(--border-strong)]!",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }
