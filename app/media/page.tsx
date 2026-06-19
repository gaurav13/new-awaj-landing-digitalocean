import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { MediaCard } from "@/components/awaj/media-card"
import { getAllMedia } from "@/app/actions/media"

export const metadata = {
  title: "Media",
  description:
    "Press coverage, interviews, videos, and podcasts featuring Asia Web3 & AI Alliance Japan (AWAJ) across global media.",
  alternates: { canonical: "/media" },
}

export default async function MediaPage() {
  const media = await getAllMedia()

  return (
    <main className="min-h-svh bg-ivory">
      <SiteHeader />

      {/* Page hero */}
      <section className="border-b border-gold/20 bg-navy">
        <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10 lg:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Media</p>
          <h1 className="mt-3 max-w-3xl text-balance font-serif text-4xl font-bold leading-tight text-white lg:text-5xl">
            AWAJ in the Media
          </h1>
          <p className="mt-4 max-w-2xl text-pretty leading-relaxed text-white/70">
            Press coverage, interviews, videos, and podcasts featuring the Alliance and our programs across global
            media.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1280px] px-5 py-12 lg:px-10 lg:py-16">
        {media.length === 0 ? (
          <div className="rounded-2xl border border-gold/20 bg-white p-12 text-center">
            <h2 className="font-serif text-xl font-bold text-navy-text">No media coverage yet</h2>
            <p className="mt-2 text-sm text-navy-text/60">Check back soon for the latest coverage of AWAJ.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {media.map((m) => (
              <MediaCard key={m.id} item={m} />
            ))}
          </div>
        )}
      </div>

      <SiteFooter />
    </main>
  )
}
