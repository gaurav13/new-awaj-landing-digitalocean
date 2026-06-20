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

function PartnerLogo({ p }: { p: Partner }) {
  return p.logoUrl ? (
    <img
      src={p.logoUrl || "/placeholder.svg"}
      alt={p.name}
      className="h-10 w-auto max-w-[160px] shrink-0 object-contain opacity-75 transition-all duration-300 hover:scale-105 hover:opacity-100"
    />
  ) : (
    <span className="shrink-0 px-2 text-center font-serif text-base font-bold leading-tight tracking-tight text-navy/55">
      {p.name}
    </span>
  )
}

function MarqueeRow({ items, reverse = false }: { items: Partner[]; reverse?: boolean }) {
  // Duplicate the list so the -50% translate loops seamlessly.
  const loop = [...items, ...items]
  return (
    <div className="awaj-marquee-mask group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
      <div className={`awaj-marquee-track items-center gap-x-14 py-1 pr-14 ${reverse ? "awaj-marquee-track-reverse" : ""}`}>
        {loop.map((p, i) =>
          p.linkUrl ? (
            <a
              key={`${p.id}-${i}`}
              href={p.linkUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center"
              aria-label={p.name}
            >
              <PartnerLogo p={p} />
            </a>
          ) : (
            <div key={`${p.id}-${i}`} className="flex items-center" aria-hidden={i >= items.length}>
              <PartnerLogo p={p} />
            </div>
          ),
        )}
      </div>
    </div>
  )
}

function Tier({ label, items, reverse }: { label: string; items: Partner[]; reverse?: boolean }) {
  if (items.length === 0) return null
  return (
    <div>
      <div className="mb-6 text-center">
        <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-gold">{label}</h3>
      </div>
      <MarqueeRow items={items} reverse={reverse} />
    </div>
  )
}

export async function PartnersMarquee() {
  const all = await getAllPartners()
  const institutions = all.filter((p) => p.tier === "institution")
  const strategic = all.filter((p) => p.tier !== "institution")

  if (all.length === 0) return null

  return (
    <section aria-label="Our partners" className="mt-12">
      <div className="rounded-3xl border border-gold/25 bg-white px-4 py-12 shadow-sm md:px-10">
        <Tier label="Supported by Leading Institutions" items={institutions} />
        {institutions.length > 0 && strategic.length > 0 && (
          <div className="mx-auto my-10 h-px w-full max-w-3xl bg-gold/20" />
        )}
        <Tier label="Strategic Ecosystem Partners" items={strategic} reverse />
        <div className="mt-10 flex items-center justify-center">
          <Link
            href="/members"
            className="group inline-flex items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-navy-text"
          >
            View all members
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}
