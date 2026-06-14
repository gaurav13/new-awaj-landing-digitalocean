import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getLatestNews } from "@/app/actions/news"
import { getUpcomingEvents } from "@/app/actions/events"
import { dateParts } from "@/lib/format-date"

export async function EventsNews() {
  const [news, events] = await Promise.all([getLatestNews(4), getUpcomingEvents(4)])

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
      {/* Upcoming Events */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[260px_1fr]">
        <div className="lg:pt-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-awaj-red">Ecosystem in Motion</p>
          <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-text">Upcoming Events</h2>
          <p className="mt-3 text-sm leading-relaxed text-navy-text/65">
            Stay connected through high-impact events, investor forums, and exclusive gatherings.
          </p>
          <Link
            href="/events"
            className="group mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-awaj-red transition-colors hover:text-navy-text"
          >
            View All Events
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {events.length === 0 ? (
          <div className="flex items-center justify-center rounded-2xl border border-gold/20 bg-white p-8 text-sm text-navy-text/60">
            No upcoming events yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {events.map((e) => {
              const d = dateParts(e.eventDate)
              return (
                <Link
                  key={e.id}
                  href={`/events/${e.slug}`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-gold/15 bg-white shadow-sm transition-shadow hover:shadow-md"
                >
                  <div className="relative h-36 overflow-hidden">
                    <img
                      src={e.imageUrl || "/images/event-night.png"}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute left-3 top-3 flex flex-col items-center rounded-lg bg-white px-2.5 py-1 text-center shadow-md">
                      <span className="text-[10px] font-bold uppercase leading-tight text-awaj-red">{d.month}</span>
                      <span className="font-serif text-xl font-bold leading-none text-navy-text">{d.day}</span>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-4">
                    <h3 className="font-serif text-base font-bold leading-snug text-navy-text">{e.title}</h3>
                    {e.location && <p className="mt-1 text-xs font-medium text-navy-text/55">{e.location}</p>}
                    <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-navy-text/70">{e.excerpt}</p>
                    <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-awaj-red">
                      Learn More
                      <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                    </span>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="my-12 h-px w-full bg-gold/15" />

      {/* Latest News */}
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold">Latest News &amp; Insights</p>
        <div className="mt-2 flex flex-wrap items-end justify-between gap-3">
          <p className="text-sm leading-relaxed text-navy-text/65">
            Stay updated with the latest ecosystem, policy, and investment news.
          </p>
          <Link
            href="/news"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-awaj-red transition-colors hover:text-navy-text"
          >
            View All News
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        {news.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-gold/20 bg-white p-8 text-center text-sm text-navy-text/60">
            No news published yet.
          </div>
        ) : (
          <div className="mt-7 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
            {news.map((n) => (
              <Link key={n.id} href={`/news/${n.slug}`} className="group flex flex-col">
                <div className="h-44 overflow-hidden rounded-xl">
                  <img
                    src={n.imageUrl || "/placeholder.svg?height=300&width=400&query=news"}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <h3 className="mt-4 font-serif text-lg font-bold leading-snug text-navy-text group-hover:text-awaj-red">
                  {n.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-text/70">{n.excerpt}</p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-awaj-red">
                  Read More
                  <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
