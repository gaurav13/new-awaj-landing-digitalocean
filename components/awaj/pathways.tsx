import Link from "next/link"
import {
  Users,
  UsersRound,
  Rocket,
  Handshake,
  User,
  TrendingUp,
  Building2,
  Landmark,
  MapPin,
  Briefcase,
  Globe,
  BarChart3,
  Star,
  ArrowRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Accent = "red" | "gold" | "navy"

type Pathway = {
  num: string
  icon: LucideIcon
  pill: string
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
    pill: "Connect & Engage",
    title: "Membership",
    body: "Connect with founders, investors, corporations, and ecosystem leaders through exclusive access to networks, insights, and events.",
    idealFor: [
      { icon: User, label: "Founders" },
      { icon: TrendingUp, label: "Investors" },
      { icon: Briefcase, label: "Professionals" },
    ],
    cta: "Become a Member",
    href: "/membership",
    accent: "red",
  },
  {
    num: "02",
    icon: Rocket,
    pill: "Build & Scale",
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
    pill: "Collaborate & Impact",
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
  {
    corner: string
    badge: string
    icon: string
    pill: string
    title: string
    underline: string
    idealText: string
    button: string
  }
> = {
  red: {
    corner: "from-awaj-red/12",
    badge: "bg-awaj-red text-white",
    icon: "text-awaj-red",
    pill: "bg-awaj-red/10 text-awaj-red",
    title: "text-awaj-red",
    underline: "bg-awaj-red",
    idealText: "text-awaj-red",
    button: "bg-awaj-red text-white hover:bg-awaj-red/90",
  },
  gold: {
    corner: "from-gold/15",
    badge: "bg-gold text-white",
    icon: "text-gold",
    pill: "bg-gold/15 text-gold",
    title: "text-gold",
    underline: "bg-gold",
    idealText: "text-gold",
    button: "bg-gold text-white hover:bg-gold/90",
  },
  navy: {
    corner: "from-navy/12",
    badge: "bg-navy text-white",
    icon: "text-navy",
    pill: "bg-navy/10 text-navy",
    title: "text-navy-text",
    underline: "bg-navy",
    idealText: "text-navy-text",
    button: "bg-navy text-white hover:bg-navy/90",
  },
}

const BOTTOM_FEATURES: { icon: LucideIcon; title: string; body: string }[] = [
  { icon: UsersRound, title: "Global Network", body: "Access to 200+ ecosystem leaders" },
  { icon: Globe, title: "Exclusive Opportunities", body: "Early access to events, programs & insights" },
  { icon: BarChart3, title: "Growth & Impact", body: "Resources and connections to scale globally" },
  { icon: Star, title: "Trusted Community", body: "Built on trust, collaboration and shared success" },
]

export function Pathways() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-10 lg:px-10 lg:py-14">
      {/* Heading */}
      <div className="mb-10 text-center lg:mb-12">
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-gold">Three Pathways. One Ecosystem.</p>
        <div className="mx-auto mt-3 flex items-center justify-center gap-2">
          <span className="h-px w-10 bg-gold/50" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold" />
          <span className="h-px w-10 bg-gold/50" />
        </div>
        <h2 className="mt-4 text-balance font-serif text-4xl font-bold text-navy-text md:text-5xl">
          Three Pathways. One Ecosystem.
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-navy-text/70 md:text-lg">
          Whether you&apos;re a founder, a growing startup, or an organization looking to collaborate — there&apos;s a
          pathway for you.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {PATHWAYS.map((p) => {
          const a = ACCENT[p.accent]
          return (
            <div
              key={p.num}
              className="relative flex flex-col overflow-hidden rounded-2xl border border-black/5 bg-white p-7 shadow-sm transition-shadow hover:shadow-lg"
            >
              {/* Diagonal tinted top corner */}
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-br ${a.corner} to-transparent`}
                aria-hidden="true"
              />

              <div className="relative flex items-start justify-between">
                <span className={`flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold ${a.badge}`}>
                  {p.num}
                </span>
                <p.icon className={`h-9 w-9 ${a.icon}`} strokeWidth={1.5} />
              </div>

              <div className="relative mt-6 flex flex-col items-center text-center">
                <span className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${a.pill}`}>
                  {p.pill}
                </span>
                <h3 className={`mt-4 font-serif text-2xl font-bold ${a.title}`}>{p.title}</h3>
                <span className={`mt-3 block h-0.5 w-12 ${a.underline}`} />
              </div>

              <p className="relative mt-5 text-pretty text-center text-sm leading-relaxed text-navy-text/75">
                {p.body}
              </p>

              {/* Ideal for */}
              <div className="relative mt-7">
                <div className="flex items-center gap-3">
                  <span className="h-px flex-1 bg-black/10" />
                  <span className={`text-xs font-bold ${a.idealText}`}>Ideal for:</span>
                  <span className="h-px flex-1 bg-black/10" />
                </div>
                <div className="mt-5 flex items-stretch justify-center">
                  {p.idealFor.map((it, i) => (
                    <div
                      key={it.label}
                      className={`flex flex-1 flex-col items-center gap-2 px-2 ${i > 0 ? "border-l border-black/10" : ""}`}
                    >
                      <it.icon className={`h-6 w-6 ${a.icon}`} strokeWidth={1.5} />
                      <span className="text-center text-xs font-medium leading-tight text-navy-text/80">
                        {it.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href={p.href}
                className={`relative mt-7 inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-bold transition-colors ${a.button}`}
              >
                {p.cta}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          )
        })}
      </div>

      {/* Bottom feature bar */}
      <div className="mt-6 rounded-2xl border border-black/5 bg-white px-6 py-7 shadow-sm md:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {BOTTOM_FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`flex items-center gap-3 ${i > 0 ? "lg:border-l lg:border-black/10 lg:pl-6" : ""}`}
            >
              <f.icon className="h-9 w-9 shrink-0 text-gold" strokeWidth={1.5} />
              <div>
                <p className="text-sm font-bold text-navy-text">{f.title}</p>
                <p className="mt-0.5 text-xs leading-snug text-navy-text/70">{f.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
