import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"
import { pool } from "@/lib/db"
import { sendEmail, resetPasswordEmailHtml } from "@/lib/email"

function getAuthBaseUrl() {
  if (process.env.BETTER_AUTH_URL) return process.env.BETTER_AUTH_URL
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  }
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`
  if (process.env.V0_RUNTIME_URL) return process.env.V0_RUNTIME_URL
  if (process.env.NODE_ENV === "development") return "http://localhost:3000"
  return undefined
}

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: getAuthBaseUrl(),
  emailAndPassword: {
    enabled: true,
    autoSignIn: true,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: "Reset your AWAJ password",
        html: resetPasswordEmailHtml(url, user.name),
      })
    },
  },
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    // v0 preview + sandbox domains (rendered inside a cross-site iframe)
    "*.vusercontent.net",
    "*.v0.app",
    "*.v0.dev",
    ...(process.env.V0_RUNTIME_URL ? [process.env.V0_RUNTIME_URL] : []),
    ...(process.env.VERCEL_URL ? [`https://${process.env.VERCEL_URL}`] : []),
    ...(process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? [`https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`]
      : []),
  ],
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  // The v0 preview renders the app inside a cross-site HTTPS iframe, so the
  // session cookie must be SameSite=None; Secure or the browser drops it.
  advanced: {
    defaultCookieAttributes: {
      sameSite: "none" as const,
      secure: true,
    },
  },
  plugins: [
    admin({
      // "superadmin" can manage other admins; "admin" is a regular content editor.
      adminRoles: ["superadmin"],
      defaultRole: "admin",
    }),
  ],
})
