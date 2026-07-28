import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { PeopleDirectory } from "@/components/awaj/people-directory"
import { InstitutionsStrip } from "@/components/awaj/institutions-strip"
import { getPeopleDirectory } from "@/app/actions/people"
import { getSiteSettings } from "@/app/actions/settings"
import { buildPageMetadata } from "@/lib/seo"

export const dynamic = "force-dynamic"

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/team",
    title: "Leadership & Ecosystem Leaders",
    description:
      "Meet the leaders, advisors, mentors, and ecosystem partners connected with Asia Web3 & AI Alliance Japan (AWAJ).",
  })
}

export default async function TeamPage() {
  const [people, settings] = await Promise.all([getPeopleDirectory(), getSiteSettings()])

  return (
    <main className="min-h-svh bg-ivory">
      <SiteHeader />

      <section className="border-b border-gold/20 bg-navy">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">
            {settings.presidentEyebrow || "Our People"}
          </p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
            {settings.leadershipSectionTitle || "Ecosystem Leaders Connected with AWAJ"}
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            Leaders, advisors, mentors, investors, and ecosystem partners driving Web3 innovation across Japan and
            Asia — and the events and programs they power.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 pt-12 lg:px-10 lg:pt-16">
        <InstitutionsStrip />
      </div>

      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
        <PeopleDirectory people={people} />
      </div>

      <SiteFooter />
    </main>
  )
}
