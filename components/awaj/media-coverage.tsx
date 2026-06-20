"use client"

import { useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { Globe, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { MediaCard, type MediaItem } from "./media-card"

const FILTERS = [
  { id: "all", label: "All" },
  { id: "article", label: "Articles" },
  { id: "press", label: "Press Releases" },
  { id: "video", label: "Videos" },
] as const

type FilterId = (typeof FILTERS)[number]["id"]

function categorize(type: string) {
  const t = type.toLowerCase()
  if (/video|podcast|interview/.test(t)) return "video"
  if (/press/.test(t)) return "press"
  return "article"
}

export function MediaCoverage({
  items,
  title,
  subtitle,
  ctaHref,
  variant = "grid",
}: {
  items: MediaItem[]
  title: string
  subtitle?: string
  ctaHref?: string
  variant?: "grid" | "slider"
}) {
  const [active, setActive] = useState<FilterId>("all")
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)

  const scrollBy = (dir: 1 | -1) => {
    const track = trackRef.current
    if (!track) return
    const amount = track.clientWidth * 0.85 * dir
    track.scrollBy({ left: amount, behavior: "smooth" })
  }

  // Only show filters that actually have matching content.
  const available = useMemo(() => {
    const present = new Set(items.map((m) => categorize(m.type)))
    return FILTERS.filter((f) => f.id === "all" || present.has(f.id))
  }, [items])

  const filtered = useMemo(
    () => (active === "all" ? items : items.filter((m) => categorize(m.type) === active)),
    [items, active],
  )

  // Auto-advance the slider; loops back to the start and pauses on hover.
  useEffect(() => {
    if (variant !== "slider" || filtered.length <= 1) return
    const id = setInterval(() => {
      const track = trackRef.current
      if (!track || pausedRef.current) return
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8
      if (atEnd) {
        track.scrollTo({ left: 0, behavior: "smooth" })
      } else {
        track.scrollBy({ left: track.clientWidth * 0.85, behavior: "smooth" })
      }
    }, 4000)
    return () => clearInterval(id)
  }, [variant, filtered.length])

  return (
    <div>
      {/* Header row: title + subtitle on the left, filter pills on the right */}
      <div className="mb-9 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="max-w-xl">
          <h2 className="font-serif text-3xl font-bold tracking-tight text-navy-text md:text-4xl">{title}</h2>
          {subtitle ? <p className="mt-3 text-pretty leading-relaxed text-navy-text/60">{subtitle}</p> : null}
        </div>

        <div className="flex items-center gap-3">
          {available.length > 2 ? (
            <div className="flex flex-wrap gap-2.5">
              {available.map((f) => {
                const isActive = active === f.id
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setActive(f.id)}
                    aria-pressed={isActive}
                    className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                      isActive
                        ? "bg-navy text-white"
                        : "border border-navy/15 bg-white text-navy-text hover:border-navy/40"
                    }`}
                  >
                    {f.label}
                  </button>
                )
              })}
            </div>
          ) : null}

          {variant === "slider" && filtered.length > 1 ? (
            <div className="hidden gap-2 sm:flex">
              <button
                type="button"
                onClick={() => scrollBy(-1)}
                aria-label="Previous"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 bg-white text-navy-text transition-colors hover:border-navy/40"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => scrollBy(1)}
                aria-label="Next"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-navy/15 bg-white text-navy-text transition-colors hover:border-navy/40"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {variant === "slider" ? (
        <div
          ref={trackRef}
          onMouseEnter={() => {
            pausedRef.current = true
          }}
          onMouseLeave={() => {
            pausedRef.current = false
          }}
          className="-mx-5 flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth px-5 pb-2 lg:mx-0 lg:px-0 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {filtered.map((m) => (
            <div
              key={m.id}
              className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
            >
              <MediaCard item={m} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((m) => (
            <MediaCard key={m.id} item={m} />
          ))}
        </div>
      )}

      {ctaHref ? (
        <div className="mt-10 flex flex-col items-start justify-between gap-5 rounded-2xl border border-gold/25 bg-white/60 px-7 py-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
              <Globe className="h-6 w-6" />
            </span>
            <p className="max-w-md text-pretty leading-relaxed text-navy-text/70">
              Explore how leading media outlets are covering our mission to build a trusted and innovative Web3
              ecosystem in Japan.
            </p>
          </div>
          <Link
            href={ctaHref}
            className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-navy px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View all media coverage
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      ) : null}
    </div>
  )
}
