export type DeployStepName = "git pull" | "npm run build" | "pm2 restart"

export type DeployStepResult = {
  step: DeployStepName
  status: "success" | "error"
  command: string
  stdout?: string
  stderr?: string
  error?: string
  durationMs: number
}
