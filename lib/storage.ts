import "server-only"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import { IMAGE_CDN_BASE_URL } from "@/lib/images"

const SPACES_REGION = process.env.DO_SPACES_REGION ?? "sgp1"
const SPACES_BUCKET = process.env.DO_SPACES_BUCKET ?? "awaj-gallery"

/**
 * S3 API endpoint must be region-only, e.g. https://sgp1.digitaloceanspaces.com
 * NOT the bucket URL (awaj-gallery.sgp1...) or CDN URL (...cdn.digitaloceanspaces.com).
 * Otherwise the SDK doubles the bucket: awaj-gallery.awaj-gallery.sgp1...
 */
function normalizeSpacesEndpoint(raw: string | undefined, bucket: string, region: string): string {
  const regionEndpoint = `https://${region}.digitaloceanspaces.com`
  if (!raw?.trim()) return regionEndpoint

  try {
    const url = new URL(raw.trim())
    let host = url.hostname.toLowerCase()

    if (host.includes(".cdn.digitaloceanspaces.com")) {
      return regionEndpoint
    }

    const bucketPrefix = `${bucket.toLowerCase()}.`
    if (host.startsWith(bucketPrefix)) {
      host = host.slice(bucketPrefix.length)
    }

    if (host.endsWith(".digitaloceanspaces.com")) {
      return `https://${host}`
    }

    return regionEndpoint
  } catch {
    return regionEndpoint
  }
}

const SPACES_ENDPOINT = normalizeSpacesEndpoint(process.env.DO_SPACES_ENDPOINT, SPACES_BUCKET, SPACES_REGION)

function getSpacesCredentials() {
  const accessKeyId = (process.env.DO_SPACES_KEY ?? process.env.SPACES_ACCESS_KEY_ID)?.trim()
  const secretAccessKey = (process.env.DO_SPACES_SECRET ?? process.env.SPACES_SECRET_ACCESS_KEY)?.trim()

  if (!accessKeyId || !secretAccessKey) {
    throw new Error(
      "DigitalOcean Spaces credentials are missing. Set DO_SPACES_KEY and DO_SPACES_SECRET in .env.local, then restart the dev server.",
    )
  }

  return { accessKeyId, secretAccessKey }
}

function getSpacesClient(): S3Client {
  const { accessKeyId, secretAccessKey } = getSpacesCredentials()

  return new S3Client({
    endpoint: SPACES_ENDPOINT,
    region: SPACES_REGION,
    credentials: { accessKeyId, secretAccessKey },
    forcePathStyle: false,
  })
}

function sanitizeFilename(name: string): string {
  const base = name.replace(/[^a-zA-Z0-9._-]/g, "-").replace(/-+/g, "-")
  const stamp = Date.now().toString(36)
  const dot = base.lastIndexOf(".")
  if (dot > 0) return `${base.slice(0, dot)}-${stamp}${base.slice(dot)}`
  return `${base}-${stamp}`
}

export type UploadImageResult = {
  path: string
  publicUrl: string
}

export async function uploadImageToSpaces(file: File): Promise<UploadImageResult> {
  const client = getSpacesClient()
  const filename = sanitizeFilename(file.name || "upload.jpg")
  const objectKey = `images/${filename}`
  const fileBuffer = Buffer.from(await file.arrayBuffer())

  await client.send(
    new PutObjectCommand({
      Bucket: SPACES_BUCKET,
      Key: objectKey,
      Body: fileBuffer,
      ContentType: file.type || "application/octet-stream",
      ACL: "public-read",
    }),
  )

  const storedPath = `/images/${filename}`
  const publicUrl = `${IMAGE_CDN_BASE_URL}${filename}`

  return { path: storedPath, publicUrl }
}
