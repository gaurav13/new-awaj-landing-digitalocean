import Link from "next/link"
import type { LucideIcon } from "lucide-react"
import { Network, Landmark, Rocket, Globe2, Globe, Building2, Share2, GraduationCap, Users, Award } from "lucide-react"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { getAllPrograms } from "@/app/actions/programs"

export const metadata = {
  title: "Programs | Asia Web3 & AI Alliance Japan",
  description: "Explore the accelerator, innovation, and ecosystem programs offered by AWAJ.",
}

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

export default async function ProgramsPage() {
  const programs = await getAllPrograms()

  return (
    <main className="min-h-screen bg-ivory">
      <SiteHeader />

      <section className="border-b border-gold/20 bg-navy">
        <div className="mx-auto max-w-[1100px] px-5 py-16 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">What We Do</p>
          <h1 className="mt-3 font-serif text-4xl font-bold text-white md:text-5xl">Our Programs</h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-white/80">
            From accelerator cohorts to ecosystem partnerships, our programs help startups validate, fund, and scale
            across Japan and Asia-Pacific.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-10">
        {programs.length === 0 ? (
          <p className="text-center text-navy-text/60">Programs will appear here soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
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
                    <h2 className="font-serif text-xl font-bold leading-snug text-navy-text transition-colors group-hover:text-gold">
                      {p.title}
                    </h2>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-navy-text/70">{p.excerpt}</p>
                    {p.regions ? (
                      <span className="mt-5 flex items-center gap-2 text-sm font-medium text-navy-text/70">
                        <Globe2 className="h-4 w-4 text-gold" />
                        {p.regions}
                      </span>
                    ) : null}
                  </div>
                  {p.imageUrl ? (
                    <div className="relative h-24 w-full overflow-hidden">
                      <img src={p.imageUrl || "/placeholder.svg"} alt="" className="h-full w-full object-cover opacity-80" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white/0 to-white" />
                    </div>
                  ) : null}
                </Link>
              )
            })}
          </div>
        )}
      </section>

      <SiteFooter />
    </main>
  )
}
