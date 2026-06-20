"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { siteSettings } from "@/lib/db/schema"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"
import { toStoredImagePath } from "@/lib/images"

const IMAGE_SETTING_KEYS = new Set([
  "headerLogoUrl",
  "footerLogoUrl",
  "heroBannerUrl",
  "ogImageUrl",
  "faviconUrl",
  "membershipHeroUrl",
  "presidentPhotoUrl",
  "presidentBgUrl",
])

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
  // Membership page header
  membershipEyebrow: string
  membershipTitle: string
  membershipSubtitle: string
  membershipHeroUrl: string
  // Leadership / President hero (homepage)
  presidentEyebrow: string
  presidentName: string
  presidentTitle: string
  presidentBio: string
  presidentPhotoUrl: string
  presidentBgUrl: string
  presidentCtaLabel: string
  presidentCtaUrl: string
  leadershipStats: string // JSON: { value: string; label: string; icon: string }[]
  leadershipSectionTitle: string
  leadershipViewAllLabel: string
  leadershipViewAllUrl: string
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
  membershipEyebrow: "One Year Membership",
  membershipTitle: "Membership Packages",
  membershipSubtitle:
    "Join Asia Web3 Alliance Japan and become part of a trusted network driving innovation, collaboration, and growth across the Web3 ecosystem.",
  membershipHeroUrl: "/images/membership-hero.png",
  presidentEyebrow: "Led by builders who understand expansion",
  presidentName: "Hinza Asif",
  presidentTitle: "Asia Web3 Alliance Japan",
  presidentBio:
    "AWAJ was created to help startups navigate Japan's ecosystem and build meaningful relationships across government, investors, corporations, universities, and international markets.",
  presidentPhotoUrl: "/images/president-hinza.png",
  presidentBgUrl: "/images/leadership-map-bg.png",
  presidentCtaLabel: "Meet Leadership Team",
  presidentCtaUrl: "/team",
  leadershipStats: JSON.stringify([
    { value: "500+", label: "Ecosystem Partners", icon: "Users" },
    { value: "120+", label: "Corporate Members", icon: "Building2" },
    { value: "200+", label: "Web3 Startups Supported", icon: "Rocket" },
    { value: "25+", label: "Countries Connected", icon: "Globe" },
    { value: "40+", label: "Events & Programs", icon: "Calendar" },
  ]),
  leadershipSectionTitle: "Ecosystem Leaders Connected with AWAJ",
  leadershipViewAllLabel: "View All Leaders",
  leadershipViewAllUrl: "/team",
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
      membershipEyebrow: map.membershipEyebrow || DEFAULTS.membershipEyebrow,
      membershipTitle: map.membershipTitle || DEFAULTS.membershipTitle,
      membershipSubtitle: map.membershipSubtitle || DEFAULTS.membershipSubtitle,
      membershipHeroUrl: map.membershipHeroUrl || DEFAULTS.membershipHeroUrl,
      presidentEyebrow: map.presidentEyebrow || DEFAULTS.presidentEyebrow,
      presidentName: map.presidentName || DEFAULTS.presidentName,
      presidentTitle: map.presidentTitle || DEFAULTS.presidentTitle,
      presidentBio: map.presidentBio || DEFAULTS.presidentBio,
      presidentPhotoUrl: map.presidentPhotoUrl || DEFAULTS.presidentPhotoUrl,
      presidentBgUrl: map.presidentBgUrl || DEFAULTS.presidentBgUrl,
      presidentCtaLabel: map.presidentCtaLabel || DEFAULTS.presidentCtaLabel,
      presidentCtaUrl: map.presidentCtaUrl || DEFAULTS.presidentCtaUrl,
      leadershipStats: map.leadershipStats || DEFAULTS.leadershipStats,
      leadershipSectionTitle: map.leadershipSectionTitle || DEFAULTS.leadershipSectionTitle,
      leadershipViewAllLabel: map.leadershipViewAllLabel || DEFAULTS.leadershipViewAllLabel,
      leadershipViewAllUrl: map.leadershipViewAllUrl || DEFAULTS.leadershipViewAllUrl,
    }
  }, DEFAULTS)
}

// ---- Admin write ----

export async function updateSiteSettings(input: Partial<SiteSettings>) {
  await getUserId()
  const entries = Object.entries(input)
  for (const [key, value] of entries) {
    const stored =
      IMAGE_SETTING_KEYS.has(key) && typeof value === "string" ? toStoredImagePath(value) : (value ?? "")
    await db
      .insert(siteSettings)
      .values({ key, value: stored })
      .onConflictDoUpdate({ target: siteSettings.key, set: { value: stored, updatedAt: new Date() } })
  }
  revalidatePath("/", "layout")
}
