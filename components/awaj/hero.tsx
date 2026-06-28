import { ArrowRight } from "lucide-react"
import { BannerSlider, type Banner } from "./banner-slider"

export function Hero({
  bannerUrl = "/images/hero-tokyo.png",
  banners = [],
}: {
  bannerUrl?: string
  banners?: Banner[]
}) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-[1440px] grid-cols-1 items-center gap-10 px-5 pt-10 pb-32 lg:grid-cols-2 lg:px-10 lg:pt-14 lg:pb-44">
        {/* Left */}
        <div className="relative z-10 max-w-xl">
          <h1 className="text-balance font-serif text-4xl font-bold leading-[1.12] tracking-tight text-navy-text md:text-5xl lg:text-[3.4rem]">
            Connecting Asia&apos;s <span className="text-gold">AI &amp; Web3  </span>Ecosystem to Japan—and Taking
            Japan&apos;s Innovations to Asia.
          </h1>
          <p className="mt-6 max-w-md text-pretty leading-relaxed text-navy-text/70">
            Asia Web3 &amp; AI Alliance Japan (AWAJ) is a General Incorporated Association bridging Asian and Japanese
            markets, creating real opportunities for growth, innovation, and global success.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <a
              href="#"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-navy px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90"
            >
              Create Program With Us
              <ArrowRight className="h-4 w-4 text-gold transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-navy/30 px-7 py-3.5 text-sm font-semibold uppercase tracking-wide text-navy-text transition-colors hover:border-gold hover:text-gold"
            >
              Explore AWAJ
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>

        {/* Right visual */}
        <div className="relative">
          {banners.length > 0 ? (
            <BannerSlider banners={banners} />
          ) : (
            <div className="relative aspect-[5/4] overflow-hidden rounded-[2rem]">
              <img
                src={bannerUrl || "/images/hero-tokyo.png"}
                alt="Tokyo Tower at golden hour with Mount Fuji in the background"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-ivory/40" />
            </div>
          )}
        </div>
      </div>

      {/* soft background glow */}
      <div className="pointer-events-none absolute right-0 top-0 -z-0 h-[600px] w-[600px] rounded-full bg-beige/50 blur-3xl" />
    </section>
  )
}
