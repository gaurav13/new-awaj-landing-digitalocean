"use client"

import { useRef, useState } from "react"
import { UploadCloud, X, Loader2 } from "lucide-react"
import { upload } from "@vercel/blob/client"

export function ImageUpload({
  value,
  onChange,
}: {
  value: string
  onChange: (url: string) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFile(file: File) {
    setError(null)
    setUploading(true)
    try {
      const blob = await upload(`awaj/${file.name}`, file, {
        access: "public",
        handleUploadUrl: "/api/upload",
      })
      onChange(blob.url)
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
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) handleFile(file)
          e.target.value = ""
        }}
      />

      {value ? (
        <div className="relative overflow-hidden rounded-xl border border-gold/30 bg-white">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value || "/placeholder.svg"} alt="Selected" className="h-40 w-full object-cover" />
          <div className="flex items-center justify-between gap-2 border-t border-gold/20 px-3 py-2">
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
              className="text-xs font-medium text-navy-text/70 hover:text-navy-text"
            >
              {uploading ? "Uploading…" : "Replace"}
            </button>
            <button
              type="button"
              onClick={() => onChange("")}
              className="rounded-md p-1 text-awaj-red/70 hover:bg-awaj-red/10 hover:text-awaj-red"
              aria-label="Remove image"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold/40 bg-white text-navy-text/60 transition-colors hover:border-gold hover:bg-beige/40"
        >
          {uploading ? (
            <>
              <Loader2 className="h-6 w-6 animate-spin" />
              <span className="text-sm">Uploading…</span>
            </>
          ) : (
            <>
              <UploadCloud className="h-6 w-6" />
              <span className="text-sm font-medium">Click to upload an image</span>
              <span className="text-xs text-navy-text/40">PNG, JPG, or WebP</span>
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
