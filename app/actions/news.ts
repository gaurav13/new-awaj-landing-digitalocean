"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { newsArticles, newsOrganizations, organizations } from "@/lib/db/schema"
import { asc, desc, eq, ne } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId, slugify } from "@/lib/admin-helpers"
import { resolveOptionalImage } from "@/lib/images"
import { syncNewsOrganizationConnections } from "@/lib/organizations-sync"

// ---- Public reads ----

export async function getAllNews() {
  return withDb(
    () =>
      db
        .select()
        .from(newsArticles)
        .orderBy(desc(newsArticles.publishedAt))
        .then((rows) => rows.map((r) => ({ ...r, imageUrl: resolveOptionalImage(r.imageUrl) }))),
    [],
  )
}

export async function getLatestNews(limit = 4) {
  return withDb(
    () =>
      db
        .select()
        .from(newsArticles)
        .orderBy(desc(newsArticles.publishedAt))
        .limit(limit)
        .then((rows) => rows.map((r) => ({ ...r, imageUrl: resolveOptionalImage(r.imageUrl) }))),
    [],
  )
}

export async function getNewsBySlug(slug: string) {
  return withDb(async () => {
    const rows = await db.select().from(newsArticles).where(eq(newsArticles.slug, slug)).limit(1)
    const row = rows[0]
    return row ? { ...row, imageUrl: resolveOptionalImage(row.imageUrl) } : null
  }, null)
}

export type LinkedOrganization = {
  id: number
  name: string
  logoUrl: string | null
  websiteUrl: string | null
  role: string | null
}

/** Companies linked to a news article (with their role), for the public news detail page. */
export async function getNewsOrganizations(newsId: number): Promise<LinkedOrganization[]> {
  return withDb(async () => {
    const links = await db
      .select({
        id: organizations.id,
        name: organizations.name,
        logoUrl: organizations.logoUrl,
        websiteUrl: organizations.websiteUrl,
        role: newsOrganizations.roleAtNews,
        status: organizations.status,
      })
      .from(newsOrganizations)
      .innerJoin(organizations, eq(organizations.id, newsOrganizations.organizationId))
      .where(eq(newsOrganizations.newsId, newsId))
      .orderBy(asc(newsOrganizations.sortOrder))
    return links
      .filter((l) => l.status !== "hidden")
      .map((l) => ({
        id: l.id,
        name: l.name,
        logoUrl: resolveOptionalImage(l.logoUrl),
        websiteUrl: l.websiteUrl,
        role: l.role,
      }))
  }, [])
}

export async function getRelatedNews(slug: string, limit = 3) {
  return withDb(
    () =>
      db
        .select()
        .from(newsArticles)
        .where(ne(newsArticles.slug, slug))
        .orderBy(desc(newsArticles.publishedAt))
        .limit(limit)
        .then((rows) => rows.map((r) => ({ ...r, imageUrl: resolveOptionalImage(r.imageUrl) }))),
    [],
  )
}

// ---- Admin reads/writes (auth required) ----

export async function getMyNews() {
  await getUserId()
  const rows = await db.select().from(newsArticles).orderBy(desc(newsArticles.publishedAt))
  const orgLinks = await db.select().from(newsOrganizations).orderBy(asc(newsOrganizations.sortOrder))
  const orgMap = new Map<number, number[]>()
  for (const l of orgLinks) {
    const arr = orgMap.get(l.newsId) ?? []
    arr.push(l.organizationId)
    orgMap.set(l.newsId, arr)
  }
  return rows.map((r) => ({ ...r, organizationIds: orgMap.get(r.id) ?? [] }))
}

export type NewsInput = {
  title: string
  excerpt: string
  content: string
  category: string
  location?: string
  imageUrl?: string
  publishedAt?: string
  organizationIds?: number[]
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
  const [created] = await db
    .insert(newsArticles)
    .values({
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
    .returning({ id: newsArticles.id })
  await syncNewsOrganizationConnections(created.id, input.organizationIds ?? [])
  revalidatePath("/")
  revalidatePath("/news")
  revalidatePath(`/news/${slug}`)
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
  await syncNewsOrganizationConnections(id, input.organizationIds ?? [])
  revalidatePath("/")
  revalidatePath("/news")
  revalidatePath(`/news/${slug}`)
}

export async function deleteNews(id: number) {
  await getUserId()
  await db.delete(newsArticles).where(eq(newsArticles.id, id))
  await db.delete(newsOrganizations).where(eq(newsOrganizations.newsId, id))
  revalidatePath("/")
  revalidatePath("/news")
}
