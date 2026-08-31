import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import {
  acquireDeployLock,
  DEPLOY_CONFIG,
  getDeployCommands,
  releaseDeployLock,
  runDeployStep,
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

        send({
          type: "complete",
          success: true,
          message: "Deployment completed successfully. The live site has been updated.",
        })
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
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "no-store",
    },
  })
}
