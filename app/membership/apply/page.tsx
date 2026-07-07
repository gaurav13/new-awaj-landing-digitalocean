import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { MembershipApplicationForm } from "@/components/awaj/membership-application-form"
import { buildPageMetadata } from "@/lib/seo"

export async function generateMetadata() {
  return buildPageMetadata({
    path: "/membership/apply",
    title: "Apply for Membership",
    description:
      "Apply to become a member of Asia Web3 & AI Alliance Japan. Submit your organization's details and our team will review your application.",
  })
}

export default function MembershipApplyPage() {
  return (
    <main className="min-h-svh bg-ivory">
      <SiteHeader />

      <section className="border-b border-gold/20 bg-navy">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Membership</p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
            Apply to Join the Alliance
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            Tell us about your organization and how you&apos;d like to be involved. Once approved, your company joins our
            members directory with the tags that reflect your role in the ecosystem.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[860px] px-5 py-12 lg:px-10 lg:py-16">
        <MembershipApplicationForm />
      </div>

      <SiteFooter />
    </main>
  )
}
