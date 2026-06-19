"use client"

import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export function ChangePassword() {
  const [current, setCurrent] = useState("")
  const [next, setNext] = useState("")
  const [confirm, setConfirm] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setDone(false)

    if (next !== confirm) {
      setError("New passwords do not match.")
      return
    }

    setLoading(true)
    const { error } = await authClient.changePassword({
      currentPassword: current,
      newPassword: next,
      revokeOtherSessions: true,
    })
    setLoading(false)

    if (error) {
      setError(error.message ?? "Could not change password.")
      return
    }
    setDone(true)
    setCurrent("")
    setNext("")
    setConfirm("")
  }

  return (
    <section className="mt-10">
      <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Your account</h3>
      <form
        onSubmit={handleSubmit}
        className="mt-4 grid max-w-xl grid-cols-1 gap-4 rounded-2xl border border-gold/20 bg-white p-5"
      >
        <h4 className="font-semibold text-navy-text">Change password</h4>
        <div className="flex flex-col gap-2">
          <Label htmlFor="current-password">Current password</Label>
          <Input
            id="current-password"
            type="password"
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="new-password">New password</Label>
            <Input
              id="new-password"
              type="password"
              value={next}
              onChange={(e) => setNext(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="confirm-password">Confirm new password</Label>
            <Input
              id="confirm-password"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={8}
              autoComplete="new-password"
            />
          </div>
        </div>

        {error ? (
          <p className="text-sm text-awaj-red" role="alert">
            {error}
          </p>
        ) : null}
        {done ? (
          <p className="text-sm font-medium text-gold" role="status">
            Password updated. Other sessions have been signed out.
          </p>
        ) : null}

        <div>
          <Button type="submit" disabled={loading} className="rounded-full bg-navy text-white hover:bg-navy/90">
            {loading ? "Updating..." : "Update password"}
          </Button>
        </div>
      </form>
    </section>
  )
}
