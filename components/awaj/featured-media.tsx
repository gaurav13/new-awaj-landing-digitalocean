import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { MediaCarousel } from "./media-carousel"
import { getFeaturedMedia } from "@/app/actions/media"

export async function FeaturedMedia() {
  const media = await getFeaturedMedia(8)
  if (media.length === 0) return null

  return (
    <section className="border-y border-gold/20 bg-beige/40 py-16">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-10">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Featured In</p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-navy-text md:text-4xl">
            AWAJ in the Media
          </h2>
          <div className="mx-auto mt-3 h-px w-20 bg-gold/60" />
        </div>

        <MediaCarousel items={media} />

        <div className="mt-10 flex justify-center">
          <Link
            href="/media"
            className="group inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            Read More Coverage
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
