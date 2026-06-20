import Link from "next/link"
import {
  Check,
  Minus,
  Users,
  Rocket,
  Building2,
  Crown,
  Globe,
  Award,
  Landmark,
  Star,
  Handshake,
  HeartHandshake,
  ArrowRight,
  BadgeCheck,
  CircleDollarSign,
  ShieldCheck,
} from "lucide-react"

export type MembershipPlan = {
  id: number
  name: string
  icon: string
  price: string
  priceNote: string | null
  periodLabel: string | null
  badge: string | null
  description: string
  features: string[]
  ctaLabel: string
  ctaUrl: string | null
  footnote: string | null
  accent: string
  isHighlighted: boolean
  sortOrder: number
}

const ICONS: Record<string, React.ComponentType<{ className?: string; strokeWidth?: number }>> = {
  Users,
  Rocket,
  Building2,
  Crown,
  Globe,
  Award,
  Landmark,
  Star,
}

function PlanIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Users
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />
}

const MINI_FEATURES = [
  { icon: Users, title: "Connect", desc: "Engage with leaders and peers" },
  { icon: Handshake, title: "Collaborate", desc: "Co-create programs and initiatives" },
  { icon: Globe, title: "Contribute", desc: "Shape the future of Web3 together" },
]

const INFO_BLOCKS = [
  {
    icon: CircleDollarSign,
    title: "Pay When You Need",
    desc: "All members (Supporter, Startup and Corporate) enjoy free membership and pay only for matching services, introductions or programs when you need them.",
  },
  {
    icon: BadgeCheck,
    title: "One Year Membership",
    desc: "All membership plans are valid for one year from the date of joining. Renew annually to continue enjoying member benefits.",
  },
  {
    icon: HeartHandshake,
    title: "Flexible & Transparent",
    desc: "No hidden fees. You choose the services you need and pay only for the value you receive.",
  },
  {
    icon: ShieldCheck,
    title: "Trusted Network",
    desc: "Join a trusted community of innovators, investors, enterprises and policymakers building the future of Web3 in Japan and Asia.",
  },
]

