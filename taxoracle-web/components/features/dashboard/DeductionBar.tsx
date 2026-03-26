"use client"

import { motion } from "framer-motion"

import { StatusBadge } from "@/components/ui/StatusBadge"

function progressWidthClass(pct: number) {
  if (pct >= 98) return "w-[100%]"
  if (pct >= 90) return "w-[92%]"
  if (pct >= 70) return "w-[75%]"
  if (pct >= 40) return "w-[55%]"
  if (pct >= 10) return "w-[28%]"
  return "w-[10%]"
}

export function DeductionBar({
  label,
  usedPct,
}: {
  label: string
  usedPct: number
}) {
  const widthClass = progressWidthClass(usedPct)
  const variant = usedPct >= 90 ? "success" : usedPct >= 55 ? "warning" : "risk"

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      whileHover={{ y: -2 }}
      className="rounded-xl border border-slate-700/60 bg-slate-800/30 px-4 py-3"
    >
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-sm font-medium text-slate-100">
            {label}
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Used {Math.round(usedPct)}%
          </p>
        </div>
        <StatusBadge variant={variant}>{variant}</StatusBadge>
      </div>

      <div className="mt-3 rounded-full bg-slate-900/40 p-1 ring-1 ring-slate-700/60">
        <div className={`h-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 ${widthClass}`} />
      </div>
    </motion.div>
  )
}

