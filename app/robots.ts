import type { MetadataRoute } from "next"
import { getSiteSettings } from "@/app/actions/settings"
import { resolveBaseUrl } from "@/lib/seo"

export const dynamic = "force-dynamic"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings()
  const base = resolveBaseUrl(settings.canonicalBaseUrl)

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Keep non-public surfaces out of search results.
        disallow: ["/admin", "/api/", "/sign-in", "/sign-up", "/forgot-password", "/reset-password"],
      },
    ],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
