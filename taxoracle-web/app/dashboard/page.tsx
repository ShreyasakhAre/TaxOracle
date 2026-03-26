"use client"

import { useEffect } from "react"
import { DashboardLayout } from "@/components/features/dashboard/DashboardLayout"
import { api } from "@/lib/api/client"
import { useProcessStore } from "@/lib/store/useProcessStore"

export default function DashboardRoute() {
  const { status, data, taskId, logs, setLogs, success, fail } = useProcessStore()

  useEffect(() => {
    if (status !== "processing" || !taskId) return

    let active = true

    async function poll() {
      for (let i = 0; i < 180 && active; i += 1) {
        try {
          const res = await api.getStatus(taskId)
          if (!active) return
          setLogs(res.logs)
          if (res.status === "completed" && res.result) {
            success(res.result)
            return
          }
          if (res.status === "failed") {
            fail(res.error || "Processing failed")
            return
          }
        } catch {
          fail("Unable to fetch task status")
          return
        }
        await new Promise((r) => setTimeout(r, 1000))
      }
    }

    poll()
    return () => {
      active = false
    }
  }, [status, taskId, setLogs, success, fail])

  const mode = status === "processing" ? "loading" : status === "error" ? "error" : "ready"

  return (
    <div className="min-h-screen bg-[#020617] p-6 lg:p-12">
      <div className="mx-auto max-w-7xl">
        <DashboardLayout data={data} mode={mode} taskId={taskId} logs={logs} />
      </div>
    </div>
  )
}

