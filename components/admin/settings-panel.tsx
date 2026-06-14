"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "./image-upload"
import { updateSiteSettings, type SiteSettings } from "@/app/actions/settings"

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

  const fields: { key: keyof SiteSettings; label: string; help: string }[] = [
    { key: "headerLogoUrl", label: "Header logo", help: "Shown in the top navigation. Leave empty to use the default AWAJ logo." },
    { key: "footerLogoUrl", label: "Footer logo", help: "Shown in the footer. Leave empty to use the default AWAJ logo." },
    { key: "heroBannerUrl", label: "Header banner image", help: "The large image displayed in the homepage hero." },
  ]

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy-text">Branding & Settings</h2>
          <p className="mt-1 text-sm text-navy-text/60">Upload your logos and the homepage banner image.</p>
        </div>
        <Button
          onClick={save}
          disabled={isPending}
          className="rounded-full bg-navy text-white hover:bg-navy/90"
        >
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-3">
        {fields.map((f) => (
          <div key={f.key} className="rounded-2xl border border-gold/20 bg-white p-5">
            <h3 className="font-semibold text-navy-text">{f.label}</h3>
            <p className="mb-3 mt-1 text-xs leading-relaxed text-navy-text/55">{f.help}</p>
            <ImageUpload value={form[f.key]} onChange={(url) => setForm({ ...form, [f.key]: url })} />
          </div>
        ))}
      </div>

      {saved && (
        <p className="mt-4 text-sm font-medium text-gold" role="status">
          Settings saved. Changes are now live on the site.
        </p>
      )}
    </div>
  )
}
