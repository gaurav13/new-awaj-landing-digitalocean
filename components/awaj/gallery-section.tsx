import { GalleryPreview } from "./gallery-preview"
import { getFeaturedGalleries } from "@/app/actions/gallery"

export async function GallerySection() {
  const albums = await getFeaturedGalleries(9)
  const withPhotos = albums.filter((a) => Array.isArray(a.photos) && a.photos.length > 0)
  if (withPhotos.length === 0) return null

  return (
    <section className="bg-beige/40 py-16 lg:py-20">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-10">
        <GalleryPreview albums={withPhotos} />
      </div>
    </section>
  )
}
