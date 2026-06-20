"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { people, eventsPeople, programsPeople, events, programs } from "@/lib/db/schema"
import { and, asc, desc, eq, inArray, sql } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"

export type Person = typeof people.$inferSelect

export type PersonInput = {
  fullName: string
  profilePhoto?: string
  jobTitle?: string
  companyName?: string
  companyLogo?: string
  linkedinUrl?: string
  email?: string
  country?: string
  bio?: string
  roleTypes?: string[]
  tags?: string[]
  featured?: boolean
  status?: string
  sortOrder?: number
  showOnHomepage?: boolean
  showCompanyLogo?: boolean
  showLinkedin?: boolean
  showRoleBadge?: boolean
}

// ---- Public reads ----

export async function getHomepageLeaders(limit = 12): Promise<Person[]> {
  return withDb(
    () =>
      db
        .select()
        .from(people)
        .where(and(eq(people.showOnHomepage, true), eq(people.status, "published")))
        .orderBy(desc(people.featured), asc(people.sortOrder), asc(people.id))
        .limit(limit),
    [],
  )
}

export async function getPublishedPeople(): Promise<Person[]> {
  return withDb(
    () =>
      db
        .select()
        .from(people)
        .where(eq(people.status, "published"))
        .orderBy(desc(people.featured), asc(people.sortOrder), asc(people.id)),
    [],
  )
}

export type PersonConnection = { id: number; title: string; slug: string }
export type DirectoryPerson = Person & {
  events: PersonConnection[]
  programs: PersonConnection[]
}

export async function getPeopleDirectory(): Promise<DirectoryPerson[]> {
  return withDb(async () => {
    const rows = await db
      .select()
      .from(people)
      .where(eq(people.status, "published"))
      .orderBy(desc(people.featured), asc(people.sortOrder), asc(people.id))
    if (rows.length === 0) return []
    const ids = rows.map((r) => r.id)

    const eventLinks = await db
      .select({
        personId: eventsPeople.personId,
        id: events.id,
        title: events.title,
        slug: events.slug,
        sortOrder: eventsPeople.sortOrder,
      })
      .from(eventsPeople)
      .innerJoin(events, eq(events.id, eventsPeople.eventId))
      .where(inArray(eventsPeople.personId, ids))
      .orderBy(asc(eventsPeople.sortOrder))

    const programLinks = await db
      .select({
        personId: programsPeople.personId,
        id: programs.id,
        title: programs.title,
        slug: programs.slug,
        sortOrder: programsPeople.sortOrder,
      })
      .from(programsPeople)
      .innerJoin(programs, eq(programs.id, programsPeople.programId))
      .where(inArray(programsPeople.personId, ids))
      .orderBy(asc(programsPeople.sortOrder))

    const eventsByPerson = new Map<number, PersonConnection[]>()
    for (const l of eventLinks) {
      const arr = eventsByPerson.get(l.personId) ?? []
      arr.push({ id: l.id, title: l.title, slug: l.slug })
      eventsByPerson.set(l.personId, arr)
    }
    const programsByPerson = new Map<number, PersonConnection[]>()
    for (const l of programLinks) {
      const arr = programsByPerson.get(l.personId) ?? []
      arr.push({ id: l.id, title: l.title, slug: l.slug })
      programsByPerson.set(l.personId, arr)
    }

    return rows.map((r) => ({
      ...r,
      events: eventsByPerson.get(r.id) ?? [],
      programs: programsByPerson.get(r.id) ?? [],
    }))
  }, [])
}

export async function getPeopleForEvent(eventId: number): Promise<Person[]> {
  return withDb(async () => {
    const links = await db
      .select()
      .from(eventsPeople)
      .where(eq(eventsPeople.eventId, eventId))
      .orderBy(asc(eventsPeople.sortOrder))
    const ids = links.map((l) => l.personId)
    if (ids.length === 0) return []
    const rows = await db
      .select()
      .from(people)
      .where(and(inArray(people.id, ids), eq(people.status, "published")))
    const order = new Map(ids.map((id, i) => [id, i]))
    return rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
  }, [])
}

export async function getPeopleForProgram(programId: number): Promise<Person[]> {
  return withDb(async () => {
    const links = await db
      .select()
      .from(programsPeople)
      .where(eq(programsPeople.programId, programId))
      .orderBy(asc(programsPeople.sortOrder))
    const ids = links.map((l) => l.personId)
    if (ids.length === 0) return []
    const rows = await db
      .select()
      .from(people)
      .where(and(inArray(people.id, ids), eq(people.status, "published")))
    const order = new Map(ids.map((id, i) => [id, i]))
    return rows.sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0))
  }, [])
}

// ---- Admin reads ----

export async function getMyPeople(): Promise<Person[]> {
  await getUserId()
  return db.select().from(people).orderBy(asc(people.sortOrder), desc(people.id))
}

