import Link from "next/link"
import {
  Users,
  UserPlus,
  UserCheck,
  UserCog,
  GraduationCap,
  Handshake,
  Building2,
  Globe2,
  Rocket,
  TrendingUp,
  Scale,
  Megaphone,
  Presentation,
  Wallet,
  Lightbulb,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

type Feature = { icon: LucideIcon; label: string }
type Offer = {
  icon: LucideIcon
  title: string
  body: string
  features: [Feature, Feature, Feature]
}

const OFFERS: Offer[] = [
  {
    icon: UserCheck,
    title: "Expert Mentorship",
    body: "1:1 guidance from 500+ industry leaders, operators, and top-tier VCs who have built and scaled globally.",
    features: [
      { icon: Users, label: "500+ Experts" },
      { icon: UserPlus, label: "1:1 Mentorship" },
      { icon: GraduationCap, label: "Domain Specialists" },
    ],
  },
  {
    icon: Handshake,
    title: "Powerful Connections",
    body: "Access our global network of investors, corporates, and ecosystem partners to open doors and create opportunities.",
    features: [
      { icon: Building2, label: "Investor Network" },
      { icon: Users, label: "Corporate Partners" },
      { icon: TrendingUp, label: "Strategic Introductions" },
    ],
  },
  {
    icon: Building2,
    title: "Workspace & Support",
    body: "Premium co-working space, operational support, HR guidance, and legal advice so you can build with confidence.",
    features: [
      { icon: Building2, label: "Plug & Play Workspace" },
      { icon: UserCog, label: "HR & Hiring Support" },
      { icon: Scale, label: "Legal Guidance" },
    ],
  },
  {
    icon: Globe2,
    title: "Global Exposure",
    body: "Showcase your startup at top global events, summits, and roadshows across Asia and key international markets.",
    features: [
      { icon: Globe2, label: "Global Events & Roadshows" },
      { icon: Megaphone, label: "Media Exposure" },
      { icon: Users, label: "Market Expansion" },
    ],
  },
  {
    icon: Rocket,
    title: "Accelerator Programs",
    body: "Curated accelerator programs with expert workshops, mentorship, and go-to-market support to scale faster.",
    features: [
      { icon: Presentation, label: "Expert-Led Workshops" },
      { icon: TrendingUp, label: "Hands-on Mentorship" },
      { icon: UserCheck, label: "Go-to-Market Support" },
    ],
  },
  {
    icon: TrendingUp,
    title: "Funding Access",
    body: "Connect with leading investors and VCs in our network and unlock funding opportunities for your next stage.",
    features: [
      { icon: UserCheck, label: "Investor Access" },
      { icon: Wallet, label: "Funding Opportunities" },
      { icon: Lightbulb, label: "Pitch Support" },
    ],
  },
]

export function Offerings() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-10 lg:px-10 lg:py-16">
      {/* Heading */}
      <div className="mx-auto mb-10 max-w-3xl text-center lg:mb-14">
        <div className="flex items-center justify-center gap-3">
          <span className="text-xs font-bold uppercase tracking-[0.28em] text-gold">What We Offer</span>
        </div>
        <div className="mx-auto mt-2 flex items-center justify-center gap-2">
          <span className="h-px w-12 bg-gold/40" />
          <span className="h-1.5 w-1.5 rotate-45 bg-gold/70" />
          <span className="h-px w-12 bg-gold/40" />
        </div>

        <h2 className="mt-5 text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-navy-text md:text-5xl">
          Everything Startups Need to{" "}
          <span className="text-gold">{"Build, Grow & "}</span>
          Go Global
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-pretty text-sm leading-relaxed text-navy-text/70 md:text-base">
          AWAJ empowers startups with capital, mentorship, networks, and world-class programs to accelerate growth and
          create global impact.
        </p>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
        {OFFERS.map((o) => (
          <article
            key={o.title}
            className="flex flex-col rounded-2xl border border-gold/15 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-beige">
                <o.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
              </div>
              <div className="flex-1">
                <h3 className="font-serif text-xl font-bold leading-snug text-navy-text">{o.title}</h3>
                <div className="mt-1.5 h-0.5 w-9 bg-gold/70" />
              </div>
            </div>

            <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-text/70">{o.body}</p>

            <div className="mt-5 grid grid-cols-3 border-t border-gold/15 pt-4">
              {o.features.map((f, i) => (
                <div
                  key={f.label}
                  className={`flex items-start gap-1.5 ${i > 0 ? "border-l border-gold/15 pl-2" : ""} ${
                    i < o.features.length - 1 ? "pr-2" : ""
                  }`}
                >
                  <f.icon className="mt-0.5 h-4 w-4 shrink-0 text-gold" strokeWidth={1.5} />
                  <span className="text-[11px] font-medium leading-tight text-navy-text/80">{f.label}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>

      {/* CTA banner */}
      <div className="mt-8 overflow-hidden rounded-2xl bg-navy lg:mt-10">
        <div className="flex flex-col items-center gap-6 px-6 py-8 text-center md:flex-row md:justify-between md:px-10 md:py-9 md:text-left">
          <div className="flex items-center gap-5">
            <div className="hidden shrink-0 sm:block">
              <Rocket className="h-12 w-12 text-gold" strokeWidth={1.25} />
            </div>
            <div>
              <h3 className="font-serif text-2xl font-bold text-ivory md:text-3xl">Join the AWAJ Ecosystem Today</h3>
              <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-ivory/70">
                Be part of a trusted community of founders, investors, and innovators shaping the future of Asia and
                beyond.
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Link
              href="/membership"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
            >
              Join as a Startup
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href="/programs"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-ivory/40 px-6 py-3 text-sm font-semibold text-ivory transition-colors hover:bg-ivory/10"
            >
              Explore Programs
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
