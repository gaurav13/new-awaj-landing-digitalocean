/**
 * Lightweight client-side analytics helpers for Google Analytics 4 (gtag.js).
 *
 * GA4 is loaded globally by <GoogleAnalytics /> only when a Measurement ID is
 * configured in the admin SEO settings. These helpers no-op safely when gtag is
 * unavailable (no ID set, SSR, ad blockers), so call sites never need guards.
 */

type GtagParams = Record<string, unknown>

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    dataLayer?: unknown[]
  }
}

/** True when gtag is available in the current browser session. */
function hasGtag(): boolean {
  return typeof window !== "undefined" && typeof window.gtag === "function"
}

/** Fire a custom GA4 event. Safe to call anywhere; no-ops without gtag. */
export function trackEvent(name: string, params: GtagParams = {}): void {
  if (!hasGtag()) return
  window.gtag!("event", name, params)
}

// --- Named helpers for the key conversions across the site ---

/** Contact form successfully submitted. */
export function trackContactSubmit(inquiryType?: string): void {
  trackEvent("contact_submit", {
    event_category: "engagement",
    ...(inquiryType ? { inquiry_type: inquiryType } : {}),
  })
}

/** Newsletter / subscribe form successfully submitted. */
export function trackNewsletterSignup(source = "site"): void {
  trackEvent("newsletter_signup", { event_category: "engagement", source })
}

/** A click on an outbound (external) link. */
export function trackOutboundClick(url: string, label?: string): void {
  trackEvent("outbound_click", {
    event_category: "outbound",
    link_url: url,
    ...(label ? { link_label: label } : {}),
  })
}

/** A click on a primary call-to-action button. */
export function trackCtaClick(label: string, location?: string): void {
  trackEvent("cta_click", {
    event_category: "engagement",
    cta_label: label,
    ...(location ? { cta_location: location } : {}),
  })
}
