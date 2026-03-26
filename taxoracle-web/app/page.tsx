"use client"

import Link from "next/link"
import { motion, useScroll, useTransform } from "framer-motion"
import { 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  Wand2,
  Lock,
  Zap,
  MousePointer2,
  Brain,
  FileText
} from "lucide-react"

import { staggerContainer, fadeInUp, float } from "@/components/animations/variants"
import { PipelineDiagram } from "@/components/features/landing/PipelineDiagram"

export default function Home() {
  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.1], [1, 0])
  const blur = useTransform(scrollYProgress, [0, 0.1], [0, 10])

  return (
    <div className="relative min-h-screen bg-[#0B0F14] selection:bg-blue-500/30 overflow-x-hidden">
      {/* Background Ambience */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-[1000px] bg-gradient-to-b from-blue-600/5 via-transparent to-transparent" />
        <div className="absolute top-[20%] right-[-10%] size-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-[20%] left-[-10%] size-[600px] bg-emerald-500/5 blur-[120px] rounded-full" />
        <div className="absolute inset-0 bg-grid opacity-20" />
      </div>

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-6 py-12 lg:py-24 space-y-32"
      >
        {/* Navigation Bar (Glass) */}
        <header className="fixed top-8 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl z-50">
          <div className="glass h-16 rounded-full px-8 flex items-center justify-between border-white/10 ring-1 ring-white/10">
            <div className="flex items-center gap-3">
              <div className="size-8 rounded-lg bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
                <ShieldCheck className="size-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white">TaxOracle <span className="text-blue-500 font-medium text-meta">Engine</span></span>
            </div>
            <Link href="/upload" className="px-6 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-slate-200 transition-all">
              Launch console
            </Link>
          </div>
        </header>

        {/* Hero Section */}
        <motion.section 
          style={{ opacity, filter: `blur(${blur}px)` }}
          className="text-center space-y-12 pt-24"
        >
          <div className="space-y-6">
            <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-meta font-medium mx-auto">
              <Zap className="size-3 fill-blue-400" />
              Production core v1.0.4
            </motion.div>
            
            <motion.h1 variants={fadeInUp} className="text-h1 tracking-tight text-white lg:max-w-4xl mx-auto leading-tight">
              Intelligent tax compliance <br />
              <span className="text-gradient">for the modern enterprise</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="max-w-2xl mx-auto text-paragraph text-slate-400 leading-relaxed">
              Autonomous tax compliance and optimization platform. Secure, deterministic, and built for speed. 
              Zero-latency extraction meets institutional-grade rule processing.
            </motion.p>
          </div>

          <motion.div variants={fadeInUp} className="flex items-center justify-center gap-6">
            <Link
              href="/upload"
              className="px-10 py-4 rounded-full bg-blue-600 text-white font-medium text-lg hover:bg-blue-500 hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-blue-600/20"
            >
              Start analysis
            </Link>
          </motion.div>

          <motion.div variants={fadeInUp} className="pt-8">
            <PipelineDiagram />
          </motion.div>
        </motion.section>

        {/* Intelligence Pipeline Detail */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
          <motion.div variants={fadeInUp} className="space-y-8">
            <div className="space-y-4">
              <h2 className="text-h2 text-white tracking-tight leading-tight">
                The compliance <br /> <span className="text-blue-500">intelligence cycle</span>
              </h2>
              <p className="text-slate-400 text-paragraph leading-relaxed max-w-lg">
                Our engine executes a deterministic five-stage pipeline 
                to ensure 99.9% extraction accuracy and perfect rule adherence.
              </p>
            </div>
            
            <div className="space-y-6">
              {[
                { label: "Deep chunking", desc: "Recursive partitioning for context preservation." },
                { label: "Vector indexing", desc: "Cross-referenced semantic search across tax slabs." },
                { label: "Rule evaluation", desc: "Deterministic logic gate for compliance verification." }
              ].map((step, i) => (
                <div key={i} className="flex gap-4 group">
                  <div className="w-1 bg-blue-500/20 group-hover:bg-blue-500 transition-all rounded-full" />
                  <div className="space-y-1">
                    <h4 className="font-semibold text-white text-sm">{step.label}</h4>
                    <p className="text-slate-500 text-meta">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div 
            variants={float}
            animate="animate"
            className="glass-dark aspect-square rounded-[3rem] p-12 flex items-center justify-center border-white/5 relative"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-emerald-500/5 rounded-[3rem]" />
            <div className="text-center space-y-6 relative z-10">
              <div className="size-32 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin mx-auto flex items-center justify-center">
                <div className="size-20 rounded-full bg-blue-500 flex items-center justify-center shadow-2xl shadow-blue-600/40">
                  <Brain className="size-10 text-white fill-white" />
                </div>
              </div>
              <p className="text-meta font-medium tracking-widest text-blue-400 uppercase">Core online</p>
            </div>
          </motion.div>
        </section>

        {/* Feature Grid: System Highlights */}
        <section className="space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-h2 text-white tracking-tight">Integrated subsystems</h2>
            <div className="h-1 w-16 bg-blue-600 mx-auto rounded-full opacity-50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: ShieldCheck, title: "Risk mitigation", desc: "Real-time audit flagging for deduction discrepancies." },
              { icon: Wand2, title: "Savings engine", desc: "Automated slab comparison yielding maximum tax efficiency." },
              { icon: FileText, title: "Report generation", desc: "Instant JSON/PDF export for institutional documentation." }
            ].map((f, i) => (
              <motion.div 
                key={i} 
                variants={fadeInUp}
                whileHover={{ y: -4 }}
                className="glass p-10 rounded-3xl border-white/5 space-y-6 group"
              >
                <div className="size-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                  <f.icon className="size-6 text-blue-500 group-hover:text-inherit" />
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-white tracking-tight">{f.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Final System CTA */}
        <section className="text-center space-y-8 pb-32">
          <motion.div variants={fadeInUp} className="inline-flex size-2 rounded-full bg-blue-500 animate-pulse" />
          <motion.h2 variants={fadeInUp} className="text-h1 text-white leading-tight tracking-tight">
            Initialize your audit
          </motion.h2>
          <motion.div variants={fadeInUp} className="pt-6">
            <Link
              href="/upload"
              className="inline-flex items-center gap-4 px-10 py-4 rounded-full bg-white text-black font-semibold hover:bg-slate-200 transition-all group"
            >
              Execute pipeline
              <ArrowRight className="size-5 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </section>
      </motion.div>

      {/* Global Scroll Progress */}
      <motion.div 
        style={{ scaleX: scrollYProgress }} 
        className="fixed bottom-0 left-0 right-0 h-1 bg-blue-600 origin-left z-[100]" 
      />
    </div>
  )
}
