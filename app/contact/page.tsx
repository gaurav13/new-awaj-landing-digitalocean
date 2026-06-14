import type { Metadata } from "next"
import { Mail, MapPin, Building2, Megaphone, Handshake, Award, Users, HelpCircle } from "lucide-react"
import { SiteHeader } from "@/components/awaj/site-header"
import { SiteFooter } from "@/components/awaj/site-footer"
import { ContactForm } from "@/components/awaj/contact-form"

export const metadata: Metadata = {
  title: "Contact | Asia Web3 & AI Alliance Japan",
  description:
    "Get in touch with Asia Web3 & AI Alliance Japan for media, sponsorship, partnership, membership, and other inquiries.",
}

const INQUIRY_CARDS = [
  { icon: Megaphone, title: "Media", desc: "Press, interviews, and coverage requests." },
  { icon: Award, title: "Sponsorship", desc: "Sponsor our programs and events." },
  { icon: Handshake, title: "Partnership", desc: "Strategic and ecosystem collaborations." },
  { icon: Users, title: "Membership", desc: "Join the alliance as a member." },
  { icon: HelpCircle, title: "Other", desc: "Any other questions or inquiries." },
]

const LEGAL_ROWS: { label: string; value: string }[] = [
  { label: "Name", value: "一般社団法人Asia Web3 Alliance 日本" },
  { label: "English notation", value: "Asia Web3 Alliance Japan" },
  { label: "Representative", value: "Hinza Asif" },
  { label: "Establishment date", value: "2024" },
  {
    label: "Address",
    value: "7F Nihonbashi Daiei Building, 1-2-6 Nihonbashi Muromachi, Chuo-ku, Tokyo 103-0022",
  },
]

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-ivory">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-gold/15">
        <div className="mx-auto max-w-[1280px] px-5 pt-12 pb-10 text-center lg:px-10 lg:pt-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-white/60 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-gold">
            <Mail className="h-3.5 w-3.5" />
            Get in touch
          </span>
          <h1 className="mx-auto mt-5 max-w-3xl text-balance font-serif text-4xl font-bold leading-[1.12] tracking-tight text-navy-text md:text-5xl">
            Contact Us
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-lg leading-relaxed text-navy-text/70">
            Whether you&apos;re from the media, looking to sponsor, partner, or join as a member, we&apos;d love to hear
            from you. Reach out and our team will respond promptly.
          </p>
        </div>
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-beige/40 blur-3xl" />
      </section>

      {/* Inquiry type cards */}
      <section className="mx-auto max-w-[1280px] px-5 py-10 lg:px-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-5">
          {INQUIRY_CARDS.map((c) => (
            <div
              key={c.title}
              className="flex flex-col items-start gap-3 rounded-2xl border border-gold/20 bg-white p-5 shadow-sm"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-beige text-gold">
                <c.icon className="h-5 w-5" strokeWidth={1.75} />
              </span>
              <div>
                <h3 className="font-serif text-base font-bold text-navy-text">{c.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-navy-text/65">{c.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Form + contact info */}
      <section className="mx-auto max-w-[1280px] px-5 pb-16 lg:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1.4fr_1fr]">
          {/* Form */}
          <div>
            <h2 className="mb-5 font-serif text-2xl font-bold text-navy-text">Send us a message</h2>
            <ContactForm />
          </div>

          {/* Info + building image */}
          <div className="flex flex-col gap-6">
            <div className="overflow-hidden rounded-3xl border border-gold/25 bg-white shadow-sm">
              <img
                src="/images/nihonbashi-office.png"
                alt="Asia Web3 & AI Alliance Japan office building in Nihonbashi Muromachi, Tokyo"
                className="aspect-[4/3] w-full object-cover"
              />
              <div className="p-6">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-semibold text-navy-text">Tokyo Office</p>
                    <p className="mt-1 text-sm leading-relaxed text-navy-text/70">
                      7F Nihonbashi Daiei Building, 1-2-6 Nihonbashi Muromachi, Chuo-ku, Tokyo 103-0022
                    </p>
                  </div>
                </div>
                <div className="mt-5 flex items-start gap-3 border-t border-gold/15 pt-5">
                  <Mail className="mt-0.5 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <p className="text-sm font-semibold text-navy-text">Email</p>
                    <a
                      href="mailto:bm@asiaweb3alliance.jp"
                      className="mt-1 block text-sm text-gold transition-colors hover:text-navy-text"
                    >
                      bm@asiaweb3alliance.jp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Specified Commercial Transactions Act */}
      <section className="border-t border-gold/15 bg-white">
        <div className="mx-auto max-w-[900px] px-5 py-14 lg:px-10">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-beige text-gold">
              <Building2 className="h-5 w-5" />
            </span>
            <h2 className="font-serif text-2xl font-bold text-navy-text md:text-3xl">
              Specified Commercial Transactions Act
            </h2>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-navy-text/65">
            Disclosure based on the Act on Specified Commercial Transactions (特定商取引法に基づく表記).
          </p>

          <dl className="mt-8 overflow-hidden rounded-2xl border border-gold/20">
            {LEGAL_ROWS.map((row, i) => (
              <div
                key={row.label}
                className={`grid grid-cols-1 sm:grid-cols-[200px_1fr] ${
                  i % 2 === 0 ? "bg-ivory/60" : "bg-white"
                } ${i !== 0 ? "border-t border-gold/15" : ""}`}
              >
                <dt className="px-5 py-4 text-sm font-semibold text-navy-text">{row.label}</dt>
                <dd className="px-5 pb-4 pt-0 text-sm leading-relaxed text-navy-text/75 sm:py-4">{row.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <SiteFooter />
    </main>
  )
}
