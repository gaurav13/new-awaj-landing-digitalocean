import "server-only"
import { db } from "@/lib/db"
import { members, partners, events, programs } from "@/lib/db/schema"
import {
  findOrCreateOrganizationByName,
  importEventSponsors,
  importProgramPartners,
  importProgramStartups,
  syncEventOrganizationConnections,
  syncProgramOrganizationConnections,
} from "@/lib/organizations-sync"

/** Map a member's category to a central organization type. */
function memberTypeFromCategory(category: string): string {
  const c = (category || "").toLowerCase()
  if (c.includes("startup")) return "Startup"
  if (c.includes("vc") || c.includes("invest")) return "VC"
  if (c.includes("govern")) return "Government"
  if (c.includes("media")) return "Media"
  if (c.includes("partner")) return "Partner"
  return "Member"
}

/**
 * One-time import: pull every existing Member, Partner, event Sponsor, and program
 * Partner/Startup into the central Organizations directory (de-duplicated by name), then
 * rebuild the event/program organization connections so everything stays linked.
 */
export async function importExistingOrganizations(): Promise<{ imported: number; linked: number }> {
  let imported = 0
  let linked = 0
  const countNew = async (fn: () => Promise<{ duplicate: boolean }>) => {
    const r = await fn()
    if (!r.duplicate) imported++
  }

  // 1. Members
  const memberRows = await db.select().from(members)
  for (const m of memberRows) {
    await countNew(() =>
      findOrCreateOrganizationByName({
        name: m.companyName,
        type: memberTypeFromCategory(m.category),
        logoUrl: m.logoUrl,
        websiteUrl: m.websiteUrl,
        description: m.description,
        status: "approved",
      }),
    )
  }

  // 2. Partners
  const partnerRows = await db.select().from(partners)
  for (const p of partnerRows) {
    await countNew(() =>
      findOrCreateOrganizationByName({
        name: p.name,
        type: "Partner",
        logoUrl: p.logoUrl,
        websiteUrl: p.linkUrl,
        status: "approved",
      }),
    )
  }

  // 3. Event sponsors -> import + connect to each event
  const eventRows = await db.select().from(events)
  for (const e of eventRows) {
    const ids = await importEventSponsors(e.sponsors ?? [])
    if (ids.length > 0) {
      await syncEventOrganizationConnections(e.id, ids)
      linked += ids.length
    }
  }

  // 4. Program partners + startups -> import + connect to each program
  const programRows = await db.select().from(programs)
  for (const pr of programRows) {
    const partnerIds = await importProgramPartners(pr.partners ?? [])
    const startupIds = await importProgramStartups(pr.startups ?? [])
    const ids = [...partnerIds, ...startupIds]
    if (ids.length > 0) {
      await syncProgramOrganizationConnections(pr.id, ids)
      linked += ids.length
    }
  }

  return { imported, linked }
}
