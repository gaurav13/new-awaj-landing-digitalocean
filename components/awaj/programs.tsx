import Link from "next/link"
import {
  Network,
  Landmark,
  Rocket,
  Globe2,
  Globe,
  Building2,
  Share2,
  GraduationCap,
  Users,
  Award,
  ArrowRight,
} from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { getAllPrograms } from "@/app/actions/programs"

const ICONS: Record<string, LucideIcon> = {
  Rocket,
  Building2,
  Share2,
  Globe,
  GraduationCap,
  Users,
  Award,
  Landmark,
  Network,
}

export async function Programs() {
  const programs = await getAllPrograms()
  if (programs.length === 0) return null

  return (
    <section id="programs" className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10">
      <div className="mb-10 text-center">
        <h2 className="font-serif text-3xl font-bold tracking-tight text-navy-text md:text-4xl">Our Core Programs</h2>
        <div className="mx-auto mt-3 h-px w-20 bg-gold/60" />
      </div>

      <div className="grid grid-cols-1 gap-7 md:grid-cols-3">
        {programs.map((p) => {
          const Icon = ICONS[p.icon] ?? Rocket
          return (
            <Link
              key={p.id}
              href={`/programs/${p.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-3xl border border-gold/25 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              <div className="flex flex-1 flex-col p-7">
                <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-beige">
                  <Icon className="h-6 w-6 text-gold" strokeWidth={1.5} />
                </div>
                <h3 className="font-serif text-xl font-bold leading-snug text-navy-text transition-colors group-hover:text-gold">
                  {p.title}
                </h3>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-text/70">{p.excerpt}</p>
                {p.regions && (
                  <span className="mt-5 flex items-center gap-2 text-sm font-medium text-navy-text/70">
                    <Globe2 className="h-4 w-4 text-gold" />
                    {p.regions}
                  </span>
                )}
              </div>
              {p.imageUrl && (
                <div className="relative h-24 w-full overflow-hidden">
                  <img src={p.imageUrl || "/placeholder.svg"} alt="" className="h-full w-full object-cover opacity-80" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white" />
                </div>
              )}
            </Link>
          )
        })}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/programs"
          className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gold transition-colors hover:text-navy-text"
        >
          View All Programs
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </Link>
      </div>
    </section>
  )
}
