import { AnalyzeAcceptedResponse, ProcessResponse, QAResponse, TaskStatusResponse } from "./types"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8001"

export class ApiError extends Error {
  constructor(public status: number, message: string, public data?: any) {
    super(message)
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new ApiError(response.status, errorData.detail || "API Request Failed", errorData)
  }
  
  return response.json()
}

export const api = {
  analyze: async (file: File): Promise<AnalyzeAcceptedResponse> => {
    const formData = new FormData()
    formData.append("file", file)
    
    return request<AnalyzeAcceptedResponse>("/api/v1/analyze", {
      method: "POST",
      body: formData,
    })
  },

  getStatus: async (taskId: string): Promise<TaskStatusResponse> => {
    return request<TaskStatusResponse>(`/api/v1/status/${taskId}`)
  },

  askQuestion: async (taskId: string, question: string): Promise<QAResponse> => {
    return request<QAResponse>("/api/v1/qa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task_id: taskId, question }),
    })
  },
  
  checkHealth: async () => {
    return request<{ status: string; uptime: string }>("/health")
  },
  
  getMetrics: async () => {
    return request<any>("/metrics")
  }
}

// Re-export types for convenience
export * from "./types"
