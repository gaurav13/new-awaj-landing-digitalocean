"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./image-upload"
import { ChangePassword } from "./change-password"
import { updateSiteSettings, type SiteSettings } from "@/app/actions/settings"

type ImageField = { key: keyof SiteSettings; label: string; help: string }
type TextField = { key: keyof SiteSettings; label: string; help: string; multiline?: boolean; placeholder?: string }

const BRANDING_FIELDS: ImageField[] = [
  {
    key: "headerLogoUrl",
    label: "Header logo",
    help: "Shown in the top navigation. Recommended 240×64px PNG with transparent background. Leave empty for the default AWAJ logo.",
  },
  {
    key: "footerLogoUrl",
    label: "Footer logo",
    help: "Shown in the footer. Recommended 240×64px PNG. Leave empty for the default AWAJ logo.",
  },
  {
    key: "heroBannerUrl",
    label: "Hero fallback image",
    help: "Used in the homepage hero when no active banners are set. Recommended 1920×1080px (16:9).",
  },
]

const SEO_TEXT_FIELDS: TextField[] = [
  {
    key: "siteTitle",
    label: "Site title",
    help: "Appears in the browser tab and search results. Page titles become “Page · Site title”.",
    placeholder: "Asia Web3 & AI Alliance Japan (AWAJ)",
  },
  {
    key: "siteDescription",
    label: "Meta description",
    help: "The summary shown under your title in Google. Aim for 140–160 characters.",
    multiline: true,
    placeholder: "Describe AWAJ in one or two sentences...",
  },
  {
    key: "siteKeywords",
    label: "Keywords",
    help: "Comma-separated keywords (e.g. Web3, AI, Japan, blockchain).",
    placeholder: "Web3, AI, Japan, Asia, blockchain",
  },
  {
    key: "canonicalBaseUrl",
    label: "Canonical base URL",
    help: "Your primary domain, used to build canonical + social URLs (e.g. https://awaj.org). Leave empty to auto-detect the deployment URL.",
    placeholder: "https://awaj.org",
  },
  {
    key: "twitterHandle",
    label: "X (Twitter) handle",
    help: "Optional. Used in social share cards, e.g. @AWAJ.",
    placeholder: "@AWAJ",
  },
]

const SOCIAL_TEXT_FIELDS: TextField[] = [
  {
    key: "ogTitle",
    label: "Open Graph title",
    help: "Title shown when shared on social media. Leave empty to reuse the site title.",
    placeholder: "Asia Web3 & AI Alliance Japan",
  },
  {
    key: "ogDescription",
    label: "Open Graph description",
    help: "Description shown in social share cards. Leave empty to reuse the meta description.",
    multiline: true,
    placeholder: "A short, punchy summary for social sharing...",
  },
]

const SEO_IMAGE_FIELDS: ImageField[] = [
  {
    key: "ogImageUrl",
    label: "Social share image (Open Graph)",
    help: "Shown when your site is shared on social media. Recommended 1200×630px JPG or PNG, under 1MB.",
  },
  {
    key: "faviconUrl",
    label: "Favicon",
    help: "The small icon in the browser tab. Recommended a square 512×512px PNG. Leave empty for the default icon.",
  },
]

