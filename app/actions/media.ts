"use server"

import { db } from "@/lib/db"
import { media } from "@/lib/db/schema"
import { asc, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"

// ---- Public reads ----

export async function getAllMedia() {
  return db.select().from(media).orderBy(asc(media.sortOrder), desc(media.publishedAt))
}

export async function getFeaturedMedia(limit = 4) {
  return db
    .select()
    .from(media)
    .where(eq(media.isFeatured, true))
    .orderBy(asc(media.sortOrder), desc(media.publishedAt))
    .limit(limit)
}

export async function getMediaByProgram(programId: number) {
  return db
    .select()
    .from(media)
    .where(eq(media.programId, programId))
    .orderBy(asc(media.sortOrder), desc(media.publishedAt))
}

// ---- Admin reads/writes ----

export async function getMyMedia() {
  await getUserId()
  return db.select().from(media).orderBy(asc(media.sortOrder), desc(media.publishedAt))
}

type MediaInput = {
  title: string
  type: string
  url?: string
  thumbnailUrl?: string
  source?: string
  excerpt?: string
  programId?: number | null
  isFeatured?: boolean
  sortOrder?: number
}

function normalizeProgramId(value: unknown): number | null {
  if (value === undefined || value === null || value === "" || value === "none") return null
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
}

export async function createMedia(input: MediaInput) {
  const userId = await getUserId()
  await db.insert(media).values({
    title: input.title,
    type: input.type || "Article",
    url: input.url || null,
    thumbnailUrl: input.thumbnailUrl || null,
    source: input.source || null,
    excerpt: input.excerpt || null,
    programId: normalizeProgramId(input.programId),
    isFeatured: Boolean(input.isFeatured),
    sortOrder: input.sortOrder ?? 0,
    authorId: userId,
  })
  revalidatePath("/")
}

export async function updateMedia(id: number, input: MediaInput) {
  await getUserId()
  await db
    .update(media)
    .set({
      title: input.title,
      type: input.type || "Article",
      url: input.url || null,
      thumbnailUrl: input.thumbnailUrl || null,
      source: input.source || null,
      excerpt: input.excerpt || null,
      programId: normalizeProgramId(input.programId),
      isFeatured: Boolean(input.isFeatured),
      sortOrder: input.sortOrder ?? 0,
    })
    .where(eq(media.id, id))
  revalidatePath("/")
}

export async function deleteMedia(id: number) {
  await getUserId()
  await db.delete(media).where(eq(media.id, id))
  revalidatePath("/")
}
