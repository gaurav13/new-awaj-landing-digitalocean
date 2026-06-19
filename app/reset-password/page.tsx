"use client"

import type React from "react"
import { Suspense, useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/awaj/logo"

function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const errorParam = searchParams.get("error")

  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const invalidToken = !token || errorParam === "invalid_token"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError("Passwords do not match.")
      return
    }

    setLoading(true)
    const { error } = await authClient.resetPassword({ newPassword: password, token: token! })
    setLoading(false)

    if (error) {
      setError(error.message ?? "Something went wrong")
      return
    }
    setDone(true)
    setTimeout(() => router.push("/sign-in"), 1500)
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-3xl border border-gold/20 bg-ivory p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <Logo />
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-navy-text">Set a new password</h1>
            <p className="mt-1 text-sm text-navy-text/60">Choose a strong password for your admin account.</p>
          </div>
        </div>

        {invalidToken ? (
          <div className="rounded-2xl border border-awaj-red/30 bg-white p-5 text-center">
            <p className="text-sm leading-relaxed text-navy-text/75">
              This reset link is invalid or has expired. Please request a new one.
            </p>
            <Link
              href="/forgot-password"
              className="mt-4 inline-block text-sm font-semibold text-gold underline-offset-4 hover:underline"
            >
              Request a new link
            </Link>
          </div>
        ) : done ? (
          <div className="rounded-2xl border border-gold/30 bg-white p-5 text-center">
            <p className="text-sm leading-relaxed text-navy-text/75">
              Your password has been reset. Redirecting you to sign in...
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">New password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="confirm">Confirm new password</Label>
              <Input
                id="confirm"
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
                minLength={8}
                autoComplete="new-password"
              />
            </div>

            {error ? (
              <p className="text-sm text-awaj-red" role="alert">
                {error}
              </p>
            ) : null}

            <Button type="submit" disabled={loading} className="w-full rounded-full bg-navy text-white hover:bg-navy/90">
              {loading ? "Updating..." : "Reset password"}
            </Button>
          </form>
        )}
      </div>
    </main>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  )
}
