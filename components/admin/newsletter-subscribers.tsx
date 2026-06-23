"use client"

import { useMemo, useState } from "react"
import { Download, Search, Trash2, Mail } from "lucide-react"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { deleteSubscriber } from "@/app/actions/ads"
import { formatLongDate } from "@/lib/format-date"
import type { NewsletterSubscriber } from "@/lib/db/schema"

export function NewsletterSubscribers({ subscribers }: { subscribers: NewsletterSubscriber[] }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [query, setQuery] = useState("")

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return subscribers
    return subscribers.filter(
      (s) => s.email.toLowerCase().includes(q) || (s.name ?? "").toLowerCase().includes(q),
    )
  }, [subscribers, query])

  function exportCsv() {
    const header = ["Name", "Email", "Consent", "Source", "Subscribed"]
    const rows = subscribers.map((s) => [
      s.name ?? "",
      s.email,
      s.consent ? "yes" : "no",
      s.source ?? "",
      new Date(s.createdAt).toISOString(),
    ])
    const escape = (v: string) => `"${String(v).replace(/"/g, '""')}"`
    const csv = [header, ...rows].map((r) => r.map(escape).join(",")).join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `newsletter-subscribers-${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleDelete(id: number) {
    if (!confirm("Remove this subscriber?")) return
    startTransition(async () => {
      await deleteSubscriber(id)
      router.refresh()
    })
  }

  return (
    <div className="rounded-2xl border border-gold/25 bg-white/60 p-5 lg:p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-navy/10 text-navy">
            <Mail className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="font-serif text-lg font-bold text-navy-text">Newsletter subscribers</h3>
            <p className="text-xs text-navy-text/55">{subscribers.length} total</p>
          </div>
        </div>
        <Button
          type="button"
          onClick={exportCsv}
          disabled={subscribers.length === 0}
          variant="outline"
          className="rounded-full border-gold/40 text-navy-text"
        >
          <Download className="mr-1.5 h-4 w-4" />
          Export CSV
        </Button>
      </div>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-text/40" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or email..."
          className="pl-9"
        />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-gold/15">
        {filtered.length === 0 ? (
          <p className="px-4 py-8 text-center text-sm text-navy-text/55">
            {subscribers.length === 0 ? "No subscribers yet." : "No subscribers match your search."}
          </p>
        ) : (
          <ul className="divide-y divide-gold/10">
            {filtered.map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 bg-white px-4 py-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-navy-text">{s.email}</p>
                  <p className="truncate text-xs text-navy-text/55">
                    {[s.name, s.source ? `via ${s.source}` : null, formatLongDate(s.createdAt)]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(s.id)}
                  disabled={isPending}
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-navy-text/50 transition-colors hover:bg-awaj-red/10 hover:text-awaj-red"
                  aria-label={`Remove ${s.email}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
