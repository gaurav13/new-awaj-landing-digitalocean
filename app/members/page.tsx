import type { Metadata } from "next"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { getOrganizationsDirectory } from "@/app/actions/organizations"
import { MembersDirectory } from "@/components/awaj/members-directory"

export const metadata: Metadata = {
  title: "Members | Asia Web3 & AI Alliance Japan",
  description:
    "Explore the members, partners, startups, sponsors, government bodies, VCs, and media of Asia Web3 & AI Alliance Japan. Filter by type, country, industry, event, and program.",
  alternates: { canonical: "/members" },
}

export default async function MembersPage() {
  const organizations = await getOrganizationsDirectory()

  return (
    <main className="min-h-svh bg-ivory">
      <SiteHeader />

      <section className="border-b border-gold/20 bg-navy">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Members</p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
            Our Network
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            The members, partners, startups, sponsors, government bodies, VCs, and media building the future of Web3
            &amp; AI together with Asia Web3 &amp; AI Alliance Japan.{" "}
            {organizations.length > 0
              ? `Currently ${organizations.length} organization${organizations.length === 1 ? "" : "s"}.`
              : ""}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
        {organizations.length === 0 ? (
          <div className="rounded-2xl border border-gold/20 bg-white p-12 text-center">
            <h2 className="font-serif text-xl font-bold text-navy-text">No organizations yet</h2>
            <p className="mt-2 text-sm text-navy-text/60">
              Approved organizations will appear here automatically once added from the admin dashboard, events, or
              programs.
            </p>
          </div>
        ) : (
          <MembersDirectory organizations={organizations} />
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
