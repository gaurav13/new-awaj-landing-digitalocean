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
      className="h-9 w-auto max-w-[150px] shrink-0 object-contain opacity-75 transition-all duration-300 hover:scale-105 hover:opacity-100 md:h-11"
    />
  ) : (
    <span className="shrink-0 px-2 text-center font-serif text-base font-bold leading-tight tracking-tight text-navy/55">
      {p.name}
    </span>
  )
}

/**
 * Logo strip shown in the Ecosystem Leaders area: "Speaker Support & Leading Institutions".
 * Combines all partner tiers into a single, seamless auto-scrolling marquee row to mirror
 * the reference design (heading left, "View All Partners" right, single logo row).
 */
export async function InstitutionsStrip({
  title = "EcoSystem Partners and",
}: {
  title?: string
}) {
  const all = (await getAllPartners()) as Partner[]
  if (all.length === 0) return null

  // Order institutions first, then the rest, then duplicate for a seamless loop.
  const ordered = [...all.filter((p) => p.tier === "institution"), ...all.filter((p) => p.tier !== "institution")]
  const loop = [...ordered, ...ordered]

  return (
    <section aria-label={title} className="mt-12">
      <div className="mb-5 flex items-center justify-between gap-4">
        <h2 className="font-sans text-sm font-bold uppercase tracking-[0.18em] text-navy-text md:text-base">{title}</h2>
        <Link
          href="/members"
          className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-gold transition-colors hover:text-navy-text"
        >
          View All Partners
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      </div>

      <div className="rounded-2xl border border-gold/25 bg-white px-4 py-8 shadow-sm md:px-8">
        <div className="awaj-marquee-mask group relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
          <div className="awaj-marquee-track items-center gap-x-12 md:gap-x-16">
            {loop.map((p, i) =>
              p.linkUrl ? (
                <a
                  key={`${p.id}-${i}`}
                  href={p.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center"
                  aria-label={p.name}
                  aria-hidden={i >= ordered.length}
                >
                  <PartnerLogo p={p} />
                </a>
              ) : (
                <div key={`${p.id}-${i}`} className="flex items-center" aria-hidden={i >= ordered.length}>
                  <PartnerLogo p={p} />
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
