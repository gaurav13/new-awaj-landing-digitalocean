import Link from "next/link"
import { Users, Rocket, Handshake, User, TrendingUp, Building2, Landmark, MapPin, ArrowRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Accent = "red" | "gold" | "navy"

type Pathway = {
  num: string
  icon: LucideIcon
  title: string
  body: string
  idealFor: { icon: LucideIcon; label: string }[]
  cta: string
  href: string
  accent: Accent
}

const PATHWAYS: Pathway[] = [
  {
    num: "01",
    icon: Users,
    title: "Membership",
    body: "Connect with founders, investors, corporations, and ecosystem leaders through exclusive access and events.",
    idealFor: [
      { icon: User, label: "Founders" },
      { icon: TrendingUp, label: "Investors" },
      { icon: Users, label: "Professionals" },
    ],
    cta: "Become a Member",
    href: "mailto:bm@asiaweb3alliance.jp?subject=Membership%20Inquiry",
    accent: "red",
  },
  {
    num: "02",
    icon: Rocket,
    title: "Accelerator Program",
    body: "Join our accelerator to validate, fund, and scale your startup with expert-led programs and global exposure.",
    idealFor: [
      { icon: Rocket, label: "Early-Stage Startups" },
      { icon: TrendingUp, label: "Growth Startups" },
    ],
    cta: "Apply for Accelerator",
    href: "mailto:bm@asiaweb3alliance.jp?subject=Accelerator%20Application",
    accent: "gold",
  },
  {
    num: "03",
    icon: Handshake,
    title: "Ecosystem Partnership",
    body: "Partner with AWAJ to engage with startups, co-innovate, and strengthen your presence in Japan and Asia-Pacific.",
    idealFor: [
      { icon: Building2, label: "Corporations" },
      { icon: Landmark, label: "Institutions" },
      { icon: MapPin, label: "Cities" },
    ],
    cta: "Partner With AWAJ",
    href: "mailto:bm@asiaweb3alliance.jp?subject=Partnership%20Inquiry",
    accent: "navy",
  },
]

const ACCENT: Record<
  Accent,
  { border: string; badge: string; icon: string; title: string; rule: string; button: string }
> = {
  red: {
    border: "border-awaj-red/30",
    badge: "bg-awaj-red text-white",
    icon: "text-awaj-red",
    title: "text-awaj-red",
    rule: "bg-awaj-red/30",
    button: "bg-awaj-red text-white hover:bg-awaj-red/90",
  },
  gold: {
    border: "border-gold/40",
    badge: "bg-gold text-white",
    icon: "text-gold",
    title: "text-gold",
    rule: "bg-gold/40",
    button: "bg-gold text-white hover:bg-gold/90",
  },
  navy: {
    border: "border-navy/25",
    badge: "bg-navy text-white",
    icon: "text-navy",
    title: "text-navy-text",
    rule: "bg-navy/25",
    button: "bg-navy text-white hover:bg-navy/90",
  },
}

export function Pathways() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-10">
      <div className="mb-10 text-center">
        <h2 className="font-sans text-sm font-semibold uppercase tracking-[0.25em] text-navy-text">
          Three Pathways. One Ecosystem.
        </h2>
        <div className="mx-auto mt-4 h-px w-20 bg-gold/60" />
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PATHWAYS.map((p) => {
          const a = ACCENT[p.accent]
          return (
            <div
              key={p.num}
              className={`flex flex-col rounded-2xl border ${a.border} bg-white p-7 shadow-sm transition-shadow hover:shadow-md`}
            >
              <div className="flex items-start justify-between">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${a.badge}`}
                >
                  {p.num}
                </span>
                <p.icon className={`h-9 w-9 ${a.icon}`} strokeWidth={1.5} />
              </div>

              <h3 className={`mt-6 text-center font-serif text-2xl font-bold ${a.title}`}>{p.title}</h3>
              <p className="mt-3 text-pretty text-center text-sm leading-relaxed text-navy-text/70">{p.body}</p>

              <div className="mt-6">
                <p className={`text-center text-xs font-semibold ${a.icon}`}>Ideal for:</p>
                <div className={`mx-auto mt-3 h-px w-full ${a.rule}`} />
                <div className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                  {p.idealFor.map((it) => (
                    <span key={it.label} className="flex items-center gap-1.5 text-xs text-navy-text/75">
                      <it.icon className="h-4 w-4 text-navy-text/50" strokeWidth={1.5} />
                      {it.label}
                    </span>
                  ))}
                </div>
              </div>

              <Link
                href={p.href}
                className={`mt-7 inline-flex items-center justify-center gap-2 rounded-lg px-5 py-3 text-sm font-semibold transition-colors ${a.button}`}
              >
                {p.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )
        })}
      </div>
    </section>
  )
}
