"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import {
  events,
  type EventSponsor,
  type EventSpeaker,
  type EventHighlight,
  type EventAgendaItem,
} from "@/lib/db/schema"
import { asc, eq, ne, gte } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId, slugify } from "@/lib/admin-helpers"

// ---- Public reads ----

export async function getAllEvents() {
  return withDb(() => db.select().from(events).orderBy(asc(events.eventDate)), [])
}

export async function getUpcomingEvents(limit = 4) {
  // Only events happening today or in the future, soonest first.
  const today = new Date().toISOString().slice(0, 10)
  return withDb(
    () =>
      db
        .select()
        .from(events)
        .where(gte(events.eventDate, today))
        .orderBy(asc(events.eventDate))
        .limit(limit),
    [],
  )
}

export async function getFeaturedEvent() {
  return withDb(async () => {
    const rows = await db
      .select()
      .from(events)
      .where(eq(events.isFeatured, true))
      .orderBy(asc(events.eventDate))
      .limit(1)
    return rows[0] ?? null
  }, null)
}

export async function getEventBySlug(slug: string) {
  return withDb(async () => {
    const rows = await db.select().from(events).where(eq(events.slug, slug)).limit(1)
    return rows[0] ?? null
  }, null)
}

export async function getRelatedEvents(slug: string, limit = 3) {
  return withDb(
    () => db.select().from(events).where(ne(events.slug, slug)).orderBy(asc(events.eventDate)).limit(limit),
    [],
  )
}

// ---- Admin reads/writes ----

export async function getMyEvents() {
  await getUserId()
  return db.select().from(events).orderBy(asc(events.eventDate))
}

type EventInput = {
  title: string
  subtitle?: string
  excerpt: string
  content: string
  eventDate: string
  timeLabel?: string
  location?: string
  venue?: string
  imageUrl?: string
  bannerUrl?: string
  joinUrl?: string
  joinLabel?: string
  secondaryUrl?: string
  secondaryLabel?: string
  highlights?: EventHighlight[]
  agenda?: EventAgendaItem[]
  sponsors?: EventSponsor[]
  speakers?: EventSpeaker[]
  isFeatured?: boolean
}

function cleanSponsors(items?: EventSponsor[]): EventSponsor[] {
  if (!Array.isArray(items)) return []
  return items
    .filter((s) => s && s.name?.trim())
    .map((s) => ({
      name: s.name.trim(),
      logoUrl: s.logoUrl || undefined,
      linkUrl: s.linkUrl || undefined,
      tier: s.tier?.trim() || undefined,
    }))
}

function cleanSpeakers(items?: EventSpeaker[]): EventSpeaker[] {
  if (!Array.isArray(items)) return []
  return items
    .filter((s) => s && s.name?.trim())
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

function cleanHighlights(items?: EventHighlight[]): EventHighlight[] {
  if (!Array.isArray(items)) return []
  return items
    .filter((h) => h && h.title?.trim())
    .map((h) => ({ title: h.title.trim(), description: h.description?.trim() || undefined }))
}

function cleanAgenda(items?: EventAgendaItem[]): EventAgendaItem[] {
  if (!Array.isArray(items)) return []
  return items
    .filter((a) => a && a.title?.trim())
    .map((a) => ({
      time: a.time?.trim() || undefined,
      title: a.title.trim(),
      description: a.description?.trim() || undefined,
    }))
}

async function uniqueSlug(base: string, excludeId?: number) {
  let slug = base || "event"
  let n = 1
  while (true) {
    const rows = await db
      .select({ id: events.id })
      .from(events)
      .where(eq(events.slug, slug))
      .limit(1)
    const conflict = rows[0]
    if (!conflict || conflict.id === excludeId) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

export async function createEvent(input: EventInput) {
  const userId = await getUserId()
  const slug = await uniqueSlug(slugify(input.title))
  await db.insert(events).values({
    title: input.title,
    subtitle: input.subtitle || null,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    eventDate: input.eventDate,
    timeLabel: input.timeLabel || null,
    location: input.location || null,
    venue: input.venue || null,
    imageUrl: input.imageUrl || null,
    bannerUrl: input.bannerUrl || null,
    joinUrl: input.joinUrl || null,
    joinLabel: input.joinLabel || null,
    secondaryUrl: input.secondaryUrl || null,
    secondaryLabel: input.secondaryLabel || null,
    highlights: cleanHighlights(input.highlights),
    agenda: cleanAgenda(input.agenda),
    sponsors: cleanSponsors(input.sponsors),
    speakers: cleanSpeakers(input.speakers),
    isFeatured: input.isFeatured ?? false,
    authorId: userId,
  })
  revalidatePath("/")
  revalidatePath("/events")
}

export async function updateEvent(id: number, input: EventInput) {
  await getUserId()
  const slug = await uniqueSlug(slugify(input.title), id)
  await db
    .update(events)
    .set({
      title: input.title,
      subtitle: input.subtitle || null,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      eventDate: input.eventDate,
      timeLabel: input.timeLabel || null,
      location: input.location || null,
      venue: input.venue || null,
      imageUrl: input.imageUrl || null,
      bannerUrl: input.bannerUrl || null,
      joinUrl: input.joinUrl || null,
      joinLabel: input.joinLabel || null,
      secondaryUrl: input.secondaryUrl || null,
      secondaryLabel: input.secondaryLabel || null,
      highlights: cleanHighlights(input.highlights),
      agenda: cleanAgenda(input.agenda),
      sponsors: cleanSponsors(input.sponsors),
      speakers: cleanSpeakers(input.speakers),
      isFeatured: input.isFeatured ?? false,
    })
    .where(eq(events.id, id))
  revalidatePath("/")
  revalidatePath("/events")
  revalidatePath(`/events/${slug}`)
}

export async function deleteEvent(id: number) {
  await getUserId()
  await db.delete(events).where(eq(events.id, id))
  revalidatePath("/")
  revalidatePath("/events")
}
