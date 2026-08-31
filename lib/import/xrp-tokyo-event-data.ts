import { readFileSync } from "fs"
import { join } from "path"
import type { EventSpeaker, EventSponsor } from "@/lib/db/schema"

/** Raw speaker shape from xrp-tokyo.io export (extra fields are ignored on import). */
export type XrpTokyoSpeakerRaw = {
  name?: string
  role?: string
  company?: string
  bio?: string
  bio_en?: string
  image?: string
  twitter?: string
  linkedin?: string
  website?: string
  nameJa?: string
  roleJa?: string
  companyJa?: string
  [key: string]: unknown
}

/** Raw sponsor shape from xrp-tokyo.io export (extra fields are ignored on import). */
export type XrpTokyoSponsorRaw = {
  name?: string
  tier?: string
  logo?: string
  website?: string
  type?: string
  whiteLogo?: boolean
  forceWhiteBackground?: boolean
  whiteBackground?: boolean
  logoInset?: boolean
  [key: string]: unknown
}

export type XrpTokyoImportFile = {
  speakers?: XrpTokyoSpeakerRaw[]
  sponsors?: XrpTokyoSponsorRaw[]
}

export const XRP_TOKYO_EVENT_SLUG = "xrp-tokyo-2026"

const DEFAULT_IMPORT_PATH = join(process.cwd(), "scripts/data/xrp-tokyo-2026-import.json")

function pickUrl(...values: (string | undefined)[]): string | undefined {
  for (const v of values) {
    const trimmed = v?.trim()
    if (trimmed) return trimmed
  }
  return undefined
}

/** Maps xrp-tokyo speaker JSON → EventSpeaker (schema-safe subset only). */
export function mapXrpSpeakerToEventSpeaker(raw: XrpTokyoSpeakerRaw): EventSpeaker | null {
  const name = raw.name?.trim()
  if (!name) return null

  const speaker: EventSpeaker = { name }
  const role = raw.role?.trim()
  const company = raw.company?.trim()
  const imageUrl = raw.image?.trim()
  const linkUrl = pickUrl(raw.linkedin, raw.twitter, raw.website)

  if (role) speaker.role = role
  if (company) speaker.company = company
  if (imageUrl) speaker.imageUrl = imageUrl
  if (linkUrl) speaker.linkUrl = linkUrl

  return speaker
}

/** Maps xrp-tokyo sponsor JSON → EventSponsor (schema-safe subset only). */
export function mapXrpSponsorToEventSponsor(raw: XrpTokyoSponsorRaw): EventSponsor | null {
  const name = raw.name?.trim()
  if (!name) return null

  const sponsor: EventSponsor = { name }
  const tier = raw.tier?.trim()
  const logoUrl = raw.logo?.trim()
  const linkUrl = raw.website?.trim()

  if (tier) sponsor.tier = tier
  if (logoUrl) sponsor.logoUrl = logoUrl
  if (linkUrl) sponsor.linkUrl = linkUrl

  return sponsor
}

export function loadXrpTokyoImportFile(filePath = DEFAULT_IMPORT_PATH): XrpTokyoImportFile {
  const raw = readFileSync(filePath, "utf8")
  return JSON.parse(raw) as XrpTokyoImportFile
}

export function mapXrpTokyoImportData(data: XrpTokyoImportFile): {
  speakers: EventSpeaker[]
  sponsors: EventSponsor[]
} {
  const speakers = (data.speakers ?? [])
    .map(mapXrpSpeakerToEventSpeaker)
    .filter((s): s is EventSpeaker => s !== null)

  const sponsors = (data.sponsors ?? [])
    .map(mapXrpSponsorToEventSponsor)
    .filter((s): s is EventSponsor => s !== null)

  return { speakers, sponsors }
}

export function loadAndMapXrpTokyoImport(filePath?: string) {
  const data = loadXrpTokyoImportFile(filePath)
  return mapXrpTokyoImportData(data)
}
