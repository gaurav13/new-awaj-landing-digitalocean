"use client"

import { useState } from "react"
import Link from "next/link"
import { Mail, Globe, Menu, X } from "lucide-react"
import { Logo } from "./logo"

const NAV: { label: string; href: string }[] = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/#programs" },
  // { label: "Members", href: "/members" },
  { label: "News", href: "/news" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
]

export function Header({ logoUrl }: { logoUrl?: string }) {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
        <Link href="/" aria-label="Home">
          <Logo imageUrl={logoUrl} />
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-navy-text/80 transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href="mailto:bm@asiaweb3alliance.jp"
            className="flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            <Mail className="h-4 w-4 text-gold" />
            bm@asiaweb3alliance.jp
          </a>
          <button
            type="button"
            aria-label="Language"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-navy-text transition-colors hover:bg-beige"
          >
            <Globe className="h-4 w-4" />
          </button>
        </div>

        <button
          type="button"
          aria-label="Toggle menu"
          onClick={() => setOpen((v) => !v)}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-gold/40 text-navy-text lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-gold/20 bg-ivory px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-text/80 hover:bg-beige"
              >
                {item.label}
              </Link>
            ))}
            <a
              href="mailto:bm@asiaweb3alliance.jp"
              className="mt-2 flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white"
            >
              <Mail className="h-4 w-4 text-gold" />
              bm@asiaweb3alliance.jp
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
