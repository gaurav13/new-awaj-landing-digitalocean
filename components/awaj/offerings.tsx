import { Users, Handshake, BriefcaseBusiness, Globe2, Rocket, TrendingUp } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Offer = { icon: LucideIcon; title: string; body: string }

const OFFERS: Offer[] = [
  { icon: Users, title: "Mentoring", body: "One-on-one mentorship from 500+ experts and top-tier VCs." },
  {
    icon: Handshake,
    title: "Connections",
    body: "Warm introductions to investors and business partners including Fortune 500.",
  },
  { icon: BriefcaseBusiness, title: "Office Space", body: "Temporary co-working space, HR support, and legal advice." },
  { icon: Globe2, title: "Global Events", body: "Showcase your project at global events across key markets." },
  { icon: Rocket, title: "Accelerator", body: "Structured programs to accelerate growth and scale globally." },
  {
    icon: TrendingUp,
    title: "Funding Access",
    body: "Connect with leading investors and unlock funding opportunities.",
  },
]

export function Offerings() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-10">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-navy-text md:text-4xl">
          What We Offer Startups
        </h2>
        <div className="mx-auto mt-3 h-px w-20 bg-gold/60" />
      </div>

      <div className="rounded-3xl border border-gold/25 bg-white p-6 shadow-sm md:p-10">
        <div className="grid grid-cols-1 gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {OFFERS.map((o) => (
            <div key={o.title} className="flex gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-beige">
                <o.icon className="h-5 w-5 text-gold" strokeWidth={1.5} />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-navy-text">{o.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-navy-text/70">{o.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
