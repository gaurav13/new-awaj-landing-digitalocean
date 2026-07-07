import { type NextRequest, NextResponse } from "next/server"
import { uploadImageToSpaces } from "@/lib/storage"

export const runtime = "nodejs"
export const maxDuration = 60

// Public, unauthenticated upload used ONLY by the public membership application form
// (company logo + founder photo). Kept deliberately strict: images only, small size cap.
const ALLOWED_TYPES = new Set(["image/png", "image/jpeg", "image/jpg", "image/webp", "image/avif"])
const EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
}
const MAX_BYTES = 5 * 1024 * 1024

function inferContentType(file: File): string | null {
  const type = file.type?.toLowerCase()
  if (type && ALLOWED_TYPES.has(type)) return type
  const ext = file.name.split(".").pop()?.toLowerCase()
  if (ext && EXT_TO_MIME[ext]) return EXT_TO_MIME[ext]
  return null
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const contentType = inferContentType(file)
    if (!contentType) {
      return NextResponse.json({ error: "Please upload a PNG, JPG, WebP, or AVIF image." }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: `${file.name || "File"} exceeds the 5 MB limit.` }, { status: 400 })
    }

    const uploadResult = await uploadImageToSpaces(file, contentType)
    return NextResponse.json({ path: uploadResult.path, url: uploadResult.publicUrl })
  } catch (uploadError: unknown) {
    console.error("[public-upload] error:", uploadError)
    const message = uploadError instanceof Error ? uploadError.message : "Upload failed"
    return NextResponse.json({ error: message }, { status: 400 })
  }
}
