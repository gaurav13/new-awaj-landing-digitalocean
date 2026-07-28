"use server"

import { db } from "@/lib/db"
import { memberApplications, organizations, people } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"
import { findOrCreateOrganizationByName } from "@/lib/organizations-sync"
import { findOrCreatePersonByName } from "@/lib/people-sync"
import { tagFromApplicationCategory, type ApplicationStatus } from "@/lib/organization-types"

function clean(value?: string | null): string | null {
  const v = (value ?? "").trim()
  return v || null
}

function orgTypeFromTag(tag: string): string {
  if (tag.includes("Startup")) return "Startup"
  if (tag.includes("Media")) return "Media"
  if (tag.includes("Government")) return "Government"
  if (tag.includes("Sponsor")) return "Sponsor"
  return "Member"
}

export async function markApplicationRead(id: number) {
  await getUserId()
  await db.update(memberApplications).set({ isRead: true }).where(eq(memberApplications.id, id))
  revalidatePath("/admin")
}

export async function setApplicationStatus(id: number, status: ApplicationStatus, reviewNotes?: string) {
  await getUserId()
  await db
    .update(memberApplications)
    .set({ status, reviewNotes: reviewNotes?.trim() || null, isRead: true, updatedAt: new Date() })
    .where(eq(memberApplications.id, id))
  revalidatePath("/admin")
}

export async function approveApplication(
  id: number,
): Promise<{ ok: true; organizationId: number } | { ok: false; error: string }> {
  await getUserId()
  try {
    const [app] = await db.select().from(memberApplications).where(eq(memberApplications.id, id)).limit(1)
    if (!app) return { ok: false, error: "Application not found." }

    const tag = tagFromApplicationCategory(app.category)

    const { id: orgId, duplicate } = await findOrCreateOrganizationByName({
      name: app.companyName,
      type: orgTypeFromTag(tag),
      tags: [tag],
      logoUrl: app.logoUrl,
      websiteUrl: app.website,
      country: app.country,
      description: app.description,
      status: "approved",
    })

    if (duplicate) {
      const [org] = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1)
      if (org) {
        const nextTags = Array.from(new Set([...(org.tags ?? []), tag]))
        await db
          .update(organizations)
          .set({
            tags: nextTags,
            logoUrl: org.logoUrl ?? app.logoUrl,
            websiteUrl: org.websiteUrl ?? app.website,
            country: org.country ?? app.country,
            description: org.description ?? app.description,
            status: "approved",
            updatedAt: new Date(),
          })
          .where(eq(organizations.id, orgId))
      }
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
      })
      await db
        .update(people)
        .set({ status: "published", organizationId: orgId, updatedAt: new Date() })
        .where(eq(people.id, personId))
    }

    await db
      .update(memberApplications)
      .set({ status: "approved", organizationId: orgId, isRead: true, updatedAt: new Date() })
      .where(eq(memberApplications.id, id))

    revalidatePath("/admin")
    revalidatePath("/members")
    revalidatePath("/team")
    revalidatePath("/")
    return { ok: true, organizationId: orgId }
  } catch (err) {
    console.error("[admin-application-actions] approve failed:", err)
    return { ok: false, error: err instanceof Error ? err.message : "Failed to approve application." }
  }
}

export async function deleteApplication(id: number) {
  await getUserId()
  await db.delete(memberApplications).where(eq(memberApplications.id, id))
  revalidatePath("/admin")
}
