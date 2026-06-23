import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { ProgramDetail } from "@/components/awaj/program-detail"
import { ConnectedPeople } from "@/components/awaj/connected-people"
import { getProgramBySlug } from "@/app/actions/programs"
import { getMediaByProgram } from "@/app/actions/media"
import { getPeopleForProgram } from "@/app/actions/people"
import { buildPageMetadata, getArticleSchema, getBreadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"
import { AdSlot } from "@/components/ads/ad-slot"
import { PageAds } from "@/components/ads/page-ads"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) return { title: "Program not found | AWAJ" }
  return buildPageMetadata({
    path: `/programs/${slug}`,
    title: program.title,
    description: program.excerpt,
    image: program.imageUrl || program.bannerUrl,
    type: "article",
  })
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) notFound()

  const media = await getMediaByProgram(program.id)
  const programPeople = await getPeopleForProgram(program.id)

  const [programSchema, breadcrumbSchema] = await Promise.all([
    getArticleSchema({
      path: `/programs/${slug}`,
      title: program.title,
      description: program.excerpt,
      image: program.imageUrl || program.bannerUrl,
    }),
    getBreadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Programs", path: "/programs" },
      { name: program.title, path: `/programs/${slug}` },
    ]),
  ])

  return (
    <main className="min-h-screen bg-ivory">
      <JsonLd data={[programSchema, breadcrumbSchema]} />
      <SiteHeader />
      <ProgramDetail program={program} media={media} />
      <AdSlot page="programs" placement="in-content" className="mx-auto max-w-[1280px] px-5 py-8 lg:px-10" />
      <ConnectedPeople
        people={programPeople}
        title="Mentors & Leaders"
        subtitle="People connected with this program."
      />
      <SiteFooter />
      <PageAds page="programs" />
    </main>
  )
}
