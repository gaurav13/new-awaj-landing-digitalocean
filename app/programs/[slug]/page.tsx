import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { ProgramDetail } from "@/components/awaj/program-detail"
import { getProgramBySlug } from "@/app/actions/programs"
import { getMediaByProgram } from "@/app/actions/media"
import { buildPageMetadata, getArticleSchema, getBreadcrumbSchema } from "@/lib/seo"
import { JsonLd } from "@/components/seo/json-ld"

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
      <SiteFooter />
    </main>
  )
}
