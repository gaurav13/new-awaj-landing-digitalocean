import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { GalleryPreview } from "./gallery-preview"
import { getFeaturedGalleries } from "@/app/actions/gallery"

export async function GallerySection() {
  const albums = await getFeaturedGalleries(8)
  const withPhotos = albums.filter((a) => Array.isArray(a.photos) && a.photos.length > 0)
  if (withPhotos.length === 0) return null

  return (
    <section className="bg-beige/40 py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-10">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Moments</p>
            <h2 className="mt-2 font-serif text-3xl font-bold tracking-tight text-navy-text md:text-4xl">
              Gallery &amp; Highlights
            </h2>
            <p className="mt-3 max-w-xl text-pretty leading-relaxed text-navy-text/65">
              A glance at our events, programs, and conferences building the future of Web3 &amp; AI across Asia.
            </p>
          </div>

          <Link
            href="/gallery"
            className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-navy/20 px-5 py-2.5 text-sm font-semibold text-navy-text transition-colors hover:bg-navy hover:text-white"
          >
            View All Albums
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>

        <GalleryPreview albums={withPhotos} />
      </div>
    </section>
  )
}
