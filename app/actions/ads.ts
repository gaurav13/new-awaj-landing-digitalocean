"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { ads, newsletterSubscribers } from "@/lib/db/schema"
import { asc, desc, eq, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"
import { toStoredImagePath } from "@/lib/images"
import type { AdInput, AdminAd, NewsletterResult } from "@/lib/ad-types"

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ---- Admin reads ----

export async function getMyAds(): Promise<AdminAd[]> {
  await getUserId()
  const rows = await db.select().from(ads).orderBy(asc(ads.sortOrder), desc(ads.createdAt))
  const now = Date.now()
  return rows.map((r) => {
    const isScheduled = !!r.startDate && r.startDate.getTime() > now
    const isExpired = !!r.endDate && r.endDate.getTime() < now
    return {
      ...r,
      ctr: r.impressions > 0 ? Math.round((r.clicks / r.impressions) * 1000) / 10 : 0,
      isScheduled,
      isExpired,
      isLive: r.status === "active" && !isScheduled && !isExpired,
    }
  })
}

function toValues(input: AdInput) {
  return {
    campaignName: input.campaignName,
    imageUrl: input.imageUrl ? toStoredImagePath(input.imageUrl) : null,
    linkUrl: input.linkUrl || null,
    altText: input.altText || null,
    title: input.title || null,
    bodyText: input.bodyText || null,
    buttonText: input.buttonText || null,
    pageTarget: input.pageTarget || "all",
    placement: input.placement || "top",
    trigger: input.trigger || "delay",
    frequency: input.frequency || "session",
    status: input.status || "active",
    showSponsoredLabel: input.showSponsoredLabel ?? true,
    startDate: input.startDate ? new Date(input.startDate) : null,
    endDate: input.endDate ? new Date(input.endDate) : null,
    sortOrder: input.sortOrder ?? 0,
    updatedAt: new Date(),
  }
}

export async function createAd(input: AdInput) {
  const userId = await getUserId()
  await db.insert(ads).values({ ...toValues(input), authorId: userId })
  revalidatePath("/", "layout")
}

export async function updateAd(id: number, input: AdInput) {
  await getUserId()
  await db.update(ads).set(toValues(input)).where(eq(ads.id, id))
  revalidatePath("/", "layout")
}

export async function setAdStatus(id: number, status: "active" | "hidden") {
  await getUserId()
  await db.update(ads).set({ status, updatedAt: new Date() }).where(eq(ads.id, id))
  revalidatePath("/", "layout")
}

export async function deleteAd(id: number) {
  await getUserId()
  await db.delete(ads).where(eq(ads.id, id))
  revalidatePath("/", "layout")
}

// ---- Public tracking (no auth; fire-and-forget counters) ----

export async function recordImpression(id: number) {
  try {
    await db.update(ads).set({ impressions: sql`${ads.impressions} + 1` }).where(eq(ads.id, id))
  } catch (error) {
    console.error("[ads] recordImpression failed:", error)
  }
}

export async function recordClick(id: number) {
  try {
    await db.update(ads).set({ clicks: sql`${ads.clicks} + 1` }).where(eq(ads.id, id))
  } catch (error) {
    console.error("[ads] recordClick failed:", error)
  }
}

// ---- Newsletter ----

export async function subscribeNewsletter(input: {
  name?: string
  email: string
  consent: boolean
}): Promise<NewsletterResult> {
  const email = input.email?.trim().toLowerCase()
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email address." }
  if (!input.consent) return { ok: false, error: "Please agree to the privacy policy to subscribe." }

  return withDb<NewsletterResult>(async () => {
    const existing = await db
      .select({ id: newsletterSubscribers.id })
      .from(newsletterSubscribers)
      .where(eq(newsletterSubscribers.email, email))
      .limit(1)
    if (existing.length > 0) return { ok: true, duplicate: true }

    await db.insert(newsletterSubscribers).values({
      name: input.name?.trim() || null,
      email,
      consent: true,
      source: "newsletter-popup",
    })
    return { ok: true, duplicate: false }
  }, { ok: false, error: "Subscription is temporarily unavailable. Please try again later." })
}

export async function getSubscribers() {
  await getUserId()
  return db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt))
}

export async function deleteSubscriber(id: number) {
  await getUserId()
  await db.delete(newsletterSubscribers).where(eq(newsletterSubscribers.id, id))
  revalidatePath("/admin")
}

export async function exportSubscribersCsv(): Promise<string> {
  await getUserId()
  const rows = await db.select().from(newsletterSubscribers).orderBy(desc(newsletterSubscribers.createdAt))
  const header = ["Name", "Email", "Consent", "Source", "Subscribed At"]
  const escape = (v: string) => `"${v.replace(/"/g, '""')}"`
  const lines = rows.map((r) =>
    [
      r.name ?? "",
      r.email,
      r.consent ? "yes" : "no",
      r.source ?? "",
      r.createdAt.toISOString(),
    ]
      .map((v) => escape(String(v)))
      .join(","),
  )
  return [header.map(escape).join(","), ...lines].join("\n")
}
