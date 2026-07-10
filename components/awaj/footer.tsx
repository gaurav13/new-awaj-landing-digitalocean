import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"
import { LogoMark } from "./logo"

const FOOTER_NAV: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/#programs" },
  // { label: "Members", href: "/members" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
]

function XIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.66l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
    </svg>
  )
}

function LinkedinIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  )
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
    </svg>
  )
}

export function Footer({
  logoUrl,
  socialLinks,
}: {
  logoUrl?: string
  socialLinks?: { twitterUrl?: string; linkedinUrl?: string; telegramUrl?: string }
}) {
  const socials = [
    { icon: XIcon, label: "X", href: socialLinks?.twitterUrl },
    { icon: LinkedinIcon, label: "LinkedIn", href: socialLinks?.linkedinUrl },
    { icon: TelegramIcon, label: "Telegram", href: socialLinks?.telegramUrl },
  ].filter((s) => s.href && s.href.trim().length > 0)

  return (
    <footer className="bg-navy text-white">
      <div className="mx-auto max-w-[1280px] px-5 py-14 lg:px-10">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
          {/* Left */}
          <div>
            {logoUrl ? (
              <img src={logoUrl || "/placeholder.svg"} alt="Asia Web3 &amp; AI Alliance Japan" className="h-11 w-auto object-contain" />
            ) : (
              <div className="flex items-center gap-3">
                <LogoMark size={40} />
                <div className="leading-none">
                  <p className="font-serif text-base font-bold">Asia Web3 &amp; AI Alliance</p>
                  <p className="text-xs font-semibold tracking-[0.35em] text-awaj-red">JAPAN</p>
                </div>
              </div>
            )}
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-white/60">
              Building the future of Web3 &amp; AI, together across Asia and beyond.
            </p>
          </div>

          {/* Center CTA */}
          <div className="flex flex-col items-start md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full border border-gold/40">
                <Mail className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-white/70">Let&apos;s build the future together.</p>
                <a href="mailto:bm@asiaweb3alliance.jp" className="font-serif text-lg font-bold text-gold">
                  bm@asiaweb3alliance.jp
                </a>
              </div>
            </div>
            <a
              href="mailto:bm@asiaweb3alliance.jp"
              className="group mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-navy transition-opacity hover:opacity-90"
            >
              Contact Us
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>

          {/* Right socials */}
          {socials.length > 0 && (
            <div className="md:text-right">
              <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Stay Connected</p>
              <div className="mt-4 flex gap-3 md:justify-end">
                {socials.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={s.label}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-gold hover:text-gold"
                  >
                    <s.icon />
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 md:flex-row md:items-center md:justify-between">
          <nav className="flex flex-wrap gap-x-5 gap-y-2">
            {FOOTER_NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs text-white/60 transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <p className="text-xs text-white/50">© 2026 Asia Web3 &amp; AI Alliance Japan. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
