export interface FinancialData {
  income_salary: number
  income_other: number
  deductions_80c: number
  deductions_other: number
  tds: number
}

export interface Risk {
  score: number
  level: "low" | "medium" | "high"
  flags: string[]
}

export interface TaxResult {
  total_income: number
  deductions_applied: number
  old_tax: number
  new_tax: number
  recommended: "old" | "new"
}

export interface ActionItem {
  title: string
  description: string
  type: "tax" | "compliance" | "error" | "suggestion"
}

export interface ReportData {
  summary: string
  download_url?: string
  generated_at?: string
}

export interface ProcessResponse {
  session_id: string
  extracted_data: FinancialData
  tax_result: TaxResult
  risk: Risk
  compliance_score: number
  savings_score: number
  insights: string[]
  actions: ActionItem[]
  confidence: number
  explanation: string
  report: ReportData | null
}

export interface AnalyzeAcceptedResponse {
  task_id: string
  status: "queued" | "processing"
}

export interface PipelineLog {
  time: string
  message: string
}

export interface TaskStatusResponse {
  task_id: string
  status: "queued" | "processing" | "completed" | "failed"
  progress: number
  logs: PipelineLog[]
  result: ProcessResponse | null
  error: string | null
}

export interface QAResponse {
  answer: string
  confidence: number
  source_excerpt: string
}
