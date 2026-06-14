import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, Clock } from "lucide-react"
import { Header } from "@/components/awaj/header"
import { Footer } from "@/components/awaj/footer"
import { RichContent } from "@/components/awaj/rich-content"
import { getEventBySlug, getRelatedEvents } from "@/app/actions/events"
import { dateParts, formatLongDate } from "@/lib/format-date"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: "Event not found | AWAJ" }
  return {
    title: `${event.title} | AWAJ`,
    description: event.excerpt,
  }
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const related = await getRelatedEvents(slug, 3)

  return (
    <main className="min-h-svh bg-ivory">
      <Header />

      <article className="mx-auto max-w-[820px] px-5 py-10 lg:py-14">
        <Link
          href="/events"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gold transition-colors hover:text-navy-text"
        >
          <ArrowLeft className="h-4 w-4" />
          All Events
        </Link>

        <h1 className="mt-6 text-balance font-serif text-3xl font-bold leading-tight text-navy-text lg:text-4xl">
          {event.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-text/60">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gold" />
            {formatLongDate(event.eventDate)}
          </span>
          {event.timeLabel && (
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4 text-gold" />
              {event.timeLabel}
            </span>
          )}
          {event.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gold" />
              {event.location}
            </span>
          )}
        </div>

        {event.imageUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl">
            <img src={event.imageUrl || "/placeholder.svg"} alt="" className="w-full object-cover" />
          </div>
        )}

        <p className="mt-8 text-pretty text-lg font-medium leading-relaxed text-navy-text/80">{event.excerpt}</p>

        <RichContent html={event.content} className="mt-6" />
      </article>

      {related.length > 0 && (
        <section className="border-t border-gold/20 bg-white">
          <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10">
            <h2 className="mb-6 font-serif text-xl font-bold uppercase tracking-wide text-navy-text">More Events</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => {
                const d = dateParts(e.eventDate)
                return (
                  <Link
                    key={e.id}
                    href={`/events/${e.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-ivory transition-shadow hover:shadow-md"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={e.imageUrl || "/placeholder.svg?height=400&width=600&query=event"}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                        {d.month} {d.day}, {d.year}
                      </p>
                      <h3 className="mt-2 text-balance font-serif text-base font-bold leading-snug text-navy-text">
                        {e.title}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  )
}
