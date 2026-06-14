import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { EventDetail } from "@/components/awaj/event-detail"
import { getEventBySlug, getRelatedEvents } from "@/app/actions/events"
import { dateParts } from "@/lib/format-date"

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
      <SiteHeader />

      <EventDetail event={event} />

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

      <SiteFooter />
    </main>
  )
}
