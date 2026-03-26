"use client"

import { useState } from "react"
import { AnimatePresence, motion } from "framer-motion"
import { ChevronDown, Sparkles } from "lucide-react"

import { Card } from "@/components/ui/Card"

export function AIExplanationPanel({ explanation }: { explanation: string }) {
  const [open, setOpen] = useState(true)

  return (
    <Card className="p-8 glass-dark border-white/5 space-y-6">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-6 text-left"
      >
        <div className="min-w-0 flex-1 space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-400">
            Intelligence Report
          </p>
          <h3 className="text-xl font-bold text-white tracking-tight">
            Compliance Rationale
          </h3>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden sm:grid size-12 place-items-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20">
            <Sparkles className="size-6 text-indigo-400" />
          </div>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="grid size-10 place-items-center rounded-2xl bg-white/5 border border-white/10"
          >
            <ChevronDown className="size-5 text-slate-400" />
          </motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <div className="rounded-[2rem] border border-white/5 bg-white/5 p-8">
              <p className="text-lg leading-relaxed text-slate-300 font-medium">{explanation}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  )
}

