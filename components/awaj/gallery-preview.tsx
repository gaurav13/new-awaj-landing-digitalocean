"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ArrowLeft, Images } from "lucide-react"
import type { GalleryItem } from "@/lib/db/schema"

export type GalleryPreviewAlbum = {
  id: number
  title: string
  category: string
  coverImageUrl: string | null
  photos: GalleryItem[]
  eventDate: string | null
  location: string | null
}

type Slide = {
  key: string
  src: string
  title: string
  count: number
}

export function GalleryPreview({ albums }: { albums: GalleryPreviewAlbum[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(false)

  // One slide per activity (album), using its cover image. The slider scrolls
  // through every featured activity, supporting well over 10 entries.
  const slides: Slide[] = []
  for (const album of albums) {
    const src = album.coverImageUrl || (album.photos[0] as { imageUrl?: string } | undefined)?.imageUrl
    if (src) slides.push({ key: `${album.id}`, src, title: album.title, count: album.photos.length })
  }

  const updateArrows = () => {
    const track = trackRef.current
    if (!track) return
    setCanPrev(track.scrollLeft > 8)
    setCanNext(track.scrollLeft + track.clientWidth < track.scrollWidth - 8)
  }

  useEffect(() => {
    updateArrows()
    const track = trackRef.current
    if (!track) return
    track.addEventListener("scroll", updateArrows, { passive: true })
    window.addEventListener("resize", updateArrows)
    return () => {
      track.removeEventListener("scroll", updateArrows)
      window.removeEventListener("resize", updateArrows)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slides.length])

  const scrollByDir = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: track.clientWidth * 0.85 * dir, behavior: "smooth" })
  }

  if (slides.length === 0) return null

  return (
    <div>
      {/* Header row */}
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-navy-text md:text-base">Gallery</h2>
        <Link
          href="/gallery"
          className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-navy"
        >
          View All Gallery
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      {/* Slider */}
      <div className="relative">
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {slides.map((slide) => (
            <Link
              key={slide.key}
              href="/gallery"
              className="group relative aspect-[5/3] w-[44%] shrink-0 snap-start overflow-hidden rounded-xl ring-1 ring-navy/10 sm:w-[31%] md:w-[23%] lg:w-[18.4%]"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={slide.src || "/placeholder.svg"}
                alt={slide.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/70 via-navy/10 to-transparent" />
              {slide.count > 0 ? (
                <span className="pointer-events-none absolute right-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold text-navy shadow-sm">
                  <Images className="h-3 w-3" />
                  {slide.count}
                </span>
              ) : null}
              <span className="pointer-events-none absolute inset-x-2 bottom-2 line-clamp-2 text-xs font-semibold leading-snug text-white">
                {slide.title}
              </span>
            </Link>
          ))}
        </div>

        {/* Prev arrow */}
        {canPrev ? (
          <button
            type="button"
            onClick={() => scrollByDir(-1)}
            aria-label="Previous images"
            className="absolute -left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-navy/10 bg-white text-navy-text shadow-md transition-colors hover:border-gold hover:text-gold lg:-left-5"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
        ) : null}

        {/* Next arrow */}
        {canNext ? (
          <button
            type="button"
            onClick={() => scrollByDir(1)}
            aria-label="Next images"
            className="absolute -right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-navy/10 bg-white text-navy-text shadow-md transition-colors hover:border-gold hover:text-gold lg:-right-5"
          >
            <ArrowRight className="h-5 w-5" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
