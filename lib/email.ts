import "server-only"
import { Resend } from "resend"

const resendApiKey = process.env.RESEND_API_KEY
const fromEmail = process.env.RESEND_FROM_EMAIL || "AWAJ <onboarding@resend.dev>"

const resend = resendApiKey ? new Resend(resendApiKey) : null

type SendEmailArgs = {
  to: string
  subject: string
  html: string
}

/**
 * Sends a transactional email through Resend.
 * If RESEND_API_KEY is not configured, the email is logged to the server
 * instead of failing, so flows like password reset still complete in dev.
 */
export async function sendEmail({ to, subject, html }: SendEmailArgs) {
  if (!resend) {
    console.log("[v0] Email not sent (RESEND_API_KEY missing). Would have sent:", {
      to,
      subject,
    })
    return { sent: false as const }
  }

  try {
    await resend.emails.send({ from: fromEmail, to, subject, html })
    return { sent: true as const }
  } catch (error) {
    console.log("[v0] Failed to send email via Resend:", error)
    return { sent: false as const }
  }
}

export function resetPasswordEmailHtml(url: string, name?: string) {
  return `
  <div style="font-family: ui-sans-serif, system-ui, sans-serif; max-width: 480px; margin: 0 auto; padding: 24px; color: #1a1a1a;">
    <h1 style="font-size: 20px; margin-bottom: 8px;">Reset your AWAJ password</h1>
    <p style="font-size: 14px; line-height: 1.6; color: #444;">
      ${name ? `Hi ${name},` : "Hi,"} we received a request to reset your password.
      Click the button below to choose a new one. This link expires in 1 hour.
    </p>
    <a href="${url}" style="display: inline-block; margin: 16px 0; padding: 12px 20px; background: #111; color: #fff; text-decoration: none; border-radius: 8px; font-size: 14px;">
      Reset password
    </a>
    <p style="font-size: 12px; color: #888; line-height: 1.6;">
      If you didn't request this, you can safely ignore this email.
    </p>
  </div>`
}
