"use client"

import type React from "react"
import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, X, Eye, EyeOff, MousePointerClick, BarChart3, Megaphone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ImageUpload } from "./image-upload"
import { resolveImageUrl } from "@/lib/images"
import {
  AD_PAGE_TARGETS,
  AD_PLACEMENTS,
  AD_OVERLAY_PLACEMENTS,
  AD_TRIGGERS,
  AD_FREQUENCIES,
  type AdPlacement,
} from "@/lib/db/schema"
import { createAd, updateAd, deleteAd, setAdStatus } from "@/app/actions/ads"
import type { AdInput, AdminAd } from "@/lib/ad-types"
import { NewsletterSubscribers } from "./newsletter-subscribers"
import type { NewsletterSubscriber } from "@/lib/db/schema"

const EMPTY: AdInput = {
  campaignName: "",
  imageUrl: "",
  linkUrl: "",
  altText: "",
  title: "",
  bodyText: "",
  buttonText: "",
  pageTarget: "all",
  placement: "top",
  trigger: "delay",
  frequency: "session",
  status: "active",
  showSponsoredLabel: true,
  startDate: null,
  endDate: null,
  sortOrder: 0,
}

const PLACEMENT_LABELS: Record<string, string> = {
  top: "Banner — Top",
  mid: "Banner — Middle",
  sidebar: "Banner — Sidebar",
  bottom: "Banner — Bottom",
  "in-content": "Banner — In-content",
  popup: "Popup / Modal",
  floating: "Floating (desktop)",
  "mobile-sticky": "Mobile sticky bar",
  newsletter: "Newsletter popup",
}

// Recommended image dimensions so uploaded creatives fit each slot on the site.
const PLACEMENT_SIZES: Record<string, string> = {
  top: "1280 × 200 px — wide leaderboard (≈6:1), full content width",
  mid: "1280 × 200 px — wide leaderboard (≈6:1), full content width",
  bottom: "1280 × 200 px — wide leaderboard (≈6:1), full content width",
  "in-content": "1200 × 675 px — landscape (16:9)",
  sidebar: "600 × 750 px — portrait (4:5)",
  popup: "600 × 400 px — landscape (3:2), shown up to ~256 px tall",
  floating: "480 × 320 px — landscape (3:2), shown ~240 px wide on desktop",
  "mobile-sticky": "96 × 96 px — small square thumbnail",
  newsletter: "1200 × 400 px — wide banner (3:1), image optional",
}

const PAGE_LABELS: Record<string, string> = {
  all: "All pages",
  home: "Home",
  events: "Events",
  programs: "Programs",
  news: "News",
  partners: "Partners",
  members: "Members",
}

const OVERLAY_SET = new Set<string>(AD_OVERLAY_PLACEMENTS)

function isOverlay(placement?: string) {
  return placement ? OVERLAY_SET.has(placement) : false
}