export function SettingsPanel({ settings }: { settings: SiteSettings }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [form, setForm] = useState<SiteSettings>(settings)
  const [saved, setSaved] = useState(false)

  function save() {
    setSaved(false)
    startTransition(async () => {
      await updateSiteSettings(form)
      setSaved(true)
      router.refresh()
    })
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy-text">Branding & SEO</h2>
          <p className="mt-1 text-sm text-navy-text/60">
            Manage logos, search engine metadata, and social sharing.
          </p>
        </div>
        <Button onClick={save} disabled={isPending} className="rounded-full bg-navy text-white hover:bg-navy/90">
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>

      {/* Branding */}
      <section className="mt-8">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Branding</h3>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          {BRANDING_FIELDS.map((f) => (
            <div key={f.key} className="rounded-2xl border border-gold/20 bg-white p-5">
              <h4 className="font-semibold text-navy-text">{f.label}</h4>
              <p className="mb-3 mt-1 text-xs leading-relaxed text-navy-text/55">{f.help}</p>
              <ImageUpload value={form[f.key]} onChange={(url) => setForm({ ...form, [f.key]: url })} />
            </div>
          ))}
        </div>
      </section>

      {/* SEO */}
      <section className="mt-10">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Search engine optimization</h3>
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-2xl border border-gold/20 bg-white p-5">
            {SEO_TEXT_FIELDS.map((f) => (
              <div key={f.key} className="flex flex-col gap-2">
                <Label htmlFor={f.key}>{f.label}</Label>
                <p className="-mt-1 text-xs leading-relaxed text-navy-text/55">{f.help}</p>
                {f.multiline ? (
                  <Textarea
                    id={f.key}
                    rows={3}
                    value={form[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                ) : (
                  <Input
                    id={f.key}
                    value={form[f.key]}
                    placeholder={f.placeholder}
                    onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-1">
            {SEO_IMAGE_FIELDS.map((f) => (
              <div key={f.key} className="rounded-2xl border border-gold/20 bg-white p-5">
                <h4 className="font-semibold text-navy-text">{f.label}</h4>
                <p className="mb-3 mt-1 text-xs leading-relaxed text-navy-text/55">{f.help}</p>
                <ImageUpload value={form[f.key]} onChange={(url) => setForm({ ...form, [f.key]: url })} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Membership page header */}
      <section className="mt-10">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Membership page header</h3>
        <p className="mt-1 text-sm text-navy-text/60">
          Edit the hero shown at the top of the public Membership page (the eyebrow, title, intro text, and banner
          image).
        </p>
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-2xl border border-gold/20 bg-white p-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="membershipEyebrow">Eyebrow label</Label>
              <p className="-mt-1 text-xs leading-relaxed text-navy-text/55">
                Small uppercase label above the title, e.g. “One Year Membership”.
              </p>
              <Input
                id="membershipEyebrow"
                value={form.membershipEyebrow}
                placeholder="One Year Membership"
                onChange={(e) => setForm({ ...form, membershipEyebrow: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="membershipTitle">Title</Label>
              <p className="-mt-1 text-xs leading-relaxed text-navy-text/55">Main heading of the membership page.</p>
              <Input
                id="membershipTitle"
                value={form.membershipTitle}
                placeholder="Membership Packages"
                onChange={(e) => setForm({ ...form, membershipTitle: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="membershipSubtitle">Intro text</Label>
              <p className="-mt-1 text-xs leading-relaxed text-navy-text/55">
                Supporting paragraph shown under the title.
              </p>
              <Textarea
                id="membershipSubtitle"
                rows={3}
                value={form.membershipSubtitle}
                placeholder="Join Asia Web3 Alliance Japan and become part of..."
                onChange={(e) => setForm({ ...form, membershipSubtitle: e.target.value })}
              />
            </div>
          </div>
          <div className="rounded-2xl border border-gold/20 bg-white p-5">
            <h4 className="font-semibold text-navy-text">Header banner image</h4>
            <p className="mb-3 mt-1 text-xs leading-relaxed text-navy-text/55">
              Shown on the right side of the membership hero. Recommended 1200×800px (3:2) JPG or PNG.
            </p>
            <ImageUpload
              value={form.membershipHeroUrl}
              onChange={(url) => setForm({ ...form, membershipHeroUrl: url })}
            />
          </div>
        </div>
      </section>

      {/* Leadership / President hero */}
      <section className="mt-10">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Leadership / President hero</h3>
        <p className="mt-1 text-sm text-navy-text/60">
          Edit the homepage leadership section: the featured president, the stats bar, and the “Ecosystem Leaders”
          heading. (Leader cards themselves are managed in the People tab.)
        </p>
        <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="flex flex-col gap-5 rounded-2xl border border-gold/20 bg-white p-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="presidentEyebrow">Eyebrow label</Label>
              <Input
                id="presidentEyebrow"
                value={form.presidentEyebrow}
                placeholder="Led by builders who understand expansion"
                onChange={(e) => setForm({ ...form, presidentEyebrow: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="presidentName">President name</Label>
              <Input
                id="presidentName"
                value={form.presidentName}
                placeholder="Hinza Asif"
                onChange={(e) => setForm({ ...form, presidentName: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="presidentTitle">Title / organization</Label>
              <Input
                id="presidentTitle"
                value={form.presidentTitle}
                placeholder="Asia Web3 Alliance Japan"
                onChange={(e) => setForm({ ...form, presidentTitle: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="presidentBio">Bio / description</Label>
              <Textarea
                id="presidentBio"
                rows={4}
                value={form.presidentBio}
                placeholder="AWAJ was created to help startups navigate Japan's ecosystem..."
                onChange={(e) => setForm({ ...form, presidentBio: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <Label htmlFor="presidentCtaLabel">Button label</Label>
                <Input
                  id="presidentCtaLabel"
                  value={form.presidentCtaLabel}
                  placeholder="Meet Leadership Team"
                  onChange={(e) => setForm({ ...form, presidentCtaLabel: e.target.value })}
                />
              </div>
              <div className="flex flex-col gap-2">
                <Label htmlFor="presidentCtaUrl">Button link</Label>
                <Input
                  id="presidentCtaUrl"
                  value={form.presidentCtaUrl}
                  placeholder="/team"
                  onChange={(e) => setForm({ ...form, presidentCtaUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <div className="rounded-2xl border border-gold/20 bg-white p-5">
              <h4 className="font-semibold text-navy-text">President photo</h4>
              <p className="mb-3 mt-1 text-xs leading-relaxed text-navy-text/55">
                Cut-out portrait on a transparent or dark background works best. Recommended 600×800px PNG.
              </p>
              <ImageUpload
                value={form.presidentPhotoUrl}
                onChange={(url) => setForm({ ...form, presidentPhotoUrl: url })}
              />
            </div>
            <div className="rounded-2xl border border-gold/20 bg-white p-5">
              <h4 className="font-semibold text-navy-text">Background image</h4>
              <p className="mb-3 mt-1 text-xs leading-relaxed text-navy-text/55">
                Dark, atmospheric image behind the hero. Recommended 1920×1080px (16:9).
              </p>
              <ImageUpload value={form.presidentBgUrl} onChange={(url) => setForm({ ...form, presidentBgUrl: url })} />
            </div>
          </div>
        </div>

        <StatsEditor
          value={form.leadershipStats}
          onChange={(v) => setForm({ ...form, leadershipStats: v })}
        />

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="flex flex-col gap-2">
            <Label htmlFor="leadershipSectionTitle">Leaders section heading</Label>
            <Input
              id="leadershipSectionTitle"
              value={form.leadershipSectionTitle}
              placeholder="Ecosystem Leaders Connected with AWAJ"
              onChange={(e) => setForm({ ...form, leadershipSectionTitle: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="leadershipViewAllLabel">“View all” label</Label>
            <Input
              id="leadershipViewAllLabel"
              value={form.leadershipViewAllLabel}
              placeholder="View All Leaders"
              onChange={(e) => setForm({ ...form, leadershipViewAllLabel: e.target.value })}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="leadershipViewAllUrl">“View all” link</Label>
            <Input
              id="leadershipViewAllUrl"
              value={form.leadershipViewAllUrl}
              placeholder="/team"
              onChange={(e) => setForm({ ...form, leadershipViewAllUrl: e.target.value })}
            />
          </div>
        </div>
      </section>

      {/* Social sharing (Open Graph) */}
      <section className="mt-10">
        <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Social sharing (Open Graph)</h3>
        <p className="mt-1 text-sm text-navy-text/60">
          Override how your site looks when shared on X, LinkedIn, Facebook, and chat apps. Pairs with the social share
          image above.
        </p>
        <div className="mt-4 flex flex-col gap-5 rounded-2xl border border-gold/20 bg-white p-5">
          {SOCIAL_TEXT_FIELDS.map((f) => (
            <div key={f.key} className="flex flex-col gap-2">
              <Label htmlFor={f.key}>{f.label}</Label>
              <p className="-mt-1 text-xs leading-relaxed text-navy-text/55">{f.help}</p>
              {f.multiline ? (
                <Textarea
                  id={f.key}
                  rows={3}
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              ) : (
                <Input
                  id={f.key}
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })}
                />
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Image size guidelines */}
      <section className="mt-10 rounded-2xl border border-gold/20 bg-beige/40 p-6">
        <h3 className="font-serif text-lg font-bold text-navy-text">Image size guidelines</h3>
        <p className="mt-1 text-sm text-navy-text/60">
          For the sharpest results, upload images at these recommended dimensions.
        </p>
        <div className="mt-4 grid grid-cols-1 gap-x-8 gap-y-2 text-sm sm:grid-cols-2">
          {[
            ["Homepage banner slider", "1920×800px (wide)"],
            ["Newsroom cover image", "1200×675px (16:9)"],
            ["Program / event card", "1200×675px (16:9)"],
            ["Program / event banner", "1920×1080px (16:9)"],
            ["Team / speaker photo", "600×600px (square)"],
            ["Partner / member logo", "400×400px PNG, transparent"],
            ["Social share image (OG)", "1200×630px"],
            ["Favicon", "512×512px PNG, square"],
          ].map(([label, size]) => (
            <div key={label} className="flex items-baseline justify-between gap-4 border-b border-gold/15 py-1.5">
              <span className="text-navy-text/80">{label}</span>
              <span className="shrink-0 font-medium text-navy-text">{size}</span>
            </div>
          ))}
        </div>
      </section>

      {saved && (
        <p className="mt-6 text-sm font-medium text-gold" role="status">
          Settings saved. Changes are now live on the site.
        </p>
      )}

      <ChangePassword />
    </div>
  )
}

type StatRow = { value: string; label: string; icon: string }
const STAT_ICON_OPTIONS = ["Users", "Building2", "Rocket", "Globe", "Calendar", "Award", "Briefcase"]

function StatsEditor({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  let rows: StatRow[] = []
  try {
    const parsed = JSON.parse(value || "[]")
    if (Array.isArray(parsed)) rows = parsed
  } catch {
    rows = []
  }

  function update(next: StatRow[]) {
    onChange(JSON.stringify(next))
  }

  return (
    <div className="mt-6 rounded-2xl border border-gold/20 bg-white p-5">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-navy-text">Stats bar</h4>
        <span className="text-xs text-navy-text/50">{rows.length} stats</span>
      </div>
      <p className="mb-4 mt-1 text-xs leading-relaxed text-navy-text/55">
        The metrics row shown below the president hero (e.g. “500+ Ecosystem Partners”).
      </p>
      <div className="flex flex-col gap-3">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-1 gap-2 rounded-xl border border-gold/15 bg-beige/30 p-3 sm:grid-cols-[110px_1fr_150px_auto] sm:items-center">
            <Input
              value={r.value}
              placeholder="500+"
              onChange={(e) => {
                const next = [...rows]
                next[i] = { ...r, value: e.target.value }
                update(next)
              }}
            />
            <Input
              value={r.label}
              placeholder="Ecosystem Partners"
              onChange={(e) => {
                const next = [...rows]
                next[i] = { ...r, label: e.target.value }
                update(next)
              }}
            />
            <select
              value={r.icon}
              onChange={(e) => {
                const next = [...rows]
                next[i] = { ...r, icon: e.target.value }
                update(next)
              }}
              className="h-9 rounded-md border border-input bg-white px-2 text-sm text-navy-text"
            >
              {STAT_ICON_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
            <Button
              type="button"
              variant="ghost"
              onClick={() => update(rows.filter((_, idx) => idx !== i))}
              className="text-awaj-red hover:text-awaj-red"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={() => update([...rows, { value: "", label: "", icon: "Users" }])}
        className="mt-3 rounded-full border-gold/40 text-navy-text"
      >
        Add stat
      </Button>
    </div>
  )
}
