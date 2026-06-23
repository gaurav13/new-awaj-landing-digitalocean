import { SiteHeader } from "@/components/awaj/site-header"
import { Hero } from "@/components/awaj/hero"
import { Stats } from "@/components/awaj/stats"
import { GrowthJourney } from "@/components/awaj/growth-journey"
import { Programs } from "@/components/awaj/programs"
import { EventsNews } from "@/components/awaj/events-news"
import { Offerings } from "@/components/awaj/offerings"
import { Pathways } from "@/components/awaj/pathways"
import { Team } from "@/components/awaj/team"
import { PartnersMarquee } from "@/components/awaj/partners-marquee"
import { FeaturedMedia } from "@/components/awaj/featured-media"
import { GallerySection } from "@/components/awaj/gallery-section"
import { JoinCta } from "@/components/awaj/join-cta"
import { SiteFooter } from "@/components/awaj/site-footer"
import { getSiteSettings } from "@/app/actions/settings"
import { getActiveBanners } from "@/app/actions/banners"
import { resolveImageUrl } from "@/lib/images"
import { buildPageMetadata } from "@/lib/seo"
import { AdSlot } from "@/components/ads/ad-slot"
import { PageAds } from "@/components/ads/page-ads"

export async function generateMetadata() {
  return buildPageMetadata({ path: "/" })
}

export default async function Page() {
  const [settings, banners] = await Promise.all([getSiteSettings(), getActiveBanners()])
  return (
    <main className="min-h-screen bg-ivory">
      <SiteHeader />
      <AdSlot page="home" placement="top" className="px-5 pt-6 lg:px-10" />
      <Hero bannerUrl={resolveImageUrl(settings.heroBannerUrl)} banners={banners} />
      <Stats />
      <GrowthJourney />
      <Team />
      <Programs />
      <Pathways />
      <AdSlot page="home" placement="mid" className="px-5 py-8 lg:px-10" />
      <Offerings />
      <PartnersMarquee />
      <EventsNews />
      <GallerySection />
      <FeaturedMedia />
      <JoinCta />
      <AdSlot page="home" placement="bottom" className="px-5 pb-10 lg:px-10" />
      <SiteFooter />
      <PageAds page="home" />
    </main>
  )
}
