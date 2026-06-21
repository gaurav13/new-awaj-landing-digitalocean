import { type NextRequest, NextResponse } from "next/server"
import { S3ServiceException } from "@aws-sdk/client-s3"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { uploadImageToSpaces } from "@/lib/storage"

export const runtime = "nodejs"
export const maxDuration = 60

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/avif",
  "image/heic",
  "image/heif",
  "image/bmp",
  "image/tiff",
])

const EXT_TO_MIME: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  gif: "image/gif",
  avif: "image/avif",
  heic: "image/heic",
  heif: "image/heif",
  bmp: "image/bmp",
  tif: "image/tiff",
  tiff: "image/tiff",
}

const MAX_BYTES = 25 * 1024 * 1024

function inferContentType(file: File): string | null {
  const type = file.type?.toLowerCase()
  if (type && ALLOWED_TYPES.has(type)) return type

  const ext = file.name.split(".").pop()?.toLowerCase()
  if (ext && EXT_TO_MIME[ext]) return EXT_TO_MIME[ext]

  return null
}

function getUploadErrorMessage(uploadError: unknown): string {
  if (uploadError instanceof S3ServiceException) {
    if (uploadError.name === "InvalidAccessKeyId" || uploadError.Code === "InvalidAccessKeyId") {
      return "Invalid DigitalOcean Spaces access key. Update DO_SPACES_KEY and DO_SPACES_SECRET in .env.local (and Vercel env if using vercel dev), then restart."
    }
    if (uploadError.name === "SignatureDoesNotMatch") {
      return "Invalid DigitalOcean Spaces secret key. Check DO_SPACES_SECRET in .env.local and restart the dev server."
    }
    if (uploadError.name === "UnknownError" || uploadError.message === "UnknownError") {
      return "DigitalOcean Spaces rejected the upload. Check DO_SPACES_KEY and DO_SPACES_SECRET in .env.local, then restart the dev server."
    }
    return uploadError.message || uploadError.name
  }
  if (uploadError instanceof Error && uploadError.message) return uploadError.message
  return "Upload failed"
}

export async function POST(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    const contentType = inferContentType(file)
    if (!contentType) {
      return NextResponse.json(
        { error: `Unsupported file type: ${file.name || "unknown"}` },
        { status: 400 },
      )
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: `${file.name || "File"} exceeds 25 MB limit` },
        { status: 400 },
      )
    }

    const uploadResult = await uploadImageToSpaces(file, contentType)
    return NextResponse.json({ path: uploadResult.path, url: uploadResult.publicUrl })
  } catch (uploadError: unknown) {
    console.error("[upload] DigitalOcean Spaces error:", uploadError)
    return NextResponse.json(
      { error: getUploadErrorMessage(uploadError) },
      { status: 400 },
    )
  }
}
