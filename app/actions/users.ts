"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { user as userTable } from "@/lib/db/schema"
import { asc } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { getSessionUser, requireSuperAdmin } from "@/lib/admin-helpers"

export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  banned: boolean
  createdAt: Date | string
}

// ---- Reads ----

export async function getCurrentAdmin() {
  const user = await getSessionUser()
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: (user.role as string) || "admin",
  }
}

export async function getAllUsers(): Promise<AdminUser[]> {
  await requireSuperAdmin()
  return withDb(async () => {
    const rows = await db
      .select({
        id: userTable.id,
        name: userTable.name,
        email: userTable.email,
        role: userTable.role,
        banned: userTable.banned,
        createdAt: userTable.createdAt,
      })
      .from(userTable)
      .orderBy(asc(userTable.createdAt))
    return rows.map((r) => ({
      id: r.id,
      name: r.name,
      email: r.email,
      role: r.role || "admin",
      banned: Boolean(r.banned),
      createdAt: r.createdAt,
    }))
  }, [] as AdminUser[])
}

// ---- Writes (super-admin only) ----

type CreateUserInput = {
  name: string
  email: string
  password: string
  role: "admin" | "superadmin"
}

export async function createAdminUser(input: CreateUserInput) {
  await requireSuperAdmin()
  try {
    await auth.api.createUser({
      body: {
        name: input.name,
        email: input.email,
        password: input.password,
        role: input.role,
      },
      headers: await headers(),
    })
    revalidatePath("/admin")
    return { ok: true as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create user"
    return { ok: false as const, error: message }
  }
}

export async function setUserRole(userId: string, role: "admin" | "superadmin") {
  const me = await requireSuperAdmin()
  if (userId === me.id) {
    return { ok: false as const, error: "You cannot change your own role." }
  }
  try {
    await auth.api.setRole({ body: { userId, role }, headers: await headers() })
    revalidatePath("/admin")
    return { ok: true as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update role"
    return { ok: false as const, error: message }
  }
}

export async function setUserPassword(userId: string, newPassword: string) {
  await requireSuperAdmin()
  try {
    await auth.api.setUserPassword({
      body: { userId, newPassword },
      headers: await headers(),
    })
    return { ok: true as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to set password"
    return { ok: false as const, error: message }
  }
}

export async function removeAdminUser(userId: string) {
  const me = await requireSuperAdmin()
  if (userId === me.id) {
    return { ok: false as const, error: "You cannot delete your own account." }
  }
  try {
    await auth.api.removeUser({ body: { userId }, headers: await headers() })
    revalidatePath("/admin")
    return { ok: true as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to remove user"
    return { ok: false as const, error: message }
  }
}

export async function setUserBanned(userId: string, banned: boolean) {
  const me = await requireSuperAdmin()
  if (userId === me.id) {
    return { ok: false as const, error: "You cannot ban your own account." }
  }
  try {
    if (banned) {
      await auth.api.banUser({ body: { userId }, headers: await headers() })
    } else {
      await auth.api.unbanUser({ body: { userId }, headers: await headers() })
    }
    revalidatePath("/admin")
    return { ok: true as const }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update access"
    return { ok: false as const, error: message }
  }
}
