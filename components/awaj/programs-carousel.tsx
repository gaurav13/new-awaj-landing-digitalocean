"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Link from "next/link"
import {
  Network,
  Landmark,
  Rocket,
  Globe2,
  Globe,
  Building2,
  Share2,
  GraduationCap,
  Users,
  Award,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

const ICONS: Record<string, LucideIcon> = {
  Rocket,
  Building2,
  Share2,
  Globe,
  GraduationCap,
  Users,
  Award,
  Landmark,
  Network,
}

export type CarouselProgram = {
  id: number
  slug: string
  title: string
  excerpt: string | null
  imageUrl: string | null
  bannerUrl: string | null
  icon: string
  regions: string | null
}

const AUTOPLAY_MS = 4000

export function ProgramsCarousel({ programs }: { programs: CarouselProgram[] }) {
  const trackRef = useRef<HTMLDivElement | null>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  // Scroll the track so the card at `index` aligns to the left edge.
  const scrollToIndex = useCallback((index: number) => {
    const track = trackRef.current
    if (!track) return
    const cards = Array.from(track.children) as HTMLElement[]
    const total = cards.length
    if (total === 0) return
    const target = ((index % total) + total) % total
    const card = cards[target]
    if (card) {
      track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" })
    }
  }, [])

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex((prev) => {
        const total = programs.length
        const next = ((index % total) + total) % total
        scrollToIndex(next)
        return next
      })
    },
    [programs.length, scrollToIndex],
  )

  const next = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo])
  const prev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo])

  // Autoplay
  useEffect(() => {
    if (paused || programs.length <= 1) return
    const id = window.setInterval(() => {
      setActiveIndex((current) => {
        const total = programs.length
        const upcoming = (current + 1) % total
        scrollToIndex(upcoming)
        return upcoming
      })
    }, AUTOPLAY_MS)
    return () => window.clearInterval(id)
  }, [paused, programs.length, scrollToIndex])

  // Keep the active dot in sync when the user scrolls/swipes manually.
  useEffect(() => {
    const track = trackRef.current
    if (!track) return
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        const cards = Array.from(track.children) as HTMLElement[]
        const left = track.scrollLeft
        let nearest = 0
        let min = Number.POSITIVE_INFINITY
        cards.forEach((card, i) => {
          const dist = Math.abs(card.offsetLeft - track.offsetLeft - left)
          if (dist < min) {
            min = dist
            nearest = i
          }
        })
        setActiveIndex(nearest)
      })
    }
    track.addEventListener("scroll", onScroll, { passive: true })
    return () => {
      track.removeEventListener("scroll", onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <section id="programs" className="mx-auto max-w-[1280px] px-5 py-10 lg:px-10 lg:py-14">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h2 className="font-serif text-2xl font-bold uppercase tracking-tight text-navy-text md:text-3xl">
          Our Core Programs
        </h2>
        <Link
          href="/programs"
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-navy-text"
        >
          View All Programs
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>

      <div
        className="relative"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocusCapture={() => setPaused(true)}
        onBlurCapture={() => setPaused(false)}
      >
        {/* Prev button */}
        <button
          type="button"
          onClick={prev}
          aria-label="Previous programs"
          className="absolute -left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/20 bg-white text-navy-text shadow-md transition-colors hover:bg-beige md:flex lg:-left-5"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        {/* Track */}
        <div
          ref={trackRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {programs.map((p) => {
            const Icon = ICONS[p.icon] ?? Rocket
            const cover = p.imageUrl || p.bannerUrl
            return (
              <div
                key={p.id}
                className="flex shrink-0 basis-[72%] snap-start sm:basis-[42%] md:basis-[31%] lg:basis-[23%] xl:basis-[18.4%]"
              >
                <Link
                  href={`/programs/${p.slug}`}
                  className="group flex h-full w-full flex-col overflow-hidden rounded-xl border border-gold/20 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-beige">
                    {cover ? (
                      <img
                        src={cover || "/placeholder.svg"}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gold/40">
                        <Icon className="h-10 w-10" strokeWidth={1.25} />
                      </div>
                    )}
                  </div>

                  <div className="flex flex-1 flex-col p-3.5">
                    {p.regions ? (
                      <span className="mb-1 flex items-center gap-1 text-[10px] font-semibold uppercase tracking-wide text-gold">
                        <Globe2 className="h-3 w-3" />
                        {p.regions}
                      </span>
                    ) : null}
                    <h3 className="font-serif text-sm font-bold leading-snug text-navy-text transition-colors group-hover:text-gold">
                      {p.title}
                    </h3>
                    <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-relaxed text-navy-text/70">{p.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-awaj-red">
                      Learn More
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </Link>
              </div>
            )
          })}
        </div>

        {/* Next button */}
        <button
          type="button"
          onClick={next}
          aria-label="Next programs"
          className="absolute -right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-gold/20 bg-white text-navy-text shadow-md transition-colors hover:bg-beige md:flex lg:-right-5"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Dots */}
      {programs.length > 1 ? (
        <div className="mt-6 flex items-center justify-center gap-2">
          {programs.map((p, i) => (
            <button
              key={p.id}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to program ${i + 1}`}
              aria-current={i === activeIndex}
              className={`h-2 rounded-full transition-all ${
                i === activeIndex ? "w-5 bg-gold" : "w-2 bg-navy-text/20 hover:bg-navy-text/40"
              }`}
            />
          ))}
        </div>
      ) : null}
    </section>
  )
}
