import { type NextRequest, NextResponse } from "next/server"
import { S3ServiceException } from "@aws-sdk/client-s3"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { uploadImageToSpaces } from "@/lib/storage"

export const runtime = "nodejs"

const ALLOWED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/gif",
  "image/avif",
])

const MAX_BYTES = 25 * 1024 * 1024

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

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 })
    }

    if (file.size > MAX_BYTES) {
      return NextResponse.json({ error: "File exceeds 25 MB limit" }, { status: 400 })
    }

    const uploadResult = await uploadImageToSpaces(file)
    return NextResponse.json({ path: uploadResult.path, url: uploadResult.publicUrl })
  } catch (uploadError: unknown) {
    console.error("[upload] DigitalOcean Spaces error:", uploadError)
    return NextResponse.json(
      { error: getUploadErrorMessage(uploadError) },
      { status: 400 },
    )
  }
}
