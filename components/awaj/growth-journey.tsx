import {
  Globe,
  Handshake,
  Landmark,
  LifeBuoy,
  Target,
  Lightbulb,
  ClipboardCheck,
  CircleDollarSign,
  BarChart3,
  Flag,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

const VALUE_PROPS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Globe, title: "Gateway to Asia-Pacific", desc: "Connect to 4B+ consumers" },
  { icon: Handshake, title: "Strong Network of Investors", desc: "Access to global capital" },
  { icon: Landmark, title: "Trusted by Institutions", desc: "Supported by government, corporations & universities" },
  { icon: LifeBuoy, title: "End-to-End Growth Support", desc: "From idea to IPO and beyond" },
  { icon: Target, title: "Global Impact", desc: "Real opportunities, real outcomes" },
]

const STEPS: { icon: LucideIcon; title: string; desc: string }[] = [
  { icon: Lightbulb, title: "Ideate", desc: "Validate your idea and market" },
  { icon: ClipboardCheck, title: "Build & Validate", desc: "Refine your model with mentors and experts" },
  { icon: CircleDollarSign, title: "Fund", desc: "Access investors and secure capital" },
  { icon: BarChart3, title: "Scale", desc: "Grow your business in Japan and APAC" },
  { icon: Globe, title: "Expand", desc: "Enter new markets and build partnerships" },
  { icon: Flag, title: "IPO & Beyond", desc: "Achieve long-term value and global impact" },
]

export function GrowthJourney() {
  return (
    <section className="mt-4">
      {/* Top value-prop band */}
      <div className="bg-navy">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-5 lg:divide-x lg:divide-gold/20 lg:px-10">
          {VALUE_PROPS.map((v) => (
            <div key={v.title} className="flex items-start gap-3 lg:px-5 lg:first:pl-0">
              <v.icon className="h-7 w-7 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
              <div>
                <p className="font-serif text-sm font-bold leading-snug text-white">{v.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-white/60">{v.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Unique value + journey */}
      <div className="mx-auto max-w-[1440px] px-5 py-16 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left intro */}
          <div className="lg:col-span-4">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-awaj-red">Our Unique Value</p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-navy-text md:text-4xl">
              We Support Every Step of Your Growth Journey
            </h2>
            <p className="mt-5 max-w-md text-pretty leading-relaxed text-navy-text/70">
              Startups don&apos;t just need funding. They need the right connections, resources, and ecosystem to grow
              and succeed globally.
            </p>
          </div>

          {/* Right journey steps */}
          <div className="lg:col-span-8">
            <ol className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-6 lg:gap-x-2">
              {STEPS.map((s, i) => (
                <li key={s.title} className="relative flex flex-col items-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-beige/40">
                    <s.icon className="h-7 w-7 text-gold" strokeWidth={1.5} aria-hidden="true" />
                  </div>
                  {i < STEPS.length - 1 && (
                    <ArrowRight
                      className="absolute -right-2 top-8 hidden h-5 w-5 -translate-y-1/2 text-gold/60 lg:block"
                      aria-hidden="true"
                    />
                  )}
                  <h3 className="mt-4 font-serif text-base font-bold text-navy-text">{s.title}</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-navy-text/60">{s.desc}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  )
}
