"use client"

import { motion } from "framer-motion"
import { ShieldAlert, Activity } from "lucide-react"

import { Card } from "@/components/ui/Card"
import { StatusBadge } from "@/components/ui/StatusBadge"
import { pulse } from "@/components/animations/variants"

type RiskLevel = "low" | "medium" | "high"

export function RiskMeter({
  score,
  level,
}: {
  score: number
  level: string
}) {
  const normalized = level.toLowerCase() as RiskLevel
  const badgeVariant =
    normalized === "low" ? "success" : normalized === "medium" ? "warning" : "risk"

  const label =
    normalized === "low" ? "Low" : normalized === "medium" ? "Medium" : "High"

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
            Compliance Depth
          </p>
          <h3 className="text-xl font-bold text-white tracking-tight">Risk Exposure</h3>
        </div>
        <div className="size-12 rounded-[1.25rem] bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
          <Activity className="size-6 text-indigo-400" />
        </div>
      </div>

      <div className="flex items-center justify-between gap-8">
        <div className="space-y-1">
          <p className="text-xs font-bold text-slate-500 uppercase">Score Index</p>
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-black text-white">{score}</span>
            <span className="text-lg font-bold text-slate-600">/100</span>
          </div>
        </div>
        <motion.div 
          variants={pulse}
          animate="animate"
          className="shrink-0"
        >
          <div className="flex items-center gap-2">
            <StatusBadge variant={badgeVariant}>
              {label} Risk Detected
            </StatusBadge>
          </div>
        </motion.div>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-slate-600">
          <span>Safe</span>
          <span>Caution</span>
          <span>Critical</span>
        </div>
        <div className="h-4 rounded-full bg-white/5 border border-white/10 p-1 overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${score}%` }}
            transition={{ duration: 1.5, ease: "circOut" }}
            className={`h-full rounded-full bg-gradient-to-r ${
              normalized === "low" 
                ? "from-emerald-500 to-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)]" 
                : normalized === "medium"
                ? "from-amber-500 to-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.3)]"
                : "from-red-600 to-red-500 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
            }`}
          />
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex gap-3">
        <ShieldAlert className="size-5 text-indigo-400 shrink-0" />
        <p className="text-xs text-slate-400 leading-relaxed">
          The risk score is determined by deterministic rules analyzing your deductions relative to total income.
        </p>
      </div>
    </div>
  )
}

