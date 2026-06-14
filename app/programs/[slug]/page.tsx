import { notFound } from "next/navigation"
import type { Metadata } from "next"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { ProgramDetail } from "@/components/awaj/program-detail"
import { getProgramBySlug } from "@/app/actions/programs"
import { getMediaByProgram } from "@/app/actions/media"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) return { title: "Program not found | AWAJ" }
  return {
    title: `${program.title} | Asia Web3 & AI Alliance Japan`,
    description: program.excerpt,
  }
}

export default async function ProgramPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const program = await getProgramBySlug(slug)
  if (!program) notFound()

  const media = await getMediaByProgram(program.id)

  return (
    <main className="min-h-screen bg-ivory">
      <SiteHeader />
      <ProgramDetail program={program} media={media} />
      <SiteFooter />
    </main>
  )
}
