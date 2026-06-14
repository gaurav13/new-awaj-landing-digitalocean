"use server"

import { db } from "@/lib/db"
import { events } from "@/lib/db/schema"
import { asc, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId, slugify } from "@/lib/admin-helpers"

// ---- Public reads ----

export async function getAllEvents() {
  return db.select().from(events).orderBy(asc(events.eventDate))
}

export async function getUpcomingEvents(limit = 4) {
  return db.select().from(events).orderBy(asc(events.eventDate)).limit(limit)
}

export async function getFeaturedEvent() {
  const rows = await db
    .select()
    .from(events)
    .where(eq(events.isFeatured, true))
    .orderBy(asc(events.eventDate))
    .limit(1)
  return rows[0] ?? null
}

export async function getEventBySlug(slug: string) {
  const rows = await db.select().from(events).where(eq(events.slug, slug)).limit(1)
  return rows[0] ?? null
}

export async function getRelatedEvents(slug: string, limit = 3) {
  return db
    .select()
    .from(events)
    .where(ne(events.slug, slug))
    .orderBy(asc(events.eventDate))
    .limit(limit)
}

// ---- Admin reads/writes ----

export async function getMyEvents() {
  await getUserId()
  return db.select().from(events).orderBy(asc(events.eventDate))
}

type EventInput = {
  title: string
  excerpt: string
  content: string
  eventDate: string
  timeLabel?: string
  location?: string
  imageUrl?: string
  isFeatured?: boolean
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
    slug,
    excerpt: input.excerpt,
    content: input.content,
    eventDate: input.eventDate,
    timeLabel: input.timeLabel || null,
    location: input.location || null,
    imageUrl: input.imageUrl || null,
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
      slug,
      excerpt: input.excerpt,
      content: input.content,
      eventDate: input.eventDate,
      timeLabel: input.timeLabel || null,
      location: input.location || null,
      imageUrl: input.imageUrl || null,
      isFeatured: input.isFeatured ?? false,
    })
    .where(eq(events.id, id))
  revalidatePath("/")
  revalidatePath("/events")
}

export async function deleteEvent(id: number) {
  await getUserId()
  await db.delete(events).where(eq(events.id, id))
  revalidatePath("/")
  revalidatePath("/events")
}
