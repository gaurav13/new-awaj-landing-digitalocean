export const INQUIRY_TYPES = [
  "Media",
  "Sponsorship",
  "Partnership",
  "Membership",
  "Other",
] as const

export type InquiryType = (typeof INQUIRY_TYPES)[number]
