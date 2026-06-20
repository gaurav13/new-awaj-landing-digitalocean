import { MediaCoverage } from "./media-coverage"
import { getFeaturedMedia } from "@/app/actions/media"

export async function FeaturedMedia() {
  const media = await getFeaturedMedia(6)
  if (media.length === 0) return null

  return (
    <section className="border-y border-gold/20 bg-ivory py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-10">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-gold">Featured In</p>
        <MediaCoverage
          items={media}
          title="Media Coverage"
          subtitle="Latest articles, interviews, and press releases featuring Asia Web3 Alliance Japan."
          ctaHref="/media"
        />
      </div>
    </section>
  )
}
