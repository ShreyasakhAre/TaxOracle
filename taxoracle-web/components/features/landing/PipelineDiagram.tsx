"use client"

import { motion } from "framer-motion"
import { FileText, Brain, Briefcase, ShieldAlert, FileCheck } from "lucide-react"

const nodes = [
  { id: "ingest", icon: FileText, label: "Ingest", color: "blue" },
  { id: "analyze", icon: Brain, label: "Analyze", color: "indigo" },
  { id: "compare", icon: Briefcase, label: "Compare", color: "purple" },
  { id: "risk", icon: ShieldAlert, label: "Audit", color: "emerald" },
  { id: "report", icon: FileCheck, label: "Report", color: "blue" },
]

export function PipelineDiagram() {
  return (
    <div className="relative w-full max-w-5xl mx-auto py-24">
      <div className="absolute inset-0 bg-grid opacity-10 pointer-events-none" />
      
      <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-4 relative z-10">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex flex-col md:flex-row items-center gap-4 group">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex flex-col items-center gap-4"
            >
              <div className={`size-20 rounded-3xl bg-${node.color}-500/10 border border-${node.color}-500/20 flex items-center justify-center relative shadow-2xl shadow-${node.color}-500/5 group-hover:scale-110 transition-transform duration-500`}>
                <div className={`absolute inset-0 rounded-3xl bg-${node.color}-500/5 blur-xl group-hover:opacity-100 opacity-0 transition-opacity`} />
                <node.icon className={`size-8 text-${node.color}-400 relative z-10`} />
                
                {/* Status Indicator */}
                <div className={`absolute -top-1 -right-1 size-3 rounded-full bg-${node.color}-400 border-2 border-[#0B0F14] animate-pulse`} />
              </div>
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                {node.label}
              </span>
            </motion.div>

            {i < nodes.length - 1 && (
              <div className="flex items-center justify-center p-4">
                <motion.div
                  initial={{ scaleX: 0 }}
                  whileInView={{ scaleX: 1 }}
                  transition={{ delay: i * 0.1 + 0.2, duration: 0.8 }}
                  className="w-12 h-[1px] bg-gradient-to-r from-transparent via-slate-700 to-transparent hidden md:block"
                />
                <motion.div
                  animate={{ 
                    x: [0, 40, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ 
                    duration: 3,
                    repeat: Infinity,
                    delay: i * 0.5
                  }}
                  className="absolute size-1.5 rounded-full bg-blue-400 blur-[2px] hidden md:block"
                />
                <div className="md:hidden h-8 w-[1px] bg-slate-800" />
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Background Pulse */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-32 bg-blue-500/5 blur-[100px] -z-10" />
    </div>
  )
}
