"use client"

import { useState } from "react"
import { X, Mail, CheckCircle2 } from "lucide-react"
import { recordClick, subscribeNewsletter } from "@/app/actions/ads"
import { useAdTrigger, type OverlayAd } from "./use-ad-trigger"

export function NewsletterPopup({ ad }: { ad: OverlayAd }) {
  const { visible, dismiss } = useAdTrigger(ad)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [consent, setConsent] = useState(false)
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")

  if (!visible) return null

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus("loading")
    setMessage("")
    const result = await subscribeNewsletter({ name, email, consent })
    if (result.ok) {
      void recordClick(ad.id)
      setStatus("success")
      setMessage(result.duplicate ? "You're already subscribed — thank you!" : "Thanks for subscribing!")
    } else {
      setStatus("error")
      setMessage(result.error)
    }
  }

  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label={ad.title || "Newsletter signup"}
    >
      <button type="button" aria-label="Close" onClick={dismiss} className="absolute inset-0 bg-navy/60 backdrop-blur-sm" />
      <div className="relative z-10 grid w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl sm:grid-cols-[0.8fr_1fr]">
        <button
          type="button"
          onClick={dismiss}
          aria-label="Close"
          className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-navy-text shadow-md transition-colors hover:bg-white"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="relative hidden bg-navy sm:block">
          {ad.imageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={ad.imageUrl || "/placeholder.svg"} alt={ad.altText || ""} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Mail className="h-12 w-12 text-gold" />
            </div>
          )}
        </div>

        <div className="p-6">
          {status === "success" ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <CheckCircle2 className="h-12 w-12 text-gold" />
              <h3 className="font-serif text-xl font-bold text-navy-text">{message}</h3>
              <button
                type="button"
                onClick={dismiss}
                className="mt-2 rounded-full bg-awaj-red px-6 py-2 text-sm font-semibold uppercase tracking-wide text-white"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <h3 className="pr-8 font-serif text-xl font-bold text-navy-text">{ad.title || "Join our newsletter"}</h3>
              {ad.bodyText ? (
                <p className="mt-2 text-sm leading-relaxed text-navy-text/70">{ad.bodyText}</p>
              ) : null}
              <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-3">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Name (optional)"
                  className="h-10 rounded-lg border border-gold/30 bg-white px-3 text-sm text-navy-text outline-none focus:border-gold"
                />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email address"
                  className="h-10 rounded-lg border border-gold/30 bg-white px-3 text-sm text-navy-text outline-none focus:border-gold"
                />
                <label className="flex items-start gap-2 text-xs leading-relaxed text-navy-text/65">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(e) => setConsent(e.target.checked)}
                    className="mt-0.5 h-4 w-4 rounded border-input accent-awaj-red"
                  />
                  <span>I agree to receive emails and accept the privacy policy.</span>
                </label>
                {status === "error" ? <p className="text-xs text-awaj-red">{message}</p> : null}
                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="inline-flex items-center justify-center rounded-full bg-awaj-red px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-white transition-opacity hover:opacity-90 disabled:opacity-60"
                >
                  {status === "loading" ? "Subscribing…" : ad.buttonText || "Subscribe"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
