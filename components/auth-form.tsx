"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Logo } from "@/components/awaj/logo"

export function AuthForm({ mode }: { mode: "sign-in" | "sign-up" }) {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === "sign-up"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(error.message ?? "Something went wrong")
      return
    }

    router.push("/admin")
    router.refresh()
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-navy px-4">
      <div className="w-full max-w-sm rounded-3xl border border-gold/20 bg-ivory p-8 shadow-xl">
        <div className="mb-6 flex flex-col items-center gap-4 text-center">
          <Logo />
          <div>
            <h1 className="font-serif text-2xl font-bold tracking-tight text-navy-text">
              {isSignUp ? "Create admin account" : "Admin sign in"}
            </h1>
            <p className="mt-1 text-sm text-navy-text/60">
              {isSignUp ? "Register to manage news content" : "Sign in to manage news content"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {isSignUp && (
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required autoComplete="name" />
            </div>
          )}
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
          <div className="flex flex-col gap-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              autoComplete={isSignUp ? "new-password" : "current-password"}
            />
          </div>

          {error && (
            <p className="text-sm text-awaj-red" role="alert">
              {error}
            </p>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-navy text-white hover:bg-navy/90"
          >
            {loading ? "Please wait..." : isSignUp ? "Create account" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-navy-text/60">
          {isSignUp ? "Already have an account? " : "Need an admin account? "}
          <Link
            href={isSignUp ? "/sign-in" : "/sign-up"}
            className="font-semibold text-gold underline-offset-4 hover:underline"
          >
            {isSignUp ? "Sign in" : "Sign up"}
          </Link>
        </p>
      </div>
    </main>
  )
}
