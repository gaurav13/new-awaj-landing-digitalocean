import { getAllMedia } from "@/app/actions/media"

type LogoItem = {
  key: string
  src: string
  alt: string
  href: string | null
}

function Logo({ item }: { item: LogoItem }) {
  const img = (
    <img
      src={item.src || "/placeholder.svg"}
      alt={item.alt}
      className="h-8 w-auto max-w-[150px] shrink-0 object-contain transition-transform duration-300 hover:scale-105"
      loading="lazy"
    />
  )
  return item.href ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className="flex items-center" aria-label={item.alt}>
      {img}
    </a>
  ) : (
    <div className="flex items-center">{img}</div>
  )
}

export async function MediaLogos() {
  const all = await getAllMedia()

  // Keep one logo per outlet (dedupe by source), preserving sort order.
  const seen = new Set<string>()
  const logos: LogoItem[] = []
  for (const m of all) {
    if (!m.logoUrl) continue
    const dedupeKey = (m.source || m.title || "").trim().toLowerCase()
    if (dedupeKey && seen.has(dedupeKey)) continue
    if (dedupeKey) seen.add(dedupeKey)
    logos.push({
      key: String(m.id),
      src: m.logoUrl,
      alt: m.source || m.title,
      href: m.url ?? null,
    })
  }

  if (logos.length === 0) return null

  // Duplicate so the -50% marquee translate loops seamlessly.
  const loop = [...logos, ...logos]

  return (
    <div className="mb-10 rounded-2xl border border-gold/20 bg-white px-4 py-5 shadow-sm md:px-8">
      <div className="awaj-marquee-mask relative overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]">
        <div className="awaj-marquee-track items-center gap-x-12 py-1 pr-12">
          {loop.map((item, i) => (
            <div key={`${item.key}-${i}`} aria-hidden={i >= logos.length} className="flex items-center">
              <Logo item={item} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
