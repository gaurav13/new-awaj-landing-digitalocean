"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { memberApplications, organizations, type MemberApplication } from "@/lib/db/schema"
import { asc, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"
import { resolveOptionalImage, toStoredImagePath } from "@/lib/images"
import { findOrCreateOrganizationByName } from "@/lib/organizations-sync"
import { MEMBER_TAGS, tagFromApplicationCategory, type ApplicationStatus } from "@/lib/organization-types"

export type PublicApplicationInput = {
  companyName: string
  applicantName: string
  email: string
  phone?: string
  website?: string
  country?: string
  category?: string
  description?: string
  logoUrl?: string
  reasonForJoining?: string
  linkedinUrl?: string
  message?: string
  founderName?: string
  founderPhoto?: string
  founderEmail?: string
}

function clean(value?: string | null): string | null {
  const v = (value ?? "").trim()
  return v || null
}

function normalizeCategory(category?: string): string {
  const match = MEMBER_TAGS.find((t) => t.toLowerCase() === (category ?? "").trim().toLowerCase())
  return match ?? "Corporate Member"
}

// ---- Public write ----

/**
 * Public submission from /membership/apply. Stored as a pending application for admin review.
 * No authentication required. Approval later creates/updates a central organization.
 */
export async function createMemberApplication(
  input: PublicApplicationInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const companyName = (input.companyName ?? "").trim()
  const applicantName = (input.applicantName ?? "").trim()
  const email = (input.email ?? "").trim()

  if (!companyName) return { ok: false, error: "Company name is required." }
  if (!applicantName) return { ok: false, error: "Your name is required." }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { ok: false, error: "A valid email address is required." }

  try {
    await db.insert(memberApplications).values({
      companyName,
      applicantName,
      email,
      phone: clean(input.phone),
      website: clean(input.website),
      country: clean(input.country),
      category: normalizeCategory(input.category),
      description: clean(input.description),
      logoUrl: input.logoUrl ? toStoredImagePath(input.logoUrl) : null,
      reasonForJoining: clean(input.reasonForJoining),
      linkedinUrl: clean(input.linkedinUrl),
      message: clean(input.message),
      founderName: clean(input.founderName),
      founderPhoto: input.founderPhoto ? toStoredImagePath(input.founderPhoto) : null,
      founderEmail: clean(input.founderEmail),
      status: "pending",
    })
    revalidatePath("/membership/apply")
    return { ok: true }
  } catch (err) {
    console.error("[member-applications] create failed:", err)
    return { ok: false, error: "Something went wrong submitting your application. Please try again." }
  }
}

// ---- Admin reads ----

function resolveApplication(row: MemberApplication): MemberApplication {
  return {
    ...row,
    logoUrl: resolveOptionalImage(row.logoUrl),
    founderPhoto: resolveOptionalImage(row.founderPhoto),
  }
}

export async function getMyApplications(): Promise<MemberApplication[]> {
  await getUserId()
  return withDb(async () => {
    const rows = await db
      .select()
      .from(memberApplications)
      .orderBy(desc(memberApplications.createdAt), asc(memberApplications.id))
    return rows.map(resolveApplication)
  }, [])
}

export async function getApplicationCounts() {
  await getUserId()
  return withDb(
    async () => {
      const rows = await db.select({ status: memberApplications.status, isRead: memberApplications.isRead }).from(
        memberApplications,
      )
      const counts = { total: rows.length, pending: 0, approved: 0, rejected: 0, info_requested: 0, unread: 0 }
      for (const r of rows) {
        if (r.status in counts) (counts as Record<string, number>)[r.status]++
        if (!r.isRead) counts.unread++
      }
      return counts
    },
    { total: 0, pending: 0, approved: 0, rejected: 0, info_requested: 0, unread: 0 },
  )
}

// ---- Admin writes ----

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

/**
 * Approve an application: create (or reuse) the central organization, de-duplicated by name.
 * If the company already exists, its category tag is merged in (never duplicating the company).
 * Links the application to the resulting organization.
 */
export async function approveApplication(id: number): Promise<{ ok: true; organizationId: number } | { ok: false; error: string }> {
  await getUserId()
  try {
    const [app] = await db.select().from(memberApplications).where(eq(memberApplications.id, id)).limit(1)
    if (!app) return { ok: false, error: "Application not found." }

    const tag = tagFromApplicationCategory(app.category)

    const { id: orgId, duplicate } = await findOrCreateOrganizationByName({
      name: app.companyName,
      type: tag.includes("Startup") ? "Startup" : tag.includes("Media") ? "Media" : tag.includes("Government") ? "Government" : tag.includes("Sponsor") ? "Sponsor" : "Member",
      tags: [tag],
      logoUrl: app.logoUrl,
      websiteUrl: app.website,
      country: app.country,
      description: app.description,
      status: "approved",
    })

    // Existing company: merge the new tag + backfill any empty fields without overwriting.
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

    await db
      .update(memberApplications)
      .set({ status: "approved", organizationId: orgId, isRead: true, updatedAt: new Date() })
      .where(eq(memberApplications.id, id))

    revalidatePath("/admin")
    revalidatePath("/members")
    revalidatePath("/")
    return { ok: true, organizationId: orgId }
  } catch (err) {
    console.error("[member-applications] approve failed:", err)
    return { ok: false, error: err instanceof Error ? err.message : "Failed to approve application." }
  }
}

export async function deleteApplication(id: number) {
  await getUserId()
  await db.delete(memberApplications).where(eq(memberApplications.id, id))
  revalidatePath("/admin")
}
