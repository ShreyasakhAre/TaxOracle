"use client"

import { Card } from "@/components/ui/Card"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { RiskMeter } from "./RiskMeter"
import { motion } from "framer-motion"
import { fadeInUp } from "@/components/animations/variants"

function TaxBars({ oldTax, newTax }: { oldTax: number; newTax: number }) {
  const max = Math.max(oldTax, newTax, 1)
  const oldH = (oldTax / max) * 100
  const newH = (newTax / max) * 100

  return (
    <div className="mt-8 space-y-6">
      <div className="grid grid-cols-2 gap-6 h-48 items-end">
        <div className="space-y-4 text-center group">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${oldH}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="w-full rounded-2xl bg-white/5 border border-white/10 group-hover:bg-white/10 transition-colors relative"
          >
            <div className="absolute inset-0 bg-indigo-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
          <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Old Regime</p>
        </div>
        <div className="space-y-4 text-center group">
          <motion.div 
            initial={{ height: 0 }}
            animate={{ height: `${newH}%` }}
            transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
            className="w-full rounded-2xl bg-indigo-500/20 border border-indigo-500/30 group-hover:bg-indigo-500/30 transition-colors relative"
          >
            <div className="absolute inset-0 bg-indigo-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
          </motion.div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">New Regime</p>
        </div>
      </div>
    </div>
  )
}

export function ChartAndRisk({
  taxOld,
  taxNew,
  riskScore,
  riskLevel,
}: {
  taxOld: number
  taxNew: number
  riskScore: number
  riskLevel: string
}) {
  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <Card className="lg:col-span-8 p-8 glass-dark border-white/5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-[80px] rounded-full" />
        <SectionTitle title="Tax Liability Analysis" subtitle="Comparative visualization of tax regimes" />
        <TaxBars oldTax={taxOld} newTax={taxNew} />
        
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="glass-dark border-white/5 rounded-3xl p-6">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-500">Gross Old Tax</p>
            <p className="mt-2 text-3xl font-black text-white">₹{taxOld.toLocaleString("en-IN")}</p>
          </div>
          <div className="glass-dark border-indigo-500/20 rounded-3xl p-6 bg-indigo-500/5">
            <p className="text-xs font-bold uppercase tracking-widest text-indigo-400">Gross New Tax</p>
            <p className="mt-2 text-3xl font-black text-white">₹{taxNew.toLocaleString("en-IN")}</p>
          </div>
        </div>
      </Card>

      <Card className="lg:col-span-4 p-8 glass-dark border-white/5">
        <RiskMeter score={riskScore} level={riskLevel} />
      </Card>
    </div>
  )
}

