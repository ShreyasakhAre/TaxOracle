"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

import type { PipelineLog, ProcessResponse } from "@/lib/api"

type ProcessStatus = "idle" | "processing" | "success" | "error"

type ProcessState = {
  status: ProcessStatus
  data: ProcessResponse | null
  error: string | null
  sessionId: string | null
  taskId: string | null
  logs: PipelineLog[]
  start: () => void
  setTask: (taskId: string) => void
  setLogs: (logs: PipelineLog[]) => void
  success: (data: ProcessResponse) => void
  fail: (message: string) => void
  reset: () => void
}

export const useProcessStore = create<ProcessState>()(
  persist(
    (set) => ({
      status: "idle",
      data: null,
      error: null,
      sessionId: null,
      taskId: null,
      logs: [],
      start: () => set({ status: "processing", error: null }),
      setTask: (taskId) => set({ taskId }),
      setLogs: (logs) => set({ logs }),
      success: (data) =>
        set({
          status: "success",
          data,
          error: null,
          sessionId: data.session_id,
        }),
      fail: (message) => set({ status: "error", error: message }),
      reset: () => set({ status: "idle", data: null, error: null, sessionId: null, taskId: null, logs: [] }),
    }),
    {
      name: "taxoracle:process:v3",
      partialize: (s) => ({
        sessionId: s.sessionId,
        status: s.status,
        taskId: s.taskId,
        logs: s.logs,
      }),
    },
  ),
)

