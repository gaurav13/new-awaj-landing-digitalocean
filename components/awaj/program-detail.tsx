import Link from "next/link"
import { ArrowLeft, Globe2, ExternalLink, ArrowUpRight } from "lucide-react"
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
      {/* Banner */}
      <section className="relative overflow-hidden bg-navy">
        {banner ? (
          <img
            src={banner || "/placeholder.svg"}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-40"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/70 to-navy/30" />
        <div className="relative mx-auto max-w-[1100px] px-5 py-20 lg:px-10 lg:py-28">
          <Link
            href="/programs"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            All Programs
          </Link>
          <h1 className="mt-6 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-white md:text-5xl">
            {program.title}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-white/80">{program.excerpt}</p>
          {program.regions ? (
            <span className="mt-6 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white">
              <Globe2 className="h-4 w-4 text-gold" />
              {program.regions}
            </span>
          ) : null}
        </div>
      </section>

      {/* Description */}
      <section className="mx-auto max-w-[820px] px-5 py-16 lg:px-10">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">About the Program</p>
        <div className="mx-auto mt-3 mb-8 h-px w-16 bg-gold/50" />
        <RichContent html={program.content} className="text-base leading-relaxed" />
      </section>

      {/* Partners */}
      {program.partners.length > 0 ? (
        <section className="border-y border-gold/20 bg-beige/40 py-16">
          <div className="mx-auto max-w-[1100px] px-5 lg:px-10">
            <h2 className="text-center font-serif text-2xl font-bold text-navy-text md:text-3xl">Program Partners</h2>
            <div className="mx-auto mt-3 h-px w-16 bg-gold/50" />
            <div className="mt-10 grid grid-cols-2 items-center gap-6 sm:grid-cols-3 lg:grid-cols-4">
              {program.partners.map((p, i) => {
                const inner = (
                  <div className="flex h-24 items-center justify-center rounded-xl border border-gold/20 bg-white p-5 transition-shadow hover:shadow-md">
                    {p.logoUrl ? (
                      <img src={p.logoUrl || "/placeholder.svg"} alt={p.name} className="max-h-12 w-auto object-contain" />
                    ) : (
                      <span className="text-center font-serif text-lg font-semibold text-navy-text">{p.name}</span>
                    )}
                  </div>
                )
                return p.linkUrl ? (
                  <a key={i} href={p.linkUrl} target="_blank" rel="noopener noreferrer" aria-label={p.name}>
                    {inner}
                  </a>
                ) : (
                  <div key={i}>{inner}</div>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {/* Startups */}
      {program.startups.length > 0 ? (
        <section className="mx-auto max-w-[1100px] px-5 py-16 lg:px-10">
          <h2 className="text-center font-serif text-2xl font-bold text-navy-text md:text-3xl">
            Startups in the Program
          </h2>
          <div className="mx-auto mt-3 h-px w-16 bg-gold/50" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {program.startups.map((s, i) => {
              const inner = (
                <div className="flex h-full flex-col rounded-2xl border border-gold/20 bg-white p-6 transition-shadow hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-beige">
                      {s.logoUrl ? (
                        <img src={s.logoUrl || "/placeholder.svg"} alt="" className="h-full w-full object-contain p-1.5" />
                      ) : (
                        <span className="font-serif text-lg font-bold text-gold">{s.name.charAt(0)}</span>
                      )}
                    </div>
                    <h3 className="font-serif text-lg font-bold text-navy-text">{s.name}</h3>
                    {s.linkUrl ? <ArrowUpRight className="ml-auto h-4 w-4 text-navy-text/40" /> : null}
                  </div>
                  {s.description ? (
                    <p className="mt-3 text-sm leading-relaxed text-navy-text/70">{s.description}</p>
                  ) : null}
                </div>
              )
              return s.linkUrl ? (
                <a key={i} href={s.linkUrl} target="_blank" rel="noopener noreferrer">
                  {inner}
                </a>
              ) : (
                <div key={i}>{inner}</div>
              )
            })}
          </div>
        </section>
      ) : null}

      {/* Gallery */}
      {program.gallery.length > 0 ? (
        <section className="border-t border-gold/20 bg-beige/40 py-16">
          <div className="mx-auto max-w-[1100px] px-5 lg:px-10">
            <h2 className="text-center font-serif text-2xl font-bold text-navy-text md:text-3xl">Gallery</h2>
            <div className="mx-auto mt-3 h-px w-16 bg-gold/50" />
            <div className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3">
              {program.gallery.map((g, i) => (
                <figure key={i} className="overflow-hidden rounded-xl border border-gold/20 bg-white">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={g.imageUrl || "/placeholder.svg"}
                      alt={g.caption ?? ""}
                      className="h-full w-full object-cover transition-transform hover:scale-105"
                    />
                  </div>
                  {g.caption ? (
                    <figcaption className="px-3 py-2 text-xs text-navy-text/60">{g.caption}</figcaption>
                  ) : null}
                </figure>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* Media */}
      {media.length > 0 ? (
        <section className="mx-auto max-w-[1100px] px-5 py-16 lg:px-10">
          <h2 className="text-center font-serif text-2xl font-bold text-navy-text md:text-3xl">In the Media</h2>
          <div className="mx-auto mt-3 h-px w-16 bg-gold/50" />
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((m) => (
              <MediaCard key={m.id} item={m} />
            ))}
          </div>
        </section>
      ) : null}
    </article>
  )
}
