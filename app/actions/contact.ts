"use server"

import { db } from "@/lib/db"
import { contactMessages } from "@/lib/db/schema"
import { desc, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { getUserId } from "@/lib/admin-helpers"
import { INQUIRY_TYPES } from "@/lib/contact-types"

export type ContactInput = {
  name: string
  email: string
  organization?: string
  inquiryType: string
  subject?: string
  message: string
}

export type ContactResult = { ok: true } | { ok: false; error: string }

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// ---- Public submit ----
export async function submitContactMessage(input: ContactInput): Promise<ContactResult> {
  const name = input.name?.trim()
  const email = input.email?.trim()
  const message = input.message?.trim()
  const inquiryType = INQUIRY_TYPES.includes(input.inquiryType as (typeof INQUIRY_TYPES)[number])
    ? input.inquiryType
    : "Other"

  if (!name) return { ok: false, error: "Please enter your name." }
  if (!email || !EMAIL_RE.test(email)) return { ok: false, error: "Please enter a valid email address." }
  if (!message || message.length < 10)
    return { ok: false, error: "Please enter a message of at least 10 characters." }

  try {
    await db.insert(contactMessages).values({
      name: name.slice(0, 200),
      email: email.slice(0, 200),
      organization: input.organization?.trim().slice(0, 200) || null,
      inquiryType,
      subject: input.subject?.trim().slice(0, 200) || null,
      message: message.slice(0, 5000),
    })
    revalidatePath("/admin")
    return { ok: true }
  } catch (err) {
    console.log("[v0] submitContactMessage error:", err)
    return { ok: false, error: "Something went wrong sending your message. Please try again." }
  }
}

// ---- Admin reads/writes (auth required) ----
export async function getMyMessages() {
  await getUserId()
  return db.select().from(contactMessages).orderBy(desc(contactMessages.createdAt))
}

export async function markMessageRead(id: number, isRead: boolean) {
  await getUserId()
  await db.update(contactMessages).set({ isRead }).where(eq(contactMessages.id, id))
  revalidatePath("/admin")
}

export async function deleteMessage(id: number) {
  await getUserId()
  await db.delete(contactMessages).where(eq(contactMessages.id, id))
  revalidatePath("/admin")
}
