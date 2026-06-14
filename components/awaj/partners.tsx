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
      className="h-10 w-auto max-w-[160px] object-contain opacity-80 transition-opacity hover:opacity-100"
    />
  ) : (
    <span className="text-center font-serif text-base font-bold leading-tight tracking-tight text-navy/55 transition-colors hover:text-gold">
      {p.name}
    </span>
  )

  if (p.linkUrl) {
    return (
      <a href={p.linkUrl} target="_blank" rel="noopener noreferrer" className="flex items-center" aria-label={p.name}>
        {inner}
      </a>
    )
  }
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
    <section id="partners" className="mx-auto max-w-[1280px] px-5 pb-16 lg:px-10">
      <div className="rounded-3xl border border-gold/25 bg-white px-6 py-12 shadow-sm md:px-10">
        <Tier label="Supported by Leading Institutions" items={institutions} />
        {institutions.length > 0 && strategic.length > 0 && (
          <div className="mx-auto my-10 h-px w-full max-w-3xl bg-gold/20" />
        )}
        <Tier label="Strategic Ecosystem Partners" items={strategic} />
      </div>
    </section>
  )
}
