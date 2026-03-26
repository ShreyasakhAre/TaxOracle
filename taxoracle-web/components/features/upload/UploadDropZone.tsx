"use client"
import { FileText, UploadCloud } from "lucide-react"
import { motion } from "framer-motion"

import { AppButton } from "@/components/ui/AppButton"
import { UploadStage, formatBytes } from "./uploadTypes"

export function UploadDropZone({
  stage,
  dragActive,
  setDragActive,
  file,
  previewUrl,
  progress,
  statusMessage,
  onPickFiles,
  onClear,
  onUpload,
}: {
  stage: UploadStage
  dragActive: boolean
  setDragActive: (active: boolean) => void
  file: File | null
  previewUrl: string | null
  progress: number
  statusMessage: string
  onPickFiles: (files: FileList | null) => Promise<void>
  onClear: () => void
  onUpload: () => Promise<void>
}) {
  const isImage = !!file?.type.startsWith("image/")

  return (
    <div
      className={
        "mt-6 rounded-2xl border-2 border-dashed transition-all " +
        (dragActive
          ? "border-blue-500 bg-blue-500/5"
          : "border-white/10 bg-white/5 hover:border-white/20")
      }
      onDragEnter={(e) => {
        e.preventDefault()
        if (stage === "idle") setDragActive(true)
      }}
      onDragOver={(e) => {
        e.preventDefault()
        if (stage === "idle") setDragActive(true)
      }}
      onDragLeave={(e) => {
        e.preventDefault()
        setDragActive(false)
      }}
      onDrop={async (e) => {
        e.preventDefault()
        setDragActive(false)
        if (stage !== "idle") return
        await onPickFiles(e.dataTransfer.files)
      }}
    >
      <div className="p-12">
        <div className="flex flex-col items-center justify-center gap-6 text-center">
          {file && isImage && previewUrl ? (
            <div className="w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-black/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt="Upload preview"
                src={previewUrl}
                className="h-64 w-full object-contain"
              />
            </div>
          ) : file ? (
            <div className="flex w-full max-w-md flex-col items-start justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
                  <FileText className="size-5 text-blue-400" />
                </div>
                <div className="text-left min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {formatBytes(file.size)}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClear}
                className="text-xs font-medium text-slate-400 hover:text-white transition-colors"
                disabled={stage !== "idle"}
              >
                Remove
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="size-16 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                <UploadCloud className="size-8 text-blue-400" />
              </div>
              <div className="space-y-1">
                <p className="text-lg font-semibold text-white">
                  Drag and drop your document
                </p>
                <p className="text-sm text-slate-500">
                  or click to select (max 12MB)
                </p>
              </div>
            </div>
          )}

          <input
            className="hidden"
            id="file-input"
            type="file"
            onChange={async (e) => {
              if (stage !== "idle") return
              await onPickFiles(e.target.files)
            }}
          />

          <div className="flex w-full max-w-md flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
            {!file && (
              <label
                htmlFor="file-input"
                className={
                  "inline-flex cursor-pointer items-center justify-center rounded-full bg-white px-8 py-3 text-sm font-semibold text-black hover:bg-slate-200 transition-all " +
                  (stage !== "idle" ? " cursor-not-allowed opacity-60" : "")
                }
              >
                Select document
              </label>
            )}

            {file && (stage === "idle" || stage === "uploading" || stage === "processing") && (
              <AppButton
                variant="primary"
                onClick={onUpload}
                isLoading={stage === "uploading" || stage === "processing"}
                disabled={stage !== "idle"}
                className="rounded-full px-12 py-3 text-sm font-semibold w-full sm:w-auto"
              >
                Analyze now
              </AppButton>
            )}
          </div>

          {(stage === "uploading" || stage === "processing") && (
            <div className="w-full max-w-sm space-y-3 pt-4">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: "0%" }}
                  animate={{ width: `${Math.max(4, Math.min(100, progress))}%` }}
                  className="h-full bg-blue-500"
                />
              </div>
              <p className="text-meta text-slate-500 animate-pulse">
                {statusMessage || (stage === "uploading" ? "Transmitting payload..." : "Extracting fields and generating analysis...")}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
