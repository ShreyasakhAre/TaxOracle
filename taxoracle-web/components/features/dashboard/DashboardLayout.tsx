import type { ProcessResponse } from "@/lib/api/client"
import { motion, AnimatePresence } from "framer-motion"
import { useState } from "react"
import { 
  ShieldAlert, 
  Briefcase, 
  FileCheck, 
  LayoutDashboard, 
  Lightbulb, 
  MessageSquare,
  Terminal,
  Activity,
  ChevronRight
} from "lucide-react"

import { SummaryCards } from "./SummaryCards"
import { ChartAndRisk } from "./ChartAndRisk"
import { DeductionBars } from "./DeductionBars"
import { RiskFlags } from "./RiskFlags"
import { InsightsList } from "./InsightsList"
import { AIExplanationPanel } from "./AIExplanationPanel"
import { Card } from "@/components/ui/Card"
import { fadeInUp, staggerContainer } from "@/components/animations/variants"
import { api } from "@/lib/api/client"
import type { PipelineLog } from "@/lib/api"

type Tab = "summary" | "insights" | "qa"

export function DashboardLayout({
  data,
  mode = "ready",
  taskId,
  logs = [],
}: {
  data: ProcessResponse | null
  mode?: "ready" | "loading" | "error"
  taskId?: string | null
  logs?: PipelineLog[]
}) {
  const [activeTab, setActiveTab] = useState<Tab>("summary")
  const [showConsole, setShowConsole] = useState(false)
  const [question, setQuestion] = useState("")
  const [answer, setAnswer] = useState("")
  const [qaConfidence, setQaConfidence] = useState<number | null>(null)
  const [qaLoading, setQaLoading] = useState(false)
  const [qaError, setQaError] = useState<string | null>(null)

  if (mode === "loading") {
    return (
      <div className="flex flex-col items-center justify-center p-24 space-y-6 text-center">
        <div className="size-16 rounded-full border-2 border-blue-500/20 border-t-blue-500 animate-spin" />
        <div className="space-y-2">
          <p className="text-h2 text-white">Initializing intelligence engine</p>
          <p className="text-meta text-slate-500">Executing deterministic extraction pipeline...</p>
        </div>
      </div>
    )
  }

  if (mode === "error") {
    return (
      <div className="glass border-red-500/20 p-12 rounded-[2.5rem] text-center space-y-8 max-w-2xl mx-auto">
        <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto border border-red-500/20">
          <ShieldAlert className="size-10 text-red-500" />
        </div>
        <div className="space-y-3">
          <h3 className="text-h2 text-white">System fault detected</h3>
          <p className="text-slate-400 text-paragraph leading-relaxed">
            The extraction pipeline encountered a critical error. This usually indicates 
            unsupported document structure or corrupted metadata.
          </p>
        </div>
        <button 
          onClick={() => window.location.href = "/upload"}
          className="px-10 py-4 rounded-full bg-white text-black font-semibold hover:bg-slate-200 transition-all text-sm"
        >
          Re-initialize pipeline
        </button>
      </div>
    )
  }

  if (!data) return null

  const savings = Math.max(0, data.tax_result.old_tax - data.tax_result.new_tax)
  const latestLogs = logs.length > 0 ? logs : [{ time: "--:--:--", message: "No logs available yet" }]

  async function askQuestion() {
    if (!taskId || !question.trim()) return
    setQaLoading(true)
    setQaError(null)
    try {
      const res = await api.askQuestion(taskId, question.trim())
      setAnswer(res.answer)
      setQaConfidence(res.confidence)
    } catch (e: any) {
      setQaError(e?.message || "Unable to fetch answer")
    } finally {
      setQaLoading(false)
    }
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[80vh]">
      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 space-y-8">
        <div className="glass p-4 rounded-3xl border-white/5 space-y-2">
          <TabButton 
            active={activeTab === "summary"} 
            onClick={() => setActiveTab("summary")}
            icon={LayoutDashboard}
            label="Summary"
          />
          <TabButton 
            active={activeTab === "insights"} 
            onClick={() => setActiveTab("insights")}
            icon={Lightbulb}
            label="Key insights"
          />
          <TabButton 
            active={activeTab === "qa"} 
            onClick={() => setActiveTab("qa")}
            icon={MessageSquare}
            label="Q&A assistant"
          />
        </div>

        <div className="glass p-6 rounded-3xl border-white/5 space-y-4">
          <div className="flex items-center gap-2 text-blue-500">
            <Activity className="size-4" />
            <span className="text-meta font-semibold">Engine status</span>
          </div>
          <div className="space-y-3">
             <StatusLine label="Extraction" status="complete" />
             <StatusLine label="Analysis" status="complete" />
             <StatusLine label="Q&A index" status="ready" />
          </div>
          <button 
            onClick={() => setShowConsole(!showConsole)}
            className="w-full mt-4 flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors text-meta text-slate-300"
          >
            <div className="flex items-center gap-2">
              <Terminal className="size-4" />
              <span>System logs</span>
            </div>
            <ChevronRight className={`size-3 transition-transform ${showConsole ? 'rotate-90' : ''}`} />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 space-y-8">
        <AnimatePresence mode="wait">
          {activeTab === "summary" && (
            <motion.div 
              key="summary"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: 10 }}
              className="space-y-8"
            >
              <SummaryCards
                savings={savings}
                savingsScore={data.savings_score}
                riskScore={data.risk.score}
                complianceScore={data.compliance_score}
                confidence={data.confidence}
              />

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-8 space-y-8">
                  <ChartAndRisk
                    taxOld={data.tax_result.old_tax}
                    taxNew={data.tax_result.new_tax}
                    riskScore={data.risk.score}
                    riskLevel={data.risk.level}
                  />
                  <DeductionBars extracted={data.extracted_data} />
                </div>
                <div className="lg:col-span-4">
                  <ReportCard report={data.report} />
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "insights" && (
            <motion.div 
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-8 space-y-8">
                <InsightsList insights={data.insights} />
                <AIExplanationPanel explanation={data.explanation} />
              </div>
              <div className="lg:col-span-4 space-y-8">
                <RiskFlags flags={data.risk.flags} />
                <ActionPlanCard actions={data.actions} />
              </div>
            </motion.div>
          )}

          {activeTab === "qa" && (
             <motion.div 
               key="qa"
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               exit={{ opacity: 0, y: 10 }}
               className="glass rounded-[2.5rem] p-12 h-[600px] flex flex-col items-center justify-center text-center space-y-6"
             >
               <div className="size-20 rounded-3xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                 <MessageSquare className="size-10 text-blue-400" />
               </div>
               <div className="space-y-2">
                 <h3 className="text-h2 text-white">Document assistant</h3>
                 <p className="text-slate-500 text-paragraph max-w-md mx-auto">
                   Ask specific questions about your document. Our engine has indexed 
                   the content for semantic retrieval and precise answers.
                 </p>
               </div>
               <div className="w-full max-w-xl pt-8">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g., What are my total medical deductions?"
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
                    />
                    <button
                      onClick={askQuestion}
                      disabled={qaLoading || !taskId || !question.trim()}
                      className="absolute right-2 top-2 px-6 py-2 rounded-full bg-blue-600 text-white font-semibold text-sm hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {qaLoading ? "Asking..." : "Ask"}
                    </button>
                  </div>
                  {(answer || qaError) && (
                    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-5 text-left space-y-2">
                      {qaError ? (
                        <p className="text-red-400 text-sm">{qaError}</p>
                      ) : (
                        <>
                          <p className="text-slate-200 text-sm leading-relaxed">{answer}</p>
                          {qaConfidence !== null && (
                            <p className="text-xs text-slate-500">Match confidence: {(qaConfidence * 100).toFixed(1)}%</p>
                          )}
                        </>
                      )}
                    </div>
                  )}
               </div>
             </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Console Panel */}
      <AnimatePresence>
        {showConsole && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-8 left-8 right-8 lg:left-auto lg:right-12 lg:w-96 z-50"
          >
            <Card className="glass-dark border-blue-500/20 p-6 rounded-3xl shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="size-4 text-blue-400" />
                  <span className="text-meta font-semibold text-white">Pipeline logs</span>
                </div>
                <button onClick={() => setShowConsole(false)} className="text-slate-500 hover:text-white transition-colors">
                  <ChevronRight className="size-4 rotate-90" />
                </button>
              </div>
              <div className="space-y-3 max-h-64 overflow-y-auto font-mono text-[10px] leading-relaxed">
                {latestLogs.map((line, idx) => (
                  <LogLine key={`${line.time}-${idx}`} time={line.time} msg={line.message} color={line.message.toLowerCase().includes("failed") ? "red" : line.message.toLowerCase().includes("complete") ? "emerald" : "blue"} />
                ))}
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function TabButton({ active, onClick, icon: Icon, label }: { active: boolean, onClick: () => void, icon: any, label: string }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all ${
        active 
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
          : 'text-slate-400 hover:bg-white/5 hover:text-white'
      }`}
    >
      <Icon className="size-4" />
      <span className="text-sm font-semibold">{label}</span>
    </button>
  )
}

function StatusLine({ label, status }: { label: string, status: 'complete' | 'ready' | 'pending' }) {
  return (
    <div className="flex items-center justify-between text-[11px]">
      <span className="text-slate-500">{label}</span>
      <div className="flex items-center gap-1.5">
        <div className={`size-1 rounded-full ${status === 'complete' ? 'bg-emerald-500' : 'bg-blue-500'}`} />
        <span className="text-slate-300 capitalize">{status}</span>
      </div>
    </div>
  )
}

function LogLine({ time, msg, color }: { time: string, msg: string, color: 'blue' | 'emerald' | 'red' }) {
  const colorMap = {
    blue: 'text-blue-400',
    emerald: 'text-emerald-400',
    red: 'text-red-400'
  }
  return (
    <div className="flex gap-2">
      <span className="text-slate-600 shrink-0">{time}</span>
      <span className={colorMap[color]}>{msg}</span>
    </div>
  )
}

function ActionPlanCard({ actions }: { actions: any[] }) {
  return (
    <Card className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-meta font-semibold text-blue-400">Action plan</h3>
        <Briefcase className="size-5 text-slate-600" />
      </div>
      <div className="space-y-4">
        {actions.map((action, i) => (
          <div key={i} className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-all">
            <div className={`size-2 rounded-full mt-2 shrink-0 ${
              action.type === 'compliance' ? 'bg-amber-500' : 
              action.type === 'tax' ? 'bg-blue-500' : 'bg-emerald-500'
            }`} />
            <div className="space-y-1">
              <p className="font-semibold text-white text-sm">{action.title}</p>
              <p className="text-slate-500 text-xs leading-relaxed">{action.description}</p>
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}

function ReportCard({ report }: { report: any }) {
  return (
    <Card className="glass p-8 rounded-[2.5rem] border-white/5 space-y-8 flex flex-col justify-between h-full bg-gradient-to-br from-blue-600/10 to-transparent">
      <div className="space-y-6">
        <div className="size-14 rounded-2xl bg-blue-600 flex items-center justify-center shadow-xl shadow-blue-600/20">
          <FileCheck className="size-7 text-white" />
        </div>
        <div className="space-y-3">
          <h3 className="text-h2 text-white leading-tight">Intelligence report</h3>
          <p className="text-slate-400 text-sm leading-relaxed">
            {report?.summary ?? "Comprehensive tax compliance and optimization audit results."}
          </p>
        </div>
      </div>
      
      <div className="space-y-4 pt-6">
        <button className="w-full py-4 rounded-full bg-white text-black font-semibold text-sm hover:bg-slate-200 transition-all">
          Download PDF report
        </button>
        <p className="text-meta text-center text-slate-600">
          {report?.generated_at ? `Verified: ${report.generated_at}` : "Verification pending"}
        </p>
      </div>
    </Card>
  )
}

