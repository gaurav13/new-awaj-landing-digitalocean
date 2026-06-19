"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/awaj/logo"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await authClient.requestPasswordReset({
      email,
      redirectTo: "/reset-password",
    })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Something went wrong")
      return
    }
    setSent(true)
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-3xl border border-gold/20 bg-ivory p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <Logo />
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-navy-text">Reset password</h1>
            <p className="mt-1 text-sm text-navy-text/60">
              Enter your email and we&apos;ll send you a reset link.
            </p>
          </div>
        </div>

        {sent ? (
          <div className="rounded-2xl border border-gold/30 bg-white p-5 text-center">
            <p className="text-sm leading-relaxed text-navy-text/75">
              If an account exists for <span className="font-semibold text-navy-text">{email}</span>, a password reset
              link is on its way. Check your inbox and spam folder.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            {error ? (
              <p className="text-sm text-awaj-red" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={loading} className="w-full rounded-full bg-navy text-white hover:bg-navy/90">
              {loading ? "Sending..." : "Send reset link"}
            </Button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-navy-text/60">
          <Link href="/sign-in" className="font-semibold text-gold underline-offset-4 hover:underline">
            Back to sign in
          </Link>
        </p>
      </div>
    </main>
  )
}
