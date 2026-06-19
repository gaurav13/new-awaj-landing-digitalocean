"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { dateParts, formatLongDate } from "@/lib/format-date"

type Article = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string | null
  category: string
  imageUrl: string | null
  location: string | null
  source: string | null
  externalUrl: string | null
  publishedAt: Date | string
}

const PAGE_SIZE = 6

function isExternal(a: Article) {
  return Boolean(a.externalUrl)
}

function CardLink({ article, children, className }: { article: Article; children: React.ReactNode; className?: string }) {
  // Every article opens its own readable page on the site.
  return (
    <Link href={`/news/${article.slug}`} className={className}>
      {children}
    </Link>
  )
}

export function NewsListing({ articles }: { articles: Article[] }) {
  const categories = useMemo(() => {
    const set = new Set<string>()
    for (const a of articles) set.add(a.category)
    return ["All", ...Array.from(set)]
  }, [articles])

  const [activeCategory, setActiveCategory] = useState("All")
  const [visible, setVisible] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    if (activeCategory === "All") return articles
    return articles.filter((a) => a.category === activeCategory)
  }, [articles, activeCategory])

  const featured = filtered[0]
  const rest = filtered.slice(1)
  const shown = rest.slice(0, visible)
  const hasMore = rest.length > visible

  function selectCategory(cat: string) {
    setActiveCategory(cat)
    setVisible(PAGE_SIZE)
  }

  if (articles.length === 0) {
    return (
      <div className="rounded-2xl border border-gold/20 bg-white p-12 text-center">
        <h2 className="font-serif text-xl font-bold text-navy-text">No news yet</h2>
        <p className="mt-2 text-sm text-navy-text/60">Check back soon for updates from AWAJ.</p>
      </div>
    )
  }

  return (
    <>
      {/* Category filters */}
      {categories.length > 2 ? (
        <div className="mb-8 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => selectCategory(cat)}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold uppercase tracking-wide transition-colors ${
                activeCategory === cat
                  ? "bg-navy text-white"
                  : "border border-gold/30 text-navy-text/70 hover:border-gold hover:text-gold"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      ) : null}

      {/* Featured */}
      {featured ? (
        <CardLink
          article={featured}
          className="group grid grid-cols-1 overflow-hidden rounded-3xl border border-gold/20 bg-white shadow-sm transition-shadow hover:shadow-md lg:grid-cols-2"
        >
          <div className="relative aspect-[16/10] overflow-hidden lg:aspect-auto">
            <img
              src={featured.imageUrl || "/placeholder.svg?height=600&width=800&query=news"}
              alt=""
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span className="absolute left-4 top-4 rounded-full bg-awaj-red px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
              {featured.category}
            </span>
          </div>
          <div className="flex flex-col justify-center gap-4 p-8 lg:p-10">
            <p className="text-xs font-semibold uppercase tracking-wide text-gold">
              {formatLongDate(featured.publishedAt)}
              {featured.source ? ` · ${featured.source}` : featured.location ? ` · ${featured.location}` : ""}
            </p>
            <h2 className="text-balance font-serif text-2xl font-bold leading-snug text-navy-text lg:text-3xl">
              {featured.title}
            </h2>
            <p className="text-pretty leading-relaxed text-navy-text/70">{featured.excerpt}</p>
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-navy-text transition-colors group-hover:text-gold">
              {isExternal(featured) ? "Read coverage" : "Read article"}
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </div>
        </CardLink>
      ) : null}

      {/* Grid */}
      {shown.length > 0 ? (
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((n) => {
            const d = dateParts(n.publishedAt)
            return (
              <CardLink
                key={n.id}
                article={n}
                className="group flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-white shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  <img
                    src={n.imageUrl || "/placeholder.svg?height=400&width=600&query=news"}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <span className="absolute left-3 top-3 rounded-full bg-navy/90 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {n.category}
                  </span>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                    {d.month} {d.day}, {d.year}
                    {n.source ? ` · ${n.source}` : ""}
                  </p>
                  <h3 className="mt-2 text-balance font-serif text-lg font-bold leading-snug text-navy-text">
                    {n.title}
                  </h3>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-text/65">{n.excerpt}</p>
                </div>
              </CardLink>
            )
          })}
        </div>
      ) : null}

      {hasMore ? (
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={() => setVisible((v) => v + PAGE_SIZE)}
            className="rounded-full bg-navy px-8 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
          >
            Load more
          </button>
        </div>
      ) : null}
    </>
  )
}
