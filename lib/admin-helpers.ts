import { auth } from "@/lib/auth"
import { headers } from "next/headers"

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user as typeof session.user & { role?: string | null }
}

export async function getUserId() {
  const user = await getSessionUser()
  return user.id
}

export async function isSuperAdmin() {
  try {
    const user = await getSessionUser()
    return user.role === "superadmin"
  } catch {
    return false
  }
}

export async function requireSuperAdmin() {
  const user = await getSessionUser()
  if (user.role !== "superadmin") {
    throw new Error("Forbidden: super-admin access required")
  }
  return user
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80)
}
