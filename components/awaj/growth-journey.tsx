import {
  Globe,
  Handshake,
  Landmark,
  Network,
  Building2,
  Target,
  FileText,
  TrendingUp,
  Lightbulb,
  Users,
  BarChart3,
  ArrowRight,
  type LucideIcon,
} from "lucide-react"

const FEATURES: { icon: LucideIcon; title: string; desc: string }[] = [
  {
    icon: Handshake,
    title: "Neutral & Independent",
    desc: "AWAJ is a neutral platform that connects startups with the right opportunities without bias.",
  },
  {
    icon: Landmark,
    title: "Government Supported",
    desc: "Supported by key government institutions and public organizations to drive innovation and economic growth.",
  },
  {
    icon: Network,
    title: "Deep & Real Network",
    desc: "Strong relationships with top-tier investors, corporations, government bodies, and ecosystem partners.",
  },
  {
    icon: Building2,
    title: "Corporate Collaboration",
    desc: "Strategic partnerships with leading enterprises for pilots, PoCs, and go-to-market opportunities.",
  },
  {
    icon: Target,
    title: "Execution-Focused",
    desc: "We don't just connect—we support startups through execution, expansion, and long-term success.",
  },
  {
    icon: Globe,
    title: "Global Impact",
    desc: "Helping startups from around the world scale into high-growth markets across Asia-Pacific and beyond.",
  },
]

const STATS: { highlight: string; line1: string; line2: string }[] = [
  { highlight: "25+", line1: "Countries", line2: "Across APAC" },
  { highlight: "Strategic", line1: "Global", line2: "Partnerships" },
  { highlight: "Cross-Border", line1: "Investor", line2: "Network" },
  { highlight: "Diverse", line1: "Industry", line2: "Ecosystem" },
]

const STEPS: { icon: LucideIcon; num: string; title: string; desc: string }[] = [
  { icon: FileText, num: "01", title: "Foundation", desc: "Build strong fundamentals and scalable business model" },
  { icon: TrendingUp, num: "02", title: "Growth", desc: "Achieve product-market fit and accelerate revenue" },
  { icon: Lightbulb, num: "03", title: "Expansion", desc: "Scale operations and enter new high-potential markets" },
  { icon: Users, num: "04", title: "Maturity", desc: "Strengthen governance, financials and organizational structure" },
  { icon: Handshake, num: "05", title: "IPO Readiness", desc: "Prepare for public markets with strategy, compliance and positioning" },
  { icon: BarChart3, num: "06", title: "IPO & Value Creation", desc: "Go public and create long-term value for all stakeholders" },
]

export function GrowthJourney() {
  return (
    <section className="mt-4">
      {/* Why leading organizations choose AWAJ — navy band */}
      <div className="bg-navy">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-16 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-20">
          {/* Left intro */}
          <div className="lg:col-span-3">
            <h2 className="text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-white md:text-4xl">
              Why Leading Organizations Choose <span className="text-awaj-red">AWAJ</span>
            </h2>
            <div className="mt-5 h-0.5 w-12 bg-awaj-red" />
            <p className="mt-6 text-pretty leading-relaxed text-white/65">
              AWAJ is a neutral, trusted, and impact-driven platform. We bring together all key players in the
              innovation ecosystem to create real value for startups and the economy.
            </p>
          </div>

          {/* Middle: feature grid in a bordered box with dividers */}
          <div className="lg:col-span-5 lg:px-2">
            <div className="overflow-hidden rounded-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2">
                {FEATURES.map((f, i) => (
                  <div
                    key={f.title}
                    className={`flex gap-4 border-gold/15 p-6 ${i % 2 === 0 ? "sm:border-r" : ""} ${
                      i < FEATURES.length - 1 ? "border-b" : ""
                    } ${i >= FEATURES.length - 2 ? "sm:border-b-0" : ""}`}
                  >
                    <f.icon className="h-7 w-7 shrink-0 text-gold" strokeWidth={1.5} aria-hidden="true" />
                    <div>
                      <h3 className="font-serif text-base font-bold text-white">{f.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-white/55">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: global reach + map + stats */}
          <div className="lg:col-span-4">
            <h3 className="font-serif text-2xl font-bold leading-tight text-white md:text-3xl">
              Global Reach. Real Impact.
            </h3>
            <p className="mt-4 text-pretty leading-relaxed text-white/65">
              AWAJ connects startups to opportunities across Asia-Pacific and the world.
            </p>

            <img
              src="/awaj-world-map-dotted.png"
              alt="Dotted world map highlighting AWAJ's reach across the Asia-Pacific region"
              className="mt-6 w-full opacity-90 mix-blend-lighten"
            />

            <dl className="mt-6 grid grid-cols-2 gap-y-6 sm:grid-cols-4 sm:divide-x sm:divide-gold/20">
              {STATS.map((s, i) => (
                <div key={s.highlight} className={i > 0 ? "sm:pl-4" : "sm:pr-4"}>
                  <dt
                    className={`font-serif font-bold leading-none text-awaj-red ${
                      i === 0 ? "text-3xl" : "text-base"
                    }`}
                  >
                    {s.highlight}
                  </dt>
                  <dd className="mt-2 text-sm leading-snug text-white/75">
                    {s.line1}
                    <br />
                    {s.line2}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {/* Your path to IPO — light band */}
      <div className="bg-ivory">
        <div className="mx-auto grid max-w-[1440px] grid-cols-1 gap-12 px-5 py-16 lg:grid-cols-12 lg:gap-10 lg:px-10 lg:py-20">
          {/* Left intro */}
          <div className="lg:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-awaj-red">Your Path to IPO</p>
            <h2 className="mt-3 text-balance font-serif text-3xl font-bold leading-tight tracking-tight text-navy-text md:text-4xl">
              From Startup to Public Company
            </h2>
          </div>

          {/* Right: steps in an elegant card */}
          <div className="lg:col-span-9">
            <div className="rounded-2xl border border-gold/20 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
              <ol className="grid grid-cols-1 gap-x-2 gap-y-10 sm:grid-cols-2 lg:grid-cols-6">
                {STEPS.map((s, i) => (
                  <li key={s.num} className="relative flex flex-col items-center text-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full border border-gold/30 bg-beige/40">
                      <s.icon className="h-7 w-7 text-gold" strokeWidth={1.5} aria-hidden="true" />
                    </div>
                    {i < STEPS.length - 1 && (
                      <ArrowRight
                        className="absolute -right-2 top-8 hidden h-5 w-5 -translate-y-1/2 text-gold/60 lg:block"
                        aria-hidden="true"
                      />
                    )}
                    <p className="mt-4 text-sm font-semibold text-gold">{s.num}</p>
                    <h3 className="mt-1 font-serif text-base font-bold text-navy-text">{s.title}</h3>
                    <p className="mt-2 max-w-[180px] text-xs leading-relaxed text-navy-text/60">{s.desc}</p>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
