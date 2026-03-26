import { type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type Status = "success" | "warning" | "risk"

export function StatusBadge({
  variant,
  className,
  ...props
}: HTMLAttributes<HTMLDivElement> & { variant: Status }) {
  const variantClass =
    variant === "success"
      ? "border-green-500/30 bg-green-500/10 text-green-200"
      : variant === "warning"
        ? "border-amber-500/30 bg-amber-500/10 text-amber-200"
        : "border-red-500/30 bg-red-500/10 text-red-200"

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium",
        variantClass,
        className,
      )}
      {...props}
    />
  )
}

