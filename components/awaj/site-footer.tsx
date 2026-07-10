import { resolveImageUrl } from "@/lib/images"
import { Footer } from "./footer"
import { getSiteSettings } from "@/app/actions/settings"

export async function SiteFooter() {
  const settings = await getSiteSettings()
  const logoUrl = settings.footerLogoUrl ? resolveImageUrl(settings.footerLogoUrl) : undefined
  return (
    <Footer
      logoUrl={logoUrl}
      socialLinks={{
        twitterUrl: settings.socialTwitterUrl,
        linkedinUrl: settings.socialLinkedinUrl,
        telegramUrl: settings.socialTelegramUrl,
      }}
    />
  )
}
