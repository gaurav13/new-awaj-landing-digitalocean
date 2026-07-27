"use client"

import { useState, useTransition } from "react"
import { CheckCircle2, AlertCircle, Send } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { PublicImageUpload } from "@/components/awaj/public-image-upload"
import { createMemberApplication } from "@/app/actions/member-applications"
import { MEMBER_TAGS } from "@/lib/organization-types"

type FormState = {
  companyName: string
  applicantName: string
  email: string
  phone: string
  website: string
  country: string
  category: string
  description: string
  logoUrl: string
  reasonForJoining: string
  linkedinUrl: string
  founderName: string
  founderEmail: string
  founderPhoto: string
  message: string
}

const EMPTY: FormState = {
  companyName: "",
  applicantName: "",
  email: "",
  phone: "",
  website: "",
  country: "",
  category: "Corporate Member",
  description: "",
  logoUrl: "",
  reasonForJoining: "",
  linkedinUrl: "",
  founderName: "",
  founderEmail: "",
  founderPhoto: "",
  message: "",
}

function Field({
  label,
  htmlFor,
  required,
  children,
  hint,
}: {
  label: string
  htmlFor?: string
  required?: boolean
  children: React.ReactNode
  hint?: string
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={htmlFor}>
        {label} {required ? <span className="text-awaj-red">*</span> : null}
      </Label>
      {children}
      {hint ? <p className="text-xs text-navy-text/50">{hint}</p> : null}
    </div>
  )
}

export function MembershipApplicationForm({ defaultCategory }: { defaultCategory?: string }) {
  const initialCategory = MEMBER_TAGS.find((t) => t === defaultCategory) ?? EMPTY.category
  const [form, setForm] = useState<FormState>({ ...EMPTY, category: initialCategory })
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
      const result = await createMemberApplication(form)
      if (result.ok) {
        setSuccess(true)
        setForm(EMPTY)
        window.scrollTo({ top: 0, behavior: "smooth" })
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
        <h3 className="mt-5 font-serif text-2xl font-bold text-navy-text">Application received</h3>
        <p className="mt-2 max-w-md text-pretty text-sm leading-relaxed text-navy-text/70">
          Thank you for applying to join Asia Web3 &amp; AI Alliance Japan. Our team will review your application and
          reach out by email. Once approved, your organization will appear in our members directory.
        </p>
        <Button
          type="button"
          onClick={() => setSuccess(false)}
          className="mt-6 rounded-full bg-navy px-6 text-white hover:opacity-90"
        >
          Submit another application
        </Button>
      </div>
    )
  }

  const inputClass =
    "h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/40"

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-gold/25 bg-white p-6 shadow-sm md:p-8">
      {/* Company */}
      <fieldset className="flex flex-col gap-5">
        <legend className="mb-1 font-serif text-lg font-bold text-navy-text">Company details</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Company / organization name" htmlFor="companyName" required>
            <Input
              id="companyName"
              value={form.companyName}
              onChange={(e) => update("companyName", e.target.value)}
              placeholder="Acme Inc."
              required
            />
          </Field>
          <Field label="Membership category" htmlFor="category" required>
            <select
              id="category"
              value={form.category}
              onChange={(e) => update("category", e.target.value)}
              className={inputClass}
            >
              {MEMBER_TAGS.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Website" htmlFor="website">
            <Input
              id="website"
              type="url"
              value={form.website}
              onChange={(e) => update("website", e.target.value)}
              placeholder="https://example.com"
            />
          </Field>
          <Field label="Country" htmlFor="country">
            <Input
              id="country"
              value={form.country}
              onChange={(e) => update("country", e.target.value)}
              placeholder="Japan"
            />
          </Field>
        </div>

        <Field label="About the company" htmlFor="description" hint="A short description shown in the members directory.">
          <Textarea
            id="description"
            value={form.description}
            onChange={(e) => update("description", e.target.value)}
            placeholder="What does your organization do?"
            rows={4}
          />
        </Field>

        <Field label="Company logo">
          <PublicImageUpload value={form.logoUrl} onChange={(url) => update("logoUrl", url)} label="logo" size="lg" />
        </Field>
      </fieldset>

      {/* Applicant */}
      <fieldset className="mt-8 flex flex-col gap-5 border-t border-gold/15 pt-8">
        <legend className="mb-1 font-serif text-lg font-bold text-navy-text">Your contact details</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Your name" htmlFor="applicantName" required>
            <Input
              id="applicantName"
              value={form.applicantName}
              onChange={(e) => update("applicantName", e.target.value)}
              placeholder="Full name"
              required
            />
          </Field>
          <Field label="Email" htmlFor="email" required>
            <Input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="you@example.com"
              required
            />
          </Field>
          <Field label="Phone" htmlFor="phone">
            <Input
              id="phone"
              value={form.phone}
              onChange={(e) => update("phone", e.target.value)}
              placeholder="+81 ..."
            />
          </Field>
          <Field label="LinkedIn" htmlFor="linkedinUrl">
            <Input
              id="linkedinUrl"
              type="url"
              value={form.linkedinUrl}
              onChange={(e) => update("linkedinUrl", e.target.value)}
              placeholder="https://linkedin.com/in/..."
            />
          </Field>
        </div>
      </fieldset>

      {/* Founder / representative */}
      <fieldset className="mt-8 flex flex-col gap-5 border-t border-gold/15 pt-8">
        <legend className="mb-1 font-serif text-lg font-bold text-navy-text">Founder / representative</legend>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Founder / representative name" htmlFor="founderName">
            <Input
              id="founderName"
              value={form.founderName}
              onChange={(e) => update("founderName", e.target.value)}
              placeholder="Full name"
            />
          </Field>
          <Field label="Founder / representative email" htmlFor="founderEmail">
            <Input
              id="founderEmail"
              type="email"
              value={form.founderEmail}
              onChange={(e) => update("founderEmail", e.target.value)}
              placeholder="founder@example.com"
            />
          </Field>
        </div>
        <Field label="Founder / representative photo">
          <PublicImageUpload
            value={form.founderPhoto}
            onChange={(url) => update("founderPhoto", url)}
            label="photo"
            circle
          />
        </Field>
      </fieldset>

      {/* Motivation */}
      <fieldset className="mt-8 flex flex-col gap-5 border-t border-gold/15 pt-8">
        <legend className="mb-1 font-serif text-lg font-bold text-navy-text">Tell us more</legend>
        <Field label="Why do you want to join?" htmlFor="reasonForJoining">
          <Textarea
            id="reasonForJoining"
            value={form.reasonForJoining}
            onChange={(e) => update("reasonForJoining", e.target.value)}
            placeholder="What are you hoping to get from the alliance?"
            rows={4}
          />
        </Field>
        <Field label="Anything else?" htmlFor="message">
          <Textarea
            id="message"
            value={form.message}
            onChange={(e) => update("message", e.target.value)}
            placeholder="Additional notes for our team (optional)"
            rows={3}
          />
        </Field>
      </fieldset>

      {error ? (
        <div
          role="alert"
          className="mt-6 flex items-center gap-2 rounded-lg border border-awaj-red/30 bg-awaj-red/5 px-4 py-3 text-sm text-awaj-red"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      ) : null}

      <Button
        type="submit"
        disabled={pending}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-full bg-navy py-6 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 sm:w-auto sm:px-10"
      >
        <Send className="h-4 w-4 text-gold" />
        {pending ? "Submitting..." : "Submit application"}
      </Button>
    </form>
  )
}
