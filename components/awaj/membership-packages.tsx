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
  Calendar,
  CreditCard,
} from "lucide-react"
import type { MembershipContent } from "@/lib/membership-content"
import { PartnersMarquee } from "@/components/awaj/partners-marquee"

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

export type MembershipHeader = {
  eyebrow: string
  title: string
  subtitle: string
  heroUrl: string
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
  Handshake,
  HeartHandshake,
  BadgeCheck,
  CircleDollarSign,
  ShieldCheck,
  Calendar,
  CreditCard,
}

function DynamicIcon({ name, className }: { name: string; className?: string }) {
  const Icon = ICONS[name] ?? Users
  return <Icon className={className} strokeWidth={1.5} aria-hidden="true" />
}

// Per-accent color styles for the light plan cards + comparison columns.
type AccentStyle = {
  iconBg: string
  iconText: string
  price: string
  check: string
  button: string
}

const ACCENTS: Record<string, AccentStyle> = {
  gold: {
    iconBg: "bg-gold/15",
    iconText: "text-gold",
    price: "text-gold",
    check: "text-gold",
    button: "border-gold/50 text-gold hover:bg-gold/10",
  },
  blue: {
    iconBg: "bg-blue-50",
    iconText: "text-blue-600",
    price: "text-blue-600",
    check: "text-blue-600",
    button: "border-blue-300 text-blue-700 hover:bg-blue-50",
  },
  green: {
    iconBg: "bg-emerald-50",
    iconText: "text-emerald-600",
    price: "text-emerald-600",
    check: "text-emerald-600",
    button: "border-emerald-300 text-emerald-700 hover:bg-emerald-50",
  },
  navy: {
    iconBg: "bg-white/10",
    iconText: "text-gold",
    price: "text-gold",
    check: "text-gold",
    button: "bg-gold text-navy hover:opacity-90",
  },
}

function accentOf(name: string): AccentStyle {
  return ACCENTS[name] ?? ACCENTS.gold
}

const MINI_FEATURES = [
  { icon: Users, title: "Connect", desc: "Engage with leaders and peers" },
  { icon: Handshake, title: "Collaborate", desc: "Co-create programs and initiatives" },
  { icon: Globe, title: "Contribute", desc: "Shape the future of Web3 together" },
]

function ComparisonCell({ value, accent }: { value: string; accent: AccentStyle }) {
  if (value === "yes") {
    return <Check className={`mx-auto h-4 w-4 ${accent.check}`} strokeWidth={2.5} aria-label="Included" />
  }
  if (value === "no" || value === "" || value === "-" || value === "—") {
    return <Minus className="mx-auto h-4 w-4 text-navy-text/25" aria-label="Not included" />
  }
  return <span className="text-xs font-medium text-navy-text/70">{value}</span>
}

