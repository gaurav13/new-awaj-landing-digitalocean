import Link from "next/link"
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  MapPin,
  Calendar,
  Clock,
  Rocket,
  Users,
  Trophy,
  Handshake,
  Mic,
  Star,
  Coffee,
  Camera,
  CalendarCheck,
} from "lucide-react"
import { RichContent } from "./rich-content"
import type { EventSponsor, EventSpeaker, EventHighlight, EventAgendaItem } from "@/lib/db/schema"
import { resolveEventPosterImage, resolveImageUrl } from "@/lib/images"

type EventData = {
  slug: string
  title: string
  subtitle: string | null
  excerpt: string
  content: string
  eventDate: string
  timeLabel: string | null
  location: string | null
  venue: string | null
  imageUrl: string | null
  bannerUrl: string | null
  joinUrl: string | null
  joinLabel: string | null
  secondaryUrl: string | null
  secondaryLabel: string | null
  highlights: EventHighlight[]
  agenda: EventAgendaItem[]
  sponsors: EventSponsor[]
  speakers: EventSpeaker[]
}

const HIGHLIGHT_ICONS = [Rocket, Users, Trophy, Handshake, Star, Mic]
const AGENDA_ICONS = [Users, Mic, Star, Handshake, Rocket, Coffee, Trophy, Camera]

function dateBits(value: string) {
  const d = new Date(`${value}T00:00:00`)
  if (Number.isNaN(d.getTime())) return { weekday: "", day: value, month: "", year: "" }
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }),
    day: d.toLocaleDateString("en-US", { day: "2-digit" }),
    month: d.toLocaleDateString("en-US", { month: "long" }),
    year: d.toLocaleDateString("en-US", { year: "numeric" }),
  }
}

/* Eyebrow + serif heading — matches the rest of the site's section style */
function SectionHeading({
  eyebrow,
  title,
  icon: Icon,
}: {
  eyebrow: string
  title: string
  icon: typeof Users
}) {
  return (
    <div className="mb-8 flex flex-col items-center text-center">
      <span className="flex items-center gap-2 text-gold">
        <Icon className="h-4 w-4" />
        <span className="text-xs font-semibold uppercase tracking-[0.22em]">{eyebrow}</span>
      </span>
      <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-text">{title}</h2>
    </div>
  )
}

