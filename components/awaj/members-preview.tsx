import Link from "next/link"
import { Building2, ArrowRight } from "lucide-react"
import { getAllMembers } from "@/app/actions/members"
import { MEMBER_CATEGORIES } from "@/lib/member-categories"

export async function MembersPreview() {
  const members = await getAllMembers()
  if (members.length === 0) return null

  const counts = MEMBER_CATEGORIES.map((cat) => ({
    ...cat,
    count: members.filter((m) => m.category === cat.value).length,
  }))

  const logos = members.filter((m) => m.logoUrl).slice(0, 12)

  return (
    <section id="members" className="mx-auto max-w-[1280px] px-5 pb-16 lg:px-10">
      <div className="rounded-3xl border border-gold/25 bg-white px-6 py-12 shadow-sm md:px-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Our Network</p>
            <h2 className="mt-2 font-serif text-3xl font-bold text-navy-text lg:text-4xl">Members</h2>
            <p className="mt-2 max-w-xl text-pretty text-sm leading-relaxed text-navy-text/65">
              {members.length} organization{members.length === 1 ? "" : "s"} across corporates, startups, sponsors, and
              public partners.
            </p>
          </div>
          <Link
            href="/members"
            className="group inline-flex items-center gap-2 rounded-full bg-navy px-6 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            View all members
            <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {counts.map((cat) => (
            <Link
              key={cat.value}
              href="/members"
              className="rounded-2xl border border-gold/20 bg-ivory/60 p-5 transition-colors hover:border-gold/50"
            >
              <p className="font-serif text-3xl font-bold text-navy-text">{cat.count}</p>
              <p className="mt-1 text-sm font-medium text-navy-text/70">{cat.label}</p>
            </Link>
          ))}
        </div>

        {logos.length > 0 ? (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-10 gap-y-6 border-t border-gold/15 pt-8">
            {logos.map((m) =>
              m.logoUrl ? (
                <img
                  key={m.id}
                  src={m.logoUrl || "/placeholder.svg"}
                  alt={m.companyName}
                  className="h-9 w-auto max-w-[150px] object-contain opacity-75 transition-opacity hover:opacity-100"
                />
              ) : null,
            )}
          </div>
        ) : (
          <div className="mt-8 flex items-center justify-center gap-2 border-t border-gold/15 pt-8 text-sm text-navy-text/55">
            <Building2 className="h-4 w-4 text-gold" />
            Explore our growing member directory.
          </div>
        )}
      </div>
    </section>
  )
}
