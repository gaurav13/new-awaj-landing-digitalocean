import { betterAuth } from "better-auth"
import { admin } from "better-auth/plugins"
import { createAccessControl } from "better-auth/plugins/access"
import { defaultStatements, adminAc } from "better-auth/plugins/admin/access"
import { pool } from "@/lib/db"
import { sendEmail, resetPasswordEmailHtml } from "@/lib/email"
import { getAuthBaseUrlConfig, getDynamicTrustedOrigins } from "@/lib/auth-url"

// Access control: a "superadmin" can manage other admins; a regular "admin"
// can only manage content (no user-management permissions).
const ac = createAccessControl(defaultStatements)
const adminRole = ac.newRole({})
const superadminRole = ac.newRole(adminAc.statements)

export const auth = betterAuth({
  database: pool,
  secret: process.env.BETTER_AUTH_SECRET,
  // Resolve base URL from incoming request host (DigitalOcean IP/domain, Vercel, localhost).
  baseURL: getAuthBaseUrlConfig(),
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
  // Accept the current request origin dynamically (trustHost-style behavior).
  trustedOrigins: async (request) => getDynamicTrustedOrigins(request),
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  advanced: {
    // Trust x-forwarded-host / x-forwarded-proto from nginx on DigitalOcean.
    trustedProxyHeaders: true,
    defaultCookieAttributes: {
      sameSite: "none" as const,
      secure: true,
      httpOnly: true,
    },
  },
  plugins: [
    admin({
      ac,
      roles: {
        admin: adminRole,
        superadmin: superadminRole,
      },
      // Only "superadmin" can manage other admins; "admin" is a content editor.
      adminRoles: ["superadmin"],
      defaultRole: "admin",
    }),
  ],
})
