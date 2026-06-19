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
