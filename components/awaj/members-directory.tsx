"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Building2, Globe, ArrowUpRight, Search, X } from "lucide-react"
import type { DirectoryOrganization } from "@/lib/organization-types"
import { latestNThenShuffle, recencyMs } from "@/lib/shuffle"

type FilterKey = "tag" | "country" | "industry" | "event" | "program"

// Number of most-recent organizations pinned to the top before randomizing the rest.
const LATEST_PINNED = 20

const ALL = "all"

function OrganizationCard({ o }: { o: DirectoryOrganization }) {
  return (
    <div className="flex h-full flex-col rounded-2xl border border-gold/20 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="flex items-center gap-4">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-gold/15 bg-white p-2">
          {o.logoUrl ? (
            <img
              src={o.logoUrl || "/placeholder.svg"}
              alt={`${o.name} logo`}
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <Building2 className="h-9 w-9 text-gold" />
          )}
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-serif text-lg font-bold text-navy-text">{o.name}</h3>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {(o.tags && o.tags.length > 0 ? o.tags : [o.type]).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-gold/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy-text"
              >
                {tag}
              </span>
            ))}
            {o.country ? <span className="text-xs text-navy-text/55">{o.country}</span> : null}
          </div>
        </div>
      </div>

      {o.industry ? (
        <p className="mt-3 text-xs font-medium uppercase tracking-wide text-gold">{o.industry}</p>
      ) : null}

      {o.description ? (
        <p className="mt-2 text-pretty text-sm leading-relaxed text-navy-text/70">{o.description}</p>
      ) : null}

      {o.events.length > 0 || o.programs.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {o.events.map((e) => (
            <Link
              key={`e-${e.id}`}
              href={`/events/${e.slug}`}
              className="rounded-full border border-gold/30 bg-beige/40 px-2.5 py-0.5 text-[11px] font-medium text-navy-text/70 transition-colors hover:border-gold hover:text-navy-text"
            >
              {e.title}
            </Link>
          ))}
          {o.programs.map((p) => (
            <Link
              key={`p-${p.id}`}
              href={`/programs/${p.slug}`}
              className="rounded-full border border-awaj-red/25 bg-awaj-red/5 px-2.5 py-0.5 text-[11px] font-medium text-awaj-red/80 transition-colors hover:border-awaj-red hover:text-awaj-red"
            >
              {p.title}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="mt-auto flex flex-wrap items-center gap-3 pt-5">
        {o.websiteUrl ? (
          <a
            href={o.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-navy-text/80 transition-colors hover:text-awaj-red"
          >
            <Globe className="h-4 w-4 text-awaj-red" />
            Website
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        ) : null}
        <Link
          href={`/contact?member=${encodeURIComponent(o.name)}`}
          className="ml-auto inline-flex items-center gap-1.5 rounded-full bg-navy px-4 py-2 text-xs font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
        >
          Request to Contact
        </Link>
      </div>
    </div>
  )
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <label className="flex min-w-[150px] flex-1 flex-col gap-1.5">
      <span className="text-xs font-semibold uppercase tracking-wide text-navy-text/55">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-10 rounded-lg border border-gold/30 bg-white px-3 text-sm text-navy-text outline-none transition-colors focus:border-gold"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  )
}

export function MembersDirectory({ organizations }: { organizations: DirectoryOrganization[] }) {
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    tag: ALL,
    country: ALL,
    industry: ALL,
    event: ALL,
    program: ALL,
  })

  // Base ordering: the 20 newest added/updated organizations first (in newest-first order),
  // then the remaining organizations shuffled. Done AFTER mount (not during render) so the SSR
  // HTML and first client paint match — avoiding hydration mismatches — while still producing a
  // fresh random order for the rest on every page load/visit.
  const [ordered, setOrdered] = useState<DirectoryOrganization[]>(organizations)
  useEffect(() => {
    setOrdered(latestNThenShuffle(organizations, LATEST_PINNED, (o) => recencyMs(o.createdAt, o.updatedAt)))
  }, [organizations])

  // Build the distinct option lists from the data itself.
  const options = useMemo(() => {
    const tags = new Set<string>()
    const countries = new Set<string>()
    const industries = new Set<string>()
    const events = new Map<string, string>()
    const programs = new Map<string, string>()
    for (const o of organizations) {
      const oTags = o.tags && o.tags.length > 0 ? o.tags : [o.type]
      for (const t of oTags) tags.add(t)
      if (o.country) countries.add(o.country)
      if (o.industry) industries.add(o.industry)
      for (const e of o.events) events.set(String(e.id), e.title)
      for (const p of o.programs) programs.set(String(p.id), p.title)
    }
    const sortStr = (a: string, b: string) => a.localeCompare(b)
    const toOpts = (vals: string[], allLabel: string) => [
      { value: ALL, label: allLabel },
      ...vals.sort(sortStr).map((v) => ({ value: v, label: v })),
    ]
    const toMapOpts = (m: Map<string, string>, allLabel: string) => [
      { value: ALL, label: allLabel },
      ...Array.from(m.entries())
        .sort((a, b) => sortStr(a[1], b[1]))
        .map(([value, label]) => ({ value, label })),
    ]
    return {
      tag: toOpts(Array.from(tags), "All tags"),
      country: toOpts(Array.from(countries), "All countries"),
      industry: toOpts(Array.from(industries), "All industries"),
      event: toMapOpts(events, "All events"),
      program: toMapOpts(programs, "All programs"),
    }
  }, [organizations])

  const filtered = useMemo(() => {
    return ordered.filter((o) => {
      const oTags = o.tags && o.tags.length > 0 ? o.tags : [o.type]
      if (filters.tag !== ALL && !oTags.includes(filters.tag)) return false
      if (filters.country !== ALL && o.country !== filters.country) return false
      if (filters.industry !== ALL && o.industry !== filters.industry) return false
      if (filters.event !== ALL && !o.events.some((e) => String(e.id) === filters.event)) return false
      if (filters.program !== ALL && !o.programs.some((p) => String(p.id) === filters.program)) return false
      if (search.trim()) {
        const q = search.toLowerCase()
        const hay =
          `${o.name} ${o.country ?? ""} ${o.industry ?? ""} ${o.type} ${oTags.join(" ")} ${o.description ?? ""}`.toLowerCase()
        if (!hay.includes(q)) return false
      }
      return true
    })
  }, [ordered, filters, search])

  const hasActiveFilters =
    search.trim() !== "" || (Object.keys(filters) as FilterKey[]).some((k) => filters[k] !== ALL)

  function reset() {
    setSearch("")
    setFilters({ tag: ALL, country: ALL, industry: ALL, event: ALL, program: ALL })
  }

  function set(key: FilterKey, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div>
      {/* Filter bar */}
      <div className="rounded-2xl border border-gold/20 bg-white p-5 shadow-sm">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-navy-text/40" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search organizations by name, country, industry..."
            className="h-11 w-full rounded-lg border border-gold/30 bg-white pl-9 pr-3 text-sm text-navy-text outline-none transition-colors focus:border-gold"
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {options.tag.map((opt) => {
            const active = filters.tag === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => set("tag", opt.value)}
                className={`rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "border-navy bg-navy text-white"
                    : "border-gold/30 bg-white text-navy-text/70 hover:border-gold hover:text-navy-text"
                }`}
              >
                {opt.label}
              </button>
            )
          })}
        </div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Select label="Country" value={filters.country} onChange={(v) => set("country", v)} options={options.country} />
          <Select
            label="Industry"
            value={filters.industry}
            onChange={(v) => set("industry", v)}
            options={options.industry}
          />
          <Select label="Event" value={filters.event} onChange={(v) => set("event", v)} options={options.event} />
          <Select label="Program" value={filters.program} onChange={(v) => set("program", v)} options={options.program} />
        </div>
      </div>

      {/* Results header */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-navy-text/65">
          Showing <span className="font-semibold text-navy-text">{filtered.length}</span> of {organizations.length}{" "}
          organization{organizations.length === 1 ? "" : "s"}
        </p>
        {hasActiveFilters ? (
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 px-3 py-1.5 text-xs font-semibold text-navy-text/70 transition-colors hover:border-gold hover:text-navy-text"
          >
            <X className="h-3.5 w-3.5" />
            Clear filters
          </button>
        ) : null}
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-gold/20 bg-white p-12 text-center">
          <h2 className="font-serif text-xl font-bold text-navy-text">No organizations match your filters</h2>
          <p className="mt-2 text-sm text-navy-text/60">Try clearing some filters or adjusting your search.</p>
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((o) => (
            <OrganizationCard key={o.id} o={o} />
          ))}
        </div>
      )}
    </div>
  )
}
