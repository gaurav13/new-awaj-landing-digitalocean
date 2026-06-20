"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, X, Calendar, Images } from "lucide-react"
import type { GalleryItem } from "@/lib/db/schema"
import { formatLongDate } from "@/lib/format-date"

export type GalleryAlbum = {
  id: number
  title: string
  description: string | null
  category: string
  coverImageUrl: string | null
  photos: GalleryItem[]
  eventDate: string | null
}

type LightboxState = { albumIndex: number; photoIndex: number } | null

export function GalleryShowcase({ albums }: { albums: GalleryAlbum[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("All")
  const [lightbox, setLightbox] = useState<LightboxState>(null)

  const categories = useMemo(() => {
    const set = new Set(albums.map((a) => a.category).filter(Boolean))
    return ["All", ...Array.from(set)]
  }, [albums])

  // Keep a stable filtered list so the lightbox indices line up with what's shown.
  const visibleAlbums = useMemo(
    () => (activeCategory === "All" ? albums : albums.filter((a) => a.category === activeCategory)),
    [albums, activeCategory],
  )

  const open = useCallback((albumIndex: number, photoIndex: number) => {
    setLightbox({ albumIndex, photoIndex })
  }, [])
  const close = useCallback(() => setLightbox(null), [])

  const activeAlbum = lightbox ? visibleAlbums[lightbox.albumIndex] : null

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((prev) => {
        if (!prev) return prev
        const album = visibleAlbums[prev.albumIndex]
        const count = album.photos.length
        const next = (prev.photoIndex + dir + count) % count
        return { ...prev, photoIndex: next }
      })
    },
    [visibleAlbums],
  )

  useEffect(() => {
    if (!lightbox) return
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") close()
      if (e.key === "ArrowRight") step(1)
      if (e.key === "ArrowLeft") step(-1)
    }
    window.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [lightbox, close, step])

  return (
    <div className="mx-auto max-w-[1280px] px-5 lg:px-10">
      {/* Category filter — see all activities & conferences at a glance */}
      {categories.length > 2 ? (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => {
            const active = cat === activeCategory
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setActiveCategory(cat)}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition-colors ${
                  active
                    ? "bg-navy text-white"
                    : "border border-navy/15 text-navy-text/70 hover:border-navy/40 hover:text-navy-text"
                }`}
              >
                {cat}
              </button>
            )
          })}
        </div>
      ) : null}

      {/* Album grid — compact, minimal, modern */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {visibleAlbums.map((album, albumIndex) => {
          const cover = album.coverImageUrl ?? album.photos[0]?.imageUrl ?? "/placeholder.svg"
          return (
            <button
              key={album.id}
              type="button"
              onClick={() => open(albumIndex, 0)}
              className="group relative overflow-hidden rounded-xl bg-beige text-left ring-1 ring-gold/15 transition-all duration-300 hover:ring-gold/40 hover:shadow-lg"
              aria-label={`Open ${album.title} gallery (${album.photos.length} photos)`}
            >
              <div className="aspect-[4/3] overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={cover || "/placeholder.svg"}
                  alt={album.title}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  loading="lazy"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/15 to-transparent" />

              <span className="absolute right-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy">
                <Images className="h-3 w-3" />
                {album.photos.length}
              </span>

              <div className="absolute inset-x-0 bottom-0 p-3.5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">{album.category}</p>
                <h3 className="mt-1 line-clamp-2 text-pretty font-serif text-base font-bold leading-snug text-white">
                  {album.title}
                </h3>
                {album.eventDate ? (
                  <p className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-white/70">
                    <Calendar className="h-3 w-3" />
                    {formatLongDate(album.eventDate)}
                  </p>
                ) : null}
              </div>
            </button>
          )
        })}
      </div>

      {activeAlbum && lightbox ? (
        <Lightbox
          album={activeAlbum}
          photoIndex={lightbox.photoIndex}
          onClose={close}
          onStep={step}
          onJump={(i) => setLightbox((prev) => (prev ? { ...prev, photoIndex: i } : prev))}
        />
      ) : null}
    </div>
  )
}

function Lightbox({
  album,
  photoIndex,
  onClose,
  onStep,
  onJump,
}: {
  album: GalleryAlbum
  photoIndex: number
  onClose: () => void
  onStep: (dir: 1 | -1) => void
  onJump: (index: number) => void
}) {
  const photo = album.photos[photoIndex]
  const multi = album.photos.length > 1

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-navy/95 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-label={`${album.title} photo viewer`}
      onClick={onClose}
    >
      <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-10">
        <div className="min-w-0">
          <p className="truncate font-serif text-lg font-bold text-white">{album.title}</p>
          <p className="text-xs text-white/60">
            {photoIndex + 1} / {album.photos.length}
            {album.category ? ` · ${album.category}` : ""}
          </p>
        </div>
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
          aria-label="Close viewer"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <div className="relative flex flex-1 items-center justify-center px-4 pb-4 lg:px-20">
        {multi ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onStep(-1)
            }}
            className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy/40 text-white transition-colors hover:bg-white/15 lg:left-8"
            aria-label="Previous photo"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
        ) : null}

        <figure className="flex max-h-full max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={photo?.imageUrl || "/placeholder.svg"}
            alt={photo?.caption ?? album.title}
            className="max-h-[72vh] w-auto rounded-lg object-contain shadow-2xl"
          />
          {photo?.caption ? (
            <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/70">{photo.caption}</figcaption>
          ) : null}
        </figure>

        {multi ? (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onStep(1)
            }}
            className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy/40 text-white transition-colors hover:bg-white/15 lg:right-8"
            aria-label="Next photo"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        ) : null}
      </div>

      {/* Thumbnail filmstrip — modern way to scan all photos */}
      {multi ? (
        <div
          className="flex gap-2 overflow-x-auto px-5 pb-5 pt-1 lg:px-10 [scrollbar-width:thin]"
          onClick={(e) => e.stopPropagation()}
        >
          {album.photos.map((p, i) => (
            <button
              key={`${p.imageUrl}-${i}`}
              type="button"
              onClick={() => onJump(i)}
              className={`relative h-14 w-20 shrink-0 overflow-hidden rounded-md ring-2 transition-all ${
                i === photoIndex ? "ring-gold" : "ring-transparent opacity-60 hover:opacity-100"
              }`}
              aria-label={`View photo ${i + 1}`}
              aria-current={i === photoIndex}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={p.imageUrl || "/placeholder.svg"} alt="" className="h-full w-full object-cover" loading="lazy" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}
