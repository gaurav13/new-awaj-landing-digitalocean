import Link from "next/link"
import { Images } from "lucide-react"
import type { GalleryItem } from "@/lib/db/schema"

export type GalleryPreviewAlbum = {
  id: number
  title: string
  category: string
  coverImageUrl: string | null
  photos: GalleryItem[]
}

export function GalleryPreview({ albums }: { albums: GalleryPreviewAlbum[] }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
      {albums.map((album) => {
        const cover = album.coverImageUrl ?? album.photos[0]?.imageUrl ?? "/placeholder.svg"
        return (
          <Link
            key={album.id}
            href="/gallery"
            className="group relative overflow-hidden rounded-xl bg-beige ring-1 ring-gold/15 transition-all duration-300 hover:ring-gold/40"
          >
            <div className="aspect-square overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cover || "/placeholder.svg"}
                alt={album.title}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-navy/85 via-navy/10 to-transparent" />

            <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy">
              <Images className="h-3 w-3" />
              {album.photos.length}
            </span>

            <div className="absolute inset-x-0 bottom-0 p-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold">{album.category}</p>
              <h3 className="mt-0.5 line-clamp-2 text-pretty font-serif text-sm font-bold leading-snug text-white">
                {album.title}
              </h3>
            </div>
          </Link>
        )
      })}
    </div>
  )
}
