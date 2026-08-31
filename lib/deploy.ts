import { exec } from "child_process"
import { promisify } from "util"
import type { DeployStepName, DeployStepResult } from "@/lib/deploy-types"

const execAsync = promisify(exec)

export type { DeployStepName, DeployStepResult } from "@/lib/deploy-types"

export const DEPLOY_CONFIG = {
  projectDir: process.env.DEPLOY_PROJECT_DIR || "/var/www/asiaweb3",
  gitBranch: process.env.DEPLOY_GIT_BRANCH || "main",
  pm2Process: process.env.DEPLOY_PM2_PROCESS || "asiaweb3",
  pm2AppId: process.env.DEPLOY_PM2_APP_ID || "2",
  pm2Bin: process.env.DEPLOY_PM2_BIN || "/usr/bin/pm2",
  execTimeoutMs: Number(process.env.DEPLOY_TIMEOUT_MS || 15 * 60 * 1000),
}

let deployLock = false

export function acquireDeployLock(): boolean {
  if (deployLock) return false
  deployLock = true
  return true
}

export function releaseDeployLock() {
  deployLock = false
}

/** Ensure system binaries resolve when Next.js runs under PM2. */
export function buildDeployEnv(): NodeJS.ProcessEnv {
  return {
    ...process.env,
    PATH: `/usr/local/bin:/usr/bin:/bin:${process.env.PATH ?? ""}`,
    NODE_ENV: process.env.NODE_ENV || "production",
  }
}

export function getPm2RestartCommand(): string {
  const { pm2Bin, pm2Process, pm2AppId } = DEPLOY_CONFIG
  return `${pm2Bin} restart ${pm2Process} --update-env || ${pm2Bin} restart ${pm2AppId} --update-env`
}

/** Build/deploy steps only — PM2 restart is scheduled separately after the HTTP response. */
export function getDeployCommands(): { step: DeployStepName; command: string }[] {
  const { gitBranch } = DEPLOY_CONFIG
  return [
    { step: "git pull", command: `git pull origin ${gitBranch}` },
    { step: "npm run build", command: "npm run build" },
  ]
}

/**
 * Restart PM2 in a detached background shell so the HTTP stream can finish
 * before this Node process is killed by the restart.
 */
export function schedulePm2Restart(): void {
  const inner = getPm2RestartCommand()
  const command = `nohup sh -c ${JSON.stringify(inner)} > /dev/null 2>&1 &`

  const child = exec(command, {
    cwd: DEPLOY_CONFIG.projectDir,
    env: buildDeployEnv(),
  })

  child.unref()
}

export async function runDeployStep(step: DeployStepName, command: string): Promise<DeployStepResult> {
  const started = Date.now()
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: DEPLOY_CONFIG.projectDir,
      timeout: DEPLOY_CONFIG.execTimeoutMs,
      maxBuffer: 10 * 1024 * 1024,
      env: buildDeployEnv(),
    })
    return {
      step,
      status: "success",
      command,
      stdout: stdout.trim() || undefined,
      stderr: stderr.trim() || undefined,
      durationMs: Date.now() - started,
    }
  } catch (error) {
    const err = error as Error & { stdout?: string; stderr?: string }
    return {
      step,
      status: "error",
      command,
      stdout: err.stdout?.trim() || undefined,
      stderr: err.stderr?.trim() || undefined,
      error: err.message,
      durationMs: Date.now() - started,
    }
  }
}

export function createScheduledPm2RestartResult(): DeployStepResult {
  return {
    step: "pm2 restart",
    status: "success",
    command: getPm2RestartCommand(),
    stdout: "Server restart scheduled in the background. The site will reload momentarily.",
    durationMs: 0,
  }
}
