import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono, Playfair_Display } from 'next/font/google'
import { getSiteSettings } from '@/app/actions/settings'
import { resolveBaseUrl } from '@/lib/seo'
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
  const ogImages = settings.ogImageUrl ? [{ url: settings.ogImageUrl }] : undefined
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
      images: ogImages,
    },
    twitter: {
      card: 'summary_large_image',
      title: ogTitle,
      description: ogDescription,
      images: settings.ogImageUrl ? [settings.ogImageUrl] : undefined,
      site: settings.twitterHandle || undefined,
    },
    icons: {
      icon,
      apple: settings.faviconUrl || '/apple-icon.png',
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'light dark',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
