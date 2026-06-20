"use client"

import { useCallback, useEffect, useRef, useState } from "react"
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
  const [lightbox, setLightbox] = useState<LightboxState>(null)

  const open = useCallback((albumIndex: number, photoIndex: number) => {
    setLightbox({ albumIndex, photoIndex })
  }, [])

  const close = useCallback(() => setLightbox(null), [])

  const activeAlbum = lightbox ? albums[lightbox.albumIndex] : null

  const step = useCallback(
    (dir: 1 | -1) => {
      setLightbox((prev) => {
        if (!prev) return prev
        const album = albums[prev.albumIndex]
        const count = album.photos.length
        const next = (prev.photoIndex + dir + count) % count
        return { ...prev, photoIndex: next }
      })
    },
    [albums],
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
    <div className="flex flex-col gap-16">
      {albums.map((album, albumIndex) => (
        <AlbumRow key={album.id} album={album} onOpen={(photoIndex) => open(albumIndex, photoIndex)} />
      ))}

      {activeAlbum ? (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-navy/95 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-label={`${activeAlbum.title} photo viewer`}
          onClick={close}
        >
          <div className="flex items-center justify-between gap-4 px-5 py-4 lg:px-10">
            <div className="min-w-0">
              <p className="truncate font-serif text-lg font-bold text-white">{activeAlbum.title}</p>
              <p className="text-xs text-white/60">
                {lightbox ? lightbox.photoIndex + 1 : 0} / {activeAlbum.photos.length}
              </p>
            </div>
            <button
              type="button"
              onClick={close}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/20 text-white transition-colors hover:bg-white/10"
              aria-label="Close viewer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="relative flex flex-1 items-center justify-center px-4 pb-6 lg:px-20">
            {activeAlbum.photos.length > 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(-1)
                }}
                className="absolute left-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy/40 text-white transition-colors hover:bg-white/15 lg:left-8"
                aria-label="Previous photo"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            ) : null}

            {lightbox ? (
              <figure className="flex max-h-full max-w-full flex-col items-center" onClick={(e) => e.stopPropagation()}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={activeAlbum.photos[lightbox.photoIndex]?.imageUrl || "/placeholder.svg"}
                  alt={activeAlbum.photos[lightbox.photoIndex]?.caption ?? activeAlbum.title}
                  className="max-h-[78vh] w-auto rounded-lg object-contain shadow-2xl"
                />
                {activeAlbum.photos[lightbox.photoIndex]?.caption ? (
                  <figcaption className="mt-4 max-w-2xl text-center text-sm text-white/70">
                    {activeAlbum.photos[lightbox.photoIndex]?.caption}
                  </figcaption>
                ) : null}
              </figure>
            ) : null}

            {activeAlbum.photos.length > 1 ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  step(1)
                }}
                className="absolute right-3 top-1/2 z-10 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-navy/40 text-white transition-colors hover:bg-white/15 lg:right-8"
                aria-label="Next photo"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  )
}

function AlbumRow({ album, onOpen }: { album: GalleryAlbum; onOpen: (photoIndex: number) => void }) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  function scrollBy(dir: 1 | -1) {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.8), behavior: "smooth" })
  }

  if (album.photos.length === 0) return null

  return (
    <section aria-label={album.title}>
      <div className="mx-auto flex max-w-[1280px] flex-wrap items-end justify-between gap-4 px-5 lg:px-10">
        <div className="min-w-0">
          <span className="inline-flex items-center rounded-full bg-gold/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
            {album.category}
          </span>
          <h3 className="mt-3 text-balance font-serif text-2xl font-bold tracking-tight text-navy-text md:text-3xl">
            {album.title}
          </h3>
          {album.description ? (
            <p className="mt-2 max-w-2xl text-pretty leading-relaxed text-navy-text/70">{album.description}</p>
          ) : null}
          <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1 text-xs font-medium text-navy-text/50">
            {album.eventDate ? (
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-gold" />
                {formatLongDate(album.eventDate)}
              </span>
            ) : null}
            <span className="inline-flex items-center gap-1.5">
              <Images className="h-3.5 w-3.5 text-gold" />
              {album.photos.length} photo{album.photos.length === 1 ? "" : "s"}
            </span>
          </div>
        </div>

        <div className="hidden shrink-0 gap-2 sm:flex">
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
      </div>

      <div
        ref={scrollerRef}
        className="mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:px-10 [scrollbar-width:thin]"
      >
        {album.photos.map((photo, i) => (
          <button
            key={`${photo.imageUrl}-${i}`}
            type="button"
            onClick={() => onOpen(i)}
            className={`group relative shrink-0 snap-center overflow-hidden rounded-2xl border border-gold/20 bg-beige ${
              i % 3 === 0 ? "w-[78%] sm:w-[48%] lg:w-[40%]" : "w-[78%] sm:w-[40%] lg:w-[30%]"
            }`}
            aria-label={`Open photo ${i + 1}${photo.caption ? `: ${photo.caption}` : ""}`}
          >
            <div className="aspect-[4/3] overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photo.imageUrl || "/placeholder.svg"}
                alt={photo.caption ?? `${album.title} photo ${i + 1}`}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
            </div>
            {photo.caption ? (
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/80 to-transparent px-4 pb-3 pt-10 text-left">
                <p className="text-sm font-medium text-white">{photo.caption}</p>
              </div>
            ) : null}
          </button>
        ))}
      </div>
    </section>
  )
}
