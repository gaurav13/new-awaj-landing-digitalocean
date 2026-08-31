/**
 * Local one-time CLI for xrp-tokyo-2026 speaker/sponsor import.
 *
 * Usage (dev server must be running on localhost:3000):
 *   npm run import:xrp-tokyo          # apply import
 *   npm run import:xrp-tokyo -- --dry-run
 *
 * Requires IMPORT_EVENT_SECRET in .env.local (same value as the API route).
 * Delete this script after the import is verified.
 */

import { readFileSync } from "fs"
import { resolve } from "path"

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local")
  try {
    const content = readFileSync(envPath, "utf8")
    for (const line of content.split("\n")) {
      const trimmed = line.trim()
      if (!trimmed || trimmed.startsWith("#")) continue
      const eq = trimmed.indexOf("=")
      if (eq === -1) continue
      const key = trimmed.slice(0, eq).trim()
      let value = trimmed.slice(eq + 1).trim()
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1)
      }
      if (!process.env[key]) process.env[key] = value
    }
  } catch {
    console.warn("Warning: could not read .env.local — set IMPORT_EVENT_SECRET manually.")
  }
}

async function main() {
  loadEnvLocal()

  const secret = process.env.IMPORT_EVENT_SECRET
  if (!secret) {
    console.error("Missing IMPORT_EVENT_SECRET in .env.local")
    process.exit(1)
  }

  const dryRun = process.argv.includes("--dry-run")
  const port = process.env.PORT ?? "3000"
  const baseUrl = process.env.IMPORT_BASE_URL ?? `http://localhost:${port}`

  console.log(`${dryRun ? "Dry run" : "Applying import"} via ${baseUrl}/api/import-event-data ...`)
  console.log("First request may take several minutes while Next.js compiles the new API route.")

  let response: Response
  try {
    response = await fetch(`${baseUrl}/api/import-event-data`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-import-secret": secret,
      },
      body: JSON.stringify({ dryRun }),
      signal: AbortSignal.timeout(600_000),
    })
  } catch (error) {
    console.error(
      "Could not reach the dev server.",
      error instanceof Error ? error.message : error,
    )
    console.error(
      "Ensure `npm run dev` (or `vercel dev`) is running, then retry.",
      "If the server is up, restart it once so the new /api/import-event-data route is picked up.",
    )
    process.exit(1)
  }

  const payload = (await response.json()) as Record<string, unknown>

  if (!response.ok) {
    console.error("Import failed:", payload.error ?? payload)
    process.exit(1)
  }

  console.log(JSON.stringify(payload, null, 2))
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
