"use client"

import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

// In the v0 preview the app is served inside a cross-origin iframe, so the
// auth client must send requests to the explicit server origin rather than
// a relative path. NEXT_PUBLIC_APP_URL is set to V0_RUNTIME_URL at build time.
const baseURL =
  process.env.NEXT_PUBLIC_APP_URL ||
  (typeof window !== "undefined" ? window.location.origin : undefined)

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
})

export const { signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword, changePassword } = authClient
