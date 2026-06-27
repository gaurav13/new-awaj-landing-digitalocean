"use client"

import { X } from "lucide-react"
import { recordClick } from "@/app/actions/ads"
import { useAdTrigger, type OverlayAd } from "./use-ad-trigger"

/** Bottom sticky banner for mobile only. Hidden on desktop. */
export function MobileStickyAd({ ad }: { ad: OverlayAd }) {
  const { visible, dismiss } = useAdTrigger(ad)
  if (!visible) return null

  const content = (
    <div className="flex items-center gap-3">
      {ad.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ad.imageUrl || "/placeholder.svg"} alt={ad.altText || ""} className="h-12 w-12 shrink-0 rounded-lg object-contain" />
      ) : null}
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-navy-text">{ad.title || ad.altText || "Sponsored"}</p>
        {ad.buttonText ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-awaj-red">{ad.buttonText}</span>
        ) : null}
      </div>
    </div>
  )

  return (
    <div className="fixed inset-x-0 bottom-0 z-[80] border-t border-gold/25 bg-white p-3 shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden">
      <div className="flex items-center gap-2">
        <div className="min-w-0 flex-1">
          {ad.linkUrl ? (
            <a
              href={ad.linkUrl}
              target="_blank"
              rel="noopener sponsored noreferrer"
              onClick={() => void recordClick(ad.id)}
              className="block"
            >
              {content}
            </a>
          ) : (
            content
          )}
        </div>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close ad"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-beige text-navy-text"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
