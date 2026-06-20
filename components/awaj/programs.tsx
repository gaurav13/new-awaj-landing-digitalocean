import { getAllPrograms } from "@/app/actions/programs"
import { ProgramsCarousel, type CarouselProgram } from "./programs-carousel"

export async function Programs() {
  const programs = await getAllPrograms()
  if (programs.length === 0) return null

  const items: CarouselProgram[] = programs.slice(0, 10).map((p) => ({
    id: p.id,
    slug: p.slug,
    title: p.title,
    excerpt: p.excerpt,
    imageUrl: p.imageUrl,
    bannerUrl: p.bannerUrl,
    icon: p.icon,
    regions: p.regions,
  }))

  return <ProgramsCarousel programs={items} />
}
