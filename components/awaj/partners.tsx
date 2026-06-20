import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { getAllPartners } from "@/app/actions/partners"

type Partner = {
  id: number
  name: string
  tier: string
  logoUrl: string | null
  linkUrl: string | null
}

function PartnerItem({ p }: { p: Partner }) {
  const inner = p.logoUrl ? (
    <img
      src={p.logoUrl || "/placeholder.svg"}
      alt={p.name}
      className="h-10 w-auto max-w-[160px] object-contain opacity-80 transition-opacity group-hover/card:opacity-100"
    />
  ) : (
    <span className="text-center font-serif text-base font-bold leading-tight tracking-tight text-navy/55">
      {p.name}
    </span>
  )
  return <div className="flex items-center">{inner}</div>
}

function Tier({ label, items }: { label: string; items: Partner[] }) {
  if (items.length === 0) return null
  return (
    <div>
      <div className="mb-7 text-center">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">{label}</h3>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6">
        {items.map((p) => (
          <PartnerItem key={p.id} p={p} />
        ))}
      </div>
    </div>
  )
}

export async function Partners() {
  const all = await getAllPartners()
  const institutions = all.filter((p) => p.tier === "institution")
  const strategic = all.filter((p) => p.tier !== "institution")

  if (all.length === 0) return null

  return (
    <section id="partners" className="mx-auto max-w-[1280px] px-5 py-10 lg:px-10 lg:py-16">
      <Link
        href="/members"
        className="group/card block rounded-3xl border border-gold/25 bg-white px-6 py-12 shadow-sm transition-shadow hover:shadow-md md:px-10"
      >
        <Tier label="Supported by Leading Institutions" items={institutions} />
        {institutions.length > 0 && strategic.length > 0 && (
          <div className="mx-auto my-10 h-px w-full max-w-3xl bg-gold/20" />
        )}
        <Tier label="Strategic Ecosystem Partners" items={strategic} />
        <div className="mt-10 flex items-center justify-center">
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors group-hover/card:text-navy-text">
            View all members
            <ArrowRight className="h-4 w-4 transition-transform group-hover/card:translate-x-0.5" />
          </span>
        </div>
      </Link>
    </section>
  )
}
