import { exec } from "child_process"
import { promisify } from "util"
import type { DeployStepName, DeployStepResult } from "@/lib/deploy-types"

const execAsync = promisify(exec)

export type { DeployStepName, DeployStepResult } from "@/lib/deploy-types"

export const DEPLOY_CONFIG = {
  projectDir: process.env.DEPLOY_PROJECT_DIR || "/var/www/asiaweb3",
  gitBranch: process.env.DEPLOY_GIT_BRANCH || "main",
  pm2Process: process.env.DEPLOY_PM2_PROCESS || "asiaweb3",
  pm2AppId: process.env.DEPLOY_PM2_APP_ID?.trim() || "",
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

/** Ensure PM2/node binaries are discoverable when Next.js runs under PM2/systemd. */
export function buildDeployEnv(): NodeJS.ProcessEnv {
  const home = process.env.HOME || "/root"
  const pathEntries = [
    `${home}/.nvm/versions/node/${process.version}/bin`,
    `${home}/.nvm/current/bin`,
    `${home}/.local/bin`,
    "/usr/local/bin",
    "/usr/bin",
    "/bin",
    process.env.PATH,
  ]

  const path = [...new Set(pathEntries.filter(Boolean).join(":").split(":"))].join(":")

  return {
    ...process.env,
    HOME: home,
    PATH: path,
    NODE_ENV: process.env.NODE_ENV || "production",
  }
}

function wrapPm2Command(subcommand: string): string {
  return [
    `$HOME/.nvm/versions/node/$(node -v)/bin/pm2 ${subcommand}`,
    `npx pm2 ${subcommand}`,
    `pm2 ${subcommand}`,
  ].join(" || ")
}

/** PM2 restart with nvm/npx/system fallbacks and optional app-id reload for asiaweb3. */
export function getPm2RestartCommand(): string {
  const { pm2Process, pm2AppId } = DEPLOY_CONFIG
  const attempts = [wrapPm2Command(`restart ${pm2Process} --update-env`)]

  if (pm2Process === "asiaweb3") {
    attempts.push(wrapPm2Command(`reload ${pm2Process}`))
    if (pm2AppId) {
      attempts.push(wrapPm2Command(`restart ${pm2AppId} --update-env`))
    }
  }

  return attempts.join(" || ")
}

export function getDeployCommands(): { step: DeployStepName; command: string }[] {
  const { gitBranch } = DEPLOY_CONFIG
  return [
    { step: "git pull", command: `git pull origin ${gitBranch}` },
    { step: "npm run build", command: "npm run build" },
    { step: "pm2 restart", command: getPm2RestartCommand() },
  ]
}

export async function runDeployStep(step: DeployStepName, command: string): Promise<DeployStepResult> {
  const started = Date.now()
  try {
    const { stdout, stderr } = await execAsync(command, {
      cwd: DEPLOY_CONFIG.projectDir,
      timeout: DEPLOY_CONFIG.execTimeoutMs,
      maxBuffer: 10 * 1024 * 1024,
      env: buildDeployEnv(),
      shell: "/bin/bash",
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
