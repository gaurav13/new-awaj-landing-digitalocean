import type { Metadata } from "next"
import { getSiteSettings, type SiteSettings } from "@/app/actions/settings"
import { resolveImageUrl } from "@/lib/images"

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

/** Picks the best social preview image: page image → OG image → hero banner. */
export function resolveSocialImage(
  settings: Pick<SiteSettings, "ogImageUrl" | "heroBannerUrl" | "siteTitle">,
  override?: string | null,
): { url: string; alt: string } | undefined {
  for (const raw of [override, settings.ogImageUrl, settings.heroBannerUrl]) {
    const url = resolveImageUrl(raw ?? "")
    if (url.startsWith("https://")) {
      return { url, alt: settings.siteTitle }
    }
  }
  return undefined
}

function buildSocialImages(image: { url: string; alt: string } | undefined) {
  if (!image) return undefined
  return [
    {
      url: image.url,
      width: 1200,
      height: 630,
      alt: image.alt,
      type: image.url.match(/\.png($|\?)/i) ? "image/png" : "image/jpeg",
    },
  ]
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
  const socialImage = resolveSocialImage(settings, input.image)
  const images = buildSocialImages(socialImage)
  const canonical = input.path === "/" ? "/" : input.path
  const pageUrl = `${base}${canonical === "/" ? "" : canonical}`

  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title: ogTitle,
      description,
      type: input.type || "website",
      url: pageUrl,
      siteName: settings.siteTitle,
      locale: "en_US",
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description,
      images: socialImage ? [socialImage.url] : undefined,
      site: "AWAJ_official" || undefined,
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
  const logoRaw = settings.headerLogoUrl || settings.ogImageUrl
  const logo = logoRaw ? resolveImageUrl(logoRaw) : undefined
  const handle = settings.twitterHandle?.replace(/^@/, "")

  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${base}/#organization`,
    name: settings.siteTitle,
    url: base,
    description: settings.siteDescription,
    ...(logo ? { logo } : {}),
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
    ...(input.image ? { image: [resolveImageUrl(input.image)] } : {}),
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
    ...(input.image ? { image: [resolveImageUrl(input.image)] } : {}),
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
