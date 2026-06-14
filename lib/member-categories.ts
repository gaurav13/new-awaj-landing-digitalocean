export type MemberCategory = "corporate" | "startup" | "sponsor" | "government"

export const MEMBER_CATEGORIES: { value: MemberCategory; label: string; description: string }[] = [
  {
    value: "corporate",
    label: "Corporate Members",
    description: "Established companies and institutions partnering across Web3 & AI.",
  },
  {
    value: "startup",
    label: "Startup Members",
    description: "Emerging ventures building the next generation of innovation.",
  },
  {
    value: "sponsor",
    label: "Program Sponsors",
    description: "Organizations powering our programs, events, and initiatives.",
  },
  {
    value: "government",
    label: "Government & Public",
    description: "Public bodies and government organizations supporting the ecosystem.",
  },
]

export const MEMBER_CATEGORY_VALUES = MEMBER_CATEGORIES.map((c) => c.value)

export function memberCategoryLabel(value: string): string {
  return MEMBER_CATEGORIES.find((c) => c.value === value)?.label ?? "Members"
}
