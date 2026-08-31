import type { DynamicBaseURLConfig } from "better-auth"

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "")
}

function parseOrigin(url: string | undefined): string | null {
  if (!url?.trim()) return null
  try {
    return new URL(url.trim()).origin
  } catch {
    return null
  }
}

function hostFromUrl(url: string): string | null {
  try {
    return new URL(url).host
  } catch {
    return null
  }
}

/** Equivalent to NextAuth `trustHost: true` — enabled by default for self-hosted/DO. */
export function trustHostEnabled() {
  return process.env.AUTH_TRUST_HOST !== "false"
}

/** Resolve a canonical fallback URL from env (Vercel, localhost, custom domain, etc.). */
export function getAuthBaseUrlFallback(): string | undefined {
  const candidates = [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.AUTH_URL,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.V0_RUNTIME_URL,
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : undefined,
  ]

  for (const candidate of candidates) {
    const origin = parseOrigin(candidate)
    if (origin) return trimTrailingSlash(origin)
  }

  return undefined
}

function collectHostsFromEnv(): string[] {
  const hosts: string[] = []

  for (const value of [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.AUTH_URL,
    process.env.V0_RUNTIME_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
  ]) {
    const host = value ? hostFromUrl(value) : null
    if (host) hosts.push(host)
  }

  for (const entry of process.env.AUTH_ALLOWED_HOSTS?.split(",") ?? []) {
    const trimmed = entry.trim()
    if (trimmed) hosts.push(trimmed)
  }

  return hosts
}

/** Dynamic base URL config — resolves host from incoming request headers on each request. */
export function getAuthBaseUrlConfig(): DynamicBaseURLConfig {
  const allowedHosts = new Set<string>([
    "localhost",
    "127.0.0.1",
    "*.localhost",
    "*.vercel.app",
    "*.vusercontent.net",
    "*.v0.app",
    "*.v0.dev",
    ...collectHostsFromEnv(),
  ])

  if (trustHostEnabled()) {
    allowedHosts.add("*")
  }

  return {
    allowedHosts: [...allowedHosts],
    fallback: getAuthBaseUrlFallback(),
    protocol: "auto",
  }
}

export function getStaticTrustedOrigins(): string[] {
  const origins = new Set<string>([
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
  ])

  for (const value of [
    process.env.BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    process.env.NEXT_PUBLIC_APP_URL,
    process.env.AUTH_URL,
    process.env.V0_RUNTIME_URL,
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined,
    process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : undefined,
  ]) {
    const origin = parseOrigin(value)
    if (origin) origins.add(origin)
  }

  for (const entry of process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(",") ?? []) {
    const trimmed = entry.trim()
    if (trimmed) origins.add(trimmed)
  }

  return [...origins]
}

/** Build an origin from request headers (host / x-forwarded-host), similar to trustHost. */
export function getRequestOrigin(request: Request): string | null {
  const originHeader = request.headers.get("origin")
  if (originHeader && originHeader !== "null") return originHeader

  const referer = request.headers.get("referer")
  if (referer) {
    try {
      return new URL(referer).origin
    } catch {
      // ignore invalid referer
    }
  }

  const host =
    request.headers.get("x-forwarded-host")?.split(",")[0]?.trim() ||
    request.headers.get("host")?.split(",")[0]?.trim()

  if (!host) return null

  const forwardedProto = request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim()
  const protocol =
    forwardedProto === "http" || forwardedProto === "https"
      ? forwardedProto
      : host.startsWith("localhost") || host.startsWith("127.0.0.1")
        ? "http"
        : "https"

  return `${protocol}://${host}`
}

export async function getDynamicTrustedOrigins(request?: Request): Promise<string[]> {
  const origins = new Set(getStaticTrustedOrigins())

  if (request && trustHostEnabled()) {
    const requestOrigin = getRequestOrigin(request)
    if (requestOrigin) origins.add(requestOrigin)
  }

  return [...origins]
}
