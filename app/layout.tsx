import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { getSiteSettings } from '@/app/actions/settings'
import { getOrganizationSchema, getWebSiteSchema, resolveBaseUrl, resolveSocialImage } from '@/lib/seo'
import { JsonLd } from '@/components/seo/json-ld'
import { GoogleAnalytics } from '@/components/analytics/google-analytics'
import './globals.css'

// Database-backed pages must not prerender at build time when env vars are unavailable.
export const dynamic = 'force-dynamic'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})
const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
})

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()

  const title = settings.siteTitle
  const description = settings.siteDescription
  const ogTitle = settings.ogTitle || title
  const ogDescription = settings.ogDescription || description
  const socialImage = resolveSocialImage(settings)
  const ogImages = socialImage
    ? [{ url: socialImage.url, width: 1200, height: 630, alt: socialImage.alt }]
    : undefined
  const baseUrl = resolveBaseUrl(settings.canonicalBaseUrl)

  // A custom favicon set in admin overrides the bundled icons.
  const icon = settings.faviconUrl
    ? [{ url: settings.faviconUrl }]
    : [
        { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
        { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ]

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: title,
      template: `%s | ${title}`,
    },
    description,
    keywords: settings.siteKeywords
      ? settings.siteKeywords.split(',').map((k) => k.trim()).filter(Boolean)
      : undefined,
    generator: 'v0.app',
    // Homepage canonical. Inner pages override this with their own path.
    alternates: { canonical: '/' },
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: 'website',
      url: baseUrl,
      siteName: title,
      locale: 'en_US',
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: socialImage ? [socialImage.url] : undefined,
      site: settings.twitterHandle || undefined,
    },
    icons: {
      icon,
      apple: settings.faviconUrl || '/apple-icon.png',
    },
    verification: {
      google: settings.googleSiteVerification || undefined,
      other: settings.bingSiteVerification
        ? { 'msvalidate.01': settings.bingSiteVerification }
        : undefined,
    },
    manifest: '/manifest.webmanifest',
  }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const [organizationSchema, webSiteSchema, settings] = await Promise.all([
    getOrganizationSchema(),
    getWebSiteSchema(),
    getSiteSettings(),
  ])

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        <JsonLd data={[organizationSchema, webSiteSchema]} />
        {children}
        <GoogleAnalytics measurementId={settings.gaMeasurementId} />
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
