"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { people, eventsPeople, programsPeople, events, programs, teamMembers } from "@/lib/db/schema"
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
export type DirectoryPerson = {
  id: string
  fullName: string
  profilePhoto: string | null
  jobTitle: string | null
  companyName: string | null
  companyLogo: string | null
  linkedinUrl: string | null
  showLinkedin: boolean
  showCompanyLogo: boolean
  roleTypes: string[]
  featured: boolean
  sortOrder: number
  events: PersonConnection[]
  programs: PersonConnection[]
}

function normalizeName(name: string) {
  return name.trim().toLowerCase()
}

function pushUnique(list: PersonConnection[], conn: PersonConnection) {
  if (!list.some((c) => c.id === conn.id)) list.push(conn)
}

/**
 * Unified people directory. Aggregates every "person" surface across the site:
 *  - the central `people` table (with their connected events/programs)
 *  - the legacy `team_members` table
 *  - free-text event `speakers` (so every event speaker is connected here too)
 * Entries are deduplicated by name and merged so each person shows all of their connections.
 */
export async function getPeopleDirectory(): Promise<DirectoryPerson[]> {
  return withDb(async () => {
    const [peopleRows, teamRows, eventRows] = await Promise.all([
      db
        .select()
        .from(people)
        .where(eq(people.status, "published"))
        .orderBy(desc(people.featured), asc(people.sortOrder), asc(people.id)),
      db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id)),
      db.select().from(events).orderBy(asc(events.eventDate)),
    ])

    const byName = new Map<string, DirectoryPerson>()
    const byPersonId = new Map<number, DirectoryPerson>()

    // 1) Central people table
    for (const p of peopleRows) {
      const entry: DirectoryPerson = {
        id: `person-${p.id}`,
        fullName: p.fullName,
        profilePhoto: p.profilePhoto,
        jobTitle: p.jobTitle,
        companyName: p.companyName,
        companyLogo: p.companyLogo,
        linkedinUrl: p.linkedinUrl,
        showLinkedin: p.showLinkedin,
        showCompanyLogo: p.showCompanyLogo,
        roleTypes: [...(p.roleTypes ?? [])],
        featured: p.featured,
        sortOrder: p.sortOrder,
        events: [],
        programs: [],
      }
      byName.set(normalizeName(p.fullName), entry)
      byPersonId.set(p.id, entry)
    }

    // Connected events/programs (junction tables) → attach to people-table entries
    const ids = peopleRows.map((r) => r.id)
    if (ids.length > 0) {
      const [eventLinks, programLinks] = await Promise.all([
        db
          .select({ personId: eventsPeople.personId, id: events.id, title: events.title, slug: events.slug })
          .from(eventsPeople)
          .innerJoin(events, eq(events.id, eventsPeople.eventId))
          .where(inArray(eventsPeople.personId, ids))
          .orderBy(asc(eventsPeople.sortOrder)),
        db
          .select({ personId: programsPeople.personId, id: programs.id, title: programs.title, slug: programs.slug })
          .from(programsPeople)
          .innerJoin(programs, eq(programs.id, programsPeople.programId))
          .where(inArray(programsPeople.personId, ids))
          .orderBy(asc(programsPeople.sortOrder)),
      ])
      for (const l of eventLinks) {
        const entry = byPersonId.get(l.personId)
        if (entry) pushUnique(entry.events, { id: l.id, title: l.title, slug: l.slug })
      }
      for (const l of programLinks) {
        const entry = byPersonId.get(l.personId)
        if (entry) pushUnique(entry.programs, { id: l.id, title: l.title, slug: l.slug })
      }
    }

    // 2) Legacy team members
    let order = peopleRows.length
    for (const t of teamRows) {
      const key = normalizeName(t.name)
      if (byName.has(key)) continue
      byName.set(key, {
        id: `team-${t.id}`,
        fullName: t.name,
        profilePhoto: t.imageUrl,
        jobTitle: t.role,
        companyName: t.company,
        companyLogo: null,
        linkedinUrl: t.linkedinUrl,
        showLinkedin: true,
        showCompanyLogo: false,
        roleTypes: ["Team"],
        featured: false,
        sortOrder: order++,
        events: [],
        programs: [],
      })
    }

    // 3) Free-text event speakers → merge into matching person or create a new entry
    for (const e of eventRows) {
      for (const s of e.speakers ?? []) {
        if (!s.name?.trim()) continue
        const key = normalizeName(s.name)
        let entry = byName.get(key)
        if (!entry) {
          entry = {
            id: `speaker-${e.id}-${key}`,
            fullName: s.name.trim(),
            profilePhoto: s.imageUrl ?? null,
            jobTitle: s.role ?? null,
            companyName: s.company ?? null,
            companyLogo: s.companyLogoUrl ?? null,
            linkedinUrl: s.linkUrl ?? null,
            showLinkedin: Boolean(s.linkUrl),
            showCompanyLogo: Boolean(s.companyLogoUrl),
            roleTypes: ["Speaker"],
            featured: false,
            sortOrder: order++,
            events: [],
            programs: [],
          }
          byName.set(key, entry)
        } else {
          // fill in any gaps from the speaker record
          if (!entry.profilePhoto && s.imageUrl) entry.profilePhoto = s.imageUrl
          if (!entry.jobTitle && s.role) entry.jobTitle = s.role
          if (!entry.companyName && s.company) entry.companyName = s.company
          if (!entry.companyLogo && s.companyLogoUrl) {
            entry.companyLogo = s.companyLogoUrl
            entry.showCompanyLogo = true
          }
          if (!entry.roleTypes.includes("Speaker")) entry.roleTypes.push("Speaker")
        }
        pushUnique(entry.events, { id: e.id, title: e.title, slug: e.slug })
      }
    }

    return Array.from(byName.values()).sort((a, b) => {
      if (a.featured !== b.featured) return a.featured ? -1 : 1
      return a.sortOrder - b.sortOrder
    })
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

// ---- Import & ordering ----

const ROLE_KEYWORDS: { role: string; re: RegExp }[] = [
  {
    role: "Government",
    re: /(govern|ministr|jetro|meti|embassy|public sector|prefectur|city of|municipal|minister|diplomat|ambassador|senator|parliament)/i,
  },
  { role: "Investor", re: /(invest|capital|ventures?|\bvc\b|\bfund\b|angel|\blp\b|\bgp\b)/i },
  { role: "Startup Founder", re: /(founder|co-?founder|\bceo\b|\bcto\b|startup)/i },
  { role: "Advisor", re: /(advisor|advisory|board member)/i },
  { role: "Mentor", re: /mentor/i },
]

function detectRoles(...parts: (string | null | undefined)[]): string[] {
  const text = parts.filter(Boolean).join(" ")
  const roles: string[] = []
  for (const { role, re } of ROLE_KEYWORDS) if (re.test(text)) roles.push(role)
  roles.push("Speaker")
  return Array.from(new Set(roles))
}

// Ordering priority: team first, then government, then everyone else.
function rolePriority(roles: string[]): number {
  if (roles.includes("Team") || roles.includes("Leadership")) return 0
  if (roles.includes("Government")) return 1
  return 2
}

/**
 * One-time (idempotent) import that pulls every legacy "person" surface into the central
 * `people` table: team members and free-text event speakers. People are deduplicated by
 * name, event connections are created in the junction table, and the whole table is
 * renumbered so the default order is Team → Government → everyone else.
 */
export async function importPeopleFromSources() {
  const userId = await getUserId()
  const [existing, teamRows, eventRows] = await Promise.all([
    db.select().from(people),
    db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id)),
    db.select().from(events).orderBy(asc(events.eventDate)),
  ])

  const byName = new Map<string, { id: number }>()
  for (const p of existing) byName.set(normalizeName(p.fullName), { id: p.id })

  let imported = 0

  // 1) Team members → people (roleType "Team")
  for (const t of teamRows) {
    const key = normalizeName(t.name)
    if (byName.has(key)) continue
    const [row] = await db
      .insert(people)
      .values({
        fullName: t.name,
        profilePhoto: t.imageUrl || null,
        jobTitle: t.role || null,
        companyName: t.company || null,
        companyLogo: null,
        linkedinUrl: t.linkedinUrl || null,
        email: null,
        country: null,
        bio: t.bio || null,
        roleTypes: ["Team"],
        tags: [],
        featured: false,
        status: "published",
        sortOrder: 0,
        showOnHomepage: false,
        showCompanyLogo: false,
        showLinkedin: true,
        showRoleBadge: true,
        authorId: userId,
      })
      .returning({ id: people.id })
    byName.set(key, { id: row.id })
    imported++
  }

  // 2) Free-text event speakers → people + event connection (deduped by name)
  for (const e of eventRows) {
    for (const s of e.speakers ?? []) {
      if (!s.name?.trim()) continue
      const key = normalizeName(s.name)
      let person = byName.get(key)
      if (!person) {
        const [row] = await db
          .insert(people)
          .values({
            fullName: s.name.trim(),
            profilePhoto: s.imageUrl || null,
            jobTitle: s.role || null,
            companyName: s.company || null,
            companyLogo: s.companyLogoUrl || null,
            linkedinUrl: s.linkUrl || null,
            email: null,
            country: null,
            bio: null,
            roleTypes: detectRoles(s.role, s.badge, s.company),
            tags: [],
            featured: false,
            status: "published",
            sortOrder: 0,
            showOnHomepage: false,
            showCompanyLogo: Boolean(s.companyLogoUrl),
            showLinkedin: Boolean(s.linkUrl),
            showRoleBadge: true,
            authorId: userId,
          })
          .returning({ id: people.id })
        person = { id: row.id }
        byName.set(key, person)
        imported++
      }
      // ensure a single junction per (event, person)
      const link = await db
        .select({ id: eventsPeople.id })
        .from(eventsPeople)
        .where(and(eq(eventsPeople.eventId, e.id), eq(eventsPeople.personId, person.id)))
      if (link.length === 0) {
        await db.insert(eventsPeople).values({
          eventId: e.id,
          personId: person.id,
          roleAtEvent: s.role || s.badge || null,
          sortOrder: 0,
        })
      }
    }
  }

  // 3) Renumber sortOrder globally: Team → Government → rest (preserving existing order within groups)
  const all = await db.select().from(people)
  const sorted = all.sort((a, b) => {
    const pa = rolePriority(a.roleTypes ?? [])
    const pb = rolePriority(b.roleTypes ?? [])
    if (pa !== pb) return pa - pb
    if (a.featured !== b.featured) return a.featured ? -1 : 1
    if (a.sortOrder !== b.sortOrder) return a.sortOrder - b.sortOrder
    return a.id - b.id
  })
  for (let i = 0; i < sorted.length; i++) {
    if (sorted[i].sortOrder !== i) {
      await db.update(people).set({ sortOrder: i }).where(eq(people.id, sorted[i].id))
    }
  }

  revalidatePath("/")
  revalidatePath("/team")
  return { imported, total: sorted.length }
}

/** Move a person up or down one position in the global ordering. */
export async function reorderPerson(id: number, direction: "up" | "down") {
  await getUserId()
  const all = await db.select().from(people).orderBy(asc(people.sortOrder), asc(people.id))
  const idx = all.findIndex((p) => p.id === id)
  if (idx === -1) return
  const swapIdx = direction === "up" ? idx - 1 : idx + 1
  if (swapIdx < 0 || swapIdx >= all.length) return
  ;[all[idx], all[swapIdx]] = [all[swapIdx], all[idx]]
  for (let i = 0; i < all.length; i++) {
    if (all[i].sortOrder !== i) {
      await db.update(people).set({ sortOrder: i }).where(eq(people.id, all[i].id))
    }
  }
  revalidatePath("/")
  revalidatePath("/team")
}

// ---- Admin reads ----

export async function getMyPeople(): Promise<Person[]> {
  await getUserId()
  return db.select().from(people).orderBy(asc(people.sortOrder), asc(people.id))
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
