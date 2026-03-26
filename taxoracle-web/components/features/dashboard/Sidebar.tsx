 "use client"

import { useState } from "react"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  UploadCloud,
  ShieldCheck,
  Activity,
  Settings,
} from "lucide-react"

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)

  const items = [
    { label: "Console", href: "/dashboard", icon: LayoutDashboard },
    { label: "Ingest", href: "/upload", icon: UploadCloud },
    { label: "Audit Log", href: "#", icon: Activity },
    { label: "Settings", href: "#", icon: Settings },
  ]

  return (
    <aside
      className={[
        "shrink-0 border-r border-white/5 bg-[#0B0F14]/80 backdrop-blur-2xl transition-[width] duration-300 ease-in-out relative z-40",
        collapsed ? "w-20" : "w-72",
      ].join(" ")}
    >
      <div className="flex h-full flex-col py-6">
        {/* Logo Container */}
        <div className="px-6 mb-12 flex items-center justify-between">
          {!collapsed && (
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <span className="text-sm font-black tracking-widest text-white uppercase">TaxOracle</span>
            </div>
          )}
          {collapsed && (
            <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center mx-auto transition-all">
              <ShieldCheck className="size-5 text-white" />
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 space-y-2">
          {items.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={[
                "group flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200",
                "hover:bg-white/5",
                collapsed ? "justify-center" : "",
              ].join(" ")}
            >
              <item.icon className="size-5 text-slate-500 group-hover:text-blue-400 transition-colors" />
              {!collapsed && (
                <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 group-hover:text-white transition-colors">
                  {item.label}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Status Section */}
        {!collapsed && (
          <div className="px-6 py-6 border-t border-white/5">
            <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Engine Status</span>
                <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] text-slate-500 font-bold leading-relaxed">
                Autonomous auditing active. Precision rule-matching enabled.
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-24 size-6 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:scale-110 transition-transform shadow-xl z-50"
        >
          {collapsed ? <ChevronRight className="size-3 text-black" /> : <ChevronLeft className="size-3 text-black" />}
        </button>
      </div>
    </aside>
  )
}