function toInputDate(d: Date | null) {
  if (!d) return ""
  // datetime-local wants YYYY-MM-DDTHH:mm in local time
  const pad = (n: number) => String(n).padStart(2, "0")
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function AdsManager({
  ads,
  subscribers,
}: {
  ads: AdminAd[]
  subscribers: NewsletterSubscriber[]
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<AdminAd | null>(null)
  const [form, setForm] = useState<AdInput>(EMPTY)
  const [error, setError] = useState<string | null>(null)
  const [placementFilter, setPlacementFilter] = useState<string>("all")

  const totals = useMemo(() => {
    const impressions = ads.reduce((s, a) => s + a.impressions, 0)
    const clicks = ads.reduce((s, a) => s + a.clicks, 0)
    return {
      live: ads.filter((a) => a.isLive).length,
      impressions,
      clicks,
      ctr: impressions > 0 ? Math.round((clicks / impressions) * 1000) / 10 : 0,
    }
  }, [ads])

  const filtered = useMemo(() => {
    if (placementFilter === "all") return ads
    if (placementFilter === "banner") return ads.filter((a) => !isOverlay(a.placement))
    if (placementFilter === "overlay") return ads.filter((a) => isOverlay(a.placement))
    return ads
  }, [ads, placementFilter])

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setError(null)
    setShowForm(true)
  }

  function openEdit(a: AdminAd) {
    setEditing(a)
    setForm({
      campaignName: a.campaignName,
      imageUrl: a.imageUrl ?? "",
      linkUrl: a.linkUrl ?? "",
      altText: a.altText ?? "",
      title: a.title ?? "",
      bodyText: a.bodyText ?? "",
      buttonText: a.buttonText ?? "",
      pageTarget: a.pageTarget as AdInput["pageTarget"],
      placement: a.placement as AdInput["placement"],
      trigger: a.trigger as AdInput["trigger"],
      frequency: a.frequency as AdInput["frequency"],
      status: a.status,
      showSponsoredLabel: a.showSponsoredLabel,
      startDate: toInputDate(a.startDate),
      endDate: toInputDate(a.endDate),
      sortOrder: a.sortOrder,
    })
    setError(null)
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.campaignName.trim()) {
      setError("Campaign name is required.")
      return
    }
    const overlay = isOverlay(form.placement)
    if (overlay && form.placement === "newsletter") {
      // newsletter overlay needs at least a title
      if (!form.title?.trim()) {
        setError("Add a title for the newsletter popup.")
        return
      }
    } else if (!form.imageUrl?.trim() && !overlay) {
      setError("Banner ads need an image.")
      return
    }
    startTransition(async () => {
      try {
        if (editing) await updateAd(editing.id, form)
        else await createAd(form)
        setShowForm(false)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.")
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this ad campaign permanently?")) return
    startTransition(async () => {
      try {
        await deleteAd(id)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to delete.")
      }
    })
  }

  function handleStatus(id: number, status: "active" | "hidden") {
    startTransition(async () => {
      try {
        await setAdStatus(id, status)
        router.refresh()
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to update status.")
      }
    })
  }

  const overlayForm = isOverlay(form.placement)
  const isNewsletter = form.placement === "newsletter"

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy-text">Ads Manager</h2>
          <p className="mt-1 text-sm text-navy-text/60">
            Create banners, popups, floating ads, mobile sticky bars, and the newsletter popup. Target pages, schedule
            runs, and track impressions and clicks.
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-full bg-awaj-red text-white hover:bg-awaj-red/90">
          <Plus className="mr-1.5 h-4 w-4" />
          New Ad
        </Button>
      </div>

      {error ? (
        <div className="mt-4 rounded-xl border border-awaj-red/30 bg-awaj-red/10 px-4 py-3 text-sm text-awaj-red">
          {error}
        </div>
      ) : null}

      {/* Analytics summary */}
      <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <SummaryCard icon={<Megaphone className="h-4 w-4" />} label="Live now" value={totals.live} />
        <SummaryCard icon={<BarChart3 className="h-4 w-4" />} label="Impressions" value={totals.impressions} />
        <SummaryCard icon={<MousePointerClick className="h-4 w-4" />} label="Clicks" value={totals.clicks} />
        <SummaryCard icon={<BarChart3 className="h-4 w-4" />} label="Avg. CTR" value={`${totals.ctr}%`} />
      </div>

      {/* Filter chips */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          { key: "all", label: "All ads" },
          { key: "banner", label: "Banners" },
          { key: "overlay", label: "Popups & overlays" },
        ].map((c) => (
          <button
            key={c.key}
            type="button"
            onClick={() => setPlacementFilter(c.key)}
            className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
              placementFilter === c.key
                ? "border-navy bg-navy text-white"
                : "border-gold/40 bg-white text-navy-text/70 hover:border-gold"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Ad list */}
      <div className="mt-5 overflow-hidden rounded-2xl border border-gold/20 bg-white">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="font-serif text-lg font-bold text-navy-text">No ads yet</h3>
            <p className="mt-2 text-sm text-navy-text/60">Create your first campaign to start promoting on the site.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gold/15">
            {filtered.map((a) => (
              <li key={a.id} className="flex items-center gap-4 p-4 hover:bg-beige/30">
                <div className="flex h-14 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-beige">
                  {a.imageUrl ? (
                    <img
                      src={resolveImageUrl(a.imageUrl) || "/placeholder.svg"}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <Megaphone className="h-5 w-5 text-navy-text/30" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="truncate font-semibold text-navy-text">{a.campaignName}</h3>
                    <AdStatusBadge ad={a} />
                  </div>
                  <p className="mt-0.5 truncate text-sm text-navy-text/60">
                    {PLACEMENT_LABELS[a.placement] ?? a.placement} · {PAGE_LABELS[a.pageTarget] ?? a.pageTarget}
                  </p>
                  <p className="mt-0.5 text-xs text-navy-text/45">
                    {a.impressions.toLocaleString()} impressions · {a.clicks.toLocaleString()} clicks · {a.ctr}% CTR
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {a.status !== "hidden" ? (
                    <button
                      type="button"
                      onClick={() => handleStatus(a.id, "hidden")}
                      disabled={isPending}
                      className="rounded-lg p-2 text-navy-text/60 transition-colors hover:bg-beige hover:text-navy-text"
                      aria-label="Hide"
                      title="Hide ad"
                    >
                      <EyeOff className="h-4 w-4" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleStatus(a.id, "active")}
                      disabled={isPending}
                      className="rounded-lg p-2 text-emerald-600/80 transition-colors hover:bg-emerald-50 hover:text-emerald-700"
                      aria-label="Activate"
                      title="Activate ad"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => openEdit(a)}
                    className="rounded-lg p-2 text-navy-text/60 transition-colors hover:bg-beige hover:text-navy-text"
                    aria-label="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(a.id)}
                    className="rounded-lg p-2 text-awaj-red/70 transition-colors hover:bg-awaj-red/10 hover:text-awaj-red"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Newsletter subscribers */}
      <div className="mt-10">
        <NewsletterSubscribers subscribers={subscribers} />
      </div>

      {/* Slide-over form */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy/40" onClick={() => setShowForm(false)}>
          <div
            className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-ivory shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gold/20 px-6 py-4">
              <h2 className="font-serif text-xl font-bold text-navy-text">{editing ? "Edit Ad" : "New Ad"}</h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1.5 text-navy-text/60 hover:bg-beige"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-6">
              <Field label="Campaign name" required>
                <Input
                  value={form.campaignName}
                  onChange={(e) => setForm({ ...form, campaignName: e.target.value })}
                  placeholder="Internal label, e.g. Spring Sponsor Banner"
                  required
                />
              </Field>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label>Placement</Label>
                  <select
                    value={form.placement}
                    onChange={(e) => setForm({ ...form, placement: e.target.value as AdPlacement })}
                    className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text"
                  >
                    {AD_PLACEMENTS.map((p) => (
                      <option key={p} value={p}>
                        {PLACEMENT_LABELS[p] ?? p}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Target page</Label>
                  <select
                    value={form.pageTarget}
                    onChange={(e) => setForm({ ...form, pageTarget: e.target.value as AdInput["pageTarget"] })}
                    className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text"
                  >
                    {AD_PAGE_TARGETS.map((p) => (
                      <option key={p} value={p}>
                        {PAGE_LABELS[p] ?? p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Recommended size so the creative fits the slot on the site */}
              {form.placement && PLACEMENT_SIZES[form.placement] ? (
                <div className="-mt-1 rounded-lg border border-gold/30 bg-beige/40 px-3 py-2 text-xs text-navy-text/70">
                  <span className="font-semibold text-navy-text">Recommended image size:</span>{" "}
                  {PLACEMENT_SIZES[form.placement]}
                </div>
              ) : null}

              {/* Image: required for banners + popup/floating/mobile; optional for newsletter */}
              {!isNewsletter && (
                <div className="flex flex-col gap-2">
                  <Label>{overlayForm ? "Image (optional)" : "Banner image"}</Label>
                  <ImageUpload value={form.imageUrl ?? ""} onChange={(url) => setForm({ ...form, imageUrl: url })} />
                  {form.placement && PLACEMENT_SIZES[form.placement] ? (
                    <p className="-mt-1 text-xs text-navy-text/50">
                      Upload at {PLACEMENT_SIZES[form.placement]} so it fits the website without cropping.
                    </p>
                  ) : null}
                </div>
              )}

              {/* Overlay copy fields */}
              {overlayForm && (
                <>
                  <Field label={isNewsletter ? "Heading" : "Title (optional)"} required={isNewsletter}>
                    <Input value={form.title ?? ""} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                  </Field>
                  <Field label="Body text (optional)">
                    <Textarea
                      value={form.bodyText ?? ""}
                      onChange={(e) => setForm({ ...form, bodyText: e.target.value })}
                      rows={2}
                    />
                  </Field>
                  {!isNewsletter && (
                    <Field label="Button text (optional)" hint="Defaults to “Learn more”">
                      <Input
                        value={form.buttonText ?? ""}
                        onChange={(e) => setForm({ ...form, buttonText: e.target.value })}
                        placeholder="Learn more"
                      />
                    </Field>
                  )}
                </>
              )}

              {/* Link + alt for everything except newsletter (which collects emails) */}
              {!isNewsletter && (
                <>
                  <Field label="Destination URL" hint="Where the ad links when clicked">
                    <Input
                      value={form.linkUrl ?? ""}
                      onChange={(e) => setForm({ ...form, linkUrl: e.target.value })}
                      placeholder="https://example.com"
                    />
                  </Field>
                  <Field label="Alt text" hint="Describes the image for screen readers">
                    <Input value={form.altText ?? ""} onChange={(e) => setForm({ ...form, altText: e.target.value })} />
                  </Field>
                </>
              )}

              {/* Trigger + frequency only for overlays */}
              {overlayForm && (
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-2">
                    <Label>Trigger</Label>
                    <select
                      value={form.trigger}
                      onChange={(e) => setForm({ ...form, trigger: e.target.value as AdInput["trigger"] })}
                      className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text"
                    >
                      {AD_TRIGGERS.map((t) => (
                        <option key={t} value={t}>
                          {t === "delay"
                            ? "After delay"
                            : t === "scroll"
                              ? "On scroll"
                              : t === "exit"
                                ? "Exit intent"
                                : "Immediately"}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label>Show frequency</Label>
                    <select
                      value={form.frequency}
                      onChange={(e) => setForm({ ...form, frequency: e.target.value as AdInput["frequency"] })}
                      className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text"
                    >
                      {AD_FREQUENCIES.map((f) => (
                        <option key={f} value={f}>
                          {f === "session" ? "Once per session" : f === "day" ? "Once per day" : "Every visit"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Field label="Start date (optional)">
                  <Input
                    type="datetime-local"
                    value={form.startDate ?? ""}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value || null })}
                  />
                </Field>
                <Field label="End date (optional)">
                  <Input
                    type="datetime-local"
                    value={form.endDate ?? ""}
                    onChange={(e) => setForm({ ...form, endDate: e.target.value || null })}
                  />
                </Field>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label>Status</Label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text"
                  >
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>
                <Field label="Sort order" hint="Lower shows first">
                  <Input
                    type="number"
                    value={String(form.sortOrder ?? 0)}
                    onChange={(e) => setForm({ ...form, sortOrder: Number(e.target.value) })}
                  />
                </Field>
              </div>

              <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-gold/25 bg-white px-3 py-3">
                <input
                  type="checkbox"
                  checked={form.showSponsoredLabel ?? true}
                  onChange={(e) => setForm({ ...form, showSponsoredLabel: e.target.checked })}
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-gold/50 text-awaj-red accent-awaj-red"
                />
                <span className="text-sm">
                  <span className="font-medium text-navy-text">Show “Sponsored” label</span>
                  <span className="mt-0.5 block text-xs text-navy-text/55">
                    Display a small “Sponsored” badge on this ad. Turn off for partner notices or non-sponsored
                    promotions.
                  </span>
                </span>
              </label>

              {error && (
                <p className="text-sm text-awaj-red" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-auto flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-full">
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-full bg-navy text-white hover:bg-navy/90"
                >
                  {isPending ? "Saving..." : editing ? "Save changes" : "Create"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number | string }) {
  return (
    <div className="rounded-2xl border border-gold/20 bg-white p-4">
      <div className="flex items-center gap-2 text-navy-text/55">
        {icon}
        <span className="text-xs font-medium uppercase tracking-wide">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold text-navy-text">
        {typeof value === "number" ? value.toLocaleString() : value}
      </p>
    </div>
  )
}

function AdStatusBadge({ ad }: { ad: AdminAd }) {
  let label = "Live"
  let cls = "bg-emerald-100 text-emerald-700"
  if (ad.status === "hidden") {
    label = "Hidden"
    cls = "bg-navy-text/10 text-navy-text/60"
  } else if (ad.isScheduled) {
    label = "Scheduled"
    cls = "bg-blue-100 text-blue-700"
  } else if (ad.isExpired) {
    label = "Expired"
    cls = "bg-amber-100 text-amber-700"
  }
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${cls}`}>{label}</span>
  )
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-2">
      <Label>
        {label}
        {required ? <span className="text-awaj-red"> *</span> : null}
      </Label>
      {children}
      {hint ? <p className="-mt-1 text-xs text-navy-text/50">{hint}</p> : null}
    </div>
  )
}
