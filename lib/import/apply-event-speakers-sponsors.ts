import { db } from "@/lib/db"
import { events, type EventSpeaker, type EventSponsor } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { syncEventSpeakerPeople } from "@/lib/people-sync"
import { importEventSponsors, syncEventOrganizationConnections } from "@/lib/organizations-sync"

function cleanSponsors(items: EventSponsor[]): EventSponsor[] {
  return items
    .filter((s) => s?.name?.trim())
    .map((s) => ({
      name: s.name.trim(),
      logoUrl: s.logoUrl || undefined,
      linkUrl: s.linkUrl || undefined,
      tier: s.tier?.trim() || undefined,
    }))
}

function cleanSpeakers(items: EventSpeaker[]): EventSpeaker[] {
  return items
    .filter((s) => s?.name?.trim())
    .map((s) => ({
      name: s.name.trim(),
      badge: s.badge?.trim() || undefined,
      role: s.role || undefined,
      company: s.company || undefined,
      companyLogoUrl: s.companyLogoUrl || undefined,
      imageUrl: s.imageUrl || undefined,
      linkUrl: s.linkUrl || undefined,
    }))
}

export type ApplyEventImportResult = {
  eventId: number
  slug: string
  title: string
  speakerCount: number
  sponsorCount: number
}

/**
 * Updates speakers + sponsors JSONB on one event and runs the same People / Organizations
 * sync used by updateEvent(). Preserves all other event fields.
 */
export async function applyEventSpeakersAndSponsors(
  slug: string,
  speakers: EventSpeaker[],
  sponsors: EventSponsor[],
  authorId: string,
): Promise<ApplyEventImportResult> {
  const rows = await db.select().from(events).where(eq(events.slug, slug)).limit(1)
  const event = rows[0]
  if (!event) {
    throw new Error(`Event not found for slug "${slug}". Create the event in admin first.`)
  }

  const cleanedSpeakers = cleanSpeakers(speakers)
  const cleanedSponsors = cleanSponsors(sponsors)

  await db
    .update(events)
    .set({
      speakers: cleanedSpeakers,
      sponsors: cleanedSponsors,
    })
    .where(eq(events.id, event.id))

  await syncEventSpeakerPeople(event.id, cleanedSpeakers, [], authorId)
  const sponsorOrgIds = await importEventSponsors(cleanedSponsors, authorId)
  await syncEventOrganizationConnections(event.id, sponsorOrgIds)

  try {
    revalidatePath("/")
    revalidatePath("/events")
    revalidatePath(`/events/${event.slug}`)
    revalidatePath("/team")
    revalidatePath("/members")
  } catch {
    // No-op when run outside a Next.js request (e.g. standalone tsx import script).
  }

  return {
    eventId: event.id,
    slug: event.slug,
    title: event.title,
    speakerCount: cleanedSpeakers.length,
    sponsorCount: cleanedSponsors.length,
  }
}
