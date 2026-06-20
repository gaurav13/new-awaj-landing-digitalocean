import { SiteHeader } from "@/components/awaj/site-header"
import { Hero } from "@/components/awaj/hero"
import { Stats } from "@/components/awaj/stats"
import { GrowthJourney } from "@/components/awaj/growth-journey"
import { Programs } from "@/components/awaj/programs"
import { UpcomingEvents, LatestNews } from "@/components/awaj/events-news"
import { Offerings } from "@/components/awaj/offerings"
import { Pathways } from "@/components/awaj/pathways"
import { Team } from "@/components/awaj/team"
import { Partners } from "@/components/awaj/partners"
import { FeaturedMedia } from "@/components/awaj/featured-media"
import { GallerySection } from "@/components/awaj/gallery-section"
import { JoinCta } from "@/components/awaj/join-cta"
import { SiteFooter } from "@/components/awaj/site-footer"
import { getSiteSettings } from "@/app/actions/settings"
import { getActiveBanners } from "@/app/actions/banners"

export default async function Page() {
  const [settings, banners] = await Promise.all([getSiteSettings(), getActiveBanners()])
  return (
    <main className="min-h-screen bg-ivory">
      <SiteHeader />
      <Hero bannerUrl={settings.heroBannerUrl} banners={banners} />
      <Stats />
      <GrowthJourney />
      <Programs />
      <UpcomingEvents />
      <GallerySection />
      <LatestNews />
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
