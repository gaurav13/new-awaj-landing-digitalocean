"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { galleries, type GalleryItem } from "@/lib/db/schema"
import { asc, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"

// ---- Public reads ----

export async function getAllGalleries() {
  return withDb(
    () => db.select().from(galleries).orderBy(asc(galleries.sortOrder), desc(galleries.createdAt)),
    [],
  )
}

export async function getFeaturedGalleries(limit = 6) {
  return withDb(
    () =>
      db
        .select()
        .from(galleries)
        .where(eq(galleries.isFeatured, true))
        .orderBy(asc(galleries.sortOrder), desc(galleries.createdAt))
        .limit(limit),
    [],
  )
}

// ---- Admin reads/writes ----

export async function getMyGalleries() {
  await getUserId()
  return db.select().from(galleries).orderBy(asc(galleries.sortOrder), desc(galleries.createdAt))
}

type GalleryInput = {
  title: string
  description?: string
  category?: string
  coverImageUrl?: string
  photos?: GalleryItem[]
  eventDate?: string | null
  location?: string
  isFeatured?: boolean
  sortOrder?: number
}

function normalizePhotos(value: unknown): GalleryItem[] {
  if (!Array.isArray(value)) return []
  return value
    .filter((p): p is GalleryItem => Boolean(p) && typeof (p as GalleryItem).imageUrl === "string" && Boolean((p as GalleryItem).imageUrl))
    .map((p) => ({ imageUrl: p.imageUrl, caption: p.caption?.trim() ? p.caption.trim() : undefined }))
}

export async function createGallery(input: GalleryInput) {
  const userId = await getUserId()
  const photos = normalizePhotos(input.photos)
  await db.insert(galleries).values({
    title: input.title,
    description: input.description || null,
    category: input.category || "Event",
    coverImageUrl: input.coverImageUrl || photos[0]?.imageUrl || null,
    photos,
    eventDate: input.eventDate || null,
    location: input.location || null,
    isFeatured: Boolean(input.isFeatured),
    sortOrder: input.sortOrder ?? 0,
    authorId: userId,
  })
  revalidatePath("/")
  revalidatePath("/gallery")
}

export async function updateGallery(id: number, input: GalleryInput) {
  await getUserId()
  const photos = normalizePhotos(input.photos)
  await db
    .update(galleries)
    .set({
      title: input.title,
      description: input.description || null,
      category: input.category || "Event",
      coverImageUrl: input.coverImageUrl || photos[0]?.imageUrl || null,
      photos,
      eventDate: input.eventDate || null,
      location: input.location || null,
      isFeatured: Boolean(input.isFeatured),
      sortOrder: input.sortOrder ?? 0,
    })
    .where(eq(galleries.id, id))
  revalidatePath("/")
  revalidatePath("/gallery")
}

export async function deleteGallery(id: number) {
  await getUserId()
  await db.delete(galleries).where(eq(galleries.id, id))
  revalidatePath("/")
  revalidatePath("/gallery")
}
