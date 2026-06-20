import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { MembershipPackages } from "@/components/awaj/membership-packages"
import { JsonLd } from "@/components/seo/json-ld"
import { getAllMembershipPlans } from "@/app/actions/membership"
import { getMembershipContent } from "@/app/actions/membership-content"
import { buildPageMetadata, getBreadcrumbSchema, resolveBaseUrl } from "@/lib/seo"
import { getSiteSettings } from "@/app/actions/settings"

export async function generateMetadata() {
  // SEO is generated automatically from the editable membership header + plan names.
  const [settings, plans] = await Promise.all([getSiteSettings(), getAllMembershipPlans()])
  const planNames = plans.map((p) => p.name.replace(/\s*Member$/i, "")).join(", ")
  const description =
    settings.membershipSubtitle ||
    `Join Asia Web3 & AI Alliance Japan. Choose from ${planNames || "Supporter, Startup, Corporate, and Executive"} membership plans and become part of a trusted Web3 network across Asia and Japan.`

  return buildPageMetadata({
    path: "/membership",
    title: settings.membershipTitle || "Membership Packages",
    description,
  })
}

export default async function MembershipPage() {
  const [plans, settings, membershipContent] = await Promise.all([
    getAllMembershipPlans(),
    getSiteSettings(),
    getMembershipContent(),
  ])
  const base = resolveBaseUrl(settings.canonicalBaseUrl)

  const breadcrumb = await getBreadcrumbSchema([
    { name: "Home", path: "/" },
    { name: "Membership", path: "/membership" },
  ])

  // OfferCatalog schema listing each membership plan as an offer.
  const offerCatalog = {
    "@context": "https://schema.org",
    "@type": "OfferCatalog",
    name: "AWAJ Membership Packages",
    url: `${base}/membership`,
    itemListElement: plans.map((p, i) => ({
      "@type": "Offer",
      position: i + 1,
      name: p.name,
      description: p.description || undefined,
      category: "Membership",
      ...(p.price.toLowerCase().includes("free")
        ? { price: "0", priceCurrency: "JPY" }
        : { priceSpecification: { "@type": "PriceSpecification", price: p.price, priceCurrency: "JPY" } }),
      seller: { "@id": `${base}/#organization` },
    })),
  }

  return (
    <main className="min-h-svh bg-ivory">
      <JsonLd data={[breadcrumb, offerCatalog]} />
      <SiteHeader />

      {plans.length === 0 ? (
        <div className="mx-auto max-w-[1280px] px-5 py-16 lg:px-10">
          <div className="rounded-2xl border border-gold/20 bg-white p-12 text-center">
            <h2 className="font-serif text-xl font-bold text-navy-text">Membership plans coming soon</h2>
            <p className="mt-2 text-sm text-navy-text/60">Check back shortly to explore AWAJ membership options.</p>
          </div>
        </div>
      ) : (
        <MembershipPackages
          plans={plans}
          header={{
            eyebrow: settings.membershipEyebrow,
            title: settings.membershipTitle,
            subtitle: settings.membershipSubtitle,
            heroUrl: settings.membershipHeroUrl,
          }}
          content={membershipContent}
        />
      )}

      <SiteFooter />
    </main>
  )
}
