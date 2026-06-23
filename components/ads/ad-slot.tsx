import type { AdPageTarget, AdPlacement } from "@/lib/db/schema"
import { getAdForSlot } from "@/lib/ads-data"
import { AdBanner } from "./ad-banner"

/**
 * Server component that fetches the active ad for an in-flow placement and
 * renders it. If no active ad exists for the slot, it renders nothing so the
 * space collapses completely. Safe to drop into any page.
 */
export async function AdSlot({
  page,
  placement,
  className = "",
}: {
  page: AdPageTarget
  placement: Extract<AdPlacement, "top" | "mid" | "sidebar" | "bottom" | "in-content">
  className?: string
}) {
  const ad = await getAdForSlot(page, placement)
  if (!ad) return null

  const variant = placement === "sidebar" ? "sidebar" : placement === "in-content" ? "in-content" : "banner"
  const wrapMax = variant === "banner" ? "mx-auto w-full max-w-[1280px]" : "w-full"

  return (
    <div className={`${wrapMax} ${className}`}>
      <AdBanner ad={ad} variant={variant} />
    </div>
  )
}
