import "server-only"
import { cache } from "react"
import { and, asc, desc, eq, isNull, lte, gte, or } from "drizzle-orm"
import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { ads, type Ad, type AdPageTarget, type AdPlacement } from "@/lib/db/schema"
import { resolveImageUrl } from "@/lib/images"

export type PublicAd = Omit<Ad, "imageUrl"> & { imageUrl: string }

function resolveAd(row: Ad): PublicAd {
  return { ...row, imageUrl: row.imageUrl ? resolveImageUrl(row.imageUrl) : "" }
}

/**
 * All currently-live ads for a given page, de-duped across the render pass via
 * React cache(). "Live" means status=active, the page matches (or target=all),
 * and the current time is inside any configured start/end window.
 */
export const getLiveAdsForPage = cache(async (page: AdPageTarget): Promise<PublicAd[]> => {
  const now = new Date()
  return withDb(
    () =>
      db
        .select()
        .from(ads)
        .where(
          and(
            eq(ads.status, "active"),
            page === "all" ? undefined : or(eq(ads.pageTarget, page), eq(ads.pageTarget, "all")),
            or(isNull(ads.startDate), lte(ads.startDate, now)),
            or(isNull(ads.endDate), gte(ads.endDate, now)),
          ),
        )
        .orderBy(asc(ads.sortOrder), desc(ads.createdAt))
        .then((rows) => rows.map(resolveAd)),
    [],
  )
})

/** First live ad for a specific in-flow placement on a page (or null to hide the slot). */
export async function getAdForSlot(page: AdPageTarget, placement: AdPlacement): Promise<PublicAd | null> {
  const all = await getLiveAdsForPage(page)
  return all.find((a) => a.placement === placement) ?? null
}

/** Live overlay ads (popup, floating, mobile-sticky, newsletter) for a page. */
export async function getOverlayAds(page: AdPageTarget): Promise<PublicAd[]> {
  const overlay = new Set<AdPlacement>(["popup", "floating", "mobile-sticky", "newsletter"])
  const all = await getLiveAdsForPage(page)
  // Only one of each overlay placement (first by sort order) to avoid stacking.
  const seen = new Set<string>()
  const result: PublicAd[] = []
  for (const a of all) {
    if (!overlay.has(a.placement as AdPlacement)) continue
    if (seen.has(a.placement)) continue
    seen.add(a.placement)
    result.push(a)
  }
  return result
}
