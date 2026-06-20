import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, MapPin, Calendar, ExternalLink } from "lucide-react"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { RichContent } from "@/components/awaj/rich-content"
import { getNewsBySlug, getRelatedNews } from "@/app/actions/news"
import { dateParts, formatLongDate } from "@/lib/format-date"
import { buildPageMetadata, getArticleSchema, getBreadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) return { title: "Article not found | AWAJ" }
  return buildPageMetadata({
    path: `/news/${slug}`,
    title: article.title,
    description: article.excerpt,
    image: article.imageUrl,
    type: "article",
  })
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await getNewsBySlug(slug)
  if (!article) notFound()

  const related = await getRelatedNews(slug, 3)

  const [articleSchema, breadcrumbSchema] = await Promise.all([
    getArticleSchema({
      path: `/news/${slug}`,
      title: article.title,
      description: article.excerpt,
      image: article.imageUrl,
      datePublished: article.publishedAt,
      section: article.category,
    }),
    getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "News", path: "/news" },
      { name: article.title, path: `/news/${slug}` },
    ]),
  ])

  return (
    <main className="min-h-svh bg-ivory">
      <JsonLd data={[articleSchema, breadcrumbSchema]} />
      <SiteHeader />

      <article className="mx-auto max-w-[820px] px-5 py-10 lg:py-14">
        <Link
          href="/news"
          className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-gold transition-colors hover:text-navy-text"
        >
          <ArrowLeft className="h-4 w-4" />
          All News
        </Link>

        <div className="mt-6">
          <span className="rounded-full bg-awaj-red px-3 py-1 text-xs font-semibold uppercase tracking-wide text-white">
            {article.category}
          </span>
        </div>

        <h1 className="mt-4 text-balance font-serif text-3xl font-bold leading-tight text-navy-text lg:text-4xl">
          {article.title}
        </h1>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy-text/60">
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4 text-gold" />
            {formatLongDate(article.publishedAt)}
          </span>
          {article.location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-gold" />
              {article.location}
            </span>
          )}
        </div>

        {article.imageUrl && (
          <div className="mt-8 overflow-hidden rounded-2xl">
            <img src={article.imageUrl || "/placeholder.svg"} alt="" className="w-full object-cover" />
          </div>
        )}

        <p className="mt-8 text-pretty text-lg font-medium leading-relaxed text-navy-text/80">{article.excerpt}</p>

        {article.content ? <RichContent html={article.content} className="mt-6" /> : null}

        {article.externalUrl ? (
          <div className="mt-8 rounded-2xl border border-gold/20 bg-white p-6">
            <p className="text-sm text-navy-text/70">
              {article.source
                ? `This story was originally published by ${article.source}.`
                : "This story was originally published externally."}
            </p>
            <a
              href={article.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-awaj-red px-5 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
            >
              Read the full coverage
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        ) : null}
      </article>

      {related.length > 0 && (
        <section className="border-t border-gold/20 bg-white">
          <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10">
            <h2 className="mb-6 font-serif text-xl font-bold uppercase tracking-wide text-navy-text">More News</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((n) => {
                const d = dateParts(n.publishedAt)
                return (
                  <Link
                    key={n.id}
                    href={`/news/${n.slug}`}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-gold/20 bg-ivory transition-shadow hover:shadow-md"
                  >
                    <div className="aspect-[16/10] overflow-hidden">
                      <img
                        src={n.imageUrl || "/placeholder.svg?height=400&width=600&query=news"}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gold">
                        {d.month} {d.day}, {d.year}
                      </p>
                      <h3 className="mt-2 text-balance font-serif text-base font-bold leading-snug text-navy-text">
                        {n.title}
                      </h3>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </main>
  )
}
