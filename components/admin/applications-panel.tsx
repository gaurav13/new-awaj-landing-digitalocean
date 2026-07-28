"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Inbox, Building2, Check, X, HelpCircle, Trash2, Globe, Mail, Phone, Link2, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatLongDate } from "@/lib/format-date"
import type { MemberApplication } from "@/lib/db/schema"
import { APPLICATION_STATUS_LABELS, type ApplicationStatus } from "@/lib/organization-types"
import {
  approveApplication,
  setApplicationStatus,
  deleteApplication,
  markApplicationRead,
} from "@/app/actions/admin-application-actions"

const STATUS_FILTERS: { value: "all" | ApplicationStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "info_requested", label: "Info requested" },
  { value: "approved", label: "Approved" },
  { value: "rejected", label: "Rejected" },
]

const STATUS_STYLES: Record<ApplicationStatus, string> = {
  pending: "bg-gold/15 text-gold",
  approved: "bg-emerald-100 text-emerald-700",
  rejected: "bg-awaj-red/10 text-awaj-red",
  info_requested: "bg-navy/10 text-navy-text",
}

export function ApplicationsPanel({ applications }: { applications: MemberApplication[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [openId, setOpenId] = useState<number | null>(null)
  const [filter, setFilter] = useState<"all" | ApplicationStatus>("all")
  const [error, setError] = useState<string | null>(null)

  const visible = applications.filter((a) => filter === "all" || a.status === filter)

  function toggleOpen(app: MemberApplication) {
    const next = openId === app.id ? null : app.id
    setOpenId(next)
    if (next !== null && !app.isRead) {
      startTransition(async () => {
        await markApplicationRead(app.id)
        router.refresh()
      })
    }
  }

  function handleApprove(id: number) {
    setError(null)
    startTransition(async () => {
      const res = await approveApplication(id)
      if (!res.ok) setError(res.error)
      router.refresh()
    })
  }

  function handleStatus(id: number, status: ApplicationStatus) {
    setError(null)
    let notes: string | undefined
    if (status === "info_requested" || status === "rejected") {
      const label = status === "rejected" ? "reason for rejection" : "what info is needed"
      notes = window.prompt(`Optional note (${label}):`) ?? undefined
    }
    startTransition(async () => {
      await setApplicationStatus(id, status, notes)
      router.refresh()
    })
  }

  function handleDelete(id: number) {
    if (!window.confirm("Delete this application permanently?")) return
    startTransition(async () => {
      await deleteApplication(id)
      if (openId === id) setOpenId(null)
      router.refresh()
    })
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-serif text-xl font-bold text-navy-text">Membership Applications</h2>
        <div className="flex flex-wrap gap-1.5">
          {STATUS_FILTERS.map((f) => {
            const count = f.value === "all" ? applications.length : applications.filter((a) => a.status === f.value).length
            return (
              <button
                key={f.value}
                type="button"
                onClick={() => setFilter(f.value)}
                className={`rounded-full px-3 py-1 text-xs font-semibold transition-colors ${
                  filter === f.value ? "bg-navy text-white" : "bg-beige text-navy-text/70 hover:bg-beige/70"
                }`}
              >
                {f.label} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {error ? (
        <p className="mb-4 rounded-lg border border-awaj-red/30 bg-awaj-red/5 px-4 py-2 text-sm text-awaj-red">{error}</p>
      ) : null}

      {visible.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gold/30 bg-white p-12 text-center">
          <Inbox className="h-10 w-10 text-gold/50" />
          <p className="mt-4 font-serif text-lg font-bold text-navy-text">No applications</p>
          <p className="mt-1 text-sm text-navy-text/60">Submissions from the public apply form appear here.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {visible.map((app) => {
            const isOpen = openId === app.id
            const status = app.status as ApplicationStatus
            return (
              <div
                key={app.id}
                className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${
                  app.isRead ? "border-gold/20" : "border-gold/50"
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleOpen(app)}
                  className="flex w-full items-center gap-4 px-5 py-4 text-left"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-beige text-gold">
                    {app.logoUrl ? (
                      <Image src={app.logoUrl || "/placeholder.svg"} alt="" width={44} height={44} className="h-full w-full object-cover" />
                    ) : (
                      <Building2 className="h-5 w-5" />
                    )}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className={`truncate text-sm ${app.isRead ? "font-medium" : "font-bold"} text-navy-text`}>
                        {app.companyName}
                      </p>
                      <span className="shrink-0 rounded-full bg-navy/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-navy-text/70">
                        {app.category}
                      </span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold ${STATUS_STYLES[status] ?? ""}`}>
                        {APPLICATION_STATUS_LABELS[status] ?? app.status}
                      </span>
                    </div>
                    <p className="truncate text-xs text-navy-text/60">
                      {app.applicantName} · {app.email}
                    </p>
                  </div>
                  <span className="hidden shrink-0 text-xs text-navy-text/50 sm:block">{formatLongDate(app.createdAt)}</span>
                </button>

                {isOpen ? (
                  <div className="border-t border-gold/15 bg-ivory/40 px-5 py-4">
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Detail icon={<User className="h-3.5 w-3.5 text-gold" />} label="Applicant" value={app.applicantName} />
                      <Detail
                        icon={<Mail className="h-3.5 w-3.5 text-gold" />}
                        label="Email"
                        value={<a href={`mailto:${app.email}`} className="text-gold hover:underline">{app.email}</a>}
                      />
                      {app.phone ? <Detail icon={<Phone className="h-3.5 w-3.5 text-gold" />} label="Phone" value={app.phone} /> : null}
                      {app.country ? <Detail icon={<Globe className="h-3.5 w-3.5 text-gold" />} label="Country" value={app.country} /> : null}
                      {app.website ? (
                        <Detail
                          icon={<Globe className="h-3.5 w-3.5 text-gold" />}
                          label="Website"
                          value={<a href={app.website} target="_blank" rel="noreferrer" className="text-gold hover:underline">{app.website}</a>}
                        />
                      ) : null}
                      {app.linkedinUrl ? (
                        <Detail
                          icon={<Link2 className="h-3.5 w-3.5 text-gold" />}
                          label="LinkedIn"
                          value={<a href={app.linkedinUrl} target="_blank" rel="noreferrer" className="text-gold hover:underline">Profile</a>}
                        />
                      ) : null}
                    </div>

                    {(app.founderName || app.founderPhoto) ? (
                      <div className="mt-4 flex items-center gap-3 rounded-xl border border-gold/15 bg-white p-3">
                        <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full bg-beige text-gold">
                          {app.founderPhoto ? (
                            <Image src={app.founderPhoto || "/placeholder.svg"} alt="" width={48} height={48} className="h-full w-full object-cover" />
                          ) : (
                            <User className="h-5 w-5" />
                          )}
                        </span>
                        <div>
                          <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-text/50">Founder / Representative</p>
                          <p className="text-sm font-medium text-navy-text">{app.founderName || "—"}</p>
                          {app.founderEmail ? <p className="text-xs text-navy-text/60">{app.founderEmail}</p> : null}
                        </div>
                      </div>
                    ) : null}

                    {app.description ? <Block label="Company description" value={app.description} /> : null}
                    {app.reasonForJoining ? <Block label="Reason for joining" value={app.reasonForJoining} /> : null}
                    {app.message ? <Block label="Message" value={app.message} /> : null}
                    {app.reviewNotes ? <Block label="Review notes" value={app.reviewNotes} /> : null}

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <Button
                        type="button"
                        disabled={pending || app.status === "approved"}
                        onClick={() => handleApprove(app.id)}
                        className="rounded-full bg-emerald-600 text-white hover:bg-emerald-700 disabled:opacity-50"
                      >
                        <Check className="mr-1.5 h-4 w-4" />
                        {app.status === "approved" ? "Approved" : "Approve & add to directory"}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={pending}
                        onClick={() => handleStatus(app.id, "info_requested")}
                        className="rounded-full border-navy/30 text-navy-text hover:bg-navy/5"
                      >
                        <HelpCircle className="mr-1.5 h-4 w-4" />
                        Request info
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        disabled={pending}
                        onClick={() => handleStatus(app.id, "rejected")}
                        className="rounded-full border-awaj-red/40 text-awaj-red hover:bg-awaj-red/10"
                      >
                        <X className="mr-1.5 h-4 w-4" />
                        Reject
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        disabled={pending}
                        onClick={() => handleDelete(app.id)}
                        className="ml-auto rounded-full text-navy-text/50 hover:text-awaj-red"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete application</span>
                      </Button>
                    </div>
                  </div>
                ) : null}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function Detail({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-text/50">{label}</p>
      <p className="flex items-center gap-1.5 text-sm text-navy-text/80">
        {icon}
        {value}
      </p>
    </div>
  )
}

function Block({ label, value }: { label: string; value: string }) {
  return (
    <div className="mt-3">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-text/50">{label}</p>
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-text/80">{value}</p>
    </div>
  )
}
