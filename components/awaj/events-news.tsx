import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getLatestNews } from "@/app/actions/news"
import { getUpcomingEvents } from "@/app/actions/events"
import { EventsCarousel } from "@/components/awaj/events-carousel"

export async function EventsNews() {
  const [events, news] = await Promise.all([getUpcomingEvents(10), getLatestNews(4)])

  return (
    <section className="mx-auto max-w-[1280px] px-5 pb-10 pt-4 lg:px-10 lg:pb-16 lg:pt-6">
      <div className="overflow-hidden rounded-3xl border border-gold/15 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
        {/* Events banner — full width so the carousel cards render large and uncropped */}
        <div className="min-w-0">
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

        {/* News banner — full-width grid with large, uncropped images */}
        <div className="mt-10 border-t border-gold/15 pt-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 className="text-sm font-bold uppercase tracking-[0.22em] text-gold">Latest News</h2>
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
            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {news.map((n) => (
                <Link key={n.id} href={`/news/${n.slug}`} className="group flex flex-col">
                  <div className="flex aspect-video w-full items-center justify-center overflow-hidden rounded-xl border border-gold/15 bg-beige">
                    <img
                      src={n.imageUrl || "/placeholder.svg?height=225&width=400&query=news"}
                      alt={n.title}
                      className="h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="mt-3 line-clamp-2 font-serif text-base font-bold leading-snug text-navy-text transition-colors group-hover:text-awaj-red">
                    {n.title}
                  </h3>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
