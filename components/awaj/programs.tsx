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
  ArrowUpRight,
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
          const banner = p.bannerUrl || p.imageUrl
          return (
            <Link
              key={p.id}
              href={`/programs/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm transition-shadow hover:shadow-lg"
            >
              {/* Banner */}
              <div className="relative aspect-video overflow-hidden bg-beige">
                {banner ? (
                  <img
                    src={banner || "/placeholder.svg"}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-gold/40">
                    <Icon className="h-12 w-12" strokeWidth={1.25} />
                  </div>
                )}
                <span className="absolute left-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-gold shadow-sm">
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </div>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                {p.regions ? (
                  <span className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gold">
                    <Globe2 className="h-3.5 w-3.5" />
                    {p.regions}
                  </span>
                ) : null}
                <h3 className="font-serif text-xl font-bold leading-snug text-navy-text transition-colors group-hover:text-gold">
                  {p.title}
                </h3>
                <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-text/70">{p.excerpt}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-awaj-red">
                  Learn more
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </div>
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
