import Link from "next/link"
import { Mail, ArrowRight } from "lucide-react"
import { LogoMark } from "./logo"

const FOOTER_NAV: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/#programs" },
  { label: "Members", href: "/members" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
  { label: "Admin", href: "/admin" },
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

function YoutubeIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  )
}

function DiscordIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.79 19.79 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  )
}

export function Footer({ logoUrl }: { logoUrl?: string }) {
  const socials = [
    { icon: XIcon, label: "X" },
    { icon: LinkedinIcon, label: "LinkedIn" },
    { icon: YoutubeIcon, label: "YouTube" },
    { icon: DiscordIcon, label: "Discord" },
  ]

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
          <div className="md:text-right">
            <p className="text-sm font-semibold uppercase tracking-wide text-white/70">Stay Connected</p>
            <div className="mt-4 flex gap-3 md:justify-end">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white/80 transition-colors hover:border-gold hover:text-gold"
                >
                  <s.icon />
                </a>
              ))}
            </div>
          </div>
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
