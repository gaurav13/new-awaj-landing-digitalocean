import { Network, Landmark, Rocket, Globe2, ArrowRight } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Program = {
  icon: LucideIcon
  title: string
  body: string
  footer?: React.ReactNode
  image: string
}

const PROGRAMS: Program[] = [
  {
    icon: Network,
    title: "Web3 Salon VC Connect",
    body: "A global platform connecting Web3 startups with top investors, VCs, and industry leaders through pitch sessions, exhibitions, and networking events.",
    footer: (
      <span className="flex items-center gap-2 text-sm font-medium text-navy-text/70">
        <Globe2 className="h-4 w-4 text-gold" />
        Japan • Singapore • USA • UAE
      </span>
    ),
    image: "/images/prog-city.png",
  },
  {
    icon: Landmark,
    title: "Japan Financial Infrastructure Innovation Program",
    body: "Accelerating Web3 startups with expert mentorship, corporate partnerships, Demo Day, awards, and funding opportunities.",
    image: "/images/prog-tower.png",
  },
  {
    icon: Rocket,
    title: "108 Venture Studio",
    body: "Hands-on venture building from idea validation to MVP, sales materials, incorporation, and fundraising launch—your venture journey starts here.",
    image: "/images/prog-mountains.png",
  },
]

export function Programs() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-20 lg:px-10">
      <div className="mb-12 text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-navy-text md:text-4xl">Our Core Programs</h2>
        <div className="mx-auto mt-3 h-px w-20 bg-gold/60" />
      </div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
        {PROGRAMS.map((p) => (
          <article
            key={p.title}
            className="group relative flex flex-col overflow-hidden rounded-3xl border border-gold/25 bg-white shadow-sm transition-shadow hover:shadow-lg"
          >
            <div className="flex flex-1 flex-col p-7">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-beige">
                <p.icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
              </div>
              <h3 className="font-serif text-xl font-bold leading-snug text-navy-text">{p.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-text/70">{p.body}</p>
              {p.footer && <div className="mt-5">{p.footer}</div>}
            </div>
            <div className="relative h-24 w-full overflow-hidden">
              <img src={p.image || "/placeholder.svg"} alt="" className="h-full w-full object-cover opacity-80" />
              <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white" />
            </div>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="#"
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gold transition-colors hover:text-navy-text"
        >
          View All Programs
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </a>
      </div>
    </section>
  )
}
