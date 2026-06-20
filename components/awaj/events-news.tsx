import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getLatestNews } from "@/app/actions/news"
import { getUpcomingEvents } from "@/app/actions/events"
import { dateParts } from "@/lib/format-date"

export async function EventsNews() {
  const [events, news] = await Promise.all([getUpcomingEvents(4), getLatestNews(4)])

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
      <div className="grid grid-cols-1 gap-10 xl:grid-cols-[1fr_360px] xl:gap-12">
        {/* Events column */}
        <div>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-awaj-red">Upcoming Events</h2>
            <Link
              href="/events"
              className="group inline-flex items-center gap-1.5 text-sm font-semibold text-awaj-red transition-colors hover:text-navy-text"
            >
              View All Events
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {events.length === 0 ? (
            <div className="mt-6 flex items-center justify-center rounded-2xl border border-gold/20 bg-white p-8 text-sm text-navy-text/60">
              No upcoming events yet.
            </div>
          ) : (
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
              {events.map((e) => {
                const d = dateParts(e.eventDate)
                const cover = e.imageUrl || e.bannerUrl
                return (
                  <Link
                    key={e.id}
                    href={`/events/${e.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gold/15 bg-white shadow-sm transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-beige">
                      <img
                        src={cover || "/images/event-night.png"}
                        alt=""
                        className={`absolute inset-0 h-full w-full transition-transform duration-500 group-hover:scale-105 ${
                          cover ? "object-contain" : "object-cover"
                        }`}
                      />
                      <div className="absolute left-3 top-3 z-10 flex flex-col items-center rounded-lg bg-white px-2.5 py-1 text-center shadow-md">
                        <span className="text-[10px] font-bold uppercase leading-tight text-awaj-red">{d.month}</span>
                        <span className="font-serif text-xl font-bold leading-none text-navy-text">{d.day}</span>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="font-serif text-lg font-bold leading-snug text-navy-text">{e.title}</h3>
                      {e.location && <p className="mt-1 text-xs font-semibold text-gold">{e.location}</p>}
                      <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-navy-text/70">{e.excerpt}</p>
                      <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-awaj-red">
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

        {/* News rail */}
        <div className="xl:border-l xl:border-gold/15 xl:pl-12">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Latest News &amp; Insights</h2>
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
            <ul className="mt-6 flex flex-col divide-y divide-gold/15">
              {news.map((n) => (
                <li key={n.id}>
                  <Link href={`/news/${n.slug}`} className="group flex items-start gap-4 py-4 first:pt-0">
                    <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg bg-beige">
                      <img
                        src={n.imageUrl || "/placeholder.svg?height=128&width=160&query=news"}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-serif text-base font-bold leading-snug text-navy-text transition-colors group-hover:text-awaj-red">
                        {n.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-navy-text/65">{n.excerpt}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
