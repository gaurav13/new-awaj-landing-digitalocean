"use client"

import { X } from "lucide-react"
import { recordClick } from "@/app/actions/ads"
import { useAdTrigger, type OverlayAd } from "./use-ad-trigger"
import { trackOutboundClick } from "@/lib/analytics"

export function PopupAd({ ad }: { ad: OverlayAd }) {
  const { visible, dismiss } = useAdTrigger(ad)
  if (!visible) return null

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={ad.title || "Advertisement"}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={dismiss}
        className="absolute inset-0 bg-navy/60 backdrop-blur-sm"
      />
      <div className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close ad"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy-text shadow-md transition-colors hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        {ad.imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={ad.imageUrl || "/placeholder.svg"} alt={ad.altText || ""} className="max-h-64 w-full object-contain" />
        ) : null}

        <div className="flex flex-col gap-3 p-6 text-center">
          {ad.showSponsoredLabel ? (
            <span className="mx-auto rounded-full bg-beige px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy-text/50">
              Sponsored
            </span>
          ) : null}
          {ad.title ? <h3 className="font-serif text-xl font-bold text-navy-text">{ad.title}</h3> : null}
          {ad.bodyText ? <p className="text-sm leading-relaxed text-navy-text/70">{ad.bodyText}</p> : null}
          {ad.linkUrl ? (
            <a
              href={ad.linkUrl}
              target="_blank"
              rel="noopener sponsored noreferrer"
              onClick={() => {
                void recordClick(ad.id)
                trackOutboundClick(ad.linkUrl ?? "", ad.title ?? ad.altText ?? "popup")
                dismiss()
              }}
              className="mt-1 inline-flex items-center justify-center rounded-full bg-awaj-red px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
            >
              {ad.buttonText || "Learn more"}
            </a>
          ) : null}
        </div>
      </div>
    </div>
  )
}
