"use client"

import { useRef, useState } from "react"
import { UploadCloud, X, Loader2, GripVertical } from "lucide-react"
import type { GalleryItem } from "@/lib/db/schema"
import { resolveImageUrl, uploadImageViaApi } from "@/lib/images"

export function MultiImageUpload({
  value,
  onChange,
}: {
  value: GalleryItem[]
  onChange: (photos: GalleryItem[]) => void
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null)
  const [error, setError] = useState<string | null>(null)
  const dragIndex = useRef<number | null>(null)

  const photos = Array.isArray(value) ? value : []

  async function handleFiles(files: FileList) {
    const list = Array.from(files).filter((f) => f.type.startsWith("image/"))
    if (list.length === 0) return
    setError(null)
    setUploading(true)
    setProgress({ done: 0, total: list.length })
    let done = 0
    const added: GalleryItem[] = []
    try {
      const batchSize = 3
      for (let i = 0; i < list.length; i += batchSize) {
        const batch = list.slice(i, i + batchSize)
        const paths = await Promise.all(
          batch.map(async (file) => {
            const path = await uploadImageViaApi(file)
            done += 1
            setProgress({ done, total: list.length })
            return path
          }),
        )
        for (const path of paths) added.push({ imageUrl: path, caption: undefined })
      }
      onChange([...photos, ...added])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Some images failed to upload")
      if (added.length) onChange([...photos, ...added])
    } finally {
      setUploading(false)
      setProgress(null)
    }
  }

  function updateCaption(index: number, caption: string) {
    onChange(photos.map((p, i) => (i === index ? { ...p, caption } : p)))
  }

  function remove(index: number) {
    onChange(photos.filter((_, i) => i !== index))
  }

  function reorder(from: number, to: number) {
    if (from === to) return
    const next = [...photos]
    const [moved] = next.splice(from, 1)
    next.splice(to, 0, moved)
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(e.target.files)
          e.target.value = ""
        }}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="flex h-32 flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-gold/40 bg-white text-navy-text/60 transition-colors hover:border-gold hover:bg-beige/40 disabled:opacity-70"
      >
        {uploading ? (
          <>
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-sm font-medium">
              Uploading {progress ? `${progress.done}/${progress.total}` : "…"}
            </span>
          </>
        ) : (
          <>
            <UploadCloud className="h-6 w-6" />
            <span className="text-sm font-medium">Click to upload photos in bulk</span>
            <span className="text-xs text-navy-text/40">Select multiple images · DigitalOcean CDN</span>
          </>
        )}
      </button>

      {photos.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo, index) => (
            <div
              key={`${photo.imageUrl}-${index}`}
              draggable
              onDragStart={() => (dragIndex.current = index)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (dragIndex.current !== null) reorder(dragIndex.current, index)
                dragIndex.current = null
              }}
              className="group relative overflow-hidden rounded-xl border border-gold/30 bg-white"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-beige">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolveImageUrl(photo.imageUrl) || "/placeholder.svg"}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="absolute left-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-navy/70 text-[11px] font-semibold text-white">
                  {index + 1}
                </span>
                <span
                  className="absolute right-1.5 top-1.5 hidden cursor-grab rounded-md bg-navy/60 p-1 text-white group-hover:block"
                  aria-hidden="true"
                >
                  <GripVertical className="h-3.5 w-3.5" />
                </span>
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute bottom-1.5 right-1.5 rounded-md bg-awaj-red/90 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  aria-label="Remove photo"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <input
                value={photo.caption ?? ""}
                onChange={(e) => updateCaption(index, e.target.value)}
                placeholder="Caption (optional)"
                className="w-full border-t border-gold/20 bg-white px-2 py-1.5 text-xs text-navy-text outline-none placeholder:text-navy-text/40"
              />
            </div>
          ))}
        </div>
      ) : null}

      {photos.length > 0 ? (
        <p className="text-xs text-navy-text/50">
          {photos.length} photo{photos.length === 1 ? "" : "s"} · drag to reorder · the first photo is used as the cover
        </p>
      ) : null}

      {error ? (
        <p className="text-xs text-awaj-red" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  )
}
