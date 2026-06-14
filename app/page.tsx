import { SiteHeader } from "@/components/awaj/site-header"
import { Hero } from "@/components/awaj/hero"
import { Stats } from "@/components/awaj/stats"
import { GrowthJourney } from "@/components/awaj/growth-journey"
import { Programs } from "@/components/awaj/programs"
import { EventsNews } from "@/components/awaj/events-news"
import { Offerings } from "@/components/awaj/offerings"
import { Pathways } from "@/components/awaj/pathways"
import { Team } from "@/components/awaj/team"
import { Partners } from "@/components/awaj/partners"
import { FeaturedMedia } from "@/components/awaj/featured-media"
import { JoinCta } from "@/components/awaj/join-cta"
import { SiteFooter } from "@/components/awaj/site-footer"
import { getSiteSettings } from "@/app/actions/settings"

export default async function Page() {
  const settings = await getSiteSettings()
  return (
    <main className="min-h-screen bg-ivory">
      <SiteHeader />
      <Hero bannerUrl={settings.heroBannerUrl} />
      <Stats />
      <GrowthJourney />
      <Programs />
      <EventsNews />
      <Offerings />
      <Partners />
      <Pathways />
      <Team />
      <FeaturedMedia />
      <JoinCta />
      <SiteFooter />
    </main>
  )
}
