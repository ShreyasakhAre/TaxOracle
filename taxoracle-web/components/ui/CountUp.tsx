"use client"

import { useEffect, useMemo, useState } from "react"

export function CountUpNumber({
  value,
  durationMs = 900,
  format,
}: {
  value: number
  durationMs?: number
  format?: (n: number) => string
}) {
  const safeValue = Number.isFinite(value) ? value : 0
  const [display, setDisplay] = useState(0)

  const formatter = useMemo(
    () => format ?? ((n: number) => n.toFixed(0)),
    [format],
  )

  useEffect(() => {
    const from = 0
    const to = safeValue
    const start = performance.now()

    let raf = 0
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - Math.pow(1 - t, 3) // easeOutCubic
      const next = from + (to - from) * eased
      setDisplay(next)
      if (t < 1) raf = requestAnimationFrame(tick)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [durationMs, safeValue])

  return <>{formatter(display)}</>
}

