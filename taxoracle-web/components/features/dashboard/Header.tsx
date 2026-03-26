"use client"

import { useProcessStore } from "@/lib/store/useProcessStore"
import { Activity, Cpu, ShieldCheck } from "lucide-react"

export default function Header() {
  const { data } = useProcessStore()

  return (
    <header className="glass h-20 rounded-[2rem] px-8 flex items-center justify-between border-white/5 ring-1 ring-white/5 mb-8">
      <div className="flex items-center gap-8">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">System Node</span>
            <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <h2 className="text-sm font-black text-white uppercase tracking-tighter">
            Analytics Console <span className="text-slate-600">/</span> {data?.session_id.slice(0, 8) ?? "INITIALIZING"}
          </h2>
        </div>

        <div className="hidden md:flex items-center gap-6 border-l border-white/10 pl-8">
          {[
            { label: "Engine", value: "v1.0.4", icon: Cpu },
            { label: "Extraction", value: data ? "Verified" : "Syncing", icon: ShieldCheck },
            { label: "Latency", value: "124ms", icon: Activity },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3">
              <item.icon className="size-4 text-slate-500" />
              <div className="space-y-0.5">
                <p className="text-[8px] font-black uppercase tracking-widest text-slate-600">{item.label}</p>
                <p className="text-[10px] font-black text-slate-300 uppercase">{item.value}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="glass-dark px-4 py-2 rounded-xl flex items-center gap-3 border-white/5">
          <div className="size-2 rounded-full bg-blue-500" />
          <span className="text-[10px] font-black text-white uppercase tracking-[0.1em]">
            Precision: {data ? `${(data.confidence * 100).toFixed(1)}%` : "0.0%"}
          </span>
        </div>
      </div>
    </header>
  )
}
