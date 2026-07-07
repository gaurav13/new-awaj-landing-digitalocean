"use client"

import { useRef, useState } from "react"
import { UploadCloud, X, Loader2 } from "lucide-react"
import { resolveImageUrl } from "@/lib/images"

/**
 * Public (unauthenticated) image uploader for the membership application form.
 * Posts to /api/public-upload and stores the returned relative `/images/...` path.
 */
export function PublicImageUpload({
  value,
  onChange,
  label,
  circle = false,
}: {
  value: string
  onChange: (url: string) => void
  label: string
  circle?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const previewUrl = value ? resolveImageUrl(value) : ""

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await fetch("/api/public-upload", { method: "POST", body: formData })
      const data = (await res.json().catch(() => null)) as { path?: string; error?: string } | null
      if (!res.ok || !data?.path) {
        throw new Error(data?.error || `Upload failed (${res.status})`)
      }
      onChange(data.path)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/avif"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />

      {value ? (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl || "/placeholder.svg"}
            alt={`${label} preview`}
            className={`h-20 w-20 border border-gold/30 bg-beige object-contain ${circle ? "rounded-full object-cover" : "rounded-xl"}`}
          />
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-left text-sm font-medium text-navy-text/70 hover:text-navy-text"
            >
              {uploading ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="flex items-center gap-1 text-left text-xs text-awaj-red/80 hover:text-awaj-red"
            >
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-28 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold/40 bg-white text-navy-text/60 transition-colors hover:border-gold hover:bg-beige/40"
        >
          {uploading ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              <span className="text-sm">Uploading…</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-5 w-5" />
              <span className="text-sm font-medium">Upload {label}</span>
              <span className="text-xs text-navy-text/40">PNG, JPG, WebP · max 5 MB</span>
            </>
          )}
        </button>
      )}

      {error && (
        <p className="text-xs text-awaj-red" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
