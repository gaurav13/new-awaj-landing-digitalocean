"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { siteSettings } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"
import {
  MEMBERSHIP_CONTENT_KEYS as KEYS,
  DEFAULT_COMPARISON,
  DEFAULT_INFO_BLOCKS,
  DEFAULT_CTA,
  type MembershipContent,
  type ComparisonRow,
  type MembershipInfoBlock,
  type MembershipCta,
} from "@/lib/membership-content"

function parseJson<T>(raw: string | undefined, fallback: T): T {
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw)
    return parsed ?? fallback
  } catch {
    return fallback
  }
}

export async function getMembershipContent(): Promise<MembershipContent> {
  const fallback: MembershipContent = {
    comparison: DEFAULT_COMPARISON,
    infoBlocks: DEFAULT_INFO_BLOCKS,
    cta: DEFAULT_CTA,
  }
  return withDb(async () => {
    const rows = await db.select().from(siteSettings)
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]))
    const comparison = parseJson<ComparisonRow[]>(map[KEYS.comparison], DEFAULT_COMPARISON)
    const infoBlocks = parseJson<MembershipInfoBlock[]>(map[KEYS.infoBlocks], DEFAULT_INFO_BLOCKS)
    const cta = parseJson<MembershipCta>(map[KEYS.cta], DEFAULT_CTA)
    return {
      comparison: Array.isArray(comparison) && comparison.length > 0 ? comparison : DEFAULT_COMPARISON,
      infoBlocks: Array.isArray(infoBlocks) && infoBlocks.length > 0 ? infoBlocks : DEFAULT_INFO_BLOCKS,
      cta: { ...DEFAULT_CTA, ...(cta || {}) },
    }
  }, fallback)
}

export async function updateMembershipContent(input: MembershipContent) {
  await getUserId()
  const payload: Record<string, string> = {
    [KEYS.comparison]: JSON.stringify(input.comparison ?? []),
    [KEYS.infoBlocks]: JSON.stringify(input.infoBlocks ?? []),
    [KEYS.cta]: JSON.stringify(input.cta ?? DEFAULT_CTA),
  }
  for (const [key, value] of Object.entries(payload)) {
    await db
      .insert(siteSettings)
      .values({ key, value })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value, updatedAt: new Date() } })
  }
  revalidatePath("/membership")
  revalidatePath("/", "layout")
}
