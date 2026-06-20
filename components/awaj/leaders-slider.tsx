"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import type { Person } from "@/app/actions/people"

export function LeadersSlider({ leaders }: { leaders: Person[] }) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

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
  }, [])

  function scrollByCards(dir: 1 | -1) {
    const el = trackRef.current
    if (!el) return
    const card = el.querySelector<HTMLElement>("[data-leader-card]")
    const amount = card ? card.offsetWidth + 16 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * amount * 2, behavior: "smooth" })
  }

  if (leaders.length === 0) return null

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Previous leaders"
        onClick={() => scrollByCards(-1)}
        className={`absolute -left-3 top-1/2 z-10 hidden -translate-y-1/2 items-center justify-center rounded-full border border-gold/30 bg-white p-2 text-navy-text shadow-md transition hover:bg-beige md:flex ${
          canPrev ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        aria-label="Next leaders"
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
        {leaders.map((p) => (
          <article
            key={p.id}
            data-leader-card
            className="group flex w-[160px] shrink-0 snap-start flex-col overflow-hidden rounded-2xl border border-gold/15 bg-white shadow-sm transition-shadow hover:shadow-md sm:w-[180px]"
          >
            <div className="aspect-square w-full overflow-hidden bg-beige">
              {p.profilePhoto ? (
                <img
                  src={p.profilePhoto || "/placeholder.svg"}
                  alt={`Portrait of ${p.fullName}`}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center font-serif text-3xl font-bold text-gold/40">
                  {p.fullName.charAt(0)}
                </div>
              )}
            </div>
            <div className="flex flex-1 flex-col items-center px-3 py-3 text-center">
              <h3 className="font-serif text-sm font-bold leading-tight text-navy-text">{p.fullName}</h3>
              {p.showRoleBadge && p.roleTypes?.[0] ? (
                <span className="mt-1 rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-gold">
                  {p.roleTypes[0]}
                </span>
              ) : null}
              <div className="mt-auto flex min-h-9 w-full items-center justify-center pt-3">
                {p.showCompanyLogo && p.companyLogo ? (
                  <img
                    src={p.companyLogo || "/placeholder.svg"}
                    alt={p.companyName ? `${p.companyName} logo` : "Company logo"}
                    className="max-h-7 w-auto max-w-[110px] object-contain"
                  />
                ) : p.companyName ? (
                  <span className="text-xs font-semibold text-navy-text/70">{p.companyName}</span>
                ) : null}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}
