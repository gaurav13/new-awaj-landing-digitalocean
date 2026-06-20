"use client"

import { useState } from "react"
import Link from "next/link"
import { Globe, Menu, X, ChevronDown } from "lucide-react"
import { Logo } from "./logo"

type NavChild = { label: string; href: string }
type NavItem = { label: string; href?: string; children?: NavChild[] }

const NAV: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "Programs", href: "/programs" },
  {
    label: "Ecosystem",
    children: [
      { label: "List of Members", href: "/members" },
      { label: "List of Leaders", href: "/team" },
      { label: "Become a Member", href: "/membership" },
    ],
  },
  { label: "Events", href: "/events" },
  {
    label: "News & Media",
    children: [
      { label: "News", href: "/news" },
      { label: "Media Coverage", href: "/media" },
      { label: "Image Gallery", href: "/gallery" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
]

export function Header({ logoUrl }: { logoUrl?: string }) {
  const [open, setOpen] = useState(false)
  const [openSection, setOpenSection] = useState<string | null>(null)

  function closeMobile() {
    setOpen(false)
    setOpenSection(null)
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gold/20 bg-ivory/90 backdrop-blur-md">
      <div className="mx-auto flex h-[88px] max-w-[1440px] items-center justify-between px-5 lg:px-10">
        <Link href="/" aria-label="Home">
          <Logo imageUrl={logoUrl} />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-7 lg:flex">
          {NAV.map((item) =>
            item.children ? (
              <div key={item.label} className="group relative">
                <button
                  type="button"
                  className="flex items-center gap-1 text-sm font-medium text-navy-text/80 transition-colors hover:text-gold group-focus-within:text-gold"
                  aria-haspopup="true"
                >
                  {item.label}
                  <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:rotate-180 group-focus-within:rotate-180" />
                </button>
                {/* Dropdown */}
                <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 pt-3 opacity-0 transition-all duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                  <div className="overflow-hidden rounded-2xl border border-gold/20 bg-ivory p-2 shadow-xl shadow-navy/5">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block rounded-xl px-4 py-2.5 text-sm font-medium text-navy-text/80 transition-colors hover:bg-beige hover:text-gold"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className="text-sm font-medium text-navy-text/80 transition-colors hover:text-gold"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <Link
            href="/membership"
            className="flex items-center gap-2 rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
          >
            Become A Member
          </Link>
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

      {/* Mobile nav */}
      {open && (
        <div className="border-t border-gold/20 bg-ivory px-5 py-4 lg:hidden">
          <nav className="flex flex-col gap-1">
            {NAV.map((item) =>
              item.children ? (
                <div key={item.label} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => setOpenSection((s) => (s === item.label ? null : item.label))}
                    aria-expanded={openSection === item.label}
                    className="flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium text-navy-text/80 hover:bg-beige"
                  >
                    {item.label}
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${openSection === item.label ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openSection === item.label && (
                    <div className="ml-3 flex flex-col border-l border-gold/20 pl-2">
                      {item.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          onClick={closeMobile}
                          className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-text/70 hover:bg-beige hover:text-gold"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  key={item.label}
                  href={item.href!}
                  onClick={closeMobile}
                  className="rounded-lg px-3 py-2.5 text-sm font-medium text-navy-text/80 hover:bg-beige"
                >
                  {item.label}
                </Link>
              ),
            )}
            <Link
              href="/membership"
              onClick={closeMobile}
              className="mt-2 flex items-center justify-center rounded-full bg-navy px-5 py-2.5 text-sm font-medium text-white transition-opacity hover:opacity-90"
            >
              Become A Member
            </Link>
          </nav>
        </div>
      )}
    </header>
  )
}
