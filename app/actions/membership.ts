"use server"

import { db } from "@/lib/db"
import { withDb } from "@/lib/db/with-db"
import { membershipPlans } from "@/lib/db/schema"
import { asc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"

// ---- Public reads ----

export async function getAllMembershipPlans() {
  return withDb(
    () => db.select().from(membershipPlans).orderBy(asc(membershipPlans.sortOrder), asc(membershipPlans.id)),
    [],
  )
}

// ---- Admin reads/writes ----

export async function getMyMembershipPlans() {
  await getUserId()
  return db.select().from(membershipPlans).orderBy(asc(membershipPlans.sortOrder), asc(membershipPlans.id))
}

type MembershipPlanInput = {
  name: string
  icon?: string
  price?: string
  priceNote?: string
  periodLabel?: string
  badge?: string
  description?: string
  // The admin repeater stores rows as { text: string }; we also accept plain strings.
  features?: (string | { text?: string })[]
  ctaLabel?: string
  ctaUrl?: string
  footnote?: string
  accent?: string
  isHighlighted?: boolean
  sortOrder?: number
}

function cleanFeatures(items?: (string | { text?: string })[]): string[] {
  if (!Array.isArray(items)) return []
  return items
    .map((f) => (typeof f === "string" ? f : (f?.text ?? "")))
    .map((s) => s.trim())
    .filter(Boolean)
}

function toValues(input: MembershipPlanInput) {
  return {
    name: input.name,
    icon: input.icon || "Users",
    price: input.price || "Free",
    priceNote: input.priceNote || null,
    periodLabel: input.periodLabel || null,
    badge: input.badge || null,
    description: input.description || "",
    features: cleanFeatures(input.features),
    ctaLabel: input.ctaLabel || "Join Now",
    ctaUrl: input.ctaUrl || null,
    footnote: input.footnote || null,
    accent: input.accent || "gold",
    isHighlighted: input.isHighlighted ?? false,
    sortOrder: input.sortOrder ?? 0,
  }
}

export async function createMembershipPlan(input: MembershipPlanInput) {
  const userId = await getUserId()
  await db.insert(membershipPlans).values({ ...toValues(input), authorId: userId })
  revalidatePath("/membership")
  revalidatePath("/")
}

export async function updateMembershipPlan(id: number, input: MembershipPlanInput) {
  await getUserId()
  await db.update(membershipPlans).set(toValues(input)).where(eq(membershipPlans.id, id))
  revalidatePath("/membership")
  revalidatePath("/")
}

export async function deleteMembershipPlan(id: number) {
  await getUserId()
  await db.delete(membershipPlans).where(eq(membershipPlans.id, id))
  revalidatePath("/membership")
  revalidatePath("/")
}
