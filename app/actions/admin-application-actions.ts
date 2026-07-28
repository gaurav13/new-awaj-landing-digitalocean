"use server"

import { db } from "@/lib/db"
import { memberApplications } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"
import { type ApplicationStatus } from "@/lib/organization-types"

export async function markApplicationRead(id: number) {
  await getUserId()
  await db.update(memberApplications).set({ isRead: true }).where(eq(memberApplications.id, id))
  revalidatePath("/admin")
}

export async function setApplicationStatus(id: number, status: ApplicationStatus, reviewNotes?: string) {
  await getUserId()
  await db
    .update(memberApplications)
    .set({ status, reviewNotes: reviewNotes?.trim() || null, isRead: true, updatedAt: new Date() })
    .where(eq(memberApplications.id, id))
  revalidatePath("/admin")
}

export async function deleteApplication(id: number) {
  await getUserId()
  await db.delete(memberApplications).where(eq(memberApplications.id, id))
  revalidatePath("/admin")
}
