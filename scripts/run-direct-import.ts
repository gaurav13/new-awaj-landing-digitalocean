/**
 * Direct DB import for xrp-tokyo-2026 (no HTTP / localhost required).
 *
 * Usage:
 *   npx tsx scripts/run-direct-import.ts --dry-run
 *   npx tsx scripts/run-direct-import.ts
 *
 * Requires DATABASE_URL in .env.local. Delete after one-time use.
 */

import { createRequire } from "node:module"
import { readFileSync } from "node:fs"
import { resolve } from "node:path"

// Allow importing server-only modules (people-sync, organizations-sync) from tsx.
const nodeRequire = createRequire(import.meta.url)
const nodeModule = nodeRequire("node:module") as typeof import("node:module") & {
  _resolveFilename: (
    request: string,
    parent: NodeModule | null | undefined,
    isMain: boolean,
    options?: object,
  ) => string
}
const resolveFilename = nodeModule._resolveFilename
nodeModule._resolveFilename = function (request, parent, isMain, options) {
  if (request === "server-only") {
    return resolve(process.cwd(), "scripts/shims/server-only.ts")
  }
  return resolveFilename.call(this, request, parent, isMain, options)
}

function loadEnvLocal() {
  const envPath = resolve(process.cwd(), ".env.local")
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
}

async function main() {
  loadEnvLocal()

  if (!process.env.DATABASE_URL && !process.env.POSTGRES_URL) {
    console.error("Missing DATABASE_URL in .env.local")
    process.exit(1)
  }

  const dryRun = process.argv.includes("--dry-run")

  const { db } = await import("@/lib/db")
  const { events } = await import("@/lib/db/schema")
  const { eq } = await import("drizzle-orm")
  const { applyEventSpeakersAndSponsors } = await import("@/lib/import/apply-event-speakers-sponsors")
  const { loadAndMapXrpTokyoImport, XRP_TOKYO_EVENT_SLUG } = await import(
    "@/lib/import/xrp-tokyo-event-data"
  )

  const { speakers, sponsors } = loadAndMapXrpTokyoImport()

  if (dryRun) {
    console.log(
      JSON.stringify(
        {
          ok: true,
          dryRun: true,
          slug: XRP_TOKYO_EVENT_SLUG,
          speakerCount: speakers.length,
          sponsorCount: sponsors.length,
          sampleSpeaker: speakers[0] ?? null,
          sampleSponsor: sponsors[0] ?? null,
        },
        null,
        2,
      ),
    )
    return
  }

  const rows = await db.select().from(events).where(eq(events.slug, XRP_TOKYO_EVENT_SLUG)).limit(1)
  const event = rows[0]
  if (!event) {
    console.error(`Event "${XRP_TOKYO_EVENT_SLUG}" not found. Create it in admin first.`)
    process.exit(1)
  }

  console.log(`Importing ${speakers.length} speakers and ${sponsors.length} sponsors into "${event.title}"...`)

  const result = await applyEventSpeakersAndSponsors(
    XRP_TOKYO_EVENT_SLUG,
    speakers,
    sponsors,
    event.authorId,
  )

  console.log(JSON.stringify({ ok: true, ...result }, null, 2))
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error instanceof Error ? error.message : error)
    process.exit(1)
  })
