"use client"

import { useEffect, useRef } from "react"
import type { PublicAd } from "@/lib/ads-data"
import { recordImpression, recordClick } from "@/app/actions/ads"

type Variant = "banner" | "sidebar" | "in-content"

/**
 * A single in-flow advertisement. Records one impression when it first scrolls
 * into view and a click when the user activates it. Renders nothing visually
 * intrusive — a clean bordered image card with a small "Sponsored" label.
 */
export function AdBanner({ ad, variant = "banner" }: { ad: PublicAd; variant?: Variant }) {
  const ref = useRef<HTMLDivElement>(null)
  const seen = useRef(false)

  useEffect(() => {
    if (!ref.current || seen.current) return
    const el = ref.current
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && !seen.current) {
            seen.current = true
            void recordImpression(ad.id)
            observer.disconnect()
          }
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [ad.id])

  if (!ad.imageUrl) return null

  const hasLink = !!ad.linkUrl
  const aspect =
    variant === "sidebar" ? "aspect-[4/5]" : variant === "in-content" ? "aspect-[16/9]" : "aspect-[1200/200]"

  const inner = (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={ad.imageUrl || "/placeholder.svg"}
      alt={ad.altText || ad.campaignName}
      className="h-full w-full object-contain"
      loading="lazy"
    />
  )

  return (
    <div
      ref={ref}
      className="group relative w-full overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm"
    >
      {ad.showSponsoredLabel ? (
        <span className="absolute right-2 top-2 z-10 rounded-full bg-navy/70 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white/90">
          Sponsored
        </span>
      ) : null}
      <div className={`relative w-full ${aspect} bg-beige/40`}>
        {hasLink ? (
          <a
            href={ad.linkUrl!}
            target="_blank"
            rel="noopener sponsored noreferrer"
            onClick={() => void recordClick(ad.id)}
            aria-label={ad.altText || ad.campaignName}
            className="block h-full w-full"
          >
            {inner}
          </a>
        ) : (
          inner
        )}
      </div>
    </div>
  )
}
