import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import {
  acquireDeployLock,
  createScheduledPm2RestartResult,
  DEPLOY_CONFIG,
  getDeployCommands,
  getPm2RestartCommand,
  releaseDeployLock,
  runDeployStep,
  schedulePm2Restart,
} from "@/lib/deploy"

export const runtime = "nodejs"
export const maxDuration = 900
export const dynamic = "force-dynamic"

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  if (!acquireDeployLock()) {
    return NextResponse.json({ error: "A deployment is already in progress." }, { status: 409 })
  }

  const encoder = new TextEncoder()
  let restartScheduled = false

  const stream = new ReadableStream({
    async start(controller) {
      const send = (payload: Record<string, unknown>) => {
        controller.enqueue(encoder.encode(`${JSON.stringify(payload)}\n`))
      }

      try {
        send({
          type: "start",
          message: "Deployment started…",
          projectDir: DEPLOY_CONFIG.projectDir,
        })

        for (const { step, command } of getDeployCommands()) {
          send({ type: "step", step, status: "running", command })

          const result = await runDeployStep(step, command)
          send({ type: "step", ...result })

          if (result.status === "error") {
            send({
              type: "complete",
              success: false,
              message: `Deployment failed during "${step}".`,
            })
            return
          }
        }

        const pm2Command = getPm2RestartCommand()
        send({ type: "step", step: "pm2 restart", status: "running", command: pm2Command })

        const pm2Result = createScheduledPm2RestartResult()
        send({ type: "step", ...pm2Result })

        send({
          type: "complete",
          success: true,
          message:
            "Deployment completed successfully. The live site will restart in the background momentarily.",
        })

        restartScheduled = true
      } catch (error) {
        send({
          type: "complete",
          success: false,
          message: error instanceof Error ? error.message : "Deployment failed unexpectedly.",
        })
      } finally {
        releaseDeployLock()
        controller.close()
      }

      if (restartScheduled) {
        setImmediate(() => schedulePm2Restart())
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
