import Link from "next/link"
import type { LucideIcon } from "lucide-react"
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
  ArrowUpRight,
} from "lucide-react"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { getAllPrograms } from "@/app/actions/programs"
import { AdSlot } from "@/components/ads/ad-slot"
import { PageAds } from "@/components/ads/page-ads"

export const metadata = {
  title: "Programs | Asia Web3 & AI Alliance Japan",
  description: "Explore the accelerator, innovation, and ecosystem programs offered by AWAJ.",
  alternates: { canonical: "/programs" },
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

      <AdSlot page="programs" placement="top" className="px-5 pt-10 lg:px-10" />

      <section className="mx-auto max-w-[1280px] px-5 py-16 lg:px-10">
        {programs.length === 0 ? (
          <p className="text-center text-navy-text/60">Programs will appear here soon.</p>
        ) : (
          <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => {
              const Icon = ICONS[p.icon] ?? Rocket
              const cover = p.imageUrl || p.bannerUrl
              return (
                <Link
                  key={p.id}
                  href={`/programs/${p.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm transition-shadow hover:shadow-lg"
                >
                  {/* Cover */}
                  <div className="relative aspect-video overflow-hidden bg-beige">
                    {cover ? (
                      <img
                        src={cover || "/placeholder.svg"}
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
                    <h2 className="font-serif text-xl font-bold leading-snug text-navy-text transition-colors group-hover:text-gold">
                      {p.title}
                    </h2>
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
        )}
      </section>

      <AdSlot page="programs" placement="bottom" className="px-5 pb-12 lg:px-10" />

      <SiteFooter />
      <PageAds page="programs" />
    </main>
  )
}
