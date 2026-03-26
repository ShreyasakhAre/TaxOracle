"use client"

import { motion } from "framer-motion"
import { Card } from "@/components/ui/Card"
import { CountUpNumber } from "@/components/ui/CountUp"

export function SummaryCard({
  label,
  value,
  prefix,
  suffix,
  subtitle,
  progress,
  color = "blue",
}: {
  label: string
  value: number
  prefix?: string
  suffix?: string
  subtitle?: string
  progress?: number
  color?: "blue" | "emerald" | "amber"
}) {
  const colorMap = {
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  }

  return (
    <Card className="glass border-white/5 p-6 group relative overflow-hidden transition-all hover:bg-white/5">
      <div className={`absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity`}>
        <div className={`size-12 rounded-full border-2 border-current blur-sm ${colorMap[color].split(' ')[0]}`} />
      </div>
      
      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-slate-300 transition-colors">
        {label}
      </p>
      
      <div className="mt-4 space-y-3">
        <div className="text-4xl font-black tracking-tighter text-white">
          <CountUpNumber
            value={value}
            format={(n) => `${prefix ?? ""}${Math.round(n).toLocaleString("en-IN")}${suffix ?? ""}`}
          />
        </div>
        
        {progress !== undefined && (
          <div className="space-y-1.5 pt-1">
            <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className={`h-full bg-current ${colorMap[color].split(' ')[0]}`}
              />
            </div>
          </div>
        )}

        {subtitle && (
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{subtitle}</p>
        )}
      </div>
    </Card>
  )
}

