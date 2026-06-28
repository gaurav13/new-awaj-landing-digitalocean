"use client"

import { useEffect, useRef } from "react"
import { X } from "lucide-react"
import { recordClick } from "@/app/actions/ads"
import { useAdTrigger, type OverlayAd } from "./use-ad-trigger"

/**
 * Slim full-width banner pinned to the very top of the page on BOTH mobile and
 * desktop. The uploaded image spans the full width with a capped height and is
 * never cropped. Dismissible, with optional title/button text shown when there
 * is no image.
 *
 * While visible it publishes its rendered height to the `--sticky-ad-height`
 * CSS variable on <html>, which globally pushes the page (and the sticky site
 * header) down so the banner never covers the navigation or hero. The variable
 * is reset to 0 when the ad is dismissed or unmounts.
 */
export function StickyHeaderAd({ ad }: { ad: OverlayAd }) {
  const { visible, dismiss } = useAdTrigger(ad)
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const root = document.documentElement
    if (!visible) {
      root.style.setProperty("--sticky-ad-height", "0px")
      return
    }
    const el = barRef.current
    if (!el) return

    const apply = () => root.style.setProperty("--sticky-ad-height", `${el.offsetHeight}px`)
    apply()

    const observer = new ResizeObserver(apply)
    observer.observe(el)
    window.addEventListener("resize", apply)

    return () => {
      observer.disconnect()
      window.removeEventListener("resize", apply)
      root.style.setProperty("--sticky-ad-height", "0px")
    }
  }, [visible])

  if (!visible) return null

  const inner = ad.imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ad.imageUrl || "/placeholder.svg"}
      alt={ad.altText || ad.title || ""}
      className="mx-auto block max-h-14 w-auto max-w-full object-contain md:max-h-20"
    />
  ) : (
    <div className="flex items-center justify-center gap-2 px-4 py-2 text-center">
      <span className="text-sm font-semibold text-navy-text">{ad.title || ad.altText || "Sponsored"}</span>
      {ad.buttonText ? (
        <span className="text-xs font-semibold uppercase tracking-wide text-awaj-red">{ad.buttonText}</span>
      ) : null}
    </div>
  )

  return (
    <div
      ref={barRef}
      className="fixed inset-x-0 top-0 z-[90] w-full border-b border-gold/25 bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)]"
    >
      <div className="relative flex w-full items-center justify-center">
        {ad.showSponsoredLabel ? (
          <span className="absolute left-2 top-1/2 hidden -translate-y-1/2 rounded-full bg-navy/70 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wide text-white/90 sm:block">
            Sponsored
          </span>
        ) : null}

        {ad.linkUrl ? (
          <a
            href={ad.linkUrl}
            target="_blank"
            rel="noopener sponsored noreferrer"
            onClick={() => void recordClick(ad.id)}
            className="block w-full"
            aria-label={ad.altText || ad.title || "Advertisement"}
          >
            {inner}
          </a>
        ) : (
          inner
        )}

        <button
          type="button"
          onClick={dismiss}
          aria-label="Close ad"
          className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-beige text-navy-text transition-colors hover:bg-gold/30"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
