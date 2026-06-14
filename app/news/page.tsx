import Link from "next/link"
import { ArrowUpRight } from "lucide-react"
import { Header } from "@/components/awaj/header"
import { Footer } from "@/components/awaj/footer"
import { getAllNews } from "@/app/actions/news"
import { dateParts, formatLongDate } from "@/lib/format-date"

export const metadata = {
  title: "News | Asia Web3 & AI Alliance Japan",
  description: "The latest news, partnerships, and program updates from Asia Web3 & AI Alliance Japan (AWAJ).",
}

export default async function NewsPage() {
  const articles = await getAllNews()
  const [featured, ...rest] = articles

  return (
    <main className="min-h-svh bg-ivory">
      <Header />

      {/* Page hero */}
      <section className="border-b border-gold/20 bg-navy">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Newsroom</p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
            Latest News from the Alliance
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            Partnerships, program milestones, and stories from across Asia and Japan&apos;s Web3 &amp; AI ecosystem.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
        {articles.length === 0 ? (
          <div className="rounded-2xl border border-gold/20 bg-white p-12 text-center">
            <h2 className="font-serif text-xl font-bold text-navy-text">No news yet</h2>
            <p className="mt-2 text-sm text-navy-text/60">Check back soon for updates from AWAJ.</p>
          </div>
        ) : (
          <>
            {/* Featured */}
            {featured && (
              <Link
                href={`/news/${featured.slug}`}
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
                    {featured.location ? ` · ${featured.location}` : ""}
                  </p>
                  <h2 className="text-balance font-serif text-2xl font-bold leading-snug text-navy-text lg:text-3xl">
                    {featured.title}
                  </h2>
                  <p className="text-pretty leading-relaxed text-navy-text/70">{featured.excerpt}</p>
                  <span className="inline-flex items-center gap-1.5 text-sm font-semibold uppercase tracking-wide text-navy-text transition-colors group-hover:text-gold">
                    Read article
                    <ArrowUpRight className="h-4 w-4" />
                  </span>
                </div>
              </Link>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((n) => {
                  const d = dateParts(n.publishedAt)
                  return (
                    <Link
                      key={n.id}
                      href={`/news/${n.slug}`}
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
                        </p>
                        <h3 className="mt-2 text-balance font-serif text-lg font-bold leading-snug text-navy-text">
                          {n.title}
                        </h3>
                        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-navy-text/65">{n.excerpt}</p>
                      </div>
                    </Link>
                  )
                })}
              </div>
            )}
          </>
        )}
      </div>

      <Footer />
    </main>
  )
}
