import Link from "next/link"
import { MapPin, Clock, ArrowRight, ChevronRight } from "lucide-react"
import { getLatestNews } from "@/app/actions/news"
import { getUpcomingEvents } from "@/app/actions/events"
import { dateParts } from "@/lib/format-date"

function SectionHeading({ title, link, href }: { title: string; link: string; href: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="font-serif text-xl font-bold uppercase tracking-wide text-navy-text">{title}</h2>
      <Link
        href={href}
        className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold transition-colors hover:text-navy-text"
      >
        {link}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </Link>
    </div>
  )
}

export async function EventsNews() {
  const [news, events] = await Promise.all([getLatestNews(4), getUpcomingEvents(5)])
  const featured = events.find((e) => e.isFeatured) ?? events[0] ?? null
  const listEvents = events.filter((e) => e.id !== featured?.id).slice(0, 3)

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-8 lg:px-10 lg:py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Upcoming Events */}
        <div>
          <SectionHeading title="Upcoming Events" link="View All Events" href="/events" />

          {events.length === 0 ? (
            <div className="rounded-2xl border border-gold/20 bg-white p-8 text-center text-sm text-navy-text/60">
              No upcoming events yet.
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Link
                  href={`/events/${featured.slug}`}
                  className="relative block overflow-hidden rounded-2xl shadow-md"
                >
                  <img
                    src={featured.imageUrl || "/images/event-night.png"}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-navy/80" />
                  <div className="relative flex gap-5 p-6">
                    <DateBadge date={featured.eventDate} variant="red" />
                    <div className="text-white">
                      <h3 className="font-serif text-lg font-bold leading-snug">{featured.title}</h3>
                      <div className="mt-3 space-y-1.5 text-sm text-white/80">
                        {featured.location && (
                          <p className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-gold" />
                            {featured.location}
                          </p>
                        )}
                        {featured.timeLabel && (
                          <p className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gold" />
                            {featured.timeLabel}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              )}

              {/* List */}
              {listEvents.length > 0 && (
                <div className="mt-4 divide-y divide-gold/15 rounded-2xl border border-gold/20 bg-white">
                  {listEvents.map((e) => {
                    const d = dateParts(e.eventDate)
                    return (
                      <Link
                        key={e.id}
                        href={`/events/${e.slug}`}
                        className="flex items-center gap-4 p-4 transition-colors hover:bg-beige/40"
                      >
                        <div className="flex h-fit w-14 flex-col items-center rounded-lg bg-beige px-2 py-1.5 text-center">
                          <span className="text-xs font-semibold uppercase text-navy-text">{d.month}</span>
                          <span className="font-serif text-xl font-bold leading-none text-navy-text">{d.day}</span>
                          <span className="text-[10px] text-gold">{d.year}</span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-bold text-navy-text">{e.title}</h4>
                          <p className="truncate text-xs text-navy-text/60">{e.timeLabel || e.excerpt}</p>
                        </div>
                        {e.location && (
                          <span className="hidden text-xs text-navy-text/50 sm:block">{e.location}</span>
                        )}
                        <ChevronRight className="h-4 w-4 shrink-0 text-gold" />
                      </Link>
                    )
                  })}
                </div>
              )}
            </>
          )}
        </div>

        {/* Latest News */}
        <div>
          <SectionHeading title="Latest News" link="View All News" href="/news" />
          {news.length === 0 ? (
            <div className="rounded-2xl border border-gold/20 bg-white p-8 text-center text-sm text-navy-text/60">
              No news published yet.
            </div>
          ) : (
            <div className="divide-y divide-gold/15 rounded-2xl border border-gold/20 bg-white">
              {news.map((n) => {
                const d = dateParts(n.publishedAt)
                return (
                  <Link
                    key={n.id}
                    href={`/news/${n.slug}`}
                    className="flex gap-4 p-4 transition-colors hover:bg-beige/40"
                  >
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                      <img
                        src={n.imageUrl || "/placeholder.svg?height=200&width=200&query=news"}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-sm font-bold leading-snug text-navy-text">{n.title}</h4>
                      <p className="mt-1 line-clamp-2 text-xs text-navy-text/60">{n.excerpt}</p>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-xs font-semibold uppercase text-navy-text/70">{d.month}</p>
                      <p className="font-serif text-lg font-bold leading-none text-awaj-red">{d.day}</p>
                      <p className="text-[10px] text-gold">{d.year}</p>
                    </div>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function DateBadge({ date, variant }: { date: string; variant: "red" }) {
  const d = dateParts(date)
  return (
    <div
      className={`flex h-fit flex-col items-center rounded-xl px-4 py-2 text-center text-white ${
        variant === "red" ? "bg-awaj-red" : "bg-navy"
      }`}
    >
      <span className="text-xs font-semibold uppercase tracking-wide">{d.month}</span>
      <span className="font-serif text-3xl font-bold leading-none">{d.day}</span>
      <span className="text-xs text-white/70">{d.year}</span>
    </div>
  )
}
