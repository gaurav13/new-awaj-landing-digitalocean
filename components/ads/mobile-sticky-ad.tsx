"use client"

import { X } from "lucide-react"
import { recordClick } from "@/app/actions/ads"
import { useAdTrigger, type OverlayAd } from "./use-ad-trigger"
import { trackOutboundClick } from "@/lib/analytics"

/**
 * Bottom sticky banner for mobile only (hidden on desktop). The uploaded image
 * spans the full width of the bar with a capped height and is never cropped,
 * matching a standard mobile leaderboard. Falls back to title/button text when
 * no image is provided.
 */
export function MobileStickyAd({ ad }: { ad: OverlayAd }) {
  const { visible, dismiss } = useAdTrigger(ad)
  if (!visible) return null

  const content = ad.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ad.imageUrl || "/placeholder.svg"}
      alt={ad.altText || ad.title || ""}
      className="mx-auto block max-h-16 w-auto max-w-full object-contain"
    />
  ) : (
    <div className="flex items-center justify-center gap-2 px-2 py-2 text-center">
      <span className="text-sm font-semibold text-navy-text">{ad.title || ad.altText || "Sponsored"}</span>
      {ad.buttonText ? (
        <span className="text-xs font-semibold uppercase tracking-wide text-awaj-red">{ad.buttonText}</span>
      ) : null}
    </div>
  )

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-gold/25 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden">
      <div className="relative flex w-full items-center justify-center px-10">
        {ad.showSponsoredLabel ? (
          <span className="absolute left-2 top-1.5 rounded-full bg-navy/70 px-1.5 py-0.5 text-[8px] font-medium uppercase tracking-wide text-white/90">
            Sponsored
          </span>
        ) : null}

        {ad.linkUrl ? (
          <a
            href={ad.linkUrl}
            target="_blank"
            rel="noopener sponsored noreferrer"
            onClick={() => {
              void recordClick(ad.id)
              trackOutboundClick(ad.linkUrl ?? "", ad.title ?? ad.altText ?? "mobile-sticky")
            }}
            className="block w-full py-1.5"
            aria-label={ad.altText || ad.title || "Advertisement"}
          >
            {content}
          </a>
        ) : (
          <div className="w-full py-1.5">{content}</div>
        )}

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close ad"
          className="absolute right-2 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-beige text-navy-text"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
