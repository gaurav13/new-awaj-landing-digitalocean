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

export function MediaCard({ item }: { item: MediaItem }) {
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
            {isVideo ? <Play className="h-10 w-10" /> : <FileText className="h-10 w-10" />}
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full bg-navy/85 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
          {item.type}
        </span>
        {isVideo && item.thumbnailUrl ? (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg">
              <Play className="h-5 w-5 translate-x-0.5 fill-current" />
            </span>
          </span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-5">
        {item.source ? (
          <span className="text-xs font-semibold uppercase tracking-wide text-gold">{item.source}</span>
        ) : null}
        <h3 className="mt-1.5 font-serif text-lg font-bold leading-snug text-navy-text transition-colors group-hover:text-gold">
          {item.title}
        </h3>
        {item.excerpt ? (
          <p className="mt-2 line-clamp-3 flex-1 text-sm leading-relaxed text-navy-text/70">{item.excerpt}</p>
        ) : null}
        {item.url ? (
          <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-awaj-red">
            {isVideo ? "Watch" : "Read more"}
            <ArrowUpRight className="h-4 w-4" />
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
