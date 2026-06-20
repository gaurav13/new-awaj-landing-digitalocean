"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { members } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"

import { resolveOptionalImage } from "@/lib/images"

// ---- Public reads ----

export async function getAllMembers() {
  return withDb(
    () =>
      db
        .select()
        .from(members)
        .orderBy(asc(members.sortOrder), asc(members.companyName))
        .then((rows) => rows.map((r) => ({ ...r, logoUrl: resolveOptionalImage(r.logoUrl) }))),
    [],
  )
}

// ---- Admin reads/writes ----

export async function getMyMembers() {
  await getUserId()
  return db.select().from(members).orderBy(asc(members.sortOrder), asc(members.companyName))
}

type MemberInput = {
  companyName: string
  founderName?: string
  designation?: string
  websiteUrl?: string
  logoUrl?: string
  description?: string
  category?: string
  contactEmail?: string
  contactUrl?: string
  sortOrder?: number
}

export async function createMember(input: MemberInput) {
  const userId = await getUserId()
  await db.insert(members).values({
    companyName: input.companyName,
    founderName: input.founderName || null,
    designation: input.designation || null,
    websiteUrl: input.websiteUrl || null,
    logoUrl: input.logoUrl || null,
    description: input.description || null,
    category: input.category || "corporate",
    contactEmail: input.contactEmail || null,
    contactUrl: input.contactUrl || null,
    sortOrder: input.sortOrder ?? 0,
    authorId: userId,
  })
  revalidatePath("/members")
  revalidatePath("/")
}

export async function updateMember(id: number, input: MemberInput) {
  await getUserId()
  await db
    .update(members)
    .set({
      companyName: input.companyName,
      founderName: input.founderName || null,
      designation: input.designation || null,
      websiteUrl: input.websiteUrl || null,
      logoUrl: input.logoUrl || null,
      description: input.description || null,
      category: input.category || "corporate",
      contactEmail: input.contactEmail || null,
      contactUrl: input.contactUrl || null,
      sortOrder: input.sortOrder ?? 0,
    })
    .where(eq(members.id, id))
  revalidatePath("/members")
  revalidatePath("/")
}

export async function deleteMember(id: number) {
  await getUserId()
  await db.delete(members).where(eq(members.id, id))
  revalidatePath("/members")
  revalidatePath("/")
}
