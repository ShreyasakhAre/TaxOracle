import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import Header from "@/components/features/dashboard/Header"
import Sidebar from "@/components/features/dashboard/Sidebar"

const inter = Inter({ subsets: ["latin"], display: "swap" })

export const metadata: Metadata = {
  title: "TaxOracle Premium",
  description: "Advanced Compliance Intelligence System",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body className={inter.className}>
        <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-indigo-500/30">
          {children}
        </div>
      </body>
    </html>
  )
}
