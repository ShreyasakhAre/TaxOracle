import { type ReactNode } from "react"

import { cn } from "@/lib/utils"

export function SectionTitle({
  title,
  subtitle,
  className,
  right,
}: {
  title: string
  subtitle?: string
  className?: string
  right?: ReactNode
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {subtitle ?? "Section"}
        </p>
        <h2 className="truncate text-base font-semibold text-slate-100">
          {title}
        </h2>
      </div>
      {right}
    </div>
  )
}

