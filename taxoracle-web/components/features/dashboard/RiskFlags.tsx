 "use client"

import { Card } from "@/components/ui/Card"
import { SectionTitle } from "@/components/ui/SectionTitle"
import { StatusBadge } from "@/components/ui/StatusBadge"

import { motion } from "framer-motion"
import { AlertTriangle, CheckCircle2 } from "lucide-react"

function flagVariant(flag: string): "success" | "warning" | "risk" {
  const f = flag.toLowerCase()
  if (f.includes("unused") || f.includes("mismatch") || f.includes("risk")) return "warning"
  return "risk"
}

export function RiskFlags({ flags }: { flags: string[] }) {
  return (
    <Card className="p-8 glass-dark border-white/5 space-y-6">
      <SectionTitle title="Compliance Verification" subtitle="Actionable flags requiring attention" />

      <div className="mt-4 flex flex-col gap-3">
        {flags.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-start justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-800/30 px-3 py-3"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-100">
                No actionable flags
              </p>
              <p className="mt-2 text-xs leading-relaxed text-slate-400">
                Your inputs look consistent with deterministic rules.
              </p>
            </div>
            <div className="shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-green-400/90" />
                <StatusBadge variant="success">success</StatusBadge>
              </div>
            </div>
          </motion.div>
        ) : (
          flags.map((flag) => {
            const variant = flagVariant(flag)
            return (
              <motion.div
                key={flag}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.25 }}
                className="flex items-start justify-between gap-4 rounded-xl border border-slate-700/60 bg-slate-800/30 px-3 py-3"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-slate-100">
                    {flag}
                  </p>
                  <p className="mt-2 text-xs leading-relaxed text-slate-400">
                    Verify the upload fields and supporting amounts.
                  </p>
                </div>
                <div className="shrink-0">
                  <div className="flex items-center gap-2">
                    {variant === "success" ? (
                      <CheckCircle2 className="size-4 text-green-400/90" />
                    ) : (
                      <AlertTriangle className="size-4 text-amber-300/90" />
                    )}
                    <StatusBadge variant={variant}>{variant}</StatusBadge>
                  </div>
                </div>
              </motion.div>
            )
          })
        )}
      </div>
    </Card>
  )
}

