"use client"

import type React from "react"
import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export type FieldType = "text" | "textarea" | "date" | "select" | "checkbox" | "number"

export type FieldDef = {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: string[]
  full?: boolean
  rows?: number
}

export type ColumnRender<T> = {
  image?: (item: T) => string | null
  badge?: (item: T) => string | null
  meta?: (item: T) => string
  title: (item: T) => string
  viewHref?: (item: T) => string
}

type Props<T extends { id: number }> = {
  title: string
  singular: string
  items: T[]
  fields: FieldDef[]
  toForm: (item: T) => Record<string, string | boolean | number>
  emptyForm: Record<string, string | boolean | number>
  render: ColumnRender<T>
  onCreate: (data: any) => Promise<void>
  onUpdate: (id: number, data: any) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

export function ResourceManager<T extends { id: number }>({
  title,
  singular,
  items,
  fields,
  toForm,
  emptyForm,
  render,
  onCreate,
  onUpdate,
  onDelete,
}: Props<T>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState<T | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Record<string, string | boolean | number>>(emptyForm)
  const [error, setError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(emptyForm)
    setError(null)
    setShowForm(true)
  }

  function openEdit(item: T) {
    setEditing(item)
    setForm(toForm(item))
    setError(null)
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    for (const f of fields) {
      if (f.required && typeof form[f.name] === "string" && !(form[f.name] as string).trim()) {
        setError(`${f.label} is required.`)
        return
      }
    }
    startTransition(async () => {
      try {
        if (editing) {
          await onUpdate(editing.id, form)
        } else {
          await onCreate(form)
        }
        setShowForm(false)
        setForm(emptyForm)
        setEditing(null)
        router.refresh()
      } catch {
        setError("Something went wrong. Please try again.")
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm(`Delete this ${singular.toLowerCase()}? This cannot be undone.`)) return
    startTransition(async () => {
      await onDelete(id)
      router.refresh()
    })
  }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-navy-text">{title}</h2>
          <p className="mt-1 text-sm text-navy-text/60">
            {items.length} {singular.toLowerCase()}
            {items.length === 1 ? "" : "s"} total.
          </p>
        </div>
        <Button onClick={openCreate} className="rounded-full bg-awaj-red text-white hover:bg-awaj-red/90">
          <Plus className="mr-1.5 h-4 w-4" />
          New {singular}
        </Button>
      </div>

      <div className="mt-6 overflow-hidden rounded-2xl border border-gold/20 bg-white">
        {items.length === 0 ? (
          <div className="p-12 text-center">
            <h3 className="font-serif text-lg font-bold text-navy-text">No {title.toLowerCase()} yet</h3>
            <p className="mt-2 text-sm text-navy-text/60">Create your first {singular.toLowerCase()} to get started.</p>
          </div>
        ) : (
          <ul className="divide-y divide-gold/15">
            {items.map((item) => {
              const img = render.image?.(item)
              const badge = render.badge?.(item)
              const viewHref = render.viewHref?.(item)
              return (
                <li key={item.id} className="flex items-center gap-4 p-4 hover:bg-beige/30">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-beige">
                    {img ? <img src={img || "/placeholder.svg"} alt="" className="h-full w-full object-cover" /> : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {badge ? (
                        <span className="rounded-full bg-beige px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy-text/70">
                          {badge}
                        </span>
                      ) : null}
                      <span className="text-xs text-navy-text/50">{render.meta?.(item)}</span>
                    </div>
                    <h3 className="mt-1 truncate font-semibold text-navy-text">{render.title(item)}</h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {viewHref ? (
                      <Link
                        href={viewHref}
                        className="rounded-lg p-2 text-navy-text/60 transition-colors hover:bg-beige hover:text-navy-text"
                        aria-label="View"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Link>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className="rounded-lg p-2 text-navy-text/60 transition-colors hover:bg-beige hover:text-navy-text"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id)}
                      className="rounded-lg p-2 text-awaj-red/70 transition-colors hover:bg-awaj-red/10 hover:text-awaj-red"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy/40" onClick={() => setShowForm(false)}>
          <div
            className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-ivory shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gold/20 px-6 py-4">
              <h2 className="font-serif text-xl font-bold text-navy-text">
                {editing ? `Edit ${singular}` : `New ${singular}`}
              </h2>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="rounded-lg p-1.5 text-navy-text/60 hover:bg-beige"
                aria-label="Close"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-4 p-6">
              {fields.map((f) => {
                if (f.type === "checkbox") {
                  return (
                    <label key={f.name} className="flex items-center gap-2.5">
                      <input
                        type="checkbox"
                        checked={Boolean(form[f.name])}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.checked })}
                        className="h-4 w-4 rounded border-input accent-awaj-red"
                      />
                      <span className="text-sm font-medium text-navy-text">{f.label}</span>
                    </label>
                  )
                }
                if (f.type === "select") {
                  return (
                    <div key={f.name} className="flex flex-col gap-2">
                      <Label htmlFor={f.name}>{f.label}</Label>
                      <select
                        id={f.name}
                        value={String(form[f.name] ?? "")}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text"
                      >
                        {(f.options ?? []).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                  )
                }
                if (f.type === "textarea") {
                  return (
                    <div key={f.name} className="flex flex-col gap-2">
                      <Label htmlFor={f.name}>{f.label}</Label>
                      <Textarea
                        id={f.name}
                        value={String(form[f.name] ?? "")}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        rows={f.rows ?? 4}
                        placeholder={f.placeholder}
                        required={f.required}
                      />
                    </div>
                  )
                }
                return (
                  <div key={f.name} className="flex flex-col gap-2">
                    <Label htmlFor={f.name}>{f.label}</Label>
                    <Input
                      id={f.name}
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                      value={String(form[f.name] ?? "")}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          [f.name]: f.type === "number" ? Number(e.target.value) : e.target.value,
                        })
                      }
                      placeholder={f.placeholder}
                      required={f.required}
                    />
                  </div>
                )
              })}

              {error && (
                <p className="text-sm text-awaj-red" role="alert">
                  {error}
                </p>
              )}

              <div className="mt-auto flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  className="flex-1 rounded-full"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="flex-1 rounded-full bg-navy text-white hover:bg-navy/90"
                >
                  {isPending ? "Saving..." : editing ? "Save changes" : "Publish"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
