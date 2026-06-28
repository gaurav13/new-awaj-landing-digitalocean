import type { MetadataRoute } from "next"
import { getSiteSettings } from "@/app/actions/settings"
import { resolveBaseUrl } from "@/lib/seo"
import { getAllNews } from "@/app/actions/news"
import { getAllEvents } from "@/app/actions/events"
import { getAllPrograms } from "@/app/actions/programs"

export const dynamic = "force-dynamic"

/** Static public routes and their relative crawl priority. */
const STATIC_ROUTES: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "/", priority: 1, changeFrequency: "daily" },
  { path: "/membership", priority: 0.9, changeFrequency: "weekly" },
  { path: "/programs", priority: 0.8, changeFrequency: "weekly" },
  { path: "/events", priority: 0.8, changeFrequency: "daily" },
  { path: "/news", priority: 0.8, changeFrequency: "daily" },
  { path: "/members", priority: 0.7, changeFrequency: "weekly" },
  { path: "/team", priority: 0.7, changeFrequency: "monthly" },
  { path: "/gallery", priority: 0.6, changeFrequency: "monthly" },
  { path: "/media", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.5, changeFrequency: "yearly" },
]

function toDate(value: unknown): Date {
  const d = value ? new Date(value as string | number | Date) : new Date()
  return Number.isNaN(d.getTime()) ? new Date() : d
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const settings = await getSiteSettings()
  const base = resolveBaseUrl(settings.canonicalBaseUrl)

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((r) => ({
    url: `${base}${r.path === "/" ? "" : r.path}`,
    lastModified: new Date(),
    changeFrequency: r.changeFrequency,
    priority: r.priority,
  }))

  // Dynamic content. Failures (e.g. DB unavailable) degrade to the static map.
  const [news, events, programs] = await Promise.all([
    getAllNews().catch(() => []),
    getAllEvents().catch(() => []),
    getAllPrograms().catch(() => []),
  ])

  const newsEntries: MetadataRoute.Sitemap = news.map((n: any) => ({
    url: `${base}/news/${n.slug}`,
    lastModified: toDate(n.updatedAt ?? n.publishedAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  const eventEntries: MetadataRoute.Sitemap = events.map((e: any) => ({
    url: `${base}/events/${e.slug}`,
    lastModified: toDate(e.updatedAt ?? e.startDate),
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  const programEntries: MetadataRoute.Sitemap = programs.map((p: any) => ({
    url: `${base}/programs/${p.slug}`,
    lastModified: toDate(p.updatedAt ?? p.createdAt),
    changeFrequency: "monthly",
    priority: 0.6,
  }))

  return [...staticEntries, ...newsEntries, ...eventEntries, ...programEntries]
}
