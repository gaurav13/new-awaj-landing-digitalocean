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
import { ImageUpload } from "./image-upload"
import { MultiImageUpload } from "./multi-image-upload"
import { RichTextEditor } from "./rich-text-editor"
import { resolveImageUrl } from "@/lib/images"
import { ORGANIZATION_TYPES, type GalleryItem } from "@/lib/db/schema"

export type FieldType =
  | "text"
  | "textarea"
  | "date"
  | "select"
  | "checkbox"
  | "number"
  | "image"
  | "richtext"
  | "repeater"
  | "gallery"
  | "people"
  | "organizations"

export type PeopleOption = { id: number; name: string; subtitle?: string }
export type OrganizationOption = { id: number; name: string; subtitle?: string }

export type RepeaterSubField = {
  name: string
  label: string
  type: "text" | "textarea" | "image"
  placeholder?: string
}

export type FieldDef = {
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: string[]
  optionItems?: { value: string; label: string }[]
  itemFields?: RepeaterSubField[]
  addLabel?: string
  hint?: string
  full?: boolean
  rows?: number
}

export type ColumnRender<T> = {
  image?: (item: T) => string | null
  badge?: (item: T) => string | null
  meta?: (item: T) => string
  title: (item: T) => string
  viewHref?: (item: T) => string | null | undefined
}

