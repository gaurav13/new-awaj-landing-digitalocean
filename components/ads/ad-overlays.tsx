"use client"

import type { OverlayAd } from "./use-ad-trigger"
import { PopupAd } from "./popup-ad"
import { NewsletterPopup } from "./newsletter-popup"
import { StickyHeaderAd } from "./sticky-header-ad"
import { FloatingAd } from "./floating-ad"
import { MobileStickyAd } from "./mobile-sticky-ad"

/**
 * Renders all overlay advertising units for a page. Each placement is fully
 * independent and configured on its own in the Ads Manager:
 *  - sticky-header: pinned to the top on both mobile and desktop
 *  - floating: bottom-right card on desktop only
 *  - floating-mobile: bottom-left card on mobile only
 *  - mobile-sticky: full-width bottom bar on mobile only
 *  - popup / newsletter: modal overlays
 */
export function AdOverlays({ ads }: { ads: OverlayAd[] }) {
  const popup = ads.find((a) => a.placement === "popup")
  const newsletter = ads.find((a) => a.placement === "newsletter")
  const stickyHeader = ads.find((a) => a.placement === "sticky-header")
  const floating = ads.find((a) => a.placement === "floating")
  const floatingMobile = ads.find((a) => a.placement === "floating-mobile")
  const mobileSticky = ads.find((a) => a.placement === "mobile-sticky")

  return (
    <>
      {stickyHeader ? <StickyHeaderAd ad={stickyHeader} /> : null}
      {popup ? <PopupAd ad={popup} /> : null}
      {newsletter ? <NewsletterPopup ad={newsletter} /> : null}
      {floating ? <FloatingAd ad={floating} device="desktop" /> : null}
      {floatingMobile ? <FloatingAd ad={floatingMobile} device="mobile" /> : null}
      {mobileSticky ? <MobileStickyAd ad={mobileSticky} /> : null}
    </>
  )
}