export function MembershipPackages({
  plans,
  header,
  content,
}: {
  plans: MembershipPlan[]
  header: MembershipHeader
  content: MembershipContent
}) {
  const { comparison, infoBlocks, cta } = content

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
      {/* Hero */}
      <section className="grid items-center gap-8 lg:grid-cols-2 lg:gap-12">
        <div>
          {header.eyebrow ? (
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">{header.eyebrow}</p>
          ) : null}
          <h1 className="mt-3 text-balance font-serif text-4xl font-bold leading-tight text-navy-text md:text-5xl">
            {header.title}
          </h1>
          {header.subtitle ? (
            <p className="mt-4 max-w-xl text-pretty leading-relaxed text-navy-text/70">{header.subtitle}</p>
          ) : null}
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
        {header.heroUrl ? (
          <div className="relative overflow-hidden rounded-2xl bg-beige">
            <img
              src={header.heroUrl || "/placeholder.svg"}
              alt="Asia Web3 Alliance Japan membership"
              className="block h-auto w-full"
            />
          </div>
        ) : null}
      </section>

      {/* Partner logos — auto-sliding, synced with the editable Partners section */}
      <PartnersMarquee embedded />

      {/* Plan cards */}
      <section className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {plans.map((plan) => {
          const highlighted = plan.isHighlighted || plan.accent === "navy"
          const accent = accentOf(plan.accent)
          const href = plan.ctaUrl || "/contact"
          return (
            <div
              key={plan.id}
              className={`relative flex flex-col overflow-hidden rounded-2xl border p-7 ${
                highlighted ? "border-gold/40 bg-navy text-white shadow-lg" : "border-navy/10 bg-white text-navy-text"
              }`}
            >
              {plan.badge ? (
                <span className="absolute right-0 top-0 rounded-bl-2xl bg-gold px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-navy">
                  {plan.badge}
                </span>
              ) : null}

              <div className={`flex h-14 w-14 items-center justify-center rounded-full ${accent.iconBg}`}>
                <DynamicIcon name={plan.icon} className={`h-7 w-7 ${accent.iconText}`} />
              </div>

              <h2 className={`mt-5 font-serif text-xl font-bold ${highlighted ? "text-white" : "text-navy-text"}`}>
                {plan.name}
              </h2>

              <p className={`mt-2 font-serif text-3xl font-bold ${accent.price}`}>{plan.price}</p>
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

              <ul
                className={`mt-5 flex flex-col gap-2.5 border-t pt-5 ${
                  highlighted ? "border-white/15" : "border-navy/10"
                }`}
              >
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm">
                    <Check className={`mt-0.5 h-4 w-4 shrink-0 ${accent.check}`} strokeWidth={2.5} aria-hidden="true" />
                    <span className={highlighted ? "text-white/85" : "text-navy-text/75"}>{f}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-auto pt-6">
                <Link
                  href={href}
                  className={`flex w-full items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-semibold transition-colors ${
                    highlighted ? `border-transparent ${accent.button}` : accent.button
                  }`}
                >
                  {plan.ctaLabel}
                </Link>
                {plan.footnote ? (
                  <p
                    className={`mt-3 text-center text-sm font-semibold leading-relaxed ${
                      highlighted
                        ? "text-[#ebbd00]"
                        : plan.accent === "blue" || plan.accent === "green"
                          ? "text-[#890b0b]"
                          : "text-navy-text/50"
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

      {/* Comparison table (admin-editable) */}
      {comparison.length > 0 && plans.length > 0 ? (
        <section className="mt-16">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Membership Benefits Comparison</p>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-navy/10 bg-white">
            <table className="w-full min-w-[640px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-navy/10 bg-beige/50">
                  <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-wide text-navy-text">
                    Benefits
                  </th>
                  {plans.map((p) => (
                    <th key={p.id} className="px-4 py-4 text-center">
                      <span className="flex flex-col items-center gap-1.5">
                        <DynamicIcon name={p.icon} className={`h-5 w-5 ${accentOf(p.accent).iconText}`} />
                        <span className="text-xs font-semibold uppercase tracking-wide text-navy-text/80">
                          {p.name.replace(/\s*Member$/i, "")}
                        </span>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {comparison.map((row, i) => (
                  <tr key={`${row.label}-${i}`} className={i % 2 === 1 ? "bg-beige/20" : ""}>
                    <td className="px-5 py-3 text-navy-text/80">{row.label}</td>
                    {plans.map((p, idx) => (
                      <td key={p.id} className="px-4 py-3 text-center">
                        <ComparisonCell value={row.values[idx] ?? "no"} accent={accentOf(p.accent)} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : null}

      {/* Value highlights — dark premium band */}
      {infoBlocks.length > 0 ? (
        <section className="mt-14 overflow-hidden rounded-3xl border border-gold/30 bg-navy p-2 shadow-lg">
          <div className="grid gap-px sm:grid-cols-2 lg:grid-cols-4">
            {infoBlocks.map((b, i) => (
              <div
                key={`${b.title}-${i}`}
                className="flex flex-col items-center px-6 py-9 text-center lg:[&:not(:last-child)]:border-r lg:[&:not(:last-child)]:border-gold/15"
              >
                {/* Glowing gold icon medallion */}
                <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                  <span
                    className="absolute inset-0 rounded-full border border-gold/40 bg-gradient-to-b from-gold/15 to-transparent"
                    aria-hidden="true"
                  />
                  <span
                    className="absolute inset-2 rounded-full bg-navy shadow-[0_0_20px_rgba(212,175,55,0.35)] ring-1 ring-gold/30"
                    aria-hidden="true"
                  />
                  <DynamicIcon name={b.icon} className="relative h-8 w-8 text-gold" />
                </div>

                <h3 className="font-serif text-sm font-bold uppercase tracking-wide text-white">{b.title}</h3>
                <span className="mt-2 h-px w-10 bg-gold" aria-hidden="true" />

                <p className="mt-4 text-sm leading-relaxed text-white/65">{b.desc}</p>

                {b.chipText ? (
                  <span className="mt-6 inline-flex items-center gap-2 rounded-lg border border-gold/40 bg-gold/5 px-3 py-2 text-xs font-medium text-white/85">
                    <DynamicIcon name={b.chipIcon} className="h-4 w-4 text-gold" />
                    {b.chipText}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      {/* CTA banner (admin-editable) */}
      <section className="mt-12">
        <div className="flex flex-col items-start gap-6 rounded-2xl bg-navy px-6 py-10 md:flex-row md:items-center md:justify-between md:px-12">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white md:text-3xl">{cta.title}</h2>
            {cta.subtitle ? <p className="mt-2 text-white/70">{cta.subtitle}</p> : null}
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            {cta.primaryLabel ? (
              <Link
                href={cta.primaryUrl || "/contact"}
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
              >
                {cta.primaryLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
            {cta.secondaryLabel ? (
              <Link
                href={cta.secondaryUrl || "/contact"}
                className="group inline-flex items-center justify-center gap-2 text-sm font-semibold text-white/80 transition-colors hover:text-gold"
              >
                {cta.secondaryLabel}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}
