"use client"

import type { OverlayAd } from "./use-ad-trigger"
import { PopupAd } from "./popup-ad"
import { NewsletterPopup } from "./newsletter-popup"
import { FloatingAd } from "./floating-ad"
import { MobileStickyAd } from "./mobile-sticky-ad"

/**
 * Renders all overlay advertising units for a page. A single "floating" ad also
 * covers the mobile bottom sticky slot unless a dedicated mobile-sticky ad is
 * configured, matching the "right-side on desktop, bottom bar on mobile" spec.
 */
export function AdOverlays({ ads }: { ads: OverlayAd[] }) {
  const popup = ads.find((a) => a.placement === "popup")
  const newsletter = ads.find((a) => a.placement === "newsletter")
  const floating = ads.find((a) => a.placement === "floating")
  const mobileSticky = ads.find((a) => a.placement === "mobile-sticky")

  // Floating doubles as the mobile sticky when no dedicated mobile ad exists.
  const mobileBar = mobileSticky ?? floating

  return (
    <>
      {popup ? <PopupAd ad={popup} /> : null}
      {newsletter ? <NewsletterPopup ad={newsletter} /> : null}
      {floating ? <FloatingAd ad={floating} /> : null}
      {mobileBar ? <MobileStickyAd key={mobileBar.id} ad={mobileBar} /> : null}
    </>
  )
}
