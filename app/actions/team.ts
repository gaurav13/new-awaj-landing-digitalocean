"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { teamMembers } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"

// ---- Public reads ----

export async function getAllTeam() {
  return withDb(
    () => db.select().from(teamMembers).orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id)),
    [],
  )
}

// ---- Admin reads/writes ----

export async function getMyTeam() {
  await getUserId()
  return db
    .select()
    .from(teamMembers)
    .orderBy(asc(teamMembers.sortOrder), asc(teamMembers.id))
}

type TeamInput = {
  name: string
  role: string
  company?: string
  bio?: string
  imageUrl?: string
  linkedinUrl?: string
  sortOrder?: number
}

export async function createTeamMember(input: TeamInput) {
  const userId = await getUserId()
  await db.insert(teamMembers).values({
    name: input.name,
    role: input.role,
    company: input.company || null,
    bio: input.bio || null,
    imageUrl: input.imageUrl || null,
    linkedinUrl: input.linkedinUrl || null,
    sortOrder: input.sortOrder ?? 0,
    authorId: userId,
  })
  revalidatePath("/")
}

export async function updateTeamMember(id: number, input: TeamInput) {
  await getUserId()
  await db
    .update(teamMembers)
    .set({
      name: input.name,
      role: input.role,
      company: input.company || null,
      bio: input.bio || null,
      imageUrl: input.imageUrl || null,
      linkedinUrl: input.linkedinUrl || null,
      sortOrder: input.sortOrder ?? 0,
    })
    .where(eq(teamMembers.id, id))
  revalidatePath("/")
}

export async function deleteTeamMember(id: number) {
  await getUserId()
  await db.delete(teamMembers).where(eq(teamMembers.id, id))
  revalidatePath("/")
}
