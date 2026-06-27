import type { AdPageTarget } from "@/lib/db/schema"
import { getOverlayAds } from "@/lib/ads-data"
import { AdOverlays } from "./ad-overlays"
import type { OverlayAd } from "./use-ad-trigger"

/**
 * Server component that loads the active overlay ads (popup, newsletter,
 * floating, mobile sticky) for a page and hands them to the client renderer.
 * Drop once per page — it renders nothing if there are no active overlays.
 */
export async function PageAds({ page }: { page: AdPageTarget }) {
  const ads = await getOverlayAds(page)
  if (ads.length === 0) return null

  const overlays: OverlayAd[] = ads.map((a) => ({
    id: a.id,
    placement: a.placement,
    imageUrl: a.imageUrl,
    linkUrl: a.linkUrl,
    altText: a.altText,
    title: a.title,
    bodyText: a.bodyText,
    buttonText: a.buttonText,
    trigger: a.trigger,
    frequency: a.frequency,
    showSponsoredLabel: a.showSponsoredLabel,
  }))

  return <AdOverlays ads={overlays} />
}
