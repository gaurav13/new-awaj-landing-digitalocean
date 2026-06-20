import { Play, FileText, ArrowRight, Newspaper } from "lucide-react"

export type MediaItem = {
  id: number
  title: string
  type: string
  url: string | null
  thumbnailUrl: string | null
  logoUrl: string | null
  source: string | null
  excerpt: string | null
  publishedAt: Date | string | null
}

function categorize(type: string) {
  const t = type.toLowerCase()
  if (/video|podcast|interview/.test(t)) return "video"
  if (/press/.test(t)) return "press"
  return "article"
}

function actionLabel(kind: string) {
  if (kind === "video") return "Watch video"
  if (kind === "press") return "Read press release"
  return "Read article"
}

export function MediaCard({ item }: { item: MediaItem }) {
  const kind = categorize(item.type)
  const isVideo = kind === "video"
  const publisher = item.source || "AWAJ"

  const inner = (
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gold/15 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/40 hover:shadow-xl">
      {/* Header: publisher logo (hero) + format badge */}
      <div className="flex items-center justify-between gap-3 px-6 pt-6">
        {item.logoUrl ? (
          <span className="inline-flex items-center rounded-xl bg-beige/50 px-3 py-2 ring-1 ring-gold/10">
            <img
              src={item.logoUrl || "/placeholder.svg"}
              alt={`${publisher} logo`}
              className="h-8 w-auto max-w-[150px] object-contain object-left"
            />
          </span>
        ) : (
          <span className="inline-flex items-center gap-2 rounded-xl bg-beige/50 px-3 py-2 ring-1 ring-gold/10">
            <Newspaper className="h-5 w-5 text-gold" />
            <span className="font-serif text-xl font-bold uppercase tracking-tight text-navy-text">{publisher}</span>
          </span>
        )}
        <span className="shrink-0 rounded-full border border-gold/50 px-3.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gold">
          {item.type}
        </span>
      </div>

      {/* Banner */}
      <div className="mt-5 px-6">
        <div className="relative aspect-video overflow-hidden rounded-xl bg-beige">
          {item.thumbnailUrl ? (
            <img
              src={item.thumbnailUrl || "/placeholder.svg"}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-gold/40">
              {isVideo ? <Play className="h-12 w-12" /> : <FileText className="h-12 w-12" />}
            </div>
          )}

          {isVideo ? (
            <span className="absolute inset-0 flex items-center justify-center">
              <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/90 text-navy shadow-lg transition-transform group-hover:scale-110">
                <Play className="h-6 w-6 translate-x-0.5 fill-current" />
              </span>
            </span>
          ) : null}
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col p-6">
        <h3 className="flex-1 text-balance font-serif text-xl font-bold leading-snug text-navy-text transition-colors group-hover:text-gold">
          {item.title}
        </h3>
        {item.url ? (
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-gold">
            {actionLabel(kind)}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </span>
        ) : null}
      </div>
    </article>
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
