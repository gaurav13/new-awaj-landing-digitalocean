import { Building2, GraduationCap, Users, UserRound, Award, Rocket } from "lucide-react"
import type { LucideIcon } from "lucide-react"

type Stat = {
  icon: LucideIcon
  value: string
  label: string
  sub: string
}

const STATS: Stat[] = [
  { icon: Building2, value: "7+", label: "Government Partnerships", sub: "with formal MOUs" },
  { icon: GraduationCap, value: "25+", label: "University Partners", sub: "across Japan, USA and UAE" },
  { icon: Users, value: "80", label: "Corporate Members", sub: "(80 社)" },
  { icon: UserRound, value: "282", label: "Individual Members", sub: "(個人会員 282 名)" },
  { icon: Award, value: "50+", label: "Top Experts & Mentors", sub: "" },
  { icon: Rocket, value: "5", label: "Startup Programs", sub: "Running" },
]

export function Stats() {
  return (
    <section className="relative z-20 -mt-28 px-5 lg:px-10">
      <div className="mx-auto max-w-[1280px] rounded-[2rem] border border-gold/25 bg-white px-6 py-10 shadow-xl md:px-10">
        <div className="grid grid-cols-2 gap-y-10 md:grid-cols-3 lg:grid-cols-6">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center px-2 text-center lg:px-4 ${
                i !== STATS.length - 1 ? "lg:border-r lg:border-gold/20" : ""
              }`}
            >
              <s.icon className="mb-2 h-7 w-7 text-gold" strokeWidth={1.5} />
              <p className="font-serif text-3xl font-bold text-gold">{s.value}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-navy-text">{s.label}</p>
              {s.sub && <p className="mt-0.5 text-xs text-navy-text/60">{s.sub}</p>}
            </div>
          ))}
        </div>
        <div className="mt-9 border-t border-gold/15 pt-5 text-center text-sm text-navy-text/60">
          Delivered through public–private partnerships and strategic industry collaboration
        </div>
      </div>
    </section>
  )
}
