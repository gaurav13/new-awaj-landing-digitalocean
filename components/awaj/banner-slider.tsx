"use client"

import { useCallback, useEffect, useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

export type Banner = {
  id: number
  title: string | null
  subtitle: string | null
  imageUrl: string
  linkUrl: string | null
  linkLabel: string | null
}

export function BannerSlider({ banners }: { banners: Banner[] }) {
  const [index, setIndex] = useState(0)
  const count = banners.length

  const goTo = useCallback((i: number) => setIndex(((i % count) + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])
  const prev = useCallback(() => goTo(index - 1), [goTo, index])

  useEffect(() => {
    if (count <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    return () => clearInterval(id)
  }, [count])

  if (count === 0) return null

  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] bg-beige shadow-xl">
      {banners.map((b, i) => {
        const active = i === index
        return (
          <div
            key={b.id}
            className={`transition-opacity duration-700 ${
              active ? "relative opacity-100" : "absolute inset-0 opacity-0"
            }`}
            aria-hidden={!active}
          >
            <img
              src={b.imageUrl || "/placeholder.svg"}
              alt={b.title || "AWAJ banner"}
              className={active ? "block h-auto w-full" : "h-full w-full object-cover"}
            />
            {(b.title || b.subtitle || b.linkUrl) && (
              <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-navy/80 via-navy/20 to-transparent p-6 lg:p-8">
                {b.title ? (
                  <h2 className="text-balance font-serif text-2xl font-bold leading-snug text-white lg:text-3xl">
                    {b.title}
                  </h2>
                ) : null}
                {b.subtitle ? (
                  <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-white/80">{b.subtitle}</p>
                ) : null}
                {b.linkUrl ? (
                  <a
                    href={b.linkUrl}
                    className="group mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy transition-opacity hover:opacity-90"
                  >
                    {b.linkLabel || "Learn more"}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </a>
                ) : null}
              </div>
            )}
          </div>
        )
      })}

      {count > 1 ? (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous banner"
            className="absolute left-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-navy shadow-md transition-colors hover:bg-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next banner"
            className="absolute right-3 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-navy shadow-md transition-colors hover:bg-white"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
            {banners.map((b, i) => (
              <button
                key={b.id}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to banner ${i + 1}`}
                aria-current={i === index}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/50 hover:bg-white/80"
                }`}
              />
            ))}
          </div>
        </>
      ) : null}
    </div>
  )
}
