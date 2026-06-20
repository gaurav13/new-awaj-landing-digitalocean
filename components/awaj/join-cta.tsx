import Link from "next/link"
import { ArrowRight } from "lucide-react"

export function JoinCta() {
  return (
    <section className="mx-auto max-w-[1280px] px-5 py-10 lg:px-10 lg:py-16">
      <div className="relative overflow-hidden rounded-3xl bg-navy">
        {/* Network backdrop */}
        <img
          src="/images/cta-network.png"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-70"
        />

        <div className="relative flex flex-col gap-8 px-6 py-12 md:px-12 lg:flex-row lg:items-center lg:justify-between lg:py-14">
          <div className="max-w-xl">
            <h2 className="text-balance font-serif text-3xl font-bold leading-tight text-white md:text-4xl">
              Join the AWAJ Ecosystem Today
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-white/70">
              Be part of Japan&apos;s leading platform that connects startups, investors, corporations, and governments
              for limitless growth.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap lg:shrink-0">
            <Link
              href="/membership"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-awaj-red px-6 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90"
            >
              Become a Member
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/#programs"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold text-navy transition-opacity hover:opacity-90"
            >
              Apply for Accelerator
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-gold hover:text-gold"
            >
              Partner With Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
