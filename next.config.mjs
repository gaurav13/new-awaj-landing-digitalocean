/** Baseline security headers applied to every response. */
const securityHeaders = [
  // Prevent MIME-type sniffing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Disallow embedding the site in iframes (clickjacking protection).
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  // Send the origin only on cross-origin requests.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // Lock down powerful browser features by default.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
  // Force HTTPS for two years, including subdomains.
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
]

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  async headers() {
    return [
      {
        // Security headers on every route.
        source: "/:path*",
        headers: securityHeaders,
      },
      {
        // Long-cache immutable, fingerprinted Next.js build assets.
        source: "/_next/static/:path*",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        // Cache static images and icons aggressively but allow revalidation.
        source: "/:all*(svg|jpg|jpeg|png|webp|avif|gif|ico|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" }],
      },
      {
        // Let crawlers cache discovery files briefly.
        source: "/:path(sitemap.xml|robots.txt|manifest.webmanifest)",
        headers: [{ key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" }],
      },
    ]
  },
}

export default nextConfig
