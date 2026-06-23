import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { NewsListing } from "@/components/awaj/news-listing"
import { getAllNews } from "@/app/actions/news"
import { AdSlot } from "@/components/ads/ad-slot"
import { PageAds } from "@/components/ads/page-ads"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/news",
    title: "News",
    description:
      "The latest news, partnerships, and program updates from Asia Web3 & AI Alliance Japan (AWAJ).",
  })
}

export default async function NewsPage() {
  const articles = await getAllNews()

  return (
    <main className="min-h-svh bg-ivory">
      <SiteHeader />

      {/* Page hero */}
      <section className="border-b border-gold/20 bg-navy">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Newsroom</p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
            Latest News from the Alliance
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            Partnerships, program milestones, media coverage, and stories from across Asia and Japan&apos;s Web3 &amp; AI
            ecosystem.
          </p>
        </div>
      </section>

      <AdSlot page="news" placement="top" className="px-5 pt-10 lg:px-10" />

      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
        <NewsListing articles={articles} />
        <AdSlot page="news" placement="mid" className="mt-10" />
      </div>

      <AdSlot page="news" placement="bottom" className="px-5 pb-12 lg:px-10" />

      <SiteFooter />
      <PageAds page="news" />
    </main>
  )
}
