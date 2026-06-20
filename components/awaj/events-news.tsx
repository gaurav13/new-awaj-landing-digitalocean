import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getLatestNews } from "@/app/actions/news"
import { getHomeEvents } from "@/app/actions/events"
import { EventsCarousel } from "@/components/awaj/events-carousel"

export async function EventsNews() {
  const [events, news] = await Promise.all([getHomeEvents(10), getLatestNews(4)])

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
            <EventsCarousel events={events} />
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
