"use client"

import { useState, useTransition } from "react"
import { CheckCircle2, AlertCircle, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { submitContactMessage } from "@/app/actions/contact"
import { INQUIRY_TYPES } from "@/lib/contact-types"

type FormState = {
  name: string
  email: string
  organization: string
  inquiryType: string
  subject: string
  message: string
}

const EMPTY: FormState = {
  name: "",
  email: "",
  organization: "",
  inquiryType: "Partnership",
  subject: "",
  message: "",
}

export function ContactForm({ member }: { member?: string }) {
  const [form, setForm] = useState<FormState>(
    member
      ? {
          ...EMPTY,
          inquiryType: "Membership",
          subject: `Request to contact ${member}`,
          message: `I would like to get in touch with ${member}. Please help connect us.\n\n`,
        }
      : EMPTY,
  )
  const [pending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const result = await submitContactMessage(form)
      if (result.ok) {
        setSuccess(true)
        setForm(EMPTY)
      } else {
        setError(result.error)
      }
    })
  }

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-gold/25 bg-white p-10 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-beige">
          <CheckCircle2 className="h-8 w-8 text-gold" />
        </div>
        <h3 className="mt-5 font-serif text-2xl font-bold text-navy-text">Message sent</h3>
        <p className="mt-2 max-w-sm text-pretty text-sm leading-relaxed text-navy-text/70">
          Thank you for reaching out. Our team will review your inquiry and get back to you as soon as possible.
        </p>
        <Button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-full bg-navy px-6 text-white hover:opacity-90"
        >
          Send another message
        </Button>
      </div>
    )
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-gold/25 bg-white p-6 shadow-sm md:p-8"
    >
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="name">
            Name <span className="text-awaj-red">*</span>
          </Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => update("name", e.target.value)}
            placeholder="Your full name"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">
            Email <span className="text-awaj-red">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            value={form.email}
            onChange={(e) => update("email", e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="organization">Organization</Label>
          <Input
            id="organization"
            value={form.organization}
            onChange={(e) => update("organization", e.target.value)}
            placeholder="Company / organization"
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="inquiryType">
            Inquiry type <span className="text-awaj-red">*</span>
          </Label>
          <select
            id="inquiryType"
            value={form.inquiryType}
            onChange={(e) => update("inquiryType", e.target.value)}
            className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"
          >
            {INQUIRY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          value={form.subject}
          onChange={(e) => update("subject", e.target.value)}
          placeholder="Brief subject line"
        />
      </div>

      <div className="mt-5 flex flex-col gap-1.5">
        <Label htmlFor="message">
          Message <span className="text-awaj-red">*</span>
        </Label>
        <Textarea
          id="message"
          value={form.message}
          onChange={(e) => update("message", e.target.value)}
          placeholder="Tell us about your inquiry..."
          rows={6}
          required
        />
      </div>

      {error ? (
        <div
          role="alert"
          className="mt-5 flex items-center gap-2 rounded-lg border border-awaj-red/30 bg-awaj-red/5 px-4 py-3 text-sm text-awaj-red"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-navy py-6 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-8"
      >
        <Send className="h-4 w-4 text-gold" />
        {pending ? "Sending..." : "Send message"}
      </Button>
    </form>
  )
}
