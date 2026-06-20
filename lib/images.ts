import type {
  EventSpeaker,
  EventSponsor,
  GalleryItem,
  ProgramPartner,
  ProgramStartup,
} from "@/lib/db/schema"

/** Public CDN base for all gallery / CMS images (no trailing slash on path segment). */
export const IMAGE_CDN_BASE_URL = (
  process.env.NEXT_PUBLIC_IMAGE_CDN_BASE_URL ||
  process.env.IMAGE_CDN_BASE_URL ||
  "https://awaj-gallery.sgp1.cdn.digitaloceanspaces.com/images/"
).replace(/\/?$/, "/")

const LEGACY_BLOB_HOST = /blob\.vercel-storage\.com/i

function isLegacyBlobUrl(value: string) {
  return LEGACY_BLOB_HOST.test(value)
}

/**
 * Turns a stored image reference into a full CDN URL.
 * Accepts bare filenames, `/images/...` paths, or existing absolute URLs.
 * Legacy Vercel Blob URLs are ignored so slug-based CDN fallbacks can apply.
 */
export function resolveImageUrl(value: string | null | undefined): string {
  const v = value?.trim()
  if (!v) return ""
  if (/^https?:\/\//i.test(v)) {
    if (isLegacyBlobUrl(v)) return ""
    return v
  }
  if (v.startsWith("/images/")) return `${IMAGE_CDN_BASE_URL}${v.slice("/images/".length)}`
  if (v.startsWith("images/")) return `${IMAGE_CDN_BASE_URL}${v.slice("images/".length)}`
  if (v.startsWith("/")) return `${IMAGE_CDN_BASE_URL}${v.replace(/^\//, "")}`
  return `${IMAGE_CDN_BASE_URL}${v}`
}

