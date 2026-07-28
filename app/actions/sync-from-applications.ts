"use server"

import { db } from "@/lib/db"
import { memberApplications, organizations, people } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"
import { findOrCreateOrganizationByName } from "@/lib/organizations-sync"
import { findOrCreatePersonByName } from "@/lib/people-sync"
import { tagFromApplicationCategory } from "@/lib/organization-types"

function orgTypeFromTag(tag: string): string {
  if (tag.includes("Startup")) return "Startup"
  if (tag.includes("Media")) return "Media"
  if (tag.includes("Government")) return "Government"
  if (tag.includes("Sponsor")) return "Sponsor"
  return "Member"
}

function clean(v: string | null | undefined): string | null {
  const t = (v ?? "").trim()
  return t === "" ? null : t
}

/**
 * Idempotent backfill: for every non-rejected application ensure a linked Organization
 * and Person exist. Approved applications produce published/approved records; pending
 * ones produce draft/pending records. Safe to run multiple times — existing records are
 * reused, never duplicated.
 */
export async function syncPeopleFromApplications(): Promise<
  { ok: true; organizations: number; people: number; scanned: number } | { ok: false; error: string }
> {
  const authorId = await getUserId()
  try {
    const allApps = await db.select().from(memberApplications).orderBy(asc(memberApplications.id))

    let orgCount = 0
    let peopleCount = 0
    let scanned = 0

    for (const app of allApps) {
      if (app.status === "rejected") continue
      if (!app.companyName?.trim()) continue
      scanned++

      const isApproved = app.status === "approved"
      const tag = tagFromApplicationCategory(app.category)

      const { id: orgId, duplicate } = await findOrCreateOrganizationByName({
        name: app.companyName,
        type: orgTypeFromTag(tag),
        tags: [tag],
        logoUrl: app.logoUrl,
        websiteUrl: app.website,
        country: app.country,
        description: app.description,
        status: isApproved ? "approved" : "pending",
        authorId,
      })
      if (!duplicate) orgCount++

      // Keep the application linked to its organization.
      if (app.organizationId !== orgId) {
        await db
          .update(memberApplications)
          .set({ organizationId: orgId })
          .where(eq(memberApplications.id, app.id))
      }

      const personName = clean(app.founderName) ?? app.applicantName
      if (personName?.trim()) {
        const personId = await findOrCreatePersonByName({
          fullName: personName,
          companyName: app.companyName,
          companyLogo: app.logoUrl,
          profilePhoto: app.founderPhoto,
          linkedinUrl: app.linkedinUrl,
          email: clean(app.founderEmail) ?? app.email,
          country: app.country,
          organizationId: orgId,
          roleHints: [app.category, app.description],
          status: isApproved ? "published" : "draft",
          authorId,
        })
        peopleCount++
        await db
          .update(people)
          .set({ organizationId: orgId, status: isApproved ? "published" : "draft", updatedAt: new Date() })
          .where(eq(people.id, personId))
      }
    }

    revalidatePath("/admin")
    revalidatePath("/members")
    revalidatePath("/team")
    revalidatePath("/")
    return { ok: true, organizations: orgCount, people: peopleCount, scanned }
  } catch (err) {
    console.error("[sync-from-applications] failed:", err)
    return { ok: false, error: err instanceof Error ? err.message : "Failed to sync from applications." }
  }
}
