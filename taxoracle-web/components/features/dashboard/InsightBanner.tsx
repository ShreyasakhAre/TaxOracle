"use client"

import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

import { Card } from "@/components/ui/Card"
import { pulse } from "@/components/animations/variants"

export function InsightBanner({
  text,
}: {
  text: string
}) {
  return (
    <motion.div
      variants={pulse}
      animate="animate"
      className="rounded-[2.5rem] p-[1px] bg-gradient-to-r from-indigo-500/50 via-indigo-500/10 to-indigo-500/50 shadow-[0_0_40px_rgba(99,102,241,0.2)]"
    >
      <Card className="border-0 bg-[#020617]/80 backdrop-blur-xl rounded-[2.45rem] p-8 lg:p-10">
        <div className="flex flex-col md:flex-row items-center md:items-start lg:items-center gap-8 text-center md:text-left">
          <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-[2rem] bg-indigo-500 shadow-[0_0_30px_rgba(99,102,241,0.4)] ring-4 ring-indigo-500/20">
            <Sparkles className="h-10 w-10 text-white fill-white" />
          </div>
          
          <div className="space-y-2">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-indigo-400">
              Optimal Strategy Detected
            </p>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tighter text-white leading-none">
              {text}
            </h1>
            <p className="text-slate-400 font-medium max-w-2xl">
              Our analysis engine suggests the above configuration yielded the highest 
              tax efficiency for your profile.
            </p>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