export function MembershipPackages({ plans }: { plans: MembershipPlan[] }) {
  // Build the comparison table from the union of all plan features (first-seen order).
  const allFeatures: string[] = []
  for (const plan of plans) {
    for (const f of plan.features) {
      if (!allFeatures.includes(f)) allFeatures.push(f)
    }
  }
  const featureSets = plans.map((p) => new Set(p.features))

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
      {/* Hero */}
      <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">One Year Membership</p>
          <h1 className="mt-3 text-balance font-serif text-4xl font-bold leading-tight text-navy-text md:text-5xl">
            Membership Packages
          </h1>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-navy-text/70">
            Join Asia Web3 Alliance Japan and become part of a trusted network driving innovation, collaboration, and
            growth across the Web3 ecosystem.
          </p>
          <ul className="mt-8 grid gap-6 sm:grid-cols-3">
            {MINI_FEATURES.map((m) => (
              <li key={m.title} className="flex flex-col gap-2">
                <m.icon className="h-6 w-6 text-gold" strokeWidth={1.5} aria-hidden="true" />
                <div>
                  <p className="font-serif text-sm font-bold text-navy-text">{m.title}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-navy-text/60">{m.desc}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="relative overflow-hidden rounded-2xl">
          <img
            src="/images/membership-hero.png"
            alt="Business professionals networking on a rooftop overlooking the Tokyo skyline"
            className="h-64 w-full object-cover lg:h-80"
          />
        </div>
      </section>

      {/* Plan cards */}
      <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const highlighted = plan.isHighlighted || plan.accent === "navy"
          const href = plan.ctaUrl || "/contact"
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col overflow-hidden rounded-2xl border p-7 ${
                highlighted
                  ? "border-gold/40 bg-navy text-white shadow-lg"
                  : "border-gold/20 bg-white text-navy-text"
              }`}
            >
              {plan.badge ? (
                <span className="absolute right-0 top-0 rounded-bl-2xl bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-navy">
                  {plan.badge}
                </span>
              ) : null}

              <div
                className={`flex h-14 w-14 items-center justify-center rounded-full ${
                  highlighted ? "bg-white/10" : "bg-beige"
                }`}
              >
                <PlanIcon name={plan.icon} className="h-7 w-7 text-gold" />
              </div>

              <h2 className={`mt-5 font-serif text-xl font-bold ${highlighted ? "text-white" : "text-navy-text"}`}>
                {plan.name}
              </h2>

              <p className="mt-2 font-serif text-3xl font-bold text-gold">{plan.price}</p>
              {plan.priceNote ? (
                <p className={`text-xs ${highlighted ? "text-white/60" : "text-navy-text/55"}`}>{plan.priceNote}</p>
              ) : null}
              {plan.periodLabel ? (
                <p className={`mt-1 text-sm font-semibold ${highlighted ? "text-white/80" : "text-navy-text/70"}`}>
                  {plan.periodLabel}
                </p>
              ) : null}

              {plan.description ? (
                <p className={`mt-4 text-sm leading-relaxed ${highlighted ? "text-white/70" : "text-navy-text/65"}`}>
                  {plan.description}
                </p>
              ) : null}

              <ul className="mt-5 flex flex-col gap-2.5 border-t border-gold/20 pt-5">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={2.5} aria-hidden="true" />
                    <span className={highlighted ? "text-white/85" : "text-navy-text/75"}>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <Link
                  href={href}
                  className={`flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-semibold transition-opacity hover:opacity-90 ${
                    highlighted
                      ? "bg-gold text-navy"
                      : "border border-gold/50 text-navy-text hover:bg-beige"
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
                {plan.footnote ? (
                  <p
                    className={`mt-3 text-center text-xs leading-relaxed ${
                      highlighted ? "text-white/55" : "text-navy-text/50"
                    }`}
                  >
                    {plan.footnote}
                  </p>
                ) : null}
              </div>
            </div>
          )
        })}
      </section>

      {/* Comparison table */}
      {allFeatures.length > 0 ? (
        <section className="mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Membership Benefits Comparison</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-gold/20 bg-white">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-gold/20 bg-beige/50">
                  <th className="px-5 py-4 text-left font-semibold text-navy-text">Benefits</th>
                  {plans.map((p) => (
                    <th key={p.id} className="px-4 py-4 text-center">
                      <span className="flex flex-col items-center gap-1.5">
                        <PlanIcon name={p.icon} className="h-5 w-5 text-gold" />
                        <span className="text-xs font-semibold uppercase tracking-wide text-navy-text/80">
                          {p.name.replace(/\s*Member$/i, "")}
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allFeatures.map((feature, i) => (
                  <tr key={feature} className={i % 2 === 1 ? "bg-beige/20" : ""}>
                    <td className="px-5 py-3 text-navy-text/80">{feature}</td>
                    {plans.map((p, idx) => (
                      <td key={p.id} className="px-4 py-3 text-center">
                        {featureSets[idx].has(feature) ? (
                          <Check className="mx-auto h-4 w-4 text-gold" strokeWidth={2.5} aria-label="Included" />
                        ) : (
                          <Minus className="mx-auto h-4 w-4 text-navy-text/25" aria-label="Not included" />
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* Info blocks */}
      <section className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-gold/20 bg-gold/15 sm:grid-cols-2 lg:grid-cols-4">
        {INFO_BLOCKS.map((b) => (
          <div key={b.title} className="flex flex-col gap-3 bg-beige/40 p-6">
            <b.icon className="h-7 w-7 text-gold" strokeWidth={1.5} aria-hidden="true" />
            <h3 className="font-serif text-sm font-bold uppercase tracking-wide text-navy-text">{b.title}</h3>
            <p className="text-xs leading-relaxed text-navy-text/65">{b.desc}</p>
          </div>
        ))}
      </section>

      {/* CTA banner */}
      <section className="mt-12">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-navy px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">Ready to be part of the future?</h2>
            <p className="mt-2 text-white/70">Join Asia Web3 Alliance Japan today.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
            >
              Join Now
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-gold"
            >
              Or Contact Us for More Information
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
