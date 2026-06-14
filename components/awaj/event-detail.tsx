import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Clock, ArrowUpRight } from "lucide-react"
import { RichContent } from "./rich-content"
import { dateParts, formatLongDate } from "@/lib/format-date"
import type { EventSponsor, EventSpeaker } from "@/lib/db/schema"

type EventData = {
  title: string
  excerpt: string
  content: string
  eventDate: string
  timeLabel: string | null
  location: string | null
  imageUrl: string | null
  bannerUrl: string | null
  sponsors: EventSponsor[]
  speakers: EventSpeaker[]
}

export function EventDetail({ event }: { event: EventData }) {
  const banner = event.bannerUrl || event.imageUrl
  const d = dateParts(event.eventDate)

  return (
    <article>
      {/* Hero header — immersive event banner */}
      <section className="relative overflow-hidden bg-navy">
        {banner ? (
          <>
            <img
              src={banner || "/placeholder.svg"}
              alt=""
              aria-hidden="true"
              className="absolute inset-0 h-full w-full scale-110 object-cover opacity-35 blur-xl"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/55" />
          </>
        ) : null}

        <div className="relative mx-auto max-w-[1180px] px-5 pt-8 pb-10 lg:px-10 lg:pt-10 lg:pb-14">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-gold"
          >
            <ArrowLeft className="h-4 w-4" />
            All Events
          </Link>

          <div className="mt-8 grid grid-cols-1 items-center gap-8 lg:grid-cols-[1.1fr_1fr] lg:gap-12">
            {/* Left: title + meta */}
            <div>
              {/* Date chip */}
              <div className="inline-flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-2.5 backdrop-blur-sm ring-1 ring-white/15">
                <div className="flex flex-col items-center leading-none">
                  <span className="text-[11px] font-bold uppercase tracking-wide text-gold">{d.month}</span>
                  <span className="font-serif text-2xl font-bold text-white">{d.day}</span>
                </div>
                <div className="h-9 w-px bg-white/20" />
                <span className="text-sm font-medium text-white/85">{d.year}</span>
              </div>

              <h1 className="mt-6 text-balance font-serif text-4xl font-bold leading-[1.1] tracking-tight text-white md:text-5xl">
                {event.title}
              </h1>
              <p className="mt-5 max-w-xl text-pretty text-lg leading-relaxed text-white/75">{event.excerpt}</p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/85">
                <span className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gold" />
                  {formatLongDate(event.eventDate)}
                </span>
                {event.timeLabel ? (
                  <span className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold" />
                    {event.timeLabel}
                  </span>
                ) : null}
                {event.location ? (
                  <span className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold" />
                    {event.location}
                  </span>
                ) : null}
              </div>
            </div>

            {/* Right: banner card */}
            <div className="relative">
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.5rem] bg-navy-text/60 shadow-2xl ring-1 ring-white/15">
                {banner ? (
                  <>
                    <img
                      src={banner || "/placeholder.svg"}
                      alt=""
                      aria-hidden="true"
                      className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                    />
                    <img
                      src={banner || "/placeholder.svg"}
                      alt={event.title}
                      className="absolute inset-0 h-full w-full object-contain"
                    />
                  </>
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Calendar className="h-16 w-16 text-white/20" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-[820px] px-5 py-12 lg:px-10 lg:py-16">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">About this Event</p>
        <div className="mt-3 mb-8 h-px w-16 bg-gold/50" />
        <RichContent html={event.content} className="text-base leading-relaxed" />
      </section>

      {/* Speakers */}
      {event.speakers.length > 0 ? (
        <section className="border-y border-gold/20 bg-beige/40 py-14 lg:py-16">
          <div className="mx-auto max-w-[1100px] px-5 lg:px-10">
            <div className="mb-9 text-center">
              <h2 className="font-serif text-2xl font-bold text-navy-text md:text-3xl">Speakers</h2>
              <div className="mx-auto mt-3 h-px w-16 bg-gold/60" />
            </div>
            <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 lg:grid-cols-4">
              {event.speakers.map((s, i) => {
                const inner = (
                  <div className="flex h-full flex-col items-center rounded-2xl border border-gold/20 bg-white p-5 text-center transition-shadow hover:shadow-md">
                    <div className="h-24 w-24 overflow-hidden rounded-full bg-beige ring-2 ring-gold/20">
                      {s.imageUrl ? (
                        <img src={s.imageUrl || "/placeholder.svg"} alt={s.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-serif text-2xl font-bold text-gold">
                          {s.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <h3 className="mt-4 flex items-center gap-1 font-serif text-base font-bold leading-snug text-navy-text">
                      {s.name}
                      {s.linkUrl ? <ArrowUpRight className="h-3.5 w-3.5 text-navy-text/40" /> : null}
                    </h3>
                    {s.role ? <p className="mt-0.5 text-sm font-medium text-awaj-red">{s.role}</p> : null}
                    {s.company ? <p className="text-xs text-navy-text/60">{s.company}</p> : null}
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

      {/* Sponsors & partners — matching the homepage partners card */}
      {event.sponsors.length > 0 ? (
        <section className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10 lg:py-16">
          <div className="mb-8 text-center">
            <h2 className="font-serif text-2xl font-bold text-navy-text md:text-3xl">Sponsors &amp; Partners</h2>
            <div className="mx-auto mt-3 h-px w-16 bg-gold/60" />
          </div>
          <div className="rounded-3xl border border-gold/25 bg-white px-6 py-12 shadow-sm md:px-10">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
              {event.sponsors.map((p, i) => {
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
    </article>
  )
}
