"use client"

import { useEffect, useState } from "react"
import { Loader2, UploadCloud, AlertCircle, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"

import { Card } from "@/components/ui/Card"
import { api } from "@/lib/api/client"
import { useProcessStore } from "@/lib/store/useProcessStore"
import { UploadDropZone } from "./UploadDropZone"
import type { UploadStage } from "./uploadTypes"
import { fadeInUp, pulse } from "@/components/animations/variants"

export function UploadCard() {
  const router = useRouter()
  const { reset: resetStore, start, setTask, setLogs, success, fail } = useProcessStore()

  const [stage, setStage] = useState<UploadStage>("idle")
  const [dragActive, setDragActive] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const [statusMessage, setStatusMessage] = useState("Waiting for file")

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl)
    }
  }, [previewUrl])

  function clearSelection() {
    setStage("idle")
    setDragActive(false)
    setFile(null)
    setError(null)
    setPreviewUrl(null)
    setProgress(0)
    setStatusMessage("Waiting for file")
  }

  async function handleFiles(next: FileList | null) {
    setError(null)
    if (!next || next.length === 0) return

    const f = next[0]
    if (f.size > 12 * 1024 * 1024) {
      setError("Payload exceeds 12MB limit. Optimize document size.")
      return
    }

    setFile(f)
    setPreviewUrl(f.type.startsWith("image/") ? URL.createObjectURL(f) : null)
  }

  async function onUpload() {
    if (!file) return
    setError(null)
    resetStore()
    start()
    setProgress(4)
    setStatusMessage("Uploading file")

    setStage("uploading")
    try {
      const accepted = await api.analyze(file)
      setTask(accepted.task_id)
      setStage("processing")

      let polls = 0
      let completed = false
      while (polls < 180) {
        polls += 1
        const status = await api.getStatus(accepted.task_id)
        setLogs(status.logs)
        setProgress(status.progress)
        if (status.logs.length > 0) {
          setStatusMessage(status.logs[status.logs.length - 1].message)
        }

        if (status.status === "completed" && status.result) {
          success(status.result)
          completed = true
          break
        }

        if (status.status === "failed") {
          throw new Error(status.error || "Processing pipeline failed")
        }

        await new Promise((r) => setTimeout(r, 1000))
      }

      if (!completed) {
        throw new Error("Processing timed out. Please retry.")
      }

      setStage("success")
      setTimeout(() => router.push("/dashboard"), 800)
    } catch (e: any) {
      const message = e.message || "Ingestion pipeline failure."
      fail(message)
      setError(message)
      setStage("idle")
    }
  }

  return (
    <motion.div variants={fadeInUp} initial="hidden" animate="visible" className="max-w-4xl mx-auto">
      <Card className="glass p-10 space-y-8 relative overflow-hidden rounded-[2.5rem] border-white/5 ring-1 ring-white/10">
        {stage === "processing" && (
          <div className="absolute inset-0 bg-blue-600/5 animate-pulse-slow pointer-events-none" />
        )}
        
        <div className="flex items-start justify-between gap-6">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-meta font-medium tracking-tight text-blue-500">Task node: Ingestion</span>
              <div className="size-1.5 rounded-full bg-blue-500 animate-pulse" />
            </div>
            <h2 className="text-h1 text-white tracking-tight">
              Analyze your document
            </h2>
            <p className="text-slate-400 text-paragraph leading-relaxed max-w-lg">
              Initialize the intelligence pipeline. Our core engine will extract, chunk, 
              and semantically index your documents for structural optimization.
            </p>
          </div>

          <AnimatePresence mode="wait">
            {stage === "idle" ? (
              <motion.div 
                key="idle"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="glass-dark px-4 py-1.5 rounded-full border-white/5 flex items-center gap-2"
              >
                <div className="size-1.5 rounded-full bg-slate-500" />
                <span className="text-meta font-medium text-slate-300">Idle</span>
              </motion.div>
            ) : (
              <motion.div 
                key="active"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-blue-600 px-4 py-1.5 rounded-full flex items-center gap-3 shadow-lg shadow-blue-600/20"
              >
                <Loader2 className="size-3 animate-spin text-white" />
                <span className="text-meta font-medium text-white">
                  {stage === "uploading" ? "Transmitting" : "Analyzing"}
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {error && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            className="rounded-2xl border border-red-500/20 bg-red-500/10 p-5 flex items-center gap-4 text-red-400"
          >
            <AlertCircle className="size-5 shrink-0" />
            <p className="text-sm font-medium leading-relaxed">{error}</p>
          </motion.div>
        )}

        <div className="relative group">
          <div className="absolute inset-0 bg-blue-600/5 rounded-[2rem] blur-2xl group-hover:bg-blue-600/10 transition-colors pointer-events-none" />
          <UploadDropZone
            stage={stage}
            dragActive={dragActive}
            setDragActive={setDragActive}
            file={file}
            previewUrl={previewUrl}
            progress={progress}
            statusMessage={statusMessage}
            onPickFiles={handleFiles}
            onClear={clearSelection}
            onUpload={onUpload}
          />
        </div>

        <div className="pt-6 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-6">
             <div className="flex items-center gap-2">
                <div className="size-1 rounded-full bg-emerald-500/40" />
                <span className="text-meta text-slate-500">SOC2 compliant</span>
             </div>
             <div className="flex items-center gap-2">
                <div className="size-1 rounded-full bg-blue-500/40" />
                <span className="text-meta text-slate-500">AES-256 encrypted</span>
             </div>
          </div>
          <p className="text-meta text-slate-600">TaxOracle Engine v1.0.4</p>
        </div>
      </Card>
    </motion.div>
  )
}

