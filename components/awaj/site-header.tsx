import { Header } from "./header"
import { getSiteSettings } from "@/app/actions/settings"

export async function SiteHeader() {
  const settings = await getSiteSettings()
  return <Header logoUrl={settings.headerLogoUrl || undefined} />
}
