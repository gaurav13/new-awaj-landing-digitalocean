"use client"

import { useRef } from "react"
import Link from "next/link"
import { Images, ArrowRight, ArrowLeft, MapPin } from "lucide-react"
import type { GalleryItem } from "@/lib/db/schema"
import { formatLongDate } from "@/lib/format-date"

export type GalleryPreviewAlbum = {
  id: number
  title: string
  category: string
  coverImageUrl: string | null
  photos: GalleryItem[]
  eventDate: string | null
  location: string | null
}

function metaLine(album: GalleryPreviewAlbum) {
  return [album.eventDate ? formatLongDate(album.eventDate) : null, album.location]
    .filter(Boolean)
    .join("  •  ")
}

export function GalleryPreview({ albums }: { albums: GalleryPreviewAlbum[] }) {
  const trackRef = useRef<HTMLDivElement>(null)

  const featured = albums[0]
  const highlights = albums.slice(1)

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    track.scrollBy({ left: track.clientWidth * 0.8 * dir, behavior: "smooth" })
  }

  const featuredCover = featured.coverImageUrl ?? featured.photos[0]?.imageUrl ?? "/placeholder.svg"

  return (
    <div className="flex flex-col gap-6">
      {/* Featured hero: intro column + large featured album */}
      <div className="grid items-stretch gap-6 lg:grid-cols-[0.85fr_1.4fr]">
        <div className="flex flex-col justify-center py-2">
          <h2 className="font-serif text-4xl font-bold tracking-tight text-navy-text md:text-5xl">Media Gallery</h2>
          <p className="mt-4 max-w-sm text-pretty leading-relaxed text-navy-text/60">
            Explore moments from our events, conferences, partnerships and more.
          </p>
          <Link
            href="/gallery"
            className="group mt-7 inline-flex w-fit items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View all photos
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <Link
          href="/gallery"
          className="group relative block aspect-[16/10] overflow-hidden rounded-2xl ring-1 ring-gold/15 sm:aspect-[16/9] lg:aspect-auto"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={featuredCover || "/placeholder.svg"}
            alt={featured.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/25 to-transparent" />

          <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-navy shadow-sm">
            <Images className="h-3.5 w-3.5" />
            {featured.photos.length}
          </span>

          <div className="absolute inset-x-0 bottom-0 p-5 lg:p-6">
            <div className="flex items-start gap-2.5">
              <Images className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
              <h3 className="text-balance font-serif text-xl font-bold leading-snug text-white lg:text-2xl">
                {featured.title}
              </h3>
            </div>
            {metaLine(featured) ? (
              <p className="mt-2 pl-7 text-sm text-white/75">{metaLine(featured)}</p>
            ) : null}
          </div>
        </Link>
      </div>

      {/* Highlights card with horizontal slider */}
      {highlights.length > 0 ? (
        <div className="rounded-2xl bg-white p-5 ring-1 ring-navy/5 lg:p-7">
          <div className="mb-5 flex items-center justify-between gap-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-navy-text">Highlights</h3>
            <div className="flex items-center gap-3">
              <Link
                href="/gallery"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-navy"
              >
                View all
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
          </div>

          <div className="relative">
            <div
              ref={trackRef}
              className="-mx-1 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-1 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              {highlights.map((album) => {
                const cover = album.coverImageUrl ?? album.photos[0]?.imageUrl ?? "/placeholder.svg"
                return (
                  <Link
                    key={album.id}
                    href="/gallery"
                    className="group w-[240px] shrink-0 snap-start sm:w-[260px]"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-xl ring-1 ring-navy/5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={cover || "/placeholder.svg"}
                        alt={album.title}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                        loading="lazy"
                      />
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 text-[11px] font-semibold text-navy shadow-sm">
                        <Images className="h-3 w-3" />
                        {album.photos.length}
                      </span>
                    </div>
                    <h4 className="mt-3 line-clamp-2 text-balance font-serif text-base font-bold leading-snug text-navy-text transition-colors group-hover:text-gold">
                      {album.title}
                    </h4>
                    {metaLine(album) ? (
                      <p className="mt-1.5 flex items-center gap-1 text-xs text-navy-text/55">
                        {album.location ? <MapPin className="h-3 w-3 shrink-0" /> : null}
                        {metaLine(album)}
                      </p>
                    ) : null}
                  </Link>
                )
              })}
            </div>

            {/* Slider controls */}
            {highlights.length > 4 ? (
              <div className="mt-5 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => scrollBy(-1)}
                  aria-label="Previous highlights"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 bg-white text-navy-text transition-colors hover:border-navy/40"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => scrollBy(1)}
                  aria-label="Next highlights"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 bg-white text-navy-text transition-colors hover:border-navy/40"
                >
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}
