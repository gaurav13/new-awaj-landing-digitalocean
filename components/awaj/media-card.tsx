import { Play, FileText, ArrowUpRight } from "lucide-react"

type MediaItem = {
  id: number
  title: string
  type: string
  url: string | null
  thumbnailUrl: string | null
  source: string | null
  excerpt: string | null
}

export function MediaCard({ item, compact = false }: { item: MediaItem; compact?: boolean }) {
  const isVideo = /video|podcast|interview/i.test(item.type)

  const inner = (
    <div className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white transition-shadow hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-beige">
        {item.thumbnailUrl ? (
          <img
            src={item.thumbnailUrl || "/placeholder.svg"}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-gold/40">
            {isVideo ? <Play className={compact ? "h-8 w-8" : "h-10 w-10"} /> : <FileText className={compact ? "h-8 w-8" : "h-10 w-10"} />}
          </div>
        )}
        <span className="absolute left-2.5 top-2.5 rounded-full bg-navy/85 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
          {item.type}
        </span>
        {isVideo && item.thumbnailUrl ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className={`flex items-center justify-center rounded-full bg-white/90 text-navy shadow-lg ${compact ? "h-10 w-10" : "h-12 w-12"}`}>
              <Play className={`translate-x-0.5 fill-current ${compact ? "h-4 w-4" : "h-5 w-5"}`} />
            </span>
          </span>
        ) : null}
      </div>
      <div className={`flex flex-1 flex-col ${compact ? "p-4" : "p-5"}`}>
        {item.source ? (
          <span className="text-[11px] font-semibold uppercase tracking-wide text-gold">{item.source}</span>
        ) : null}
        <h3
          className={`mt-1 font-serif font-bold leading-snug text-navy-text transition-colors group-hover:text-gold ${
            compact ? "text-sm line-clamp-2" : "mt-1.5 text-lg"
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
        ) : null}
        {item.url ? (
          <span
            className={`mt-3 inline-flex items-center gap-1.5 font-semibold text-awaj-red ${
              compact ? "text-xs" : "mt-4 text-sm"
            }`}
          >
            {isVideo ? "Watch" : "Read more"}
            <ArrowUpRight className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
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
