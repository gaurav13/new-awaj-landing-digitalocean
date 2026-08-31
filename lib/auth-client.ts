"use client"

import { createAuthClient } from "better-auth/react"
import { adminClient } from "better-auth/client/plugins"

// Always target the current browser origin so auth works on Vercel, localhost,
// DigitalOcean IP, and custom domains without hardcoding NEXT_PUBLIC_APP_URL.
const baseURL = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_APP_URL

export const authClient = createAuthClient({
  baseURL,
  plugins: [adminClient()],
})

export const { signIn, signUp, signOut, useSession, requestPasswordReset, resetPassword, changePassword } = authClient
