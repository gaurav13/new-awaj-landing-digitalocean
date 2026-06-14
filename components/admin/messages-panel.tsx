"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Mail, MailOpen, Trash2, Building2, Inbox } from "lucide-react"
import { Button } from "@/components/ui/button"
import { formatLongDate } from "@/lib/format-date"
import { markMessageRead, deleteMessage } from "@/app/actions/contact"

type Message = {
  id: number
  name: string
  email: string
  organization: string | null
  inquiryType: string
  subject: string | null
  message: string
  isRead: boolean
  createdAt: Date | string
}

export function MessagesPanel({ messages }: { messages: Message[] }) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()
  const [openId, setOpenId] = useState<number | null>(null)

  const unread = messages.filter((m) => !m.isRead).length

  function toggleOpen(m: Message) {
    const next = openId === m.id ? null : m.id
    setOpenId(next)
    if (next !== null && !m.isRead) {
      startTransition(async () => {
        await markMessageRead(m.id, true)
        router.refresh()
      })
    }
  }

  function handleDelete(id: number) {
    startTransition(async () => {
      await deleteMessage(id)
      if (openId === id) setOpenId(null)
      router.refresh()
    })
  }

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gold/30 bg-white p-12 text-center">
        <Inbox className="h-10 w-10 text-gold/50" />
        <p className="mt-4 font-serif text-lg font-bold text-navy-text">No messages yet</p>
        <p className="mt-1 text-sm text-navy-text/60">Contact form submissions will appear here.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="font-serif text-xl font-bold text-navy-text">Contact Messages</h2>
        <span className="rounded-full bg-beige px-3 py-1 text-xs font-semibold text-navy-text">
          {unread} unread · {messages.length} total
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {messages.map((m) => {
          const isOpen = openId === m.id
          return (
            <div
              key={m.id}
              className={`overflow-hidden rounded-2xl border bg-white shadow-sm transition-colors ${
                m.isRead ? "border-gold/20" : "border-gold/50"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleOpen(m)}
                className="flex w-full items-center gap-4 px-5 py-4 text-left"
              >
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                    m.isRead ? "bg-beige text-gold" : "bg-gold text-white"
                  }`}
                >
                  {m.isRead ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className={`truncate text-sm ${m.isRead ? "font-medium" : "font-bold"} text-navy-text`}>
                      {m.name}
                    </p>
                    <span className="shrink-0 rounded-full bg-navy/5 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-navy-text/70">
                      {m.inquiryType}
                    </span>
                  </div>
                  <p className="truncate text-xs text-navy-text/60">{m.subject || m.message}</p>
                </div>
                <span className="hidden shrink-0 text-xs text-navy-text/50 sm:block">
                  {formatLongDate(m.createdAt)}
                </span>
              </button>

              {isOpen ? (
                <div className="border-t border-gold/15 bg-ivory/40 px-5 py-4">
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-text/50">Email</p>
                      <a href={`mailto:${m.email}`} className="text-sm text-gold hover:underline">
                        {m.email}
                      </a>
                    </div>
                    {m.organization ? (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-text/50">
                          Organization
                        </p>
                        <p className="flex items-center gap-1.5 text-sm text-navy-text/80">
                          <Building2 className="h-3.5 w-3.5 text-gold" />
                          {m.organization}
                        </p>
                      </div>
                    ) : null}
                  </div>
                  {m.subject ? (
                    <div className="mt-3">
                      <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-text/50">Subject</p>
                      <p className="text-sm font-medium text-navy-text">{m.subject}</p>
                    </div>
                  ) : null}
                  <div className="mt-3">
                    <p className="text-[11px] font-semibold uppercase tracking-wide text-navy-text/50">Message</p>
                    <p className="whitespace-pre-wrap text-sm leading-relaxed text-navy-text/80">{m.message}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2">
                    <a href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject || m.inquiryType)}`}>
                      <Button type="button" className="rounded-full bg-navy text-white hover:opacity-90">
                        <Mail className="mr-1.5 h-4 w-4 text-gold" />
                        Reply
                      </Button>
                    </a>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={pending}
                      onClick={() => handleDelete(m.id)}
                      className="rounded-full border-awaj-red/40 text-awaj-red hover:bg-awaj-red/10"
                    >
                      <Trash2 className="mr-1.5 h-4 w-4" />
                      Delete
                    </Button>
                  </div>
                </div>
              ) : null}
            </div>
          )
        })}
      </div>
    </div>
  )
}
