import { GalleryPreview } from "./gallery-preview"
import { getFeaturedGalleries } from "@/app/actions/gallery"

export async function GallerySection() {
  const albums = await getFeaturedGalleries(24)
  const withPhotos = albums.filter(
    (a) => a.coverImageUrl || (Array.isArray(a.photos) && a.photos.length > 0),
  )
  if (withPhotos.length === 0) return null

  return (
    <section className="py-10 lg:py-16">
      <div className="mx-auto max-w-[1280px] px-5 lg:px-10">
        <GalleryPreview albums={withPhotos} />
      </div>
    </section>
  )
}
