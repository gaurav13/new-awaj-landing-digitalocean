import type { MetadataRoute } from "next"
import { getSiteSettings } from "@/app/actions/settings"

export const dynamic = "force-dynamic"

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings()
  const name = settings.siteTitle || "Asia Web3 & AI Alliance Japan (AWAJ)"

  return {
    name,
    short_name: "AWAJ",
    description: settings.siteDescription,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10243d",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  }
}
