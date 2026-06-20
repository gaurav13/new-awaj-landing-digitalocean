import "server-only"
import { db } from "@/lib/db"
import { people, eventsPeople, programsPeople, type EventSpeaker } from "@/lib/db/schema"
import { eq, sql } from "drizzle-orm"
import { getUserId } from "@/lib/admin-helpers"

export function normalizeName(name: string) {
  return name.trim().toLowerCase()
}

const ROLE_KEYWORDS: { role: string; re: RegExp }[] = [
  {
    role: "Government",
    re: /(govern|ministr|jetro|meti|embassy|public sector|prefectur|city of|municipal|minister|diplomat|ambassador|senator|parliament|policy)/i,
  },
  { role: "Investor", re: /(invest|capital|ventures?|\bvc\b|\bfund\b|angel|\blp\b|\bgp\b|asset manage)/i },
  { role: "Ecosystem Partner", re: /(partner|ecosystem|alliance|foundation|association|accelerator|incubator)/i },
  { role: "Startup Founder", re: /(founder|co-?founder|\bceo\b|\bcto\b|startup)/i },
  { role: "Advisor", re: /(advisor|advisory|board member)/i },
  { role: "Mentor", re: /mentor/i },
]

/** Infer role types from free-text fields. Always includes "Speaker". */
export function detectRoles(...parts: (string | null | undefined)[]): string[] {
  const text = parts.filter(Boolean).join(" ")
  const roles: string[] = []
  for (const { role, re } of ROLE_KEYWORDS) if (re.test(text)) roles.push(role)
  roles.push("Speaker")
  return Array.from(new Set(roles))
}

/**
 * Global ordering priority for the directory and homepage slider:
 * Team → Government → Ecosystem Partner / Investor → Startup Founder → everyone else.
 */
export function rolePriority(roles: string[]): number {
  if (roles.includes("Team") || roles.includes("Leadership")) return 0
  if (roles.includes("Government")) return 1
  if (roles.includes("Ecosystem Partner") || roles.includes("Investor")) return 2
  if (roles.includes("Startup Founder")) return 3
  return 4
}

/** Renumber every person's sortOrder to follow the role priority (stable within a tier). */
export async function renumberPeopleByPriority() {
  const all = await db.select().from(people)
  const sorted = [...all].sort((a, b) => {
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
}

/**
 * Find a person by (case-insensitive) name, creating one if none exists.
 * Existing people are never overwritten — admin edits in the People area are preserved.
 */
export async function findOrCreatePersonByName(input: {
  fullName: string
  jobTitle?: string | null
  companyName?: string | null
  companyLogo?: string | null
  profilePhoto?: string | null
  linkedinUrl?: string | null
  roleTypes?: string[]
  roleHints?: (string | null | undefined)[]
}): Promise<number> {
  const key = normalizeName(input.fullName)
  const existing = await db
    .select({ id: people.id })
    .from(people)
    .where(sql`lower(${people.fullName}) = ${key}`)
    .limit(1)
  if (existing[0]) return existing[0].id

  const userId = await getUserId()
  const roles =
    input.roleTypes && input.roleTypes.length > 0
      ? input.roleTypes
      : detectRoles(input.jobTitle, ...(input.roleHints ?? []), input.companyName)

  const [row] = await db
    .insert(people)
    .values({
      fullName: input.fullName.trim(),
      profilePhoto: input.profilePhoto || null,
      jobTitle: input.jobTitle || null,
      companyName: input.companyName || null,
      companyLogo: input.companyLogo || null,
      linkedinUrl: input.linkedinUrl || null,
      email: null,
      country: null,
      bio: null,
      roleTypes: roles,
      tags: [],
      featured: false,
      status: "published",
      sortOrder: 0,
      showOnHomepage: false,
      showCompanyLogo: Boolean(input.companyLogo),
      showLinkedin: Boolean(input.linkedinUrl),
      showRoleBadge: true,
      authorId: userId,
    })
    .returning({ id: people.id })
  return row.id
}

/**
 * Rebuild an event's people connections from its free-text speakers plus any explicitly
 * picked people. Each speaker is upserted into the central People table so it shows up in
 * the People admin and on /team, and the event keeps a junction (with the event-specific badge).
 */
export async function syncEventSpeakerPeople(
  eventId: number,
  speakers: EventSpeaker[],
  extraPeopleIds: number[] = [],
) {
  const ordered: { personId: number; roleAtEvent: string | null }[] = []
  for (const s of speakers) {
    if (!s.name?.trim()) continue
    const personId = await findOrCreatePersonByName({
      fullName: s.name,
      jobTitle: s.role,
      companyName: s.company,
      companyLogo: s.companyLogoUrl,
      profilePhoto: s.imageUrl,
      linkedinUrl: s.linkUrl,
      roleHints: [s.role, s.badge, s.company],
    })
    if (!ordered.some((o) => o.personId === personId)) {
      ordered.push({ personId, roleAtEvent: s.badge || s.role || null })
    }
  }
  for (const pid of extraPeopleIds.map(Number).filter((n) => Number.isFinite(n))) {
    if (!ordered.some((o) => o.personId === pid)) ordered.push({ personId: pid, roleAtEvent: null })
  }

  await db.delete(eventsPeople).where(eq(eventsPeople.eventId, eventId))
  if (ordered.length > 0) {
    await db
      .insert(eventsPeople)
      .values(ordered.map((o, i) => ({ eventId, personId: o.personId, roleAtEvent: o.roleAtEvent, sortOrder: i })))
  }
  await renumberPeopleByPriority()
}

/** Rebuild a program's people connections from the picker, then reorder the directory. */
export async function syncProgramPeopleConnections(programId: number, peopleIds: number[] = []) {
  await db.delete(programsPeople).where(eq(programsPeople.programId, programId))
  const ids = peopleIds.map(Number).filter((n) => Number.isFinite(n))
  if (ids.length > 0) {
    await db.insert(programsPeople).values(ids.map((personId, i) => ({ programId, personId, sortOrder: i })))
  }
  await renumberPeopleByPriority()
}
