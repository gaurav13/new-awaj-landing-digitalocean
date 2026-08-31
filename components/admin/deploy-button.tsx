"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { CheckCircle2, Loader2, Rocket, TriangleAlert, X, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { DeployStepName } from "@/lib/deploy-types"

type StepState = {
  step: DeployStepName
  status: "pending" | "running" | "success" | "error"
  command?: string
  stdout?: string
  stderr?: string
  error?: string
  durationMs?: number
}

type ToastState = {
  type: "success" | "error"
  message: string
}

const DEPLOY_STEPS: DeployStepName[] = ["git pull", "npm run build", "pm2 restart"]

function formatDuration(ms?: number) {
  if (!ms) return ""
  if (ms < 1000) return `${ms}ms`
  return `${(ms / 1000).toFixed(1)}s`
}

export function DeployButton() {
  const [showConfirm, setShowConfirm] = useState(false)
  const [deploying, setDeploying] = useState(false)
  const [steps, setSteps] = useState<StepState[]>(() =>
    DEPLOY_STEPS.map((step) => ({ step, status: "pending" })),
  )
  const [logLines, setLogLines] = useState<string[]>([])
  const [toast, setToast] = useState<ToastState | null>(null)
  const logRef = useRef<HTMLPreElement>(null)
  const abortRef = useRef<AbortController | null>(null)

  const appendLog = useCallback((line: string) => {
    setLogLines((prev) => [...prev, line])
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 6000)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" })
  }, [logLines])

  function resetProgress() {
    setSteps(DEPLOY_STEPS.map((step) => ({ step, status: "pending" })))
    setLogLines([])
  }

  function updateStep(step: DeployStepName, patch: Partial<StepState>) {
    setSteps((prev) => prev.map((item) => (item.step === step ? { ...item, ...patch } : item)))
  }

  async function handleDeploy() {
    setShowConfirm(false)
    setDeploying(true)
    resetProgress()
    appendLog(`[${new Date().toLocaleTimeString()}] Starting deployment…`)

    const controller = new AbortController()
    abortRef.current = controller

    try {
      const response = await fetch("/api/admin/deploy", {
        method: "POST",
        signal: controller.signal,
      })

      if (!response.ok) {
        const data = (await response.json().catch(() => null)) as { error?: string } | null
        throw new Error(data?.error || `Deployment request failed (${response.status})`)
      }

      if (!response.body) {
        throw new Error("Deployment stream unavailable.")
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ""

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split("\n")
        buffer = lines.pop() ?? ""

        for (const line of lines) {
          if (!line.trim()) continue
          const event = JSON.parse(line) as Record<string, unknown>

          if (event.type === "start") {
            appendLog(String(event.message ?? "Deployment started"))
            if (event.projectDir) appendLog(`Project directory: ${event.projectDir}`)
            continue
          }

          if (event.type === "step" && typeof event.step === "string") {
            const step = event.step as DeployStepName
            if (event.status === "running") {
              updateStep(step, { status: "running", command: String(event.command ?? "") })
              appendLog(`→ Running: ${event.command ?? step}`)
              continue
            }

            updateStep(step, {
              status: event.status === "success" ? "success" : "error",
              command: String(event.command ?? ""),
              stdout: typeof event.stdout === "string" ? event.stdout : undefined,
              stderr: typeof event.stderr === "string" ? event.stderr : undefined,
              error: typeof event.error === "string" ? event.error : undefined,
              durationMs: typeof event.durationMs === "number" ? event.durationMs : undefined,
            })

            if (typeof event.stdout === "string" && event.stdout) appendLog(event.stdout)
            if (typeof event.stderr === "string" && event.stderr) appendLog(event.stderr)
            if (typeof event.error === "string" && event.error) appendLog(`Error: ${event.error}`)

            appendLog(
              `${event.status === "success" ? "✓" : "✗"} ${step} ${formatDuration(event.durationMs as number | undefined)}`,
            )
            continue
          }

          if (event.type === "complete") {
            const success = event.success === true
            const message = String(event.message ?? (success ? "Deployment complete." : "Deployment failed."))
            appendLog(message)
            setToast({ type: success ? "success" : "error", message })
          }
        }
      }
    } catch (error) {
      if (controller.signal.aborted) return
      const message = error instanceof Error ? error.message : "Deployment failed."
      appendLog(`Error: ${message}`)
      setToast({ type: "error", message })
    } finally {
      abortRef.current = null
      setDeploying(false)
    }
  }

  return (
    <>
      <section className="rounded-3xl border border-gold/20 bg-white p-6 text-navy-text shadow-sm sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-beige px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
              <Rocket className="h-3.5 w-3.5" />
              Live deployment
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold text-navy-text">Deploy to DigitalOcean</h2>
            <p className="mt-2 text-sm leading-relaxed text-navy-text/70">
              Pull the latest code from GitHub, rebuild the production app, and restart PM2 on the live server.
              This usually takes a few minutes while <code className="rounded bg-beige px-1 text-navy-text">npm run build</code> runs.
            </p>
          </div>

          <Button
            type="button"
            disabled={deploying}
            onClick={() => setShowConfirm(true)}
            className="h-11 shrink-0 rounded-full bg-gold px-6 text-sm font-semibold text-navy hover:bg-gold/90 disabled:opacity-60"
          >
            {deploying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Deploying…
              </>
            ) : (
              <>
                <Rocket className="h-4 w-4" />
                Deploy to Live Server
              </>
            )}
          </Button>
        </div>

        {(deploying || steps.some((step) => step.status !== "pending")) && (
          <div className="mt-6 space-y-4 rounded-2xl border border-gold/15 bg-beige/40 p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-3">
              {steps.map((step) => (
                <div
                  key={step.step}
                  className="rounded-xl border border-gold/15 bg-white px-4 py-3"
                >
                  <div className="flex items-center gap-2 text-sm font-medium capitalize text-navy-text">
                    {step.status === "running" ? (
                      <Loader2 className="h-4 w-4 animate-spin text-gold" />
                    ) : step.status === "success" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : step.status === "error" ? (
                      <XCircle className="h-4 w-4 text-red-600" />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-navy-text/30" />
                    )}
                    {step.step}
                  </div>
                  {step.durationMs ? (
                    <p className="mt-1 text-xs text-navy-text/50">{formatDuration(step.durationMs)}</p>
                  ) : null}
                </div>
              ))}
            </div>

            {logLines.length > 0 ? (
              <pre
                ref={logRef}
                className="max-h-64 overflow-auto rounded-xl border border-gold/15 bg-navy p-4 text-xs leading-relaxed text-white/90"
              >
                {logLines.join("\n")}
              </pre>
            ) : null}
          </div>
        )}
      </section>

      {showConfirm ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-navy/50 px-4"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl border border-gold/20 bg-ivory p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="deploy-confirm-title"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Confirm deployment</p>
                <h3 id="deploy-confirm-title" className="mt-2 font-serif text-2xl font-bold text-navy-text">
                  Deploy latest changes?
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="rounded-full p-2 text-navy-text/50 hover:bg-beige hover:text-navy-text"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-navy-text/70">
              Are you sure you want to deploy latest changes to the live server? This will run{" "}
              <strong>git pull</strong>, <strong>npm run build</strong>, and <strong>pm2 restart</strong> on the
              production droplet.
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowConfirm(false)}
                className="rounded-full border-gold/40 text-navy-text"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleDeploy}
                className="rounded-full bg-navy text-white hover:bg-navy/90"
              >
                Yes, deploy now
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {toast ? (
        <div
          className={`fixed bottom-6 right-6 z-[60] flex max-w-sm items-start gap-3 rounded-2xl border px-4 py-3 shadow-xl ${
            toast.type === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-950"
              : "border-red-200 bg-red-50 text-red-950"
          }`}
          role="status"
        >
          {toast.type === "success" ? (
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-600" />
          ) : (
            <TriangleAlert className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
          )}
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold">{toast.type === "success" ? "Deployment successful" : "Deployment failed"}</p>
            <p className="mt-1 text-sm opacity-80">{toast.message}</p>
          </div>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="rounded-full p-1 opacity-60 hover:opacity-100"
            aria-label="Dismiss notification"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </>
  )
}
