import Link from "next/link"
import { notFound } from "next/navigation"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { EventDetail } from "@/components/awaj/event-detail"
import { getEventBySlug, getRelatedEvents } from "@/app/actions/events"
import { getEventPeople } from "@/app/actions/people"
import { dateParts } from "@/lib/format-date"
import { buildPageMetadata, getEventSchema, getBreadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { resolveEventCardImage, resolveEventPosterImage } from "@/lib/images"
import { AdSlot } from "@/components/ads/ad-slot"
import { PageAds } from "@/components/ads/page-ads"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) return { title: "Event not found | AWAJ" }
  return buildPageMetadata({
    path: `/events/${slug}`,
    title: event.title,
    description: event.excerpt,
    image: resolveEventPosterImage({ slug, imageUrl: event.imageUrl, bannerUrl: event.bannerUrl }),
    type: "article",
  })
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params
  const event = await getEventBySlug(slug)
  if (!event) notFound()

  const related = await getRelatedEvents(slug, 3)

  // Render the speakers section from the connected People records (single source of truth),
  // so any edit made in the People admin is reflected here. Falls back to the event's own
  // free-text speakers for events that haven't been re-saved/synced yet.
  const connected = await getEventPeople(event.id)
  const connectedSpeakers = connected.map((p) => ({
    name: p.fullName,
    badge: p.roleAtContext || undefined,
    role: p.jobTitle || undefined,
    company: p.companyName || undefined,
    companyLogoUrl: p.showCompanyLogo && p.companyLogo ? p.companyLogo : undefined,
    imageUrl: p.profilePhoto || undefined,
    linkUrl: p.showLinkedin && p.linkedinUrl ? p.linkedinUrl : undefined,
  }))
  const eventForDetail = {
    ...event,
    speakers: connectedSpeakers.length > 0 ? connectedSpeakers : event.speakers,
  }

  const [eventSchema, breadcrumbSchema] = await Promise.all([
    getEventSchema({
      path: `/events/${slug}`,
      title: event.title,
      description: event.excerpt,
      image: resolveEventPosterImage({ slug, imageUrl: event.imageUrl, bannerUrl: event.bannerUrl }),
      startDate: event.eventDate,
      location: event.location,
    }),
    getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Events", path: "/events" },
      { name: event.title, path: `/events/${slug}` },
    ]),
  ])

  return (
    <main className="min-h-svh bg-ivory">
      <JsonLd data={[eventSchema, breadcrumbSchema]} />
      <SiteHeader />

      <EventDetail event={eventForDetail} />

      <AdSlot page="events" placement="in-content" className="mx-auto max-w-[1280px] px-5 py-8 lg:px-10" />

      {related.length > 0 && (
        <section className="border-t border-gold/20 bg-white">
          <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10">
            <h2 className="mb-6 font-serif text-xl font-bold uppercase tracking-wide text-navy-text">More Events</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => {
                const d = dateParts(e.eventDate)
                const cover = resolveEventCardImage(e)
                return (
                  <Link
                    key={e.id}
                    href={`/events/${e.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-ivory transition-shadow hover:shadow-md"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-beige">
                      <img
                        src={cover}
                        alt=""
                        className="absolute inset-0 h-full w-full object-contain transition-transform duration-500 group-hover:scale-105"
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
      <PageAds page="events" />
    </main>
  )
}
