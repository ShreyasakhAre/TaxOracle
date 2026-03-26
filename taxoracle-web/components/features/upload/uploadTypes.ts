export type UploadStage = "idle" | "uploading" | "processing" | "success"

export function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes)) return "—"
  const units = ["B", "KB", "MB", "GB"]
  let v = bytes
  let i = 0
  while (v >= 1024 && i < units.length - 1) {
    v /= 1024
    i++
  }
  return `${v.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

