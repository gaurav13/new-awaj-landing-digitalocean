"use client"

import { X } from "lucide-react"
import { recordClick } from "@/app/actions/ads"
import { useAdTrigger, type OverlayAd } from "./use-ad-trigger"

/**
 * Small floating card ad. Controlled per device:
 *  - "desktop": bottom-right corner, visible on md+ only.
 *  - "mobile": bottom-left corner, visible below md only (sits above the mobile
 *    sticky bar if one is also active).
 */
export function FloatingAd({ ad, device = "desktop" }: { ad: OverlayAd; device?: "desktop" | "mobile" }) {
  const { visible, dismiss } = useAdTrigger(ad)
  if (!visible) return null

  const positionClass =
    device === "mobile"
      ? "bottom-24 left-4 z-[80] block w-44 md:hidden"
      : "bottom-6 right-6 z-[80] hidden w-60 md:block"

  const body = (
    <>
      {ad.imageUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={ad.imageUrl || "/placeholder.svg"} alt={ad.altText || ""} className="h-32 w-full object-contain" />
      ) : null}
      {ad.title ? (
        <div className="px-3 py-2.5">
          <p className="text-sm font-semibold leading-snug text-navy-text">{ad.title}</p>
          {ad.buttonText ? (
            <span className="mt-1 inline-block text-xs font-semibold uppercase tracking-wide text-awaj-red">
              {ad.buttonText}
            </span>
          ) : null}
        </div>
      ) : null}
    </>
  )

  return (
    <div className={`fixed ${positionClass}`}>
      <div className="relative overflow-hidden rounded-2xl border border-gold/25 bg-white shadow-xl">
        {ad.showSponsoredLabel ? (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-navy/70 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white/90">
            Sponsored
          </span>
        ) : null}
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close ad"
          className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-white/90 text-navy-text shadow transition-colors hover:bg-white"
        >
          <X className="h-3.5 w-3.5" />
        </button>
        {ad.linkUrl ? (
          <a
            href={ad.linkUrl}
            target="_blank"
            rel="noopener sponsored noreferrer"
            onClick={() => void recordClick(ad.id)}
            className="block"
          >
            {body}
          </a>
        ) : (
          body
        )}
      </div>
    </div>
  )
}
