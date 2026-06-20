import { Play, FileText, ArrowUpRight, Newspaper } from "lucide-react"

type MediaItem = {
  id: number
  title: string
  type: string
  url: string | null
  thumbnailUrl: string | null
  logoUrl: string | null
  source: string | null
  excerpt: string | null
}

export function MediaCard({ item, compact = false }: { item: MediaItem; compact?: boolean }) {
  const isVideo = /video|podcast|interview/i.test(item.type)
  const publisher = item.source || "AWAJ"

  const inner = (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl">
      {/* Banner image with the publisher logo emphasized on top of it */}
      <div className="relative aspect-video overflow-hidden bg-beige">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl || "/placeholder.svg"}
            alt=""
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gold/40">
            {isVideo ? (
              <Play className={compact ? "h-9 w-9" : "h-12 w-12"} />
            ) : (
              <FileText className={compact ? "h-9 w-9" : "h-12 w-12"} />
            )}
          </div>
        )}

        {/* Gradient so the logo chip stays legible over any image */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-navy/70 via-navy/20 to-transparent" />

        {/* Format badge */}
        <span
          className={`absolute right-3 top-3 rounded-full bg-white/90 font-semibold uppercase tracking-wide text-navy shadow-sm ${
            compact ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-[10px]"
          }`}
        >
          {item.type}
        </span>

        {/* Video play affordance */}
        {isVideo && item.thumbnailUrl ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span
              className={`flex items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition-transform group-hover:scale-110 ${
                compact ? "h-10 w-10" : "h-14 w-14"
              }`}
            >
              <Play className={`translate-x-0.5 fill-current ${compact ? "h-4 w-4" : "h-6 w-6"}`} />
            </span>
          </span>
        ) : null}

        {/* Publisher logo chip — the media company is the hero of the card */}
        <div
          className={`absolute bottom-3 left-3 flex items-center gap-2 rounded-xl bg-white/95 shadow-md backdrop-blur ${
            compact ? "px-2 py-1.5" : "px-3 py-2"
          }`}
        >
          <span
            className={`flex shrink-0 items-center justify-center overflow-hidden rounded-md bg-beige/60 ${
              compact ? "h-7 w-7" : "h-9 w-9"
            }`}
          >
            {item.logoUrl ? (
              <img
                src={item.logoUrl || "/placeholder.svg"}
                alt={`${publisher} logo`}
                className="h-full w-full object-contain p-0.5"
              />
            ) : (
              <Newspaper className={compact ? "h-3.5 w-3.5 text-gold" : "h-4 w-4 text-gold"} />
            )}
          </span>
          <span
            className={`truncate font-bold uppercase tracking-wide text-navy-text ${
              compact ? "max-w-[90px] text-[10px]" : "max-w-[150px] text-xs"
            }`}
          >
            {publisher}
          </span>
        </div>
      </div>

      {/* Header: short description + read more */}
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        <h3
          className={`font-serif font-bold leading-snug text-navy-text transition-colors group-hover:text-gold ${
            compact ? "text-sm line-clamp-2" : "text-lg line-clamp-2"
          }`}
        >
          {item.title}
        </h3>
        {item.excerpt ? (
          <p
            className={`mt-2 flex-1 leading-relaxed text-navy-text/70 ${
              compact ? "line-clamp-2 text-xs" : "line-clamp-3 text-sm"
            }`}
          >
            {item.excerpt}
          </p>
        ) : (
          <div className="flex-1" />
        )}
        {item.url ? (
          <span
            className={`mt-4 inline-flex items-center gap-1.5 font-semibold text-awaj-red ${
              compact ? "text-xs" : "text-sm"
            }`}
          >
            {isVideo ? "Watch now" : "Read more"}
            <ArrowUpRight className={`transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 ${compact ? "h-3.5 w-3.5" : "h-4 w-4"}`} />
          </span>
        ) : null}
      </div>
    </div>
  )

  if (item.url) {
    return (
      <a href={item.url} target="_blank" rel="noopener noreferrer" className="block h-full">
        {inner}
      </a>
    )
  }
  return <div className="h-full">{inner}</div>
}
