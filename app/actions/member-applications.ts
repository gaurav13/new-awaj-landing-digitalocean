"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { memberApplications, organizations, type MemberApplication } from "@/lib/db/schema"
import { asc, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"
import { resolveOptionalImage, toStoredImagePath } from "@/lib/images"
import { findOrCreateOrganizationByName } from "@/lib/organizations-sync"
import { findOrCreatePersonByName } from "@/lib/people-sync"
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

// Author id used for records created by public (unauthenticated) membership submissions.
const PUBLIC_AUTHOR_ID = "public-application"

function orgTypeFromTag(tag: string): string {
  if (tag.includes("Startup")) return "Startup"
  if (tag.includes("Media")) return "Media"
  if (tag.includes("Government")) return "Government"
  if (tag.includes("Sponsor")) return "Sponsor"
  return "Member"
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

  const category = normalizeCategory(input.category)
  const logoUrl = input.logoUrl ? toStoredImagePath(input.logoUrl) : null
  const founderPhoto = input.founderPhoto ? toStoredImagePath(input.founderPhoto) : null

  try {
    // 1) Store the raw application as the review/audit record.
    const [appRow] = await db
      .insert(memberApplications)
      .values({
        companyName,
        applicantName,
        email,
        phone: clean(input.phone),
        website: clean(input.website),
        country: clean(input.country),
        category,
        description: clean(input.description),
        logoUrl,
        reasonForJoining: clean(input.reasonForJoining),
        linkedinUrl: clean(input.linkedinUrl),
        message: clean(input.message),
        founderName: clean(input.founderName),
        founderPhoto,
        founderEmail: clean(input.founderEmail),
        status: "pending",
      })
      .returning({ id: memberApplications.id })

    // 2) Immediately create/link the central Organization and Person so the submission
    //    appears in Admin → People and Organizations right away. They are created in a
    //    non-public state (org "pending", person "draft") so they stay off the public
    //    site until an admin approves the application.
    const tag = tagFromApplicationCategory(category)
    const { id: orgId, duplicate } = await findOrCreateOrganizationByName({
      name: companyName,
      type: orgTypeFromTag(tag),
      tags: [tag],
      logoUrl,
      websiteUrl: clean(input.website),
      country: clean(input.country),
      description: clean(input.description),
      status: "pending",
      authorId: PUBLIC_AUTHOR_ID,
    })

    // Merge the tag into an existing org without overwriting admin edits, but never flip
    // an already-approved org back to pending.
    if (duplicate) {
      const [org] = await db.select().from(organizations).where(eq(organizations.id, orgId)).limit(1)
      if (org) {
        const nextTags = Array.from(new Set([...(org.tags ?? []), tag]))
        await db
          .update(organizations)
          .set({
            tags: nextTags,
            logoUrl: org.logoUrl ?? logoUrl,
            websiteUrl: org.websiteUrl ?? clean(input.website),
            country: org.country ?? clean(input.country),
            description: org.description ?? clean(input.description),
            updatedAt: new Date(),
          })
          .where(eq(organizations.id, orgId))
      }
    }

    const personName = clean(input.founderName) ?? applicantName
    if (personName.trim()) {
      await findOrCreatePersonByName({
        fullName: personName,
        companyName,
        companyLogo: logoUrl,
        profilePhoto: founderPhoto,
        linkedinUrl: clean(input.linkedinUrl),
        email: clean(input.founderEmail) ?? email,
        country: clean(input.country),
        organizationId: orgId,
        roleHints: [category, input.description],
        status: "draft",
        authorId: PUBLIC_AUTHOR_ID,
      })
    }

    // Link the application row to the resolved organization.
    await db
      .update(memberApplications)
      .set({ organizationId: orgId })
      .where(eq(memberApplications.id, appRow.id))

    revalidatePath("/membership/apply")
    revalidatePath("/admin")
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




