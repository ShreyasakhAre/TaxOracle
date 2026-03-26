"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown } from "lucide-react"

import { Card } from "@/components/ui/Card"

export function InsightsList({
  insights,
}: {
  insights: string[]
}) {
  const [open, setOpen] = useState(false)
  const items = insights ?? []
  const preview = items.slice(0, 2)

  return (
    <Card className="p-8 glass-dark border-white/5 space-y-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6"
      >
        <div className="min-w-0 text-left">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Insights
          </p>
          <p className="mt-1 truncate text-sm font-medium text-slate-100">
            {items.length ? `${items.length} item${items.length === 1 ? "" : "s"}` : "No insights"}
          </p>
        </div>
        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="grid size-9 place-items-center rounded-xl bg-slate-800/30 ring-1 ring-slate-700/60"
        >
          <ChevronDown className="size-4 text-indigo-200" />
        </motion.span>
      </button>

      <div className="mt-4 space-y-2">
        <AnimatePresence initial={false}>
          {(open ? items : preview).map((insight) => (
            <motion.div
              key={insight}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.25 }}
              className="rounded-xl border border-slate-700/60 bg-slate-800/30 px-3 py-2"
            >
              <p className="text-sm leading-relaxed text-slate-200">{insight}</p>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </Card>
  )
}

