"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { MediaCard } from "./media-card"

type MediaItem = {
  id: number
  title: string
  type: string
  url: string | null
  thumbnailUrl: string | null
  source: string | null
  excerpt: string | null
}

export function MediaCarousel({ items }: { items: MediaItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const amount = Math.min(track.clientWidth * 0.9, 640)
    track.scrollBy({ left: dir * amount, behavior: "smooth" })
  }

  // With few items a plain grid reads better than a carousel.
  if (items.length <= 3) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((m) => (
          <MediaCard key={m.id} item={m} />
        ))}
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        ref={trackRef}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {items.map((m) => (
          <div
            key={m.id}
            className="w-[78%] shrink-0 snap-start sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
          >
            <MediaCard item={m} />
          </div>
        ))}
      </div>

      <div className="mt-6 flex justify-center gap-3">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          aria-label="Scroll to previous coverage"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-white text-navy transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          aria-label="Scroll to next coverage"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 bg-white text-navy transition-colors hover:border-gold hover:text-gold"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
