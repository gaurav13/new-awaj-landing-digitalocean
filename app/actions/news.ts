"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { newsArticles } from "@/lib/db/schema"
import { desc, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId, slugify } from "@/lib/admin-helpers"

// ---- Public reads ----

export async function getAllNews() {
  return withDb(() => db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt)), [])
}

export async function getLatestNews(limit = 4) {
  return withDb(
    () => db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt)).limit(limit),
    [],
  )
}

export async function getNewsBySlug(slug: string) {
  return withDb(async () => {
    const rows = await db.select().from(newsArticles).where(eq(newsArticles.slug, slug)).limit(1)
    return rows[0] ?? null
  }, null)
}

export async function getRelatedNews(slug: string, limit = 3) {
  return withDb(
    () =>
      db
        .select()
        .from(newsArticles)
        .where(ne(newsArticles.slug, slug))
        .orderBy(desc(newsArticles.publishedAt))
        .limit(limit),
    [],
  )
}

// ---- Admin reads/writes (auth required) ----

export async function getMyNews() {
  await getUserId()
  return db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt))
}

export type NewsInput = {
  title: string
  excerpt: string
  content: string
  category: string
  location?: string
  imageUrl?: string
  publishedAt?: string
}

async function uniqueSlug(base: string, excludeId?: number) {
  let slug = base || "article"
  let n = 1
  while (true) {
    const rows = await db
      .select({ id: newsArticles.id })
      .from(newsArticles)
      .where(eq(newsArticles.slug, slug))
      .limit(1)
    const conflict = rows[0]
    if (!conflict || conflict.id === excludeId) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

export async function createNews(input: NewsInput) {
  const userId = await getUserId()
  const slug = await uniqueSlug(slugify(input.title))
  await db.insert(newsArticles).values({
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    category: input.category || "News",
    location: input.location || null,
    imageUrl: input.imageUrl || null,
    publishedAt: input.publishedAt ? new Date(input.publishedAt) : new Date(),
    authorId: userId,
  })
  revalidatePath("/")
  revalidatePath("/news")
}

export async function updateNews(id: number, input: NewsInput) {
  await getUserId()
  const slug = await uniqueSlug(slugify(input.title), id)
  await db
    .update(newsArticles)
    .set({
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      category: input.category || "News",
      location: input.location || null,
      imageUrl: input.imageUrl || null,
      ...(input.publishedAt ? { publishedAt: new Date(input.publishedAt) } : {}),
    })
    .where(eq(newsArticles.id, id))
  revalidatePath("/")
  revalidatePath("/news")
}

export async function deleteNews(id: number) {
  await getUserId()
  await db.delete(newsArticles).where(eq(newsArticles.id, id))
  revalidatePath("/")
  revalidatePath("/news")
}
