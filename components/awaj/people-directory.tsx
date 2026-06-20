"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Search, ExternalLink, CalendarDays, Layers } from "lucide-react"
import type { DirectoryPerson } from "@/app/actions/people"

export function PeopleDirectory({ people }: { people: DirectoryPerson[] }) {
  const [query, setQuery] = useState("")
  const [activeRole, setActiveRole] = useState("All")

  const roles = useMemo(() => {
    const set = new Set<string>()
    for (const p of people) for (const r of p.roleTypes ?? []) set.add(r)
    return ["All", ...Array.from(set).sort()]
  }, [people])

  const filtered = useMemo(() => {
    return people.filter((p) => {
      const matchesRole = activeRole === "All" || (p.roleTypes ?? []).includes(activeRole)
      const haystack = `${p.fullName} ${p.jobTitle ?? ""} ${p.companyName ?? ""} ${p.country ?? ""}`.toLowerCase()
      const matchesQuery = !query.trim() || haystack.includes(query.toLowerCase())
      return matchesRole && matchesQuery
    })
  }, [people, activeRole, query])

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-md">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-text/40" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, company, or role..."
            className="h-11 w-full rounded-full border border-gold/30 bg-white pl-10 pr-4 text-sm text-navy-text outline-none transition-colors focus:border-gold"
            aria-label="Search people"
          />
        </div>
        <p className="text-sm text-navy-text/55">
          {filtered.length} {filtered.length === 1 ? "person" : "people"}
        </p>
      </div>

      {/* Role filters */}
      <div className="mt-5 flex flex-wrap gap-2">
        {roles.map((role) => (
          <button
            key={role}
            type="button"
            onClick={() => setActiveRole(role)}
            className={`rounded-full border px-4 py-1.5 text-sm font-medium transition-colors ${
              activeRole === role
                ? "border-awaj-red bg-awaj-red text-white"
                : "border-gold/30 bg-white text-navy-text/70 hover:border-gold hover:text-navy-text"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-gold/20 bg-white p-12 text-center">
          <h2 className="font-serif text-xl font-bold text-navy-text">No people found</h2>
          <p className="mt-2 text-sm text-navy-text/60">Try a different search or filter.</p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map((person) => (
            <PersonCard key={person.id} person={person} />
          ))}
        </div>
      )}
    </div>
  )
}

function PersonCard({ person }: { person: DirectoryPerson }) {
  const roles = person.roleTypes ?? []
  return (
    <article className="flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-[4/5] overflow-hidden bg-beige">
        <img
          src={person.profilePhoto || "/placeholder.svg?height=500&width=400&query=professional+headshot"}
          alt={person.fullName}
          className="h-full w-full object-cover"
        />
        {person.featured && (
          <span className="absolute left-3 top-3 rounded-full bg-awaj-red px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
            Featured
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-serif text-lg font-bold leading-snug text-navy-text">{person.fullName}</h3>
        {(person.jobTitle || person.companyName) && (
          <p className="mt-1 text-sm text-navy-text/65">
            {[person.jobTitle, person.companyName].filter(Boolean).join(" · ")}
          </p>
        )}

        {roles.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {roles.map((r) => (
              <span
                key={r}
                className="rounded-full bg-gold/10 px-2.5 py-0.5 text-[11px] font-medium text-gold"
              >
                {r}
              </span>
            ))}
          </div>
        )}

        {(person.events.length > 0 || person.programs.length > 0) && (
          <div className="mt-4 flex flex-col gap-2 border-t border-gold/15 pt-4">
            {person.events.length > 0 && (
              <div className="flex items-start gap-2 text-xs text-navy-text/70">
                <CalendarDays className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                <span className="flex flex-wrap gap-x-1.5">
                  {person.events.map((e, i) => (
                    <span key={e.id}>
                      <Link href={`/events/${e.slug}`} className="font-medium text-navy-text hover:text-awaj-red">
                        {e.title}
                      </Link>
                      {i < person.events.length - 1 ? "," : ""}
                    </span>
                  ))}
                </span>
              </div>
            )}
            {person.programs.length > 0 && (
              <div className="flex items-start gap-2 text-xs text-navy-text/70">
                <Layers className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold" />
                <span className="flex flex-wrap gap-x-1.5">
                  {person.programs.map((p, i) => (
                    <span key={p.id}>
                      <Link href={`/programs/${p.slug}`} className="font-medium text-navy-text hover:text-awaj-red">
                        {p.title}
                      </Link>
                      {i < person.programs.length - 1 ? "," : ""}
                    </span>
                  ))}
                </span>
              </div>
            )}
          </div>
        )}

        {person.showLinkedin && person.linkedinUrl && (
          <a
            href={person.linkedinUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex w-fit items-center gap-1.5 text-xs font-semibold text-awaj-red hover:underline"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            LinkedIn
          </a>
        )}
      </div>
    </article>
  )
}
