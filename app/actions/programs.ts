"use server"

import { db } from "@/lib/db"
import { programs } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId, slugify } from "@/lib/admin-helpers"

// ---- Public reads ----

export async function getAllPrograms() {
  return db
    .select()
    .from(programs)
    .orderBy(asc(programs.sortOrder), asc(programs.id))
}

export async function getProgramBySlug(slug: string) {
  const rows = await db.select().from(programs).where(eq(programs.slug, slug)).limit(1)
  return rows[0] ?? null
}

// ---- Admin reads/writes ----

export async function getMyPrograms() {
  await getUserId()
  return db
    .select()
    .from(programs)
    .orderBy(asc(programs.sortOrder), asc(programs.id))
}

type ProgramInput = {
  title: string
  excerpt: string
  content: string
  icon: string
  regions?: string
  imageUrl?: string
  sortOrder?: number
}

async function uniqueSlug(base: string, excludeId?: number) {
  let slug = base || "program"
  let n = 1
  while (true) {
    const rows = await db
      .select({ id: programs.id })
      .from(programs)
      .where(eq(programs.slug, slug))
      .limit(1)
    const conflict = rows[0]
    if (!conflict || conflict.id === excludeId) return slug
    n += 1
    slug = `${base}-${n}`
  }
}

export async function createProgram(input: ProgramInput) {
  const userId = await getUserId()
  const slug = await uniqueSlug(slugify(input.title))
  await db.insert(programs).values({
    title: input.title,
    slug,
    excerpt: input.excerpt,
    content: input.content,
    icon: input.icon || "Rocket",
    regions: input.regions || null,
    imageUrl: input.imageUrl || null,
    sortOrder: input.sortOrder ?? 0,
    authorId: userId,
  })
  revalidatePath("/")
}

export async function updateProgram(id: number, input: ProgramInput) {
  await getUserId()
  const slug = await uniqueSlug(slugify(input.title), id)
  await db
    .update(programs)
    .set({
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      icon: input.icon || "Rocket",
      regions: input.regions || null,
      imageUrl: input.imageUrl || null,
      sortOrder: input.sortOrder ?? 0,
    })
    .where(eq(programs.id, id))
  revalidatePath("/")
}

export async function deleteProgram(id: number) {
  await getUserId()
  await db.delete(programs).where(eq(programs.id, id))
  revalidatePath("/")
}
