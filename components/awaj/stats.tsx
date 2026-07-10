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
    <section className="relative z-20 -mt-20 px-5 sm:-mt-24 lg:px-10">
      <div className="mx-auto max-w-[1280px] rounded-3xl border border-gold/25 bg-white p-5 shadow-xl sm:p-6 md:p-8">
        <div className="grid grid-cols-2 gap-x-2 gap-y-6 sm:grid-cols-3 sm:gap-y-8 lg:grid-cols-6 lg:gap-x-0">
          {STATS.map((s, i) => (
            <div
              key={s.label}
              className={`flex flex-col items-center px-1 text-center sm:px-3 ${
                i !== STATS.length - 1 ? "lg:border-r lg:border-gold/20" : ""
              }`}
            >
              <s.icon className="mb-1.5 h-6 w-6 text-gold sm:h-7 sm:w-7" strokeWidth={1.5} />
              <p className="font-serif text-2xl font-bold leading-none text-gold sm:text-3xl">{s.value}</p>
              <p className="mt-1.5 text-[11px] font-semibold uppercase leading-snug tracking-wide text-navy-text sm:text-xs">
                {s.label}
              </p>
              {s.sub && <p className="mt-0.5 text-[11px] leading-snug text-navy-text/60 sm:text-xs">{s.sub}</p>}
            </div>
          ))}
        </div>
        <div className="mt-5 border-t border-gold/15 pt-4 text-center text-xs text-navy-text/60 sm:text-sm">
          Delivered through public–private partnerships and strategic industry collaboration
        </div>
      </div>
    </section>
  )
}
