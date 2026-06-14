import Link from "next/link"
import { ArrowLeft, Globe2, ArrowUpRight } from "lucide-react"
import { RichContent } from "./rich-content"
import { MediaCard } from "./media-card"
import type { ProgramPartner, ProgramStartup, GalleryItem } from "@/lib/db/schema"

type Program = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  regions: string | null
  imageUrl: string | null
  bannerUrl: string | null
  partners: ProgramPartner[]
  startups: ProgramStartup[]
  gallery: GalleryItem[]
}

type MediaItem = {
  id: number
  title: string
  type: string
  url: string | null
  thumbnailUrl: string | null
  source: string | null
  excerpt: string | null
}

export function ProgramDetail({ program, media }: { program: Program; media: MediaItem[] }) {
  const banner = program.bannerUrl || program.imageUrl

  return (
    <article>
      {/* Hero — heading left, banner right (like the main header) */}
      <section className="relative overflow-hidden border-b border-gold/15">
        <div className="mx-auto grid max-w-[1280px] grid-cols-1 items-center gap-8 px-5 pt-8 pb-10 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:pt-12 lg:pb-14">
          {/* Left */}
          <div className="relative z-10 flex flex-col justify-center lg:py-4">
            <Link
              href="/programs"
              className="inline-flex w-fit items-center gap-2 text-sm font-medium text-navy-text/60 transition-colors hover:text-gold"
            >
              <ArrowLeft className="h-4 w-4" />
              All Programs
            </Link>
            {program.regions ? (
              <span className="mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
                <Globe2 className="h-4 w-4" />
                {program.regions}
              </span>
            ) : null}
            <h1 className="mt-3 text-balance font-serif text-4xl font-bold leading-[1.12] tracking-tight text-navy-text md:text-5xl">
              {program.title}
            </h1>
            <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-navy-text/70">{program.excerpt}</p>
          </div>

          {/* Right visual — fixed-ratio frame that flatters any banner shape */}
          <div className="relative">
            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.75rem] bg-beige ring-1 ring-gold/15">
              {banner ? (
                <img
                  src={banner || "/placeholder.svg"}
                  alt={program.title}
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-beige">
                  <Globe2 className="h-16 w-16 text-gold/30" />
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="pointer-events-none absolute right-0 top-0 -z-0 h-[500px] w-[500px] rounded-full bg-beige/50 blur-3xl" />
      </section>

      {/* Description */}
      <section className="mx-auto max-w-[820px] px-5 py-12 lg:px-10 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">About the Program</p>
        <div className="mt-3 mb-8 h-px w-16 bg-gold/50" />
        <RichContent html={program.content} className="text-base leading-relaxed" />
      </section>

      {/* Partners — matching the homepage partners card */}
      {program.partners.length > 0 ? (
        <section className="mx-auto max-w-[1280px] px-5 pb-16 lg:px-10">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-navy-text md:text-3xl">Program Partners</h2>
            <div className="mx-auto mt-3 h-px w-16 bg-gold/60" />
          </div>
          <div className="rounded-3xl border border-gold/25 bg-white px-6 py-12 shadow-sm md:px-10">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {program.partners.map((p, i) => {
                const inner = p.logoUrl ? (
                  <img
                    src={p.logoUrl || "/placeholder.svg"}
                    alt={p.name}
                    className="h-10 w-auto max-w-[160px] object-contain opacity-80 transition-opacity hover:opacity-100"
                  />
                ) : (
                  <span className="text-center font-serif text-base font-bold leading-tight tracking-tight text-navy/55 transition-colors hover:text-gold">
                    {p.name}
                  </span>
                )
                return p.linkUrl ? (
                  <a
                    key={i}
                    href={p.linkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center"
                    aria-label={p.name}
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={i} className="flex items-center">
                    {inner}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Startups */}
      {program.startups.length > 0 ? (
        <section className="border-y border-gold/20 bg-beige/40 py-14 lg:py-16">
          <div className="mx-auto max-w-[1100px] px-5 lg:px-10">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-2xl font-bold text-navy-text md:text-3xl">Startups in the Program</h2>
              <div className="mx-auto mt-3 h-px w-16 bg-gold/60" />
            </div>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {program.startups.map((s, i) => {
                const inner = (
                  <div className="flex h-full flex-col rounded-2xl border border-gold/20 bg-white p-6 transition-shadow hover:shadow-md">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-beige">
                        {s.logoUrl ? (
                          <img
                            src={s.logoUrl || "/placeholder.svg"}
                            alt=""
                            className="h-full w-full object-contain p-1.5"
                          />
                        ) : (
                          <span className="font-serif text-lg font-bold text-gold">{s.name.charAt(0)}</span>
                        )}
                      </div>
                      <h3 className="font-serif text-lg font-bold leading-snug text-navy-text">{s.name}</h3>
                      {s.linkUrl ? <ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-navy-text/40" /> : null}
                    </div>
                    {s.description ? (
                      <p className="mt-3 text-sm leading-relaxed text-navy-text/70">{s.description}</p>
                    ) : null}
                  </div>
                )
                return s.linkUrl ? (
                  <a key={i} href={s.linkUrl} target="_blank" rel="noopener noreferrer" className="block h-full">
                    {inner}
                  </a>
                ) : (
                  <div key={i} className="h-full">
                    {inner}
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Gallery — horizontal scroll */}
      {program.gallery.length > 0 ? (
        <section className="py-14 lg:py-16">
          <div className="mx-auto max-w-[1280px] px-5 lg:px-10">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-2xl font-bold text-navy-text md:text-3xl">Gallery</h2>
              <div className="mx-auto mt-3 h-px w-16 bg-gold/60" />
            </div>
          </div>
          <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 lg:px-10 [scrollbar-width:thin]">
            {program.gallery.map((g, i) => (
              <figure
                key={i}
                className="w-[80%] shrink-0 snap-center overflow-hidden rounded-2xl border border-gold/20 bg-white sm:w-[55%] md:w-[40%] lg:w-[32%]"
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={g.imageUrl || "/placeholder.svg"}
                    alt={g.caption ?? ""}
                    className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                </div>
                {g.caption ? (
                  <figcaption className="px-4 py-3 text-sm text-navy-text/60">{g.caption}</figcaption>
                ) : null}
              </figure>
            ))}
          </div>
        </section>
      ) : null}

      {/* Media */}
      {media.length > 0 ? (
        <section className="border-t border-gold/20 bg-beige/40 py-14 lg:py-16">
          <div className="mx-auto max-w-[1100px] px-5 lg:px-10">
            <div className="mb-8 text-center">
              <h2 className="font-serif text-2xl font-bold text-navy-text md:text-3xl">In the Media</h2>
              <div className="mx-auto mt-3 h-px w-16 bg-gold/60" />
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {media.map((m) => (
                <MediaCard key={m.id} item={m} />
              ))}
            </div>
          </div>
        </section>
      ) : null}
    </article>
  )
}
