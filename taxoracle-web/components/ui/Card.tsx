import { type HTMLAttributes } from "react"

import { cn } from "@/lib/utils"

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-xl bg-slate-800/60 shadow-sm shadow-slate-900/40",
        "border border-slate-700/60",
        className,
      )}
      {...props}
    />
  )
}

