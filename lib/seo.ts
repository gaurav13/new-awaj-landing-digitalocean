import type { Metadata } from "next"
import { getSiteSettings } from "@/app/actions/settings"

/**
 * Resolves the canonical base URL for the site. Priority:
 * 1. The admin-configured "Canonical base URL" setting.
 * 2. The Vercel production URL, then the current deployment URL.
 * 3. The v0 runtime URL (preview), then localhost.
 * Always returns an absolute origin with no trailing slash.
 */
export function resolveBaseUrl(canonicalBaseUrl?: string): string {
  const candidate =
    canonicalBaseUrl?.trim() ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    process.env.V0_RUNTIME_URL ||
    "http://localhost:3000"

  const withProtocol = /^https?:\/\//.test(candidate) ? candidate : `https://${candidate}`
  return withProtocol.replace(/\/+$/, "")
}

type PageSeoInput = {
  /** Route path beginning with "/", e.g. "/news" or "/events/my-event". */
  path: string
  /** Page-specific title (without the site-name suffix). */
  title?: string
  /** Page-specific description. Falls back to the site description. */
  description?: string
  /** Page-specific social image. Falls back to the global OG image. */
  image?: string | null
  /** "article" for blog/news/event detail pages, otherwise "website". */
  type?: "website" | "article"
}

/**
 * Builds a complete Metadata object for a page: title, description, canonical
 * URL, and Open Graph + Twitter social-preview metadata. Uses the admin SEO
 * settings as defaults so every page stays on-brand and consistent.
 */
export async function buildPageMetadata(input: PageSeoInput): Promise<Metadata> {
  const settings = await getSiteSettings()
  const base = resolveBaseUrl(settings.canonicalBaseUrl)

  const title = input.title || settings.siteTitle
  const description = input.description || settings.ogDescription || settings.siteDescription
  const ogTitle = input.title || settings.ogTitle || settings.siteTitle
  const image = input.image || settings.ogImageUrl || undefined
  const canonical = input.path === "/" ? "/" : input.path

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description,
      type: input.type || "website",
      url: `${base}${canonical === "/" ? "" : canonical}`,
      siteName: settings.siteTitle,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: image ? [image] : undefined,
      site: settings.twitterHandle || undefined,
    },
  }
}

// ---------------------------------------------------------------------------
// schema.org JSON-LD structured data
// ---------------------------------------------------------------------------

function absoluteUrl(base: string, path: string) {
  if (!path) return base
  if (/^https?:\/\//.test(path)) return path
  return `${base}${path.startsWith("/") ? path : `/${path}`}`
}

/** Organization schema describing the Alliance. Used site-wide. */
export async function getOrganizationSchema() {
  const settings = await getSiteSettings()
  const base = resolveBaseUrl(settings.canonicalBaseUrl)
  const logo = settings.headerLogoUrl || settings.ogImageUrl
  const handle = settings.twitterHandle?.replace(/^@/, "")

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: settings.siteTitle,
    url: base,
    description: settings.siteDescription,
    ...(logo ? { logo: absoluteUrl(base, logo) } : {}),
    ...(handle ? { sameAs: [`https://x.com/${handle}`] } : {}),
  }
}

/** WebSite schema. Used site-wide. */
export async function getWebSiteSchema() {
  const settings = await getSiteSettings()
  const base = resolveBaseUrl(settings.canonicalBaseUrl)

  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${base}/#website`,
    name: settings.siteTitle,
    url: base,
    description: settings.siteDescription,
    publisher: { "@id": `${base}/#organization` },
  }
}

type ArticleSchemaInput = {
  path: string
  title: string
  description?: string
  image?: string | null
  datePublished?: Date | string
  dateModified?: Date | string
  section?: string
}

/** Article schema for news detail pages. */
export async function getArticleSchema(input: ArticleSchemaInput) {
  const settings = await getSiteSettings()
  const base = resolveBaseUrl(settings.canonicalBaseUrl)
  const url = absoluteUrl(base, input.path)

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    headline: input.title,
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: [absoluteUrl(base, input.image)] } : {}),
    ...(input.section ? { articleSection: input.section } : {}),
    ...(input.datePublished ? { datePublished: new Date(input.datePublished).toISOString() } : {}),
    dateModified: new Date(input.dateModified || input.datePublished || Date.now()).toISOString(),
    author: { "@type": "Organization", name: settings.siteTitle, "@id": `${base}/#organization` },
    publisher: { "@id": `${base}/#organization` },
  }
}

type EventSchemaInput = {
  path: string
  title: string
  description?: string
  image?: string | null
  startDate?: Date | string
  location?: string | null
}

/** Event schema for event detail pages. */
export async function getEventSchema(input: EventSchemaInput) {
  const settings = await getSiteSettings()
  const base = resolveBaseUrl(settings.canonicalBaseUrl)

  return {
    "@context": "https://schema.org",
    "@type": "Event",
    name: input.title,
    url: absoluteUrl(base, input.path),
    ...(input.description ? { description: input.description } : {}),
    ...(input.image ? { image: [absoluteUrl(base, input.image)] } : {}),
    ...(input.startDate ? { startDate: new Date(input.startDate).toISOString() } : {}),
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    ...(input.location
      ? { location: { "@type": "Place", name: input.location, address: input.location } }
      : {}),
    organizer: { "@type": "Organization", name: settings.siteTitle, url: base },
  }
}

/** BreadcrumbList schema. Accepts ordered { name, path } crumbs. */
export async function getBreadcrumbSchema(crumbs: { name: string; path: string }[]) {
  const settings = await getSiteSettings()
  const base = resolveBaseUrl(settings.canonicalBaseUrl)

  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.name,
      item: absoluteUrl(base, c.path),
    })),
  }
}
