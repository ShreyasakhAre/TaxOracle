"use client"

import { type ButtonHTMLAttributes } from "react"
import { Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

type Variant = "primary" | "secondary"

export function AppButton({
  variant,
  isLoading,
  disabled,
  className,
  children,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant: Variant
  isLoading?: boolean
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-colors"

  const variantClass =
    variant === "primary"
      ? "bg-gradient-to-r from-indigo-500 to-indigo-600 text-white shadow-sm shadow-indigo-500/20 hover:from-indigo-400 hover:to-indigo-500"
      : "bg-slate-800/60 text-slate-100 border border-slate-700/60 hover:bg-slate-800/80"

  return (
    <button
      className={cn(base, variantClass, className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="size-4 animate-spin" />}
      {children}
    </button>
  )
}

