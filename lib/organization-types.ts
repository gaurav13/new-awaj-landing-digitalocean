import type { Organization } from "@/lib/db/schema"

export type { Organization }

export type OrgConnection = { id: number; title: string; slug: string }

export type DirectoryOrganization = Organization & {
  events: OrgConnection[]
  programs: OrgConnection[]
}

export type AdminOrganization = Organization & {
  eventCount: number
  programCount: number
  events: OrgConnection[]
  programs: OrgConnection[]
}

export type EventProgramOptions = {
  events: { id: number; title: string }[]
  programs: { id: number; title: string }[]
}

export type OrganizationInput = {
  name: string
  type?: string
  logoUrl?: string
  websiteUrl?: string
  country?: string
  industry?: string
  description?: string
  status?: string
  featured?: boolean
  sortOrder?: number
}
