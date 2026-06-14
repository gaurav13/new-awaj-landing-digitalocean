import { Footer } from "./footer"
import { getSiteSettings } from "@/app/actions/settings"

export async function SiteFooter() {
  const settings = await getSiteSettings()
  return <Footer logoUrl={settings.footerLogoUrl || undefined} />
}
