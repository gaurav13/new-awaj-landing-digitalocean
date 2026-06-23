import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { MediaCoverage } from "@/components/awaj/media-coverage"
import { getAllMedia } from "@/app/actions/media"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/media",
    title: "Media",
    description:
      "Press coverage, interviews, videos, and podcasts featuring Asia Web3 & AI Alliance Japan (AWAJ) across global media.",
  })
}

export default async function MediaPage() {
  const media = await getAllMedia()

  return (
    <main className="min-h-svh bg-ivory">
      <SiteHeader />

      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
        {media.length === 0 ? (
          <div className="rounded-2xl border border-gold/20 bg-white p-12 text-center">
            <h2 className="font-serif text-xl font-bold text-navy-text">No media coverage yet</h2>
            <p className="mt-2 text-sm text-navy-text/60">Check back soon for the latest coverage of AWAJ.</p>
          </div>
        ) : (
          <MediaCoverage
            items={media}
            title="Media Coverage"
            subtitle="Latest articles, interviews, and press releases featuring Asia Web3 Alliance Japan."
          />
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
