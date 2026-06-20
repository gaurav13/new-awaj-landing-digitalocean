"use client"

import Link from "next/link"
import { useRef } from "react"
import { ChevronLeft, ChevronRight, Images } from "lucide-react"
import type { GalleryItem } from "@/lib/db/schema"

export type GalleryPreviewAlbum = {
  id: number
  title: string
  category: string
  coverImageUrl: string | null
  photos: GalleryItem[]
}

export function GalleryPreview({ albums }: { albums: GalleryPreviewAlbum[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  function scrollBy(dir: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" })
  }

  return (
    <div className="relative">
      <div className="mb-5 flex justify-end gap-2">
        <button
          type="button"
          onClick={() => scrollBy(-1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-navy-text transition-colors hover:bg-beige"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollBy(1)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-navy-text transition-colors hover:bg-beige"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <div
        ref={scrollerRef}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 [scrollbar-width:thin]"
      >
        {albums.map((album) => {
          const cover = album.coverImageUrl ?? album.photos[0]?.imageUrl ?? "/placeholder.svg"
          return (
            <Link
              key={album.id}
              href="/gallery"
              className="group relative w-[82%] shrink-0 snap-center overflow-hidden rounded-3xl border border-gold/20 bg-beige sm:w-[46%] lg:w-[31%]"
            >
              <div className="aspect-[4/5] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover || "/placeholder.svg"}
                  alt={album.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="inline-flex items-center rounded-full bg-gold/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-navy">
                  {album.category}
                </span>
                <h3 className="mt-3 text-balance font-serif text-xl font-bold leading-snug text-white">
                  {album.title}
                </h3>
                <p className="mt-2 inline-flex items-center gap-1.5 text-xs font-medium text-white/80">
                  <Images className="h-3.5 w-3.5" />
                  {album.photos.length} photo{album.photos.length === 1 ? "" : "s"}
                </p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
