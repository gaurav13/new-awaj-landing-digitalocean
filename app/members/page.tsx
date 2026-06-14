import type { Metadata } from "next"
import Link from "next/link"
import { Building2, Globe, User, Mail, ArrowUpRight } from "lucide-react"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { getAllMembers } from "@/app/actions/members"
import { MEMBER_CATEGORIES } from "@/lib/member-categories"

export const metadata: Metadata = {
  title: "Members | Asia Web3 & AI Alliance Japan",
  description:
    "Meet the corporate members, startups, program sponsors, and government partners of Asia Web3 & AI Alliance Japan.",
}

type Member = Awaited<ReturnType<typeof getAllMembers>>[number]

function contactHref(m: Member) {
  if (m.contactEmail) {
    const subject = encodeURIComponent(`Request to contact ${m.companyName}`)
    return `mailto:${m.contactEmail}?subject=${subject}`
  }
  return `/contact?member=${encodeURIComponent(m.companyName)}`
}

function MemberCard({ m }: { m: Member }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gold/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-beige">
          {m.logoUrl ? (
            <img
              src={m.logoUrl || "/placeholder.svg"}
              alt={`${m.companyName} logo`}
              className="h-full w-full object-contain"
            />
          ) : (
            <Building2 className="h-6 w-6 text-gold" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-serif text-lg font-bold text-navy-text">{m.companyName}</h3>
          {m.founderName ? (
            <p className="mt-0.5 flex items-center gap-1.5 text-sm text-navy-text/65">
              <User className="h-3.5 w-3.5 shrink-0 text-gold" />
              <span className="truncate">{m.founderName}</span>
            </p>
          ) : null}
        </div>
      </div>

      {m.description ? (
        <p className="mt-4 text-pretty text-sm leading-relaxed text-navy-text/70">{m.description}</p>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
        {m.websiteUrl ? (
          <a
            href={m.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-gold transition-colors hover:text-navy-text"
          >
            <Globe className="h-4 w-4" />
            Website
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : null}
        <a
          href={contactHref(m)}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
        >
          <Mail className="h-3.5 w-3.5 text-gold" />
          Request to Contact
        </a>
      </div>
    </div>
  )
}

export default async function MembersPage() {
  const members = await getAllMembers()
  const grouped = MEMBER_CATEGORIES.map((cat) => ({
    ...cat,
    items: members.filter((m) => m.category === cat.value),
  }))

  return (
    <main className="min-h-svh bg-ivory">
      <SiteHeader />

      <section className="border-b border-gold/20 bg-navy">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Members</p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
            Our Members
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            The corporates, startups, sponsors, and public partners building the future of Web3 &amp; AI together with
            Asia Web3 &amp; AI Alliance Japan.{" "}
            {members.length > 0 ? `Currently ${members.length} member organization${members.length === 1 ? "" : "s"}.` : ""}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
        {members.length === 0 ? (
          <div className="rounded-2xl border border-gold/20 bg-white p-12 text-center">
            <h2 className="font-serif text-xl font-bold text-navy-text">No members yet</h2>
            <p className="mt-2 text-sm text-navy-text/60">
              Members will appear here once added from the admin dashboard.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-14">
            {grouped.map((cat) =>
              cat.items.length === 0 ? null : (
                <section key={cat.value}>
                  <div className="flex flex-wrap items-end justify-between gap-3 border-b border-gold/20 pb-4">
                    <div>
                      <h2 className="font-serif text-2xl font-bold text-navy-text lg:text-3xl">{cat.label}</h2>
                      <p className="mt-1 max-w-xl text-pretty text-sm leading-relaxed text-navy-text/65">
                        {cat.description}
                      </p>
                    </div>
                    <span className="rounded-full bg-beige px-3 py-1 text-xs font-semibold text-navy-text/70">
                      {cat.items.length} {cat.items.length === 1 ? "member" : "members"}
                    </span>
                  </div>
                  <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {cat.items.map((m) => (
                      <MemberCard key={m.id} m={m} />
                    ))}
                  </div>
                </section>
              ),
            )}
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
