"use server"

import { db } from "@/lib/db"
import { partners } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"

// ---- Public reads ----

export async function getAllPartners() {
  return db.select().from(partners).orderBy(asc(partners.sortOrder), asc(partners.id))
}

// ---- Admin reads/writes ----

export async function getMyPartners() {
  await getUserId()
  return db.select().from(partners).orderBy(asc(partners.sortOrder), asc(partners.id))
}

type PartnerInput = {
  name: string
  tier?: string
  logoUrl?: string
  linkUrl?: string
  sortOrder?: number
}

export async function createPartner(input: PartnerInput) {
  const userId = await getUserId()
  await db.insert(partners).values({
    name: input.name,
    tier: input.tier || "strategic",
    logoUrl: input.logoUrl || null,
    linkUrl: input.linkUrl || null,
    sortOrder: input.sortOrder ?? 0,
    authorId: userId,
  })
  revalidatePath("/")
}

export async function updatePartner(id: number, input: PartnerInput) {
  await getUserId()
  await db
    .update(partners)
    .set({
      name: input.name,
      tier: input.tier || "strategic",
      logoUrl: input.logoUrl || null,
      linkUrl: input.linkUrl || null,
      sortOrder: input.sortOrder ?? 0,
    })
    .where(eq(partners.id, id))
  revalidatePath("/")
}

export async function deletePartner(id: number) {
  await getUserId()
  await db.delete(partners).where(eq(partners.id, id))
  revalidatePath("/")
}
