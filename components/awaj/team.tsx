import Link from "next/link"
import { ArrowRight, Users, Building2, Rocket, Globe, Calendar, Award, Briefcase, type LucideIcon } from "lucide-react"
import { getHomepageLeaders } from "@/app/actions/people"
import { getAllPartners } from "@/app/actions/partners"
import { getSiteSettings } from "@/app/actions/settings"
import { LeadersSlider } from "@/components/awaj/leaders-slider"

const STAT_ICONS: Record<string, LucideIcon> = {
  Users,
  Building2,
  Rocket,
  Globe,
  Calendar,
  Award,
  Briefcase,
}

type Stat = { value: string; label: string; icon?: string }

function parseStats(raw: string): Stat[] {
  try {
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

export async function Team() {
  const [leaders, partners, settings] = await Promise.all([
    getHomepageLeaders(14),
    getAllPartners(),
    getSiteSettings(),
  ])

  const stats = parseStats(settings.leadershipStats)
  const logoPartners = partners.filter((p) => p.logoUrl)

  return (
    <section id="team" className="bg-ivory">
      {/* President hero */}
      <div className="relative overflow-hidden bg-navy-text">
        {settings.presidentBgUrl ? (
          <img
            src={settings.presidentBgUrl || "/placeholder.svg"}
            alt=""
            className="absolute inset-0 h-full w-full object-cover opacity-50"
          />
        ) : null}
        <div className="absolute inset-0 bg-gradient-to-r from-navy-text via-navy-text/85 to-navy-text/40" />

        <div className="relative mx-auto grid max-w-[1280px] grid-cols-1 items-end gap-8 px-5 pt-12 lg:grid-cols-[300px_1fr] lg:px-10 lg:pt-0">
          {/* Portrait */}
          <div className="relative mx-auto flex h-full w-full max-w-[300px] items-end justify-center lg:mx-0">
            {settings.presidentPhotoUrl ? (
              <img
                src={settings.presidentPhotoUrl || "/placeholder.svg"}
                alt={`Portrait of ${settings.presidentName}`}
                className="h-auto w-full max-w-[300px] object-contain object-bottom drop-shadow-2xl"
              />
            ) : null}
          </div>

          {/* Copy */}
          <div className="pb-12 lg:py-16">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
              {settings.presidentEyebrow}
            </p>
            <h2 className="mt-4 font-serif text-4xl font-bold leading-none tracking-tight text-white md:text-6xl">
              {settings.presidentName}
            </h2>
            <p className="mt-3 text-lg font-medium text-white/85 md:text-xl">{settings.presidentTitle}</p>
            <div className="mt-5 h-0.5 w-16 bg-gold" />
            <p className="mt-5 max-w-xl text-pretty text-sm leading-relaxed text-white/75 md:text-base">
              {settings.presidentBio}
            </p>
            {settings.presidentCtaLabel ? (
              <Link
                href={settings.presidentCtaUrl || "/team"}
                className="mt-7 inline-flex items-center gap-2 rounded-lg bg-gold px-6 py-3 text-sm font-semibold text-navy-text shadow-lg transition hover:bg-gold/90"
              >
                {settings.presidentCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>
        </div>

        {/* Stats bar */}
        {stats.length > 0 ? (
          <div className="relative mx-auto -mb-px max-w-[1280px] px-5 pb-8 lg:px-10">
            <div className="grid grid-cols-2 gap-x-6 gap-y-6 rounded-2xl border border-white/10 bg-navy-text/60 p-6 backdrop-blur sm:grid-cols-3 lg:grid-cols-5">
              {stats.map((s, i) => {
                const Icon = (s.icon && STAT_ICONS[s.icon]) || Users
                return (
                  <div key={i} className="flex items-center gap-3">
                    <Icon className="h-7 w-7 shrink-0 text-gold" strokeWidth={1.5} />
                    <div className="min-w-0">
                      <div className="font-serif text-2xl font-bold leading-none text-white">{s.value}</div>
                      <div className="mt-1 text-xs leading-tight text-white/70">{s.label}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>

      {/* Ecosystem leaders slider */}
      {leaders.length > 0 ? (
        <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
          <div className="mb-8 flex items-end justify-between gap-4">
            <h3 className="text-balance font-serif text-2xl font-bold tracking-tight text-navy-text md:text-4xl">
              {settings.leadershipSectionTitle}
            </h3>
            {settings.leadershipViewAllLabel ? (
              <Link
                href={settings.leadershipViewAllUrl || "/team"}
                className="inline-flex shrink-0 items-center gap-1.5 text-sm font-semibold text-gold transition hover:text-gold/80"
              >
                {settings.leadershipViewAllLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : null}
          </div>

          <LeadersSlider leaders={leaders} />
        </div>
      ) : null}

      {/* Partner logos strip */}
      {logoPartners.length > 0 ? (
        <div className="border-t border-gold/15">
          <div className="mx-auto flex max-w-[1280px] flex-col items-center gap-6 px-5 py-8 lg:flex-row lg:gap-10 lg:px-10">
            <p className="shrink-0 text-xs font-semibold uppercase leading-tight tracking-[0.2em] text-navy-text/60">
              Our Ecosystem
              <br className="hidden lg:block" /> Partners
            </p>
            <div className="flex flex-1 flex-wrap items-center justify-center gap-x-8 gap-y-5 lg:justify-start">
              {logoPartners.slice(0, 9).map((p) => (
                <img
                  key={p.id}
                  src={p.logoUrl || "/placeholder.svg"}
                  alt={`${p.name} logo`}
                  className="max-h-7 w-auto max-w-[120px] object-contain opacity-80 transition hover:opacity-100"
                />
              ))}
              <span className="text-xs font-semibold uppercase tracking-wide text-navy-text/50">And more</span>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  )
}
