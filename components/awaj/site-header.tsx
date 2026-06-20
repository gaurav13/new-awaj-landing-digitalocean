import { resolveImageUrl } from "@/lib/images"
import { Header } from "./header"
import { getSiteSettings } from "@/app/actions/settings"

export async function SiteHeader() {
  const settings = await getSiteSettings()
  const logoUrl = settings.headerLogoUrl ? resolveImageUrl(settings.headerLogoUrl) : undefined
  return <Header logoUrl={logoUrl} />
}