export async function getPeopleCounts() {
  await getUserId()
  return withDb(
    async () => {
      const rows = await db.select().from(people)
      const counts = { total: rows.length, published: 0, draft: 0, homepage: 0 }
      const byRole: Record<string, number> = {}
      for (const r of rows) {
        if (r.status === "published") counts.published++
        else counts.draft++
        if (r.showOnHomepage) counts.homepage++
        for (const role of r.roleTypes ?? []) byRole[role] = (byRole[role] ?? 0) + 1
      }
      return { counts, byRole }
    },
    { counts: { total: 0, published: 0, draft: 0, homepage: 0 }, byRole: {} as Record<string, number> },
  )
}

// ---- Admin writes ----

function normalize(input: PersonInput) {
  return {
    fullName: input.fullName,
    profilePhoto: input.profilePhoto || null,
    jobTitle: input.jobTitle || null,
    companyName: input.companyName || null,
    companyLogo: input.companyLogo || null,
    linkedinUrl: input.linkedinUrl || null,
    email: input.email || null,
    country: input.country || null,
    bio: input.bio || null,
    roleTypes: input.roleTypes ?? [],
    tags: input.tags ?? [],
    featured: input.featured ?? false,
    status: input.status || "published",
    sortOrder: input.sortOrder ?? 0,
    showOnHomepage: input.showOnHomepage ?? false,
    showCompanyLogo: input.showCompanyLogo ?? true,
    showLinkedin: input.showLinkedin ?? true,
    showRoleBadge: input.showRoleBadge ?? false,
  }
}

export async function createPerson(input: PersonInput) {
  const userId = await getUserId()
  await db.insert(people).values({ ...normalize(input), authorId: userId })
  revalidatePath("/")
  revalidatePath("/team")
}

export async function updatePerson(id: number, input: PersonInput) {
  await getUserId()
  await db
    .update(people)
    .set({ ...normalize(input), updatedAt: new Date() })
    .where(eq(people.id, id))
  revalidatePath("/")
  revalidatePath("/team")
}

export async function deletePerson(id: number) {
  await getUserId()
  await db.delete(people).where(eq(people.id, id))
  await db.delete(eventsPeople).where(eq(eventsPeople.personId, id))
  await db.delete(programsPeople).where(eq(programsPeople.personId, id))
  revalidatePath("/")
  revalidatePath("/team")
}

// ---- Connections: events ----

export type ConnectedPerson = Person & { roleAtContext: string | null }

export async function getEventPeople(eventId: number): Promise<ConnectedPerson[]> {
  return withDb(async () => {
    const rows = await db
      .select({ person: people, link: eventsPeople })
      .from(eventsPeople)
      .innerJoin(people, eq(people.id, eventsPeople.personId))
      .where(and(eq(eventsPeople.eventId, eventId), eq(people.status, "published")))
      .orderBy(asc(eventsPeople.sortOrder), asc(eventsPeople.id))
    return rows.map((r) => ({ ...r.person, roleAtContext: r.link.roleAtEvent }))
  }, [])
}

export async function setEventPeople(eventId: number, personIds: number[]) {
  await getUserId()
  await db.delete(eventsPeople).where(eq(eventsPeople.eventId, eventId))
  if (personIds.length > 0) {
    await db.insert(eventsPeople).values(
      personIds.map((personId, i) => ({ eventId, personId, sortOrder: i })),
    )
  }
  revalidatePath("/")
}

// ---- Connections: programs ----

export async function getProgramPeople(programId: number): Promise<ConnectedPerson[]> {
  return withDb(async () => {
    const rows = await db
      .select({ person: people, link: programsPeople })
      .from(programsPeople)
      .innerJoin(people, eq(people.id, programsPeople.personId))
      .where(and(eq(programsPeople.programId, programId), eq(people.status, "published")))
      .orderBy(asc(programsPeople.sortOrder), asc(programsPeople.id))
    return rows.map((r) => ({ ...r.person, roleAtContext: r.link.roleAtProgram }))
  }, [])
}

export async function setProgramPeople(programId: number, personIds: number[]) {
  await getUserId()
  await db.delete(programsPeople).where(eq(programsPeople.programId, programId))
  if (personIds.length > 0) {
    await db.insert(programsPeople).values(
      personIds.map((personId, i) => ({ programId, personId, sortOrder: i })),
    )
  }
  revalidatePath("/")
}

// Map of personId -> connection counts (for admin display)
export async function getPersonConnectionCounts(personIds: number[]) {
  await getUserId()
  if (personIds.length === 0) return {} as Record<number, { events: number; programs: number }>
  return withDb(async () => {
    const ev = await db
      .select({ personId: eventsPeople.personId, c: sql<number>`count(*)::int` })
      .from(eventsPeople)
      .where(inArray(eventsPeople.personId, personIds))
      .groupBy(eventsPeople.personId)
    const pr = await db
      .select({ personId: programsPeople.personId, c: sql<number>`count(*)::int` })
      .from(programsPeople)
      .where(inArray(programsPeople.personId, personIds))
      .groupBy(programsPeople.personId)
    const out: Record<number, { events: number; programs: number }> = {}
    for (const id of personIds) out[id] = { events: 0, programs: 0 }
    for (const r of ev) out[r.personId].events = r.c
    for (const r of pr) out[r.personId].programs = r.c
    return out
  }, {} as Record<number, { events: number; programs: number }>)
}
