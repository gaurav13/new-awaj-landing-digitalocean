import Link from "next/link"
import { ArrowLeft, MapPin, Calendar, Clock, ArrowUpRight, CalendarCheck } from "lucide-react"
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
  joinUrl: string | null
  joinLabel: string | null
  sponsors: EventSponsor[]
  speakers: EventSpeaker[]
}

function weekdayLabel(value: string) {
  const d = new Date(`${value}T00:00:00`)
  if (Number.isNaN(d.getTime())) return ""
  return d.toLocaleDateString("en-US", { weekday: "long" })
}

export function EventDetail({ event }: { event: EventData }) {
  const poster = event.bannerUrl || event.imageUrl
  const d = dateParts(event.eventDate)
  const mapHref = event.location
    ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`
    : null
  const joinLabel = event.joinLabel?.trim() || "Join the Event"

  return (
    <article className="bg-ivory">
      {/* Luma-style hero */}
      <section className="mx-auto max-w-[1120px] px-5 pt-7 pb-12 lg:px-10 lg:pt-10 lg:pb-16">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-navy-text/60 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          All Events
        </Link>

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12">
          {/* Left: poster + hosted by */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-navy shadow-lg ring-1 ring-gold/15">
              {poster ? (
                <>
                  <img
                    src={poster || "/placeholder.svg"}
                    alt=""
                    aria-hidden="true"
                    className="absolute inset-0 h-full w-full scale-110 object-cover opacity-40 blur-2xl"
                  />
                  <img
                    src={poster || "/placeholder.svg"}
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

            {/* Hosted by */}
            <div className="mt-6 rounded-2xl border border-gold/20 bg-white p-5">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-navy-text/50">Hosted By</p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-sm font-bold text-white">
                  A
                </div>
                <span className="font-serif text-base font-bold text-navy-text">Asia Web3 Alliance Japan</span>
              </div>
            </div>
          </div>

          {/* Right: details */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
              AWAJ Event
            </span>

            <h1 className="mt-4 text-balance font-serif text-4xl font-bold leading-[1.08] tracking-tight text-navy-text md:text-5xl">
              {event.title}
            </h1>

            {/* Date + time row */}
            <div className="mt-7 flex items-center gap-4">
              <div className="flex w-14 flex-col overflow-hidden rounded-xl border border-gold/25 bg-white text-center shadow-sm">
                <span className="bg-beige py-1 text-[11px] font-bold uppercase tracking-wide text-awaj-red">
                  {d.month}
                </span>
                <span className="py-1.5 font-serif text-xl font-bold leading-none text-navy-text">{d.day}</span>
              </div>
              <div>
                <p className="font-serif text-lg font-bold text-navy-text">
                  {weekdayLabel(event.eventDate)} {d.day} {d.month}
                </p>
                {event.timeLabel ? (
                  <p className="flex items-center gap-1.5 text-sm text-navy-text/65">
                    <Clock className="h-3.5 w-3.5 text-gold" />
                    {event.timeLabel}
                  </p>
                ) : (
                  <p className="text-sm text-navy-text/65">{formatLongDate(event.eventDate)}</p>
                )}
              </div>
            </div>

            {/* Location row */}
            {event.location ? (
              <a
                href={mapHref ?? "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center gap-4 rounded-xl border border-transparent transition-colors hover:border-gold/20"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white ring-1 ring-gold/20">
                  <MapPin className="h-5 w-5 text-gold" />
                </span>
                <span className="flex flex-1 items-center justify-between gap-2">
                  <span className="text-sm font-medium leading-snug text-navy-text">{event.location}</span>
                  <ArrowUpRight className="h-4 w-4 shrink-0 text-navy-text/40" />
                </span>
              </a>
            ) : null}

            {/* Registration card */}
            <div className="mt-7 overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm">
              <div className="border-b border-gold/15 bg-beige/50 px-5 py-3">
                <p className="text-sm font-semibold uppercase tracking-wide text-navy-text/70">Registration</p>
              </div>
              <div className="p-5">
                <p className="text-sm leading-relaxed text-navy-text/70">{event.excerpt}</p>
                {event.joinUrl ? (
                  <a
                    href={event.joinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-awaj-red px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-awaj-red/90"
                  >
                    <CalendarCheck className="h-5 w-5" />
                    {joinLabel}
                  </a>
                ) : (
                  <div className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-beige px-6 py-3.5 text-base font-semibold text-navy-text/50">
                    Registration details coming soon
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-[820px] px-5 pb-12 lg:px-10 lg:pb-16">
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
