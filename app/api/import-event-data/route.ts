import { type NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { applyEventSpeakersAndSponsors } from "@/lib/import/apply-event-speakers-sponsors"
import {
  XRP_TOKYO_EVENT_SLUG,
  loadAndMapXrpTokyoImport,
} from "@/lib/import/xrp-tokyo-event-data"

export const runtime = "nodejs"

const ALLOWED_SLUG = XRP_TOKYO_EVENT_SLUG

function importBlockedInProduction() {
  return process.env.NODE_ENV === "production" && process.env.ALLOW_EVENT_IMPORT !== "true"
}

function verifyImportSecret(request: NextRequest): boolean {
  const secret = process.env.IMPORT_EVENT_SECRET
  if (!secret) return false
  return request.headers.get("x-import-secret") === secret
}

/**
 * One-time import for xrp-tokyo-2026 speakers + sponsors.
 *
 * POST /api/import-event-data
 * Headers: x-import-secret: <IMPORT_EVENT_SECRET from .env.local>
 * Body (optional): { "dryRun": true }
 *
 * Delete this route after the import is verified.
 */
export async function POST(request: NextRequest) {
  if (importBlockedInProduction()) {
    return NextResponse.json(
      { error: "Event import is disabled in production. Set ALLOW_EVENT_IMPORT=true to override." },
      { status: 403 },
    )
  }

  if (!verifyImportSecret(request)) {
    return NextResponse.json(
      { error: "Invalid or missing x-import-secret header. Set IMPORT_EVENT_SECRET in .env.local." },
      { status: 401 },
    )
  }

  const session = await auth.api.getSession({ headers: await headers() })

  let body: { dryRun?: boolean } = {}
  try {
    body = (await request.json()) as { dryRun?: boolean }
  } catch {
    body = {}
  }

  const rows = await db.select().from(events).where(eq(events.slug, ALLOWED_SLUG)).limit(1)
  const event = rows[0]
  if (!event) {
    return NextResponse.json(
      { error: `Event "${ALLOWED_SLUG}" not found. Create it in admin before importing.` },
      { status: 404 },
    )
  }

  const authorId = session?.user?.id ?? event.authorId
  if (!authorId) {
    return NextResponse.json(
      { error: "No authorId available. Log in as admin or ensure the event has an authorId." },
      { status: 401 },
    )
  }

  const { speakers, sponsors } = loadAndMapXrpTokyoImport()

  if (body.dryRun) {
    return NextResponse.json({
      ok: true,
      dryRun: true,
      slug: ALLOWED_SLUG,
      speakerCount: speakers.length,
      sponsorCount: sponsors.length,
      sampleSpeaker: speakers[0] ?? null,
      sampleSponsor: sponsors[0] ?? null,
    })
  }

  try {
    const result = await applyEventSpeakersAndSponsors(ALLOWED_SLUG, speakers, sponsors, authorId)
    return NextResponse.json({ ok: true, ...result })
  } catch (error) {
    const message = error instanceof Error ? error.message : "Import failed"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
