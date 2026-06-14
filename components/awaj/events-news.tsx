import { MapPin, Clock, ArrowRight, ChevronRight } from "lucide-react"

const EVENTS = [
  {
    month: "MAR",
    day: "19",
    year: "2026",
    title: "Web3 Salon VC Connect – Singapore",
    desc: "VC Networking • Pitch Session • Exhibition",
    place: "Singapore",
  },
  {
    month: "APR",
    day: "16",
    year: "2026",
    title: "Web3 Salon VC Connect – USA",
    desc: "VC Networking • Pitch Session • Exhibition",
    place: "New York, USA",
  },
  {
    month: "MAY",
    day: "14",
    year: "2026",
    title: "Web3 Salon VC Connect – UAE",
    desc: "VC Networking • Pitch Session • Exhibition",
    place: "Dubai, UAE",
  },
]

const NEWS = [
  {
    image: "/images/news-1.png",
    title: "AWAJ Meets U.S. SEC Chairman Paul S. Atkins",
    desc: "Strengthening the Web3 corridor between Japan and the United States.",
    month: "MAY",
    day: "07",
    year: "2025",
  },
  {
    image: "/images/news-2.png",
    title: "Strategic Collaboration with The Digital Chamber",
    desc: "Building stronger ties and advancing Web3 innovation between Japan and the U.S.",
    month: "APR",
    day: "28",
    year: "2025",
  },
  {
    image: "/images/news-3.png",
    title: "Japan Financial Infrastructure Innovation Program – Phase 2 Selected",
    desc: "10 startups selected for Demo Day from 76 total applications.",
    month: "APR",
    day: "15",
    year: "2025",
  },
  {
    image: "/images/news-4.png",
    title: "Memories from Japan Hub, A Week of Excellence",
    desc: "Highlights from our global event bringing together innovators and leaders.",
    month: "MAR",
    day: "31",
    year: "2025",
  },
]

function SectionHeading({ title, link }: { title: string; link: string }) {
  return (
    <div className="mb-6 flex items-center justify-between">
      <h2 className="font-serif text-xl font-bold uppercase tracking-wide text-navy-text">{title}</h2>
      <a
        href="#"
        className="group inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold transition-colors hover:text-navy-text"
      >
        {link}
        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
      </a>
    </div>
  )
}

export function EventsNews() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-8 lg:px-10 lg:py-12">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
        {/* Upcoming Events */}
        <div>
          <SectionHeading title="Upcoming Events" link="View All Events" />

          {/* Featured */}
          <div className="relative overflow-hidden rounded-2xl shadow-md">
            <img src="/images/event-night.png" alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-navy/80" />
            <div className="relative flex gap-5 p-6">
              <div className="flex h-fit flex-col items-center rounded-xl bg-awaj-red px-4 py-2 text-center text-white">
                <span className="text-xs font-semibold uppercase tracking-wide">Feb</span>
                <span className="font-serif text-3xl font-bold leading-none">24</span>
                <span className="text-xs text-white/70">2026</span>
              </div>
              <div className="text-white">
                <h3 className="font-serif text-lg font-bold leading-snug">
                  Japan Financial Infrastructure Innovation Program Demo Day &amp; Awards Ceremony
                </h3>
                <div className="mt-3 space-y-1.5 text-sm text-white/80">
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gold" />
                    Tokyo Headquarters
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gold" />
                    12:00 PM – 4:30 PM (JST)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* List */}
          <div className="mt-4 divide-y divide-gold/15 rounded-2xl border border-gold/20 bg-white">
            {EVENTS.map((e) => (
              <a key={e.title} href="#" className="flex items-center gap-4 p-4 transition-colors hover:bg-beige/40">
                <div className="flex h-fit w-14 flex-col items-center rounded-lg bg-beige px-2 py-1.5 text-center">
                  <span className="text-xs font-semibold uppercase text-navy-text">{e.month}</span>
                  <span className="font-serif text-xl font-bold leading-none text-navy-text">{e.day}</span>
                  <span className="text-[10px] text-gold">{e.year}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="truncate text-sm font-bold text-navy-text">{e.title}</h4>
                  <p className="text-xs text-navy-text/60">{e.desc}</p>
                </div>
                <span className="hidden text-xs text-navy-text/50 sm:block">{e.place}</span>
                <ChevronRight className="h-4 w-4 shrink-0 text-gold" />
              </a>
            ))}
          </div>
        </div>

        {/* Latest News */}
        <div>
          <SectionHeading title="Latest News" link="View All News" />
          <div className="divide-y divide-gold/15 rounded-2xl border border-gold/20 bg-white">
            {NEWS.map((n) => (
              <a key={n.title} href="#" className="flex gap-4 p-4 transition-colors hover:bg-beige/40">
                <div className="h-16 w-20 shrink-0 overflow-hidden rounded-lg">
                  <img src={n.image || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                </div>
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold leading-snug text-navy-text">{n.title}</h4>
                  <p className="mt-1 line-clamp-2 text-xs text-navy-text/60">{n.desc}</p>
                </div>
                <div className="shrink-0 text-right">
                  <p className="text-xs font-semibold uppercase text-navy-text/70">{n.month}</p>
                  <p className="font-serif text-lg font-bold leading-none text-awaj-red">{n.day}</p>
                  <p className="text-[10px] text-gold">{n.year}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
