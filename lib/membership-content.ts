// Shared types + defaults for editable membership page content.
// Kept out of the "use server" action file, which may only export async functions.

// A comparison cell is one of:
//  - "yes"  -> shows a colored check in that plan's accent
//  - "no"   -> shows a muted dash
//  - any other non-empty string -> shows that text (e.g. "Paid (when needed)")
export type ComparisonRow = {
  label: string
  // Aligned to the plan column order (by sortOrder). Index i = plan i.
  values: string[]
}

export type MembershipInfoBlock = {
  icon: string
  title: string
  desc: string
  chipIcon: string
  chipText: string
}

export type MembershipCta = {
  title: string
  subtitle: string
  primaryLabel: string
  primaryUrl: string
  secondaryLabel: string
  secondaryUrl: string
}

export type MembershipContent = {
  comparison: ComparisonRow[]
  infoBlocks: MembershipInfoBlock[]
  cta: MembershipCta
}

export const MEMBERSHIP_CONTENT_KEYS = {
  comparison: "membershipComparison",
  infoBlocks: "membershipInfoBlocks",
  cta: "membershipCta",
} as const

export const DEFAULT_COMPARISON: ComparisonRow[] = [
  { label: "Access to member directory", values: ["yes", "yes", "yes", "yes"] },
  { label: "Invitations to public events", values: ["yes", "yes", "yes", "yes"] },
  { label: "Newsletter & ecosystem updates", values: ["yes", "yes", "yes", "yes"] },
  { label: "Community access", values: ["yes", "yes", "yes", "yes"] },
  { label: "Startup resources", values: ["no", "yes", "no", "yes"] },
  { label: "Industry reports & insights", values: ["no", "no", "yes", "yes"] },
  { label: "Brand visibility on AWAJ platform", values: ["no", "no", "yes", "yes"] },
  {
    label: "Matching services & introductions (on request)",
    values: ["Paid (when needed)", "Paid (when needed)", "Paid (when needed)", "yes"],
  },
  { label: "Co-create programs & initiatives", values: ["no", "no", "no", "yes"] },
  { label: "Private roundtables & executive dinners", values: ["no", "no", "no", "yes"] },
]

export const DEFAULT_INFO_BLOCKS: MembershipInfoBlock[] = [
  {
    icon: "CircleDollarSign",
    title: "Pay When You Need",
    desc: "All members (Supporter, Startup and Corporate) enjoy free membership and pay only for matching services, introductions or programs when you need them.",
    chipIcon: "BadgeCheck",
    chipText: "No hidden fees. Pay only for value.",
  },
  {
    icon: "BadgeCheck",
    title: "One Year Membership",
    desc: "All membership plans are valid for one year from the date of joining. Renew annually to continue enjoying member benefits.",
    chipIcon: "Calendar",
    chipText: "12 Months of Access & Benefits",
  },
  {
    icon: "HeartHandshake",
    title: "Flexible & Transparent",
    desc: "No hidden fees. You choose the services you need and pay only for the value you receive.",
    chipIcon: "CreditCard",
    chipText: "Full Transparency, Always",
  },
  {
    icon: "ShieldCheck",
    title: "Trusted Network",
    desc: "Join a trusted community of innovators, investors, enterprises and policymakers building the future of Web3 in Japan and Asia.",
    chipIcon: "Users",
    chipText: "Connect. Collaborate. Grow.",
  },
]

export const DEFAULT_CTA: MembershipCta = {
  title: "Ready to be part of the future?",
  subtitle: "Join Asia Web3 Alliance Japan today.",
  primaryLabel: "Join Now",
  primaryUrl: "/contact",
  secondaryLabel: "Or Contact Us for More Information",
  secondaryUrl: "/contact",
}