/** Normalizes a value for database storage (relative `/images/...` path). */
export function toStoredImagePath(value: string | null | undefined): string {
  const v = value?.trim()
  if (!v) return ""

  const cdnBase = IMAGE_CDN_BASE_URL.replace(/\/$/, "")
  if (v.startsWith(cdnBase)) {
    const rest = v.slice(cdnBase.length).replace(/^\//, "")
    return `/images/${rest}`
  }

  if (/^https?:\/\//i.test(v)) {
    try {
      const name = new URL(v).pathname.split("/").filter(Boolean).pop()
      if (name) return `/images/${name}`
    } catch {
      return v
    }
    return v
  }

  if (v.startsWith("/images/")) return v
  if (v.startsWith("images/")) return `/${v}`
  if (v.startsWith("/")) return `/images/${v.replace(/^\//, "")}`
  return `/images/${v}`
}

export function resolveGalleryItems(items: GalleryItem[] | null | undefined): GalleryItem[] {
  if (!items?.length) return []
  return items.map((item) => ({
    ...item,
    imageUrl: resolveImageUrl(item.imageUrl),
  }))
}

export function resolveEventSpeakers(speakers: EventSpeaker[] | null | undefined): EventSpeaker[] {
  if (!speakers?.length) return []
  return speakers.map((s) => ({
    ...s,
    imageUrl: s.imageUrl ? resolveImageUrl(s.imageUrl) : s.imageUrl,
    companyLogoUrl: s.companyLogoUrl ? resolveImageUrl(s.companyLogoUrl) : s.companyLogoUrl,
  }))
}

export function resolveEventSponsors(sponsors: EventSponsor[] | null | undefined): EventSponsor[] {
  if (!sponsors?.length) return []
  return sponsors.map((s) => ({
    ...s,
    logoUrl: s.logoUrl ? resolveImageUrl(s.logoUrl) : s.logoUrl,
  }))
}

export function resolveProgramPartners(partners: ProgramPartner[] | null | undefined): ProgramPartner[] {
  if (!partners?.length) return []
  return partners.map((p) => ({
    ...p,
    logoUrl: p.logoUrl ? resolveImageUrl(p.logoUrl) : p.logoUrl,
  }))
}

export function resolveProgramStartups(startups: ProgramStartup[] | null | undefined): ProgramStartup[] {
  if (!startups?.length) return []
  return startups.map((s) => ({
    ...s,
    logoUrl: s.logoUrl ? resolveImageUrl(s.logoUrl) : s.logoUrl,
  }))
}

export function resolveOptionalImage(value: string | null | undefined): string | null {
  const resolved = resolveImageUrl(value)
  return resolved || null
}

type EventImageFields = {
  slug: string
  imageUrl?: string | null
  bannerUrl?: string | null
}

/** Slug-based CDN fallback when DB image fields are empty (e.g. `my-event.png`). */
export function resolveEventSlugFallback(slug: string): string {
  return resolveImageUrl(`${slug}.png`)
}

/** Card / list thumbnail — prefers poster (`imageUrl`), then banner, then slug CDN file. */
export function resolveEventCardImage(event: EventImageFields): string {
  return (
    resolveImageUrl(event.imageUrl) ||
    resolveImageUrl(event.bannerUrl) ||
    resolveEventSlugFallback(event.slug)
  )
}

/** Detail hero — prefers banner, then poster, then slug CDN file. */
export function resolveEventPosterImage(event: EventImageFields): string {
  return (
    resolveImageUrl(event.bannerUrl) ||
    resolveImageUrl(event.imageUrl) ||
    resolveEventSlugFallback(event.slug)
  )
}

export function resolveEventRecord<
  T extends {
    slug: string
    imageUrl?: string | null
    bannerUrl?: string | null
    speakers?: EventSpeaker[] | null
    sponsors?: EventSponsor[] | null
  },
>(row: T): T {
  const resolvedBanner = resolveOptionalImage(row.bannerUrl ?? null)
  const resolvedImage = resolveOptionalImage(row.imageUrl ?? null)
  const slugFallback = resolveEventSlugFallback(row.slug)

  return {
    ...row,
    bannerUrl: resolvedBanner,
    imageUrl: resolvedImage || resolvedBanner || slugFallback,
    speakers: resolveEventSpeakers(row.speakers ?? undefined) as T["speakers"],
    sponsors: resolveEventSponsors(row.sponsors ?? undefined) as T["sponsors"],
  }
}

export function resolveProgramRecord<
  T extends {
    imageUrl?: string | null
    bannerUrl?: string | null
    partners?: ProgramPartner[] | null
    startups?: ProgramStartup[] | null
    gallery?: GalleryItem[] | null
  },
>(row: T): T {
  return {
    ...row,
    imageUrl: resolveOptionalImage(row.imageUrl ?? null),
    bannerUrl: resolveOptionalImage(row.bannerUrl ?? null),
    partners: resolveProgramPartners(row.partners ?? undefined) as T["partners"],
    startups: resolveProgramStartups(row.startups ?? undefined) as T["startups"],
    gallery: resolveGalleryItems(row.gallery ?? undefined) as T["gallery"],
  }
}

export function resolveGalleryRecord<
  T extends {
    coverImageUrl?: string | null
    photos?: GalleryItem[] | null
  },
>(row: T): T {
  return {
    ...row,
    coverImageUrl: resolveOptionalImage(row.coverImageUrl ?? null),
    photos: resolveGalleryItems(row.photos ?? undefined) as T["photos"],
  }
}

export function resolvePersonRecord<
  T extends {
    profilePhoto?: string | null
    companyLogo?: string | null
  },
>(row: T): T {
  return {
    ...row,
    profilePhoto: resolveOptionalImage(row.profilePhoto ?? null),
    companyLogo: resolveOptionalImage(row.companyLogo ?? null),
  }
}

/** Client-side upload helper — stores a relative `/images/...` path in the database. */
export async function uploadImageViaApi(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)
  const res = await fetch("/api/upload", { method: "POST", body: formData })
  if (!res.ok) {
    const body = (await res.json().catch(() => null)) as { error?: string } | null
    throw new Error(body?.error || "Upload failed")
  }
  const data = (await res.json()) as { path: string }
  return data.path
}
