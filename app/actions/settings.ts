"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { siteSettings } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"

export type SiteSettings = {
  headerLogoUrl: string
  footerLogoUrl: string
  heroBannerUrl: string
  // SEO
  siteTitle: string
  siteDescription: string
  siteKeywords: string
  ogTitle: string
  ogDescription: string
  ogImageUrl: string
  faviconUrl: string
  twitterHandle: string
  canonicalBaseUrl: string
}

const DEFAULTS: SiteSettings = {
  headerLogoUrl: "",
  footerLogoUrl: "",
  heroBannerUrl: "/images/hero-tokyo.png",
  siteTitle: "Asia Web3 & AI Alliance Japan (AWAJ)",
  siteDescription:
    "Asia Web3 & AI Alliance Japan (AWAJ) connects startups, investors, and institutions across Asia and Japan's Web3 & AI ecosystem.",
  siteKeywords: "Web3, AI, Japan, Asia, blockchain, startups, alliance, AWAJ",
  ogTitle: "",
  ogDescription: "",
  ogImageUrl: "",
  faviconUrl: "",
  twitterHandle: "",
  canonicalBaseUrl: "",
}

// ---- Public read ----

export async function getSiteSettings(): Promise<SiteSettings> {
  return withDb(async () => {
    const rows = await db.select().from(siteSettings)
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value ?? ""]))
    return {
      headerLogoUrl: map.headerLogoUrl || DEFAULTS.headerLogoUrl,
      footerLogoUrl: map.footerLogoUrl || DEFAULTS.footerLogoUrl,
      heroBannerUrl: map.heroBannerUrl || DEFAULTS.heroBannerUrl,
      siteTitle: map.siteTitle || DEFAULTS.siteTitle,
      siteDescription: map.siteDescription || DEFAULTS.siteDescription,
      siteKeywords: map.siteKeywords || DEFAULTS.siteKeywords,
      ogTitle: map.ogTitle || DEFAULTS.ogTitle,
      ogDescription: map.ogDescription || DEFAULTS.ogDescription,
      ogImageUrl: map.ogImageUrl || DEFAULTS.ogImageUrl,
      faviconUrl: map.faviconUrl || DEFAULTS.faviconUrl,
      twitterHandle: map.twitterHandle || DEFAULTS.twitterHandle,
      canonicalBaseUrl: map.canonicalBaseUrl || DEFAULTS.canonicalBaseUrl,
    }
  }, DEFAULTS)
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
