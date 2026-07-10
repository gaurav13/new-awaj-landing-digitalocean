"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Building2, ArrowRight } from "lucide-react"
import type { DirectoryOrganization } from "@/lib/organization-types"
import { latestNThenShuffle, recencyMs } from "@/lib/shuffle"

// Number of most-recently added/updated companies pinned to the front of the slider
// before the remaining members are randomized.
const LATEST_PINNED = 20

export function MembersSlider({ organizations }: { organizations: DirectoryOrganization[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  // Base ordering: the 20 newest companies first (in newest-first order), then the rest
  // shuffled. Done AFTER mount (not during render) so the SSR HTML matches first paint —
  // avoiding hydration mismatches — while producing a fresh random tail on every visit.
  const [ordered, setOrdered] = useState<DirectoryOrganization[]>(organizations)
  useEffect(() => {
    setOrdered(latestNThenShuffle(organizations, LATEST_PINNED, (o) => recencyMs(o.createdAt, o.updatedAt)))
  }, [organizations])

  function updateButtons() {
    const el = trackRef.current
    if (!el) return
    setCanPrev(el.scrollLeft > 8)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 8)
  }

  useEffect(() => {
    updateButtons()
    const el = trackRef.current
    if (!el) return
    el.addEventListener("scroll", updateButtons, { passive: true })
    window.addEventListener("resize", updateButtons)
    return () => {
      el.removeEventListener("scroll", updateButtons)
      window.removeEventListener("resize", updateButtons)
    }
  }, [ordered])

  function scrollByCards(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-member-card]")
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * amount * 2, behavior: "smooth" })
  }

  if (organizations.length === 0) return null

  return (
    <section aria-label="New members" className="bg-ivory">
      <div className="mx-auto max-w-[1280px] px-5 py-10 lg:px-10 lg:py-14">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-gold">New Members</h2>
            <p className="mt-1 font-serif text-2xl font-bold text-navy-text">Welcoming Our Newest Companies</p>
          </div>
          <Link
            href="/members"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-awaj-red transition-colors hover:text-navy-text"
          >
            View All Members
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="relative mt-6">
          <button
            type="button"
            aria-label="Previous members"
            onClick={() => scrollByCards(-1)}
            className={`absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-white p-2 text-navy-text shadow-md transition hover:bg-beige md:flex ${
              canPrev ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            aria-label="Next members"
            onClick={() => scrollByCards(1)}
            className={`absolute -right-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-white p-2 text-navy-text shadow-md transition hover:bg-beige md:flex ${
              canNext ? "opacity-100" : "pointer-events-none opacity-0"
            }`}
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={trackRef}
            className="flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {ordered.map((o) => {
              const card = (
                <>
                  <div className="flex h-20 w-full items-center justify-center overflow-hidden rounded-xl border border-gold/15 bg-white p-3">
                    {o.logoUrl ? (
                      <img
                        src={o.logoUrl || "/placeholder.svg"}
                        alt={`${o.name} logo`}
                        className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Building2 className="h-8 w-8 text-gold" />
                    )}
                  </div>
                  <h3 className="mt-2 line-clamp-2 text-center text-xs font-semibold leading-snug text-navy-text">
                    {o.name}
                  </h3>
                </>
              )
              const className =
                "group flex w-[150px] shrink-0 snap-start flex-col sm:w-[170px]"
              return o.websiteUrl ? (
                <a
                  key={o.id}
                  href={o.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-member-card
                  className={className}
                >
                  {card}
                </a>
              ) : (
                <div key={o.id} data-member-card className={className}>
                  {card}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
