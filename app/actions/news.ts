"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { newsArticles } from "@/lib/db/schema"
import { and, asc, desc, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId, slugify } from "@/lib/admin-helpers"

/**
 * The Newsroom is a single unified model (the `news_articles` table). It holds
 * both internal articles (with full `content`, opened at /news/[slug]) and
 * external media coverage (with `externalUrl` + `source`, opened off-site).
 * The `isFeatured` flag drives the "AWAJ in the Media" carousel on the homepage.
 */

// ---- Public reads ----

export async function getAllNews() {
  return withDb(
    () =>
      db
        .select()
        .from(newsArticles)
        .where(eq(newsArticles.status, "published"))
        .orderBy(desc(newsArticles.publishedAt)),
    [],
  )
}

export async function getLatestNews(limit = 4) {
  return withDb(
    () =>
      db
        .select()
        .from(newsArticles)
        .where(eq(newsArticles.status, "published"))
        .orderBy(desc(newsArticles.publishedAt))
        .limit(limit),
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
        .where(and(ne(newsArticles.slug, slug), eq(newsArticles.status, "published")))
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
  content?: string
  category: string
  location?: string
  imageUrl?: string
  // Unified newsroom fields
  mediaType?: string
  source?: string
  externalUrl?: string
  programId?: number | string | null
  isFeatured?: boolean
  status?: string
  sortOrder?: number
  publishedAt?: string
}

function normalizeProgramId(value: unknown): number | null {
  if (value === undefined || value === null || value === "" || value === "none") return null
  const n = Number(value)
  return Number.isFinite(n) && n > 0 ? n : null
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

function toValues(input: NewsInput) {
  return {
    title: input.title,
    excerpt: input.excerpt,
    content: input.content || null,
    category: input.category || "News",
    location: input.location || null,
    imageUrl: input.imageUrl || null,
    mediaType: input.mediaType || "article",
    source: input.source || null,
    externalUrl: input.externalUrl || null,
    programId: normalizeProgramId(input.programId),
    isFeatured: Boolean(input.isFeatured),
    status: input.status || "published",
    sortOrder: input.sortOrder ?? 0,
  }
}

export async function createNews(input: NewsInput) {
  const userId = await getUserId()
  const slug = await uniqueSlug(slugify(input.title))
  await db.insert(newsArticles).values({
    ...toValues(input),
    slug,
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
      ...toValues(input),
      slug,
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

// ---- Featured media coverage (reads from the same unified table) ----

type MediaShape = {
  id: number
  title: string
  type: string
  url: string | null
  thumbnailUrl: string | null
  source: string | null
  excerpt: string | null
  programId: number | null
  isFeatured: boolean
  publishedAt: Date | string
  sortOrder: number
}

function toMediaShape(row: typeof newsArticles.$inferSelect): MediaShape {
  return {
    id: row.id,
    title: row.title,
    type: row.mediaType || "Article",
    url: row.externalUrl ?? (row.content ? `/news/${row.slug}` : null),
    thumbnailUrl: row.imageUrl,
    source: row.source,
    excerpt: row.excerpt,
    programId: row.programId,
    isFeatured: row.isFeatured,
    publishedAt: row.publishedAt,
    sortOrder: row.sortOrder,
  }
}

export async function getFeaturedCoverage(limit = 8) {
  return withDb(async () => {
    const rows = await db
      .select()
      .from(newsArticles)
      .where(and(eq(newsArticles.isFeatured, true), eq(newsArticles.status, "published")))
      .orderBy(asc(newsArticles.sortOrder), desc(newsArticles.publishedAt))
      .limit(limit)
    return rows.map(toMediaShape)
  }, [] as MediaShape[])
}

export async function getCoverageByProgram(programId: number) {
  return withDb(async () => {
    const rows = await db
      .select()
      .from(newsArticles)
      .where(and(eq(newsArticles.programId, programId), eq(newsArticles.status, "published")))
      .orderBy(asc(newsArticles.sortOrder), desc(newsArticles.publishedAt))
    return rows.map(toMediaShape)
  }, [] as MediaShape[])
}
