"use client"

import type React from "react"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Plus, Trash2, KeyRound, ShieldCheck, Shield, Ban, CircleCheck, X, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  createAdminUser,
  updateAdminUser,
  setUserRole,
  setUserPassword,
  removeAdminUser,
  setUserBanned,
} from "@/app/actions/users"
import { formatLongDate } from "@/lib/format-date"

export type AdminUser = {
  id: string
  name: string
  email: string
  role: string
  banned: boolean
  createdAt: Date | string
}

export function UserManager({ users, currentUserId }: { users: AdminUser[]; currentUserId: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [passwordFor, setPasswordFor] = useState<AdminUser | null>(null)
  const [editFor, setEditFor] = useState<AdminUser | null>(null)

  const [form, setForm] = useState({ name: "", email: "", password: "", role: "admin" as "admin" | "superadmin" })
  const [newPassword, setNewPassword] = useState("")
  const [editForm, setEditForm] = useState({ name: "", email: "" })

  function run(fn: () => Promise<{ ok: boolean; error?: string }>, onDone?: () => void) {
    setError(null)
    startTransition(async () => {
      const res = await fn()
      if (!res.ok) {
        setError(res.error || "Something went wrong.")
        return
      }
      onDone?.()
      router.refresh()
    })
  }

  function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim() || !form.email.trim() || form.password.length < 8) {
      setError("Name, email, and a password of at least 8 characters are required.")
      return
    }
    run(() => createAdminUser(form), () => {
      setShowCreate(false)
      setForm({ name: "", email: "", password: "", role: "admin" })
    })
  }

  function handleEdit(e: React.FormEvent) {
    e.preventDefault()
    if (!editFor) return
    if (!editForm.name.trim() || !editForm.email.trim()) {
      setError("Name and email are required.")
      return
    }
    run(() => updateAdminUser(editFor.id, editForm), () => {
      setEditFor(null)
    })
  }

  function handleSetPassword(e: React.FormEvent) {
    e.preventDefault()
    if (!passwordFor) return
    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.")
      return
    }
    run(() => setUserPassword(passwordFor.id, newPassword), () => {
      setPasswordFor(null)
      setNewPassword("")
    })
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy-text">Admin users</h2>
          <p className="mt-1 text-sm text-navy-text/60">
            Super-admins can add team members, reset passwords, and control access.
          </p>
        </div>
        <Button
          onClick={() => {
            setError(null)
            setShowCreate(true)
          }}
          className="rounded-full bg-awaj-red text-white hover:bg-awaj-red/90"
        >
          <Plus className="mr-1.5 h-4 w-4" />
          New user
        </Button>
      </div>

      {error && !showCreate && !passwordFor && !editFor ? (
        <p className="mt-4 rounded-lg bg-awaj-red/10 px-4 py-2 text-sm text-awaj-red" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-6 overflow-hidden rounded-2xl border border-gold/20 bg-white">
        <ul className="divide-y divide-gold/15">
          {users.map((u) => {
            const isSelf = u.id === currentUserId
            const isSuper = u.role === "superadmin"
            return (
              <li key={u.id} className="flex flex-wrap items-center gap-4 p-4 hover:bg-beige/30">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-navy text-sm font-semibold uppercase text-white">
                  {u.name.slice(0, 2)}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        isSuper ? "bg-gold/20 text-gold" : "bg-beige text-navy-text/70"
                      }`}
                    >
                      {isSuper ? <ShieldCheck className="h-3 w-3" /> : <Shield className="h-3 w-3" />}
                      {isSuper ? "Super admin" : "Admin"}
                    </span>
                    {u.banned ? (
                      <span className="rounded-full bg-awaj-red/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-awaj-red">
                        Suspended
                      </span>
                    ) : null}
                    {isSelf ? <span className="text-[10px] uppercase tracking-wide text-navy-text/40">You</span> : null}
                  </div>
                  <h3 className="mt-1 truncate font-semibold text-navy-text">{u.name}</h3>
                  <p className="truncate text-sm text-navy-text/60">{u.email}</p>
                  <p className="text-xs text-navy-text/40">Joined {formatLongDate(u.createdAt)}</p>
                </div>
                <div className="flex shrink-0 flex-wrap items-center gap-1">
                  <button
                    type="button"
                    onClick={() => {
                      setError(null)
                      setEditForm({ name: u.name, email: u.email })
                      setEditFor(u)
                    }}
                    className="rounded-lg p-2 text-navy-text/60 transition-colors hover:bg-beige hover:text-navy-text"
                    aria-label={`Edit ${u.name}`}
                    title="Edit details"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setError(null)
                      setNewPassword("")
                      setPasswordFor(u)
                    }}
                    className="rounded-lg p-2 text-navy-text/60 transition-colors hover:bg-beige hover:text-navy-text"
                    aria-label={`Reset password for ${u.name}`}
                    title="Reset password"
                  >
                    <KeyRound className="h-4 w-4" />
                  </button>
                  {!isSelf ? (
                    <>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => run(() => setUserRole(u.id, isSuper ? "admin" : "superadmin"))}
                        className="rounded-lg p-2 text-navy-text/60 transition-colors hover:bg-beige hover:text-navy-text"
                        aria-label={isSuper ? "Demote to admin" : "Promote to super admin"}
                        title={isSuper ? "Demote to admin" : "Promote to super admin"}
                      >
                        {isSuper ? <Shield className="h-4 w-4" /> : <ShieldCheck className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => run(() => setUserBanned(u.id, !u.banned))}
                        className="rounded-lg p-2 text-navy-text/60 transition-colors hover:bg-beige hover:text-navy-text"
                        aria-label={u.banned ? "Restore access" : "Suspend user"}
                        title={u.banned ? "Restore access" : "Suspend access"}
                      >
                        {u.banned ? <CircleCheck className="h-4 w-4" /> : <Ban className="h-4 w-4" />}
                      </button>
                      <button
                        type="button"
                        disabled={isPending}
                        onClick={() => {
                          if (confirm(`Delete ${u.name}? This cannot be undone.`)) {
                            run(() => removeAdminUser(u.id))
                          }
                        }}
                        className="rounded-lg p-2 text-awaj-red/70 transition-colors hover:bg-awaj-red/10 hover:text-awaj-red"
                        aria-label={`Delete ${u.name}`}
                        title="Delete user"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </>
                  ) : null}
                </div>
              </li>
            )
          })}
        </ul>
      </div>

      {/* Create user drawer */}
      {showCreate ? (
        <Drawer title="New admin user" onClose={() => setShowCreate(false)}>
          <form onSubmit={handleCreate} className="flex flex-1 flex-col gap-4 p-6">
            <Field label="Full name">
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
            </Field>
            <Field label="Temporary password">
              <Input
                type="text"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 8 characters"
                required
              />
            </Field>
            <Field label="Role">
              <select
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as "admin" | "superadmin" })}
                className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text"
              >
                <option value="admin">Admin (content editor)</option>
                <option value="superadmin">Super admin (manages users)</option>
              </select>
            </Field>
            {error ? (
              <p className="text-sm text-awaj-red" role="alert">
                {error}
              </p>
            ) : null}
            <DrawerActions isPending={isPending} onCancel={() => setShowCreate(false)} submitLabel="Create user" />
          </form>
        </Drawer>
      ) : null}

      {/* Edit user drawer */}
      {editFor ? (
        <Drawer title="Edit admin user" onClose={() => setEditFor(null)}>
          <form onSubmit={handleEdit} className="flex flex-1 flex-col gap-4 p-6">
            <Field label="Full name">
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                required
              />
            </Field>
            <Field label="Email">
              <Input
                type="email"
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                required
              />
            </Field>
            {error ? (
              <p className="text-sm text-awaj-red" role="alert">
                {error}
              </p>
            ) : null}
            <DrawerActions isPending={isPending} onCancel={() => setEditFor(null)} submitLabel="Save changes" />
          </form>
        </Drawer>
      ) : null}

      {/* Reset password drawer */}
      {passwordFor ? (
        <Drawer title={`Reset password`} onClose={() => setPasswordFor(null)}>
          <form onSubmit={handleSetPassword} className="flex flex-1 flex-col gap-4 p-6">
            <p className="text-sm text-navy-text/70">
              Set a new password for <span className="font-semibold text-navy-text">{passwordFor.email}</span>. Share it
              with them securely.
            </p>
            <Field label="New password">
              <Input
                type="text"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 8 characters"
                required
              />
            </Field>
            {error ? (
              <p className="text-sm text-awaj-red" role="alert">
                {error}
              </p>
            ) : null}
            <DrawerActions isPending={isPending} onCancel={() => setPasswordFor(null)} submitLabel="Update password" />
          </form>
        </Drawer>
      ) : null}
    </div>
  )
}

function Drawer({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy/40" onClick={onClose}>
      <div
        className="flex h-full w-full max-w-md flex-col overflow-y-auto bg-ivory shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gold/20 px-6 py-4">
          <h2 className="font-serif text-xl font-bold text-navy-text">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-navy-text/60 hover:bg-beige"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  )
}

function DrawerActions({
  isPending,
  onCancel,
  submitLabel,
}: {
  isPending: boolean
  onCancel: () => void
  submitLabel: string
}) {
  return (
    <div className="mt-auto flex gap-3 pt-2">
      <Button type="button" variant="outline" onClick={onCancel} className="flex-1 rounded-full">
        Cancel
      </Button>
      <Button
        type="submit"
        disabled={isPending}
        className="flex-1 rounded-full bg-navy text-white hover:bg-navy/90"
      >
        {isPending ? "Saving..." : submitLabel}
      </Button>
    </div>
  )
}