export function EventDetail({ event }: { event: EventData }) {
  const poster = resolveEventPosterImage(event)
  const d = dateBits(event.eventDate)
  const primaryLabel = event.joinLabel?.trim() || "Register Now"

  // Group sponsors by tier, preserving order of first appearance
  const tiers: { tier: string; items: EventSponsor[] }[] = []
  for (const s of event.sponsors) {
    const key = s.tier?.trim() || ""
    let group = tiers.find((t) => t.tier === key)
    if (!group) {
      group = { tier: key, items: [] }
      tiers.push(group)
    }
    group.items.push(s)
  }

  return (
    <article className="bg-ivory">
      <div className="mx-auto max-w-[1180px] px-5 py-7 lg:px-8 lg:py-10">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-medium text-navy-text/60 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-4 w-4" />
          All Events
        </Link>

        {/* ── Hero ── */}
        <section className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,420px)_1fr] lg:gap-12">
          {/* Poster */}
          <div className="lg:sticky lg:top-6 lg:self-start">
            <div className="relative aspect-square w-full overflow-hidden rounded-3xl bg-beige ring-1 ring-gold/15">
              <img
                src={poster}
                alt={event.title}
                className="absolute inset-0 h-full w-full object-contain"
              />
            </div>
          </div>

          {/* Details */}
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-awaj-red" />
              AWAJ Event
            </span>

            <h1 className="mt-4 text-balance font-serif text-3xl font-bold leading-[1.12] tracking-tight text-navy-text md:text-4xl">
              {event.title}
            </h1>
            {event.subtitle ? (
              <p className="mt-2.5 text-pretty font-serif text-lg font-semibold text-awaj-red md:text-xl">
                {event.subtitle}
              </p>
            ) : null}

            <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-navy-text/70">{event.excerpt}</p>

            {/* Info cards */}
            <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-2xl border border-gold/20 bg-white p-4">
                <div className="flex items-center gap-2 text-gold">
                  <Calendar className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-navy-text/50">Date</span>
                </div>
                <p className="mt-2 text-sm font-medium text-navy-text/70">{d.weekday}</p>
                <p className="font-serif text-2xl font-bold leading-tight text-navy-text">{d.day}</p>
                <p className="text-sm text-navy-text/60">
                  {d.month} {d.year}
                </p>
              </div>

              <div className="rounded-2xl border border-gold/20 bg-white p-4">
                <div className="flex items-center gap-2 text-gold">
                  <Clock className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-navy-text/50">Time</span>
                </div>
                <p className="mt-2 font-serif text-lg font-bold leading-tight text-navy-text">
                  {event.timeLabel || "TBA"}
                </p>
                <p className="text-sm text-navy-text/60">Japan Standard Time</p>
              </div>

              <div className="rounded-2xl border border-gold/20 bg-white p-4">
                <div className="flex items-center gap-2 text-gold">
                  <MapPin className="h-4 w-4" />
                  <span className="text-[11px] font-bold uppercase tracking-wide text-navy-text/50">Venue</span>
                </div>
                <p className="mt-2 text-sm font-bold leading-tight text-navy-text">{event.venue || "To be announced"}</p>
                {event.location ? <p className="mt-0.5 text-sm leading-snug text-navy-text/60">{event.location}</p> : null}
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              {event.joinUrl ? (
                <a
                  href={event.joinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-awaj-red px-6 py-3.5 text-base font-semibold text-white shadow-sm transition-colors hover:bg-awaj-red/90"
                >
                  <CalendarCheck className="h-5 w-5" />
                  {primaryLabel}
                </a>
              ) : (
                <div className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-beige px-6 py-3.5 text-base font-semibold text-navy-text/50">
                  Registration coming soon
                </div>
              )}
              {event.secondaryUrl ? (
                <a
                  href={event.secondaryUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-navy/20 bg-white px-6 py-3.5 text-base font-semibold text-navy-text transition-colors hover:border-gold/40 hover:text-gold"
                >
                  {event.secondaryLabel?.trim() || "Learn More"}
                  <ArrowRight className="h-4 w-4" />
                </a>
              ) : null}
            </div>
          </div>
        </section>

        {/* ── Sponsors & partners (slider, top placement) ── */}
        {event.sponsors.length > 0 ? (
          <section className="mt-12 lg:mt-14">
            <SectionHeading eyebrow="Backed by" title="Sponsors & Partners" icon={Trophy} />
            <div className="rounded-3xl border border-gold/25 bg-white px-4 py-8 shadow-sm md:px-8">
              <div className="flex flex-col gap-8">
                {tiers.map((group, gi) => {
                  // Duplicate the items so the marquee loops seamlessly.
                  const loop = [...group.items, ...group.items]
                  return (
                    <div key={gi}>
                      {group.tier ? (
                        <p className="mb-4 text-center text-xs font-bold uppercase tracking-[0.25em] text-navy-text/45">
                          {group.tier}
                        </p>
                      ) : null}
                      {/* Auto-scrolling marquee slider — saves space, pauses on hover */}
                      <div className="awaj-marquee-mask group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
                        <div className="awaj-marquee-track items-center gap-10 pr-10">
                          {loop.map((p, i) => {
                            const logo = resolveImageUrl(p.logoUrl)
                            const inner = logo ? (
                              <img
                                src={logo}
                                alt={p.name}
                                className="h-10 w-auto max-w-[150px] object-contain opacity-80 transition-opacity hover:opacity-100"
                              />
                            ) : (
                              <span className="whitespace-nowrap rounded-xl border border-gold/20 bg-beige/50 px-5 py-2.5 text-center font-serif text-base font-bold leading-tight tracking-tight text-navy/65 transition-colors hover:text-gold">
                                {p.name}
                              </span>
                            )
                            return p.linkUrl ? (
                              <a
                                key={i}
                                href={p.linkUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex shrink-0 items-center"
                                aria-label={p.name}
                                aria-hidden={i >= group.items.length}
                              >
                                {inner}
                              </a>
                            ) : (
                              <div
                                key={i}
                                className="flex shrink-0 items-center"
                                aria-hidden={i >= group.items.length}
                              >
                                {inner}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </section>
        ) : null}
      </div>

      {/* ── Speakers (right after sponsors) ── */}
      {event.speakers.length > 0 ? (
        <section className="border-y border-gold/20 bg-beige/40 py-14 lg:py-16">
          <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
            <SectionHeading eyebrow="Meet the" title="Speakers" icon={Users} />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {event.speakers.map((s, i) => {
                const photo = resolveImageUrl(s.imageUrl)
                const companyLogo = resolveImageUrl(s.companyLogoUrl)
                const inner = (
                  <div className="group relative flex h-full items-center gap-4 overflow-hidden rounded-2xl border border-gold/20 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <span className="absolute inset-x-0 top-0 h-1 bg-gold/70" />
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-beige ring-1 ring-gold/20">
                      {photo ? (
                        <img src={photo} alt={s.name} className="h-full w-full object-cover" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center font-serif text-3xl font-bold text-gold">
                          {s.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      {s.badge ? (
                        <span className="inline-block rounded-full bg-awaj-red/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-awaj-red">
                          {s.badge}
                        </span>
                      ) : null}
                      <h3 className="mt-1.5 flex items-center gap-1 font-serif text-lg font-bold leading-snug text-navy-text">
                        <span className="truncate">{s.name}</span>
                        {s.linkUrl ? <ArrowUpRight className="h-4 w-4 shrink-0 text-navy-text/40 transition-colors group-hover:text-gold" /> : null}
                      </h3>
                      {s.role ? <p className="mt-0.5 text-sm font-medium leading-snug text-navy-text/70">{s.role}</p> : null}
                      {s.company ? <p className="text-sm leading-snug text-navy-text/50">{s.company}</p> : null}
                      {companyLogo ? (
                        <img
                          src={companyLogo}
                          alt={s.company || ""}
                          className="mt-2 h-5 w-auto max-w-[100px] object-contain opacity-80"
                        />
                      ) : null}
                    </div>
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

      {/* ── About + Agenda ── */}
      <div className="mx-auto max-w-[1180px] px-5 lg:px-8">
        <section className="mt-12 grid grid-cols-1 gap-8 pb-2 lg:mt-16 lg:grid-cols-2 lg:gap-10">
          {/* About */}
          <div className="rounded-3xl border border-gold/20 bg-white p-7 lg:p-8">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-gold" />
              <h2 className="font-serif text-2xl font-bold tracking-tight text-navy-text">About the Event</h2>
            </div>
            <RichContent html={event.content} className="mt-5 text-[15px] leading-relaxed" />

            {event.highlights.length > 0 ? (
              <div className="mt-8 grid grid-cols-2 gap-x-5 gap-y-7">
                {event.highlights.map((h, i) => {
                  const Icon = HIGHLIGHT_ICONS[i % HIGHLIGHT_ICONS.length]
                  return (
                    <div key={i} className="flex flex-col items-center text-center">
                      <span className="flex h-11 w-11 items-center justify-center rounded-full bg-beige text-gold">
                        <Icon className="h-5 w-5" strokeWidth={1.75} />
                      </span>
                      <h3 className="mt-3 text-sm font-bold text-navy-text">{h.title}</h3>
                      {h.description ? (
                        <p className="mt-1 text-xs leading-relaxed text-navy-text/60">{h.description}</p>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ) : null}
          </div>

          {/* Agenda */}
          {event.agenda.length > 0 ? (
            <div className="rounded-3xl border border-gold/20 bg-white p-7 lg:p-8">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-gold" />
                  <h2 className="font-serif text-2xl font-bold tracking-tight text-navy-text">Agenda</h2>
                </div>
                <span className="text-sm text-navy-text/55">
                  {d.weekday}, {d.day} {d.month} {d.year}
                </span>
              </div>

              <ol className="mt-5">
                {event.agenda.map((a, i) => {
                  const Icon = AGENDA_ICONS[i % AGENDA_ICONS.length]
                  return (
                    <li key={i} className="flex gap-4 border-t border-gold/15 py-4 first:border-t-0 first:pt-0">
                      {a.time ? (
                        <span className="w-24 shrink-0 pt-0.5 text-sm font-semibold text-navy-text/70">{a.time}</span>
                      ) : null}
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold leading-snug text-navy-text">{a.title}</h3>
                        {a.description ? (
                          <p className="mt-0.5 text-sm leading-relaxed text-navy-text/60">{a.description}</p>
                        ) : null}
                      </div>
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center self-start rounded-full bg-beige text-gold">
                        <Icon className="h-4 w-4" strokeWidth={1.75} />
                      </span>
                    </li>
                  )
                })}
              </ol>
            </div>
          ) : null}
        </section>
      </div>
    </article>
  )
}
