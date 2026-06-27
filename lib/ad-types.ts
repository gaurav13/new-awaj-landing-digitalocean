import type { Ad, AdPageTarget, AdPlacement, AdTrigger, AdFrequency } from "@/lib/db/schema"

export type AdInput = {
  campaignName: string
  imageUrl?: string
  linkUrl?: string
  altText?: string
  title?: string
  bodyText?: string
  buttonText?: string
  pageTarget?: AdPageTarget
  placement?: AdPlacement
  trigger?: AdTrigger
  frequency?: AdFrequency
  status?: string
  showSponsoredLabel?: boolean
  startDate?: string | null
  endDate?: string | null
  sortOrder?: number
}

/** Ad row enriched with derived analytics for the admin table. */
export type AdminAd = Ad & {
  ctr: number
  isExpired: boolean
  isScheduled: boolean
  isLive: boolean
}

export type NewsletterResult =
  | { ok: true; duplicate: boolean }
  | { ok: false; error: string }
