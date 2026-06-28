import Script from "next/script"

/**
 * Loads Google Analytics 4 (gtag.js) globally. Renders nothing unless a valid
 * GA4 Measurement ID (G-XXXXXXXXXX) is provided from the admin SEO settings.
 * Scripts use afterInteractive so they never block first paint.
 */
export function GoogleAnalytics({ measurementId }: { measurementId?: string }) {
  const id = measurementId?.trim()
  if (!id) return null

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${id}`} strategy="afterInteractive" />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${id}');
        `}
      </Script>
    </>
  )
}
