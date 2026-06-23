import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { GalleryShowcase, type GalleryAlbum } from "@/components/awaj/gallery-showcase"
import { getAllGalleries } from "@/app/actions/gallery"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/gallery",
    title: "Gallery",
    description:
      "Photo highlights from Asia Web3 & AI Alliance Japan (AWAJ) events, programs, conferences, and community activities.",
  })
}

export default async function GalleryPage() {
  const galleries = await getAllGalleries()
  const albums: GalleryAlbum[] = galleries
    .filter((g) => Array.isArray(g.photos) && g.photos.length > 0)
    .map((g) => ({
      id: g.id,
      title: g.title,
      description: g.description,
      category: g.category,
      coverImageUrl: g.coverImageUrl,
      photos: g.photos,
      eventDate: g.eventDate,
    }))

  return (
    <main className="min-h-svh bg-ivory">
      <SiteHeader />

      {/* Page hero */}
      <section className="border-b border-gold/20 bg-navy">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Gallery</p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
            Moments from the Alliance
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            Photo highlights from our events, programs, conferences, and the community building the future of Web3
            &amp; AI across Asia.
          </p>
        </div>
      </section>

      <div className="py-12 lg:py-16">
        {albums.length === 0 ? (
          <div className="mx-auto max-w-[1280px] px-5 lg:px-10">
            <div className="rounded-2xl border border-gold/20 bg-white p-12 text-center">
              <h2 className="font-serif text-xl font-bold text-navy-text">No photos yet</h2>
              <p className="mt-2 text-sm text-navy-text/60">Check back soon for highlights from our activities.</p>
            </div>
          </div>
        ) : (
          <GalleryShowcase albums={albums} />
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
