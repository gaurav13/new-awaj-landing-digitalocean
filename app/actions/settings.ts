"use server"

import { db } from "@/lib/db"
import { siteSettings } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"

export type SiteSettings = {
  headerLogoUrl: string
  footerLogoUrl: string
  heroBannerUrl: string
}

const DEFAULTS: SiteSettings = {
  headerLogoUrl: "",
  footerLogoUrl: "",
  heroBannerUrl: "/images/hero-tokyo.png",
}

// ---- Public read ----

export async function getSiteSettings(): Promise<SiteSettings> {
  const rows = await db.select().from(siteSettings)
  const map = Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]))
  return {
    headerLogoUrl: map.headerLogoUrl || DEFAULTS.headerLogoUrl,
    footerLogoUrl: map.footerLogoUrl || DEFAULTS.footerLogoUrl,
    heroBannerUrl: map.heroBannerUrl || DEFAULTS.heroBannerUrl,
  }
}

// ---- Admin write ----

export async function updateSiteSettings(input: Partial<SiteSettings>) {
  await getUserId()
  const entries = Object.entries(input)
  for (const [key, value] of entries) {
    await db
      .insert(siteSettings)
      .values({ key, value: value ?? "" })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value: value ?? "", updatedAt: new Date() } })
  }
  revalidatePath("/", "layout")
}