type Props<T extends { id: number }> = {
  title: string
  singular: string
  items: T[]
  fields: FieldDef[]
  toForm: (item: T) => Record<string, any>
  emptyForm: Record<string, any>
  render: ColumnRender<T>
  onCreate: (data: any) => Promise<void>
  onUpdate: (id: number, data: any) => Promise<void>
  onDelete: (id: number) => Promise<void>
  peopleOptions?: PeopleOption[]
  organizationOptions?: OrganizationOption[]
  /** Create a new organization inline; returns the created/existing option to select. */
  onQuickCreateOrganization?: (input: {
    name: string
    type?: string
  }) => Promise<{ id: number; name: string; subtitle: string | null; duplicate: boolean }>
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
  peopleOptions = [],
  organizationOptions = [],
  onQuickCreateOrganization,
}: Props<T>) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState<T | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<Record<string, any>>(emptyForm)
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
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "string"
              ? err
              : "Something went wrong. Please try again."
        console.log("[v0] admin save error:", message)
        setError(message)
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm(`Delete this ${singular.toLowerCase()}? This cannot be undone.`)) return
    startTransition(async () => {
      try {
        await onDelete(id)
        router.refresh()
      } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to delete. Please try again."
        console.log("[v0] admin delete error:", message)
        setError(message)
      }
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
                    {img ? (
                      <img
                        src={resolveImageUrl(img) || "/placeholder.svg"}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
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
                      {f.hint ? <p className="-mt-1 text-xs text-navy-text/55">{f.hint}</p> : null}
                      <select
                        id={f.name}
                        value={String(form[f.name] ?? "")}
                        onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                        className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text"
                      >
                        {f.optionItems
                          ? f.optionItems.map((o) => (
                              <option key={o.value} value={o.value}>
                                {o.label}
                              </option>
                            ))
                          : (f.options ?? []).map((o) => (
                              <option key={o} value={o}>
                                {o}
                              </option>
                            ))}
                      </select>
                    </div>
                  )
                }
                if (f.type === "repeater") {
                  return (
                    <RepeaterField
                      key={f.name}
                      field={f}
                      value={Array.isArray(form[f.name]) ? form[f.name] : []}
                      onChange={(rows) => setForm({ ...form, [f.name]: rows })}
                    />
                  )
                }
                if (f.type === "people") {
                  return (
                    <PeopleSelectField
                      key={f.name}
                      field={f}
                      options={peopleOptions}
                      value={Array.isArray(form[f.name]) ? (form[f.name] as number[]) : []}
                      onChange={(ids) => setForm({ ...form, [f.name]: ids })}
                    />
                  )
                }
                if (f.type === "organizations") {
                  return (
                    <OrganizationSelectField
                      key={f.name}
                      field={f}
                      options={organizationOptions}
                      value={Array.isArray(form[f.name]) ? (form[f.name] as number[]) : []}
                      onChange={(ids) => setForm({ ...form, [f.name]: ids })}
                      onQuickCreate={onQuickCreateOrganization}
                    />
                  )
                }
                if (f.type === "image") {
                  return (
                    <div key={f.name} className="flex flex-col gap-2">
                      <Label>{f.label}</Label>
                      {f.hint ? <p className="-mt-1 text-xs text-navy-text/55">{f.hint}</p> : null}
                      <ImageUpload
                        value={String(form[f.name] ?? "")}
                        onChange={(url) => setForm({ ...form, [f.name]: url })}
                      />
                    </div>
                  )
                }
                if (f.type === "gallery") {
                  return (
                    <div key={f.name} className="flex flex-col gap-2">
                      <Label>{f.label}</Label>
                      {f.hint ? <p className="-mt-1 text-xs text-navy-text/55">{f.hint}</p> : null}
                      <MultiImageUpload
                        value={Array.isArray(form[f.name]) ? (form[f.name] as GalleryItem[]) : []}
                        onChange={(photos) => setForm({ ...form, [f.name]: photos })}
                      />
                    </div>
                  )
                }
                if (f.type === "richtext") {
                  return (
                    <div key={f.name} className="flex flex-col gap-2">
                      <Label>{f.label}</Label>
                      {f.hint ? <p className="-mt-1 text-xs text-navy-text/55">{f.hint}</p> : null}
                      <RichTextEditor
                        value={String(form[f.name] ?? "")}
                        onChange={(html) => setForm({ ...form, [f.name]: html })}
                        placeholder={f.placeholder}
                      />
                    </div>
                  )
                }
                if (f.type === "textarea") {
                  return (
                    <div key={f.name} className="flex flex-col gap-2">
                      <Label htmlFor={f.name}>{f.label}</Label>
                      {f.hint ? <p className="-mt-1 text-xs text-navy-text/55">{f.hint}</p> : null}
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
                    {f.hint ? <p className="-mt-1 text-xs text-navy-text/55">{f.hint}</p> : null}
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

function RepeaterField({
  field,
  value,
  onChange,
}: {
  field: FieldDef
  value: Record<string, string>[]
  onChange: (rows: Record<string, string>[]) => void
}) {
  const subFields = field.itemFields ?? []

  function emptyRow() {
    const row: Record<string, string> = {}
    for (const sf of subFields) row[sf.name] = ""
    return row
  }

  function update(index: number, key: string, val: string) {
    const next = value.map((row, i) => (i === index ? { ...row, [key]: val } : row))
    onChange(next)
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gold/25 bg-white/60 p-4">
      <div className="flex items-center justify-between">
        <Label>{field.label}</Label>
        <span className="text-xs text-navy-text/50">{value.length} item{value.length === 1 ? "" : "s"}</span>
      </div>
      {field.hint ? <p className="-mt-1 text-xs text-navy-text/55">{field.hint}</p> : null}

      {value.map((row, index) => (
        <div key={index} className="relative rounded-lg border border-gold/20 bg-beige/30 p-3">
          <button
            type="button"
            onClick={() => onChange(value.filter((_, i) => i !== index))}
            className="absolute right-2 top-2 rounded-md p-1 text-awaj-red/70 hover:bg-awaj-red/10 hover:text-awaj-red"
            aria-label="Remove item"
          >
            <Trash2 className="h-3.5 w-3.5" />
          </button>
          <div className="flex flex-col gap-2.5 pr-6">
            {subFields.map((sf) => {
              if (sf.type === "image") {
                return (
                  <div key={sf.name} className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-navy-text/70">{sf.label}</span>
                    <ImageUpload value={row[sf.name] ?? ""} onChange={(url) => update(index, sf.name, url)} />
                  </div>
                )
              }
              if (sf.type === "textarea") {
                return (
                  <div key={sf.name} className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-navy-text/70">{sf.label}</span>
                    <Textarea
                      value={row[sf.name] ?? ""}
                      onChange={(e) => update(index, sf.name, e.target.value)}
                      rows={2}
                      placeholder={sf.placeholder}
                    />
                  </div>
                )
              }
              return (
                <div key={sf.name} className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-navy-text/70">{sf.label}</span>
                  <Input
                    value={row[sf.name] ?? ""}
                    onChange={(e) => update(index, sf.name, e.target.value)}
                    placeholder={sf.placeholder}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        onClick={() => onChange([...value, emptyRow()])}
        className="rounded-full border-gold/40 text-navy-text"
      >
        <Plus className="mr-1.5 h-4 w-4" />
        {field.addLabel ?? "Add item"}
      </Button>
    </div>
  )
}

function PeopleSelectField({
  field,
  options,
  value,
  onChange,
}: {
  field: FieldDef
  options: PeopleOption[]
  value: number[]
  onChange: (ids: number[]) => void
}) {
  const [query, setQuery] = useState("")
  const selected = new Set(value)
  const filtered = options.filter(
    (o) =>
      !query.trim() ||
      `${o.name} ${o.subtitle ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  )

  function toggle(id: number) {
    onChange(selected.has(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gold/25 bg-white/60 p-4">
      <div className="flex items-center justify-between">
        <Label>{field.label}</Label>
        <span className="text-xs text-navy-text/50">
          {value.length} selected
        </span>
      </div>
      {field.hint ? <p className="-mt-1 text-xs text-navy-text/55">{field.hint}</p> : null}
      {options.length === 0 ? (
        <p className="text-xs text-navy-text/55">No people yet. Add people in the People tab first.</p>
      ) : (
        <>
          <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search people..." />
          <div className="max-h-56 overflow-y-auto rounded-lg border border-gold/20 bg-white">
            <ul className="divide-y divide-gold/10">
              {filtered.map((o) => (
                <li key={o.id}>
                  <label className="flex cursor-pointer items-center gap-2.5 px-3 py-2 hover:bg-beige/40">
                    <input
                      type="checkbox"
                      checked={selected.has(o.id)}
                      onChange={() => toggle(o.id)}
                      className="h-4 w-4 rounded border-input accent-awaj-red"
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-navy-text">{o.name}</span>
                      {o.subtitle ? (
                        <span className="block truncate text-xs text-navy-text/55">{o.subtitle}</span>
                      ) : null}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  )
}

function OrganizationSelectField({
  field,
  options,
  value,
  onChange,
  onQuickCreate,
}: {
  field: FieldDef
  options: OrganizationOption[]
  value: number[]
  onChange: (ids: number[]) => void
  onQuickCreate?: (input: {
    name: string
    type?: string
  }) => Promise<{ id: number; name: string; subtitle: string | null; duplicate: boolean }>
}) {
  // Local mirror of the options so newly-created organizations appear immediately.
  const [localOptions, setLocalOptions] = useState<OrganizationOption[]>(options)
  const [query, setQuery] = useState("")
  const [adding, setAdding] = useState(false)
  const [newName, setNewName] = useState("")
  const [newType, setNewType] = useState<string>("Partner")
  const [creating, setCreating] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [createError, setCreateError] = useState<string | null>(null)

  const selected = new Set(value)
  const filtered = localOptions.filter(
    (o) => !query.trim() || `${o.name} ${o.subtitle ?? ""}`.toLowerCase().includes(query.toLowerCase()),
  )

  function toggle(id: number) {
    onChange(selected.has(id) ? value.filter((v) => v !== id) : [...value, id])
  }

  async function handleCreate() {
    if (!onQuickCreate || !newName.trim()) return
    setCreating(true)
    setCreateError(null)
    setNotice(null)
    try {
      const created = await onQuickCreate({ name: newName.trim(), type: newType })
      setLocalOptions((prev) =>
        prev.some((o) => o.id === created.id)
          ? prev
          : [...prev, { id: created.id, name: created.name, subtitle: created.subtitle ?? undefined }],
      )
      if (!selected.has(created.id)) onChange([...value, created.id])
      setNotice(
        created.duplicate
          ? `"${created.name}" already exists - selected the existing entry.`
          : `Added "${created.name}" to the central directory.`,
      )
      setNewName("")
      setAdding(false)
    } catch (err) {
      setCreateError(err instanceof Error ? err.message : "Could not create organization.")
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-gold/25 bg-white/60 p-4">
      <div className="flex items-center justify-between">
        <Label>{field.label}</Label>
        <span className="text-xs text-navy-text/50">{value.length} selected</span>
      </div>
      {field.hint ? <p className="-mt-1 text-xs text-navy-text/55">{field.hint}</p> : null}

      <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search organizations..." />

      <div className="max-h-56 overflow-y-auto rounded-lg border border-gold/20 bg-white">
        {filtered.length === 0 ? (
          <p className="px-3 py-3 text-xs text-navy-text/55">
            No organizations found. Add one below to save it to the central directory.
          </p>
        ) : (
          <ul className="divide-y divide-gold/10">
            {filtered.map((o) => (
              <li key={o.id}>
                <label className="flex cursor-pointer items-center gap-2.5 px-3 py-2 hover:bg-beige/40">
                  <input
                    type="checkbox"
                    checked={selected.has(o.id)}
                    onChange={() => toggle(o.id)}
                    className="h-4 w-4 rounded border-input accent-awaj-red"
                  />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium text-navy-text">{o.name}</span>
                    {o.subtitle ? (
                      <span className="block truncate text-xs text-navy-text/55">{o.subtitle}</span>
                    ) : null}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        )}
      </div>

      {notice ? <p className="text-xs text-navy-text/70">{notice}</p> : null}

      {onQuickCreate ? (
        adding ? (
          <div className="flex flex-col gap-2 rounded-lg border border-gold/25 bg-beige/30 p-3">
            <Input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="New organization name"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  handleCreate()
                }
              }}
            />
            <select
              value={newType}
              onChange={(e) => setNewType(e.target.value)}
              className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text"
            >
              {ORGANIZATION_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
            {createError ? <p className="text-xs text-awaj-red">{createError}</p> : null}
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={handleCreate}
                disabled={creating || !newName.trim()}
                className="flex-1 rounded-full bg-navy text-white hover:bg-navy/90"
              >
                {creating ? "Adding..." : "Add & select"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAdding(false)
                  setCreateError(null)
                }}
                className="rounded-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setAdding(true)
              setNewName(query)
            }}
            className="rounded-full border-gold/40 text-navy-text"
          >
            <Plus className="mr-1.5 h-4 w-4" />
            Add new organization
          </Button>
        )
      ) : null}
    </div>
  )
}
