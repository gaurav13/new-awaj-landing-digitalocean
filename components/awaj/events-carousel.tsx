"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"
import { dateParts } from "@/lib/format-date"

type CarouselEvent = {
  id: number
  slug: string
  title: string
  excerpt: string
  location: string | null
  eventDate: string
  imageUrl: string | null
  bannerUrl: string | null
}

export function EventsCarousel({ events }: { events: CarouselEvent[] }) {
  const [perView, setPerView] = useState(3)
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Responsive items-per-view: 1 (mobile) / 2 (tablet) / 3 (desktop)
  useEffect(() => {
    const compute = () => {
      if (window.matchMedia("(min-width: 1024px)").matches) setPerView(3)
      else if (window.matchMedia("(min-width: 640px)").matches) setPerView(2)
      else setPerView(1)
    }
    compute()
    window.addEventListener("resize", compute)
    return () => window.removeEventListener("resize", compute)
  }, [])

  const maxIndex = Math.max(0, events.length - perView)

  // Keep index in range when perView changes.
  useEffect(() => {
    setIndex((i) => Math.min(i, maxIndex))
  }, [maxIndex])

  const next = useCallback(() => {
    setIndex((i) => (i >= maxIndex ? 0 : i + 1))
  }, [maxIndex])

  const prev = useCallback(() => {
    setIndex((i) => (i <= 0 ? maxIndex : i - 1))
  }, [maxIndex])

  // Auto-slide
  const canSlide = events.length > perView
  const pausedRef = useRef(paused)
  pausedRef.current = paused
  useEffect(() => {
    if (!canSlide) return
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReduced) return
    const timer = setInterval(() => {
      if (!pausedRef.current) next()
    }, 3500)
    return () => clearInterval(timer)
  }, [canSlide, next])

  return (
    <div
      className="relative mt-6"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${index * (100 / perView)}%)` }}
        >
          {events.map((e) => {
            const d = dateParts(e.eventDate)
            const cover = e.imageUrl || e.bannerUrl
            const isPast = e.eventDate < new Date().toISOString().slice(0, 10)
            return (
              <div key={e.id} className="shrink-0 px-2" style={{ flex: `0 0 ${100 / perView}%` }}>
                <Link
                  href={`/events/${e.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-xl border border-gold/15 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative aspect-[16/9] overflow-hidden bg-beige">
                    <img
                      src={cover || "/images/event-night.png"}
                      alt=""
                      className={`absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105 ${
                        cover ? "object-contain" : "object-cover"
                      }`}
                    />
                    <div className="absolute left-2.5 top-2.5 z-10 flex flex-col items-center rounded-md bg-white px-2 py-0.5 text-center shadow-md">
                      <span className="text-[9px] font-bold uppercase leading-tight text-awaj-red">{d.month}</span>
                      <span className="font-serif text-base font-bold leading-none text-navy-text">{d.day}</span>
                    </div>
                    {isPast && (
                      <span className="absolute right-2.5 top-2.5 z-10 rounded-full bg-navy-text/85 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow-md">
                        Past
                      </span>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col p-3.5">
                    <h3 className="font-serif text-sm font-bold leading-snug text-navy-text">{e.title}</h3>
                    {e.location && <p className="mt-1 text-[11px] font-semibold text-gold">{e.location}</p>}
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-navy-text/70">{e.excerpt}</p>
                    <span className="mt-auto inline-flex items-center gap-1 pt-3 text-xs font-semibold text-awaj-red">
                      Learn More
                      <ArrowRight className="h-3 w-3 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>
      </div>

      {canSlide && (
        <div className="mt-4 flex items-center justify-between">
          {/* Dots */}
          <div className="flex items-center gap-1.5">
            {Array.from({ length: maxIndex + 1 }).map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all ${
                  i === index ? "w-5 bg-awaj-red" : "w-1.5 bg-navy-text/20 hover:bg-navy-text/40"
                }`}
              />
            ))}
          </div>

          {/* Arrows */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prev}
              aria-label="Previous events"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-white text-navy-text transition-colors hover:border-awaj-red hover:text-awaj-red"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next events"
              className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/30 bg-white text-navy-text transition-colors hover:border-awaj-red hover:text-awaj-red"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
