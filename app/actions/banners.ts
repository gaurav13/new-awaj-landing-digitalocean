"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { banners } from "@/lib/db/schema"
import { asc, desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"

import { resolveImageUrl } from "@/lib/images"

// ---- Public read ----

export async function getActiveBanners() {
  return withDb(
    () =>
      db
        .select()
        .from(banners)
        .where(eq(banners.isActive, true))
        .orderBy(asc(banners.sortOrder), desc(banners.createdAt))
        .then((rows) => rows.map((r) => ({ ...r, imageUrl: resolveImageUrl(r.imageUrl) }))),
    [],
  )
}

// ---- Admin reads/writes ----

export async function getMyBanners() {
  await getUserId()
  return db.select().from(banners).orderBy(asc(banners.sortOrder), desc(banners.createdAt))
}

type BannerInput = {
  title?: string
  subtitle?: string
  imageUrl: string
  linkUrl?: string
  linkLabel?: string
  isActive?: boolean
  sortOrder?: number
}

function toValues(input: BannerInput) {
  return {
    title: input.title || null,
    subtitle: input.subtitle || null,
    imageUrl: input.imageUrl,
    linkUrl: input.linkUrl || null,
    linkLabel: input.linkLabel || null,
    isActive: input.isActive ?? true,
    sortOrder: input.sortOrder ?? 0,
  }
}

export async function createBanner(input: BannerInput) {
  const userId = await getUserId()
  await db.insert(banners).values({ ...toValues(input), authorId: userId })
  revalidatePath("/")
}

export async function updateBanner(id: number, input: BannerInput) {
  await getUserId()
  await db.update(banners).set(toValues(input)).where(eq(banners.id, id))
  revalidatePath("/")
}

export async function deleteBanner(id: number) {
  await getUserId()
  await db.delete(banners).where(eq(banners.id, id))
  revalidatePath("/")
}
