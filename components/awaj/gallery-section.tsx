import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { GalleryPreview } from "./gallery-preview"
import { getFeaturedGalleries } from "@/app/actions/gallery"

export async function GallerySection() {
  const albums = await getFeaturedGalleries(8)
  const withPhotos = albums.filter((a) => Array.isArray(a.photos) && a.photos.length > 0)
  if (withPhotos.length === 0) return null

  return (
    <section className="py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-10">
        <div className="mb-10 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Moments</p>
          <h2 className="mt-3 font-serif text-3xl font-bold tracking-tight text-navy-text md:text-4xl">
            Gallery & Highlights
          </h2>
          <div className="mx-auto mt-3 h-px w-20 bg-gold/60" />
          <p className="mx-auto mt-4 max-w-2xl text-pretty leading-relaxed text-navy-text/65">
            A look back at our events, programs, and the community building the future of Web3 &amp; AI across Asia.
          </p>
        </div>

        <GalleryPreview albums={withPhotos} />

        <div className="mt-10 flex justify-center">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 rounded-full bg-navy px-7 py-3 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            Explore Full Gallery
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  )
}
