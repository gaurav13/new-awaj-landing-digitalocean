"use client"

import type React from "react"
import { useState, useTransition } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Plus, Pencil, Trash2, LogOut, ExternalLink, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Logo } from "@/components/awaj/logo"
import { authClient } from "@/lib/auth-client"
import { createNews, updateNews, deleteNews } from "@/app/actions/news"
import { formatLongDate } from "@/lib/format-date"

type Article = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  imageUrl: string | null
  location: string | null
  publishedAt: Date | string
}

const CATEGORIES = ["News", "Partnerships", "Programs", "Events", "Announcements"]

const EMPTY = {
  title: "",
  excerpt: "",
  content: "",
  category: "News",
  location: "",
  imageUrl: "",
  publishedAt: "",
}

export function AdminDashboard({ articles, userName }: { articles: Article[]; userName: string }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [editing, setEditing] = useState<Article | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY)
  const [error, setError] = useState<string | null>(null)

  function openCreate() {
    setEditing(null)
    setForm(EMPTY)
    setError(null)
    setShowForm(true)
  }

  function openEdit(a: Article) {
    setEditing(a)
    setForm({
      title: a.title,
      excerpt: a.excerpt,
      content: a.content,
      category: a.category,
      location: a.location ?? "",
      imageUrl: a.imageUrl ?? "",
      publishedAt: new Date(a.publishedAt).toISOString().slice(0, 10),
    })
    setError(null)
    setShowForm(true)
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (!form.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setError("Title, excerpt, and content are required.")
      return
    }
    startTransition(async () => {
      try {
        if (editing) {
          await updateNews(editing.id, form)
        } else {
          await createNews(form)
        }
        setShowForm(false)
        setForm(EMPTY)
        setEditing(null)
        router.refresh()
      } catch {
        setError("Something went wrong. Please try again.")
      }
    })
  }

  function handleDelete(id: number) {
    if (!confirm("Delete this article? This cannot be undone.")) return
    startTransition(async () => {
      await deleteNews(id)
      router.refresh()
    })
  }

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <main className="min-h-svh bg-ivory">
      {/* Top bar */}
      <header className="border-b border-gold/20 bg-navy">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 lg:px-8">
          <Logo variant="light" />
          <div className="flex items-center gap-3">
            <Link
              href="/news"
              className="hidden items-center gap-1.5 text-sm font-medium text-white/80 transition-colors hover:text-gold sm:flex"
            >
              View site
              <ExternalLink className="h-4 w-4" />
            </Link>
            <button
              type="button"
              onClick={handleSignOut}
              className="flex items-center gap-2 rounded-full border border-white/20 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1200px] px-5 py-8 lg:px-8">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Admin Dashboard</p>
            <h1 className="mt-1 font-serif text-3xl font-bold text-navy-text">News Manager</h1>
            <p className="mt-1 text-sm text-navy-text/60">
              Welcome back, {userName}. You have {articles.length} article{articles.length === 1 ? "" : "s"} published.
            </p>
          </div>
          <Button onClick={openCreate} className="rounded-full bg-awaj-red text-white hover:bg-awaj-red/90">
            <Plus className="mr-1.5 h-4 w-4" />
            New Article
          </Button>
        </div>

        {/* List */}
        <div className="mt-8 overflow-hidden rounded-2xl border border-gold/20 bg-white">
          {articles.length === 0 ? (
            <div className="p-12 text-center">
              <h2 className="font-serif text-xl font-bold text-navy-text">No articles yet</h2>
              <p className="mt-2 text-sm text-navy-text/60">Create your first news article to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gold/15">
              {articles.map((a) => (
                <li key={a.id} className="flex items-center gap-4 p-4 hover:bg-beige/30">
                  <div className="h-14 w-20 shrink-0 overflow-hidden rounded-lg bg-beige">
                    {a.imageUrl ? (
                      <img src={a.imageUrl || "/placeholder.svg"} alt="" className="h-full w-full object-cover" />
                    ) : null}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-beige px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-navy-text/70">
                        {a.category}
                      </span>
                      <span className="text-xs text-navy-text/50">{formatLongDate(a.publishedAt)}</span>
                    </div>
                    <h3 className="mt-1 truncate font-semibold text-navy-text">{a.title}</h3>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Link
                      href={`/news/${a.slug}`}
                      className="rounded-lg p-2 text-navy-text/60 transition-colors hover:bg-beige hover:text-navy-text"
                      aria-label="View article"
                    >
                      <ExternalLink className="h-4 w-4" />
                    </Link>
                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      className="rounded-lg p-2 text-navy-text/60 transition-colors hover:bg-beige hover:text-navy-text"
                      aria-label="Edit article"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(a.id)}
                      className="rounded-lg p-2 text-awaj-red/70 transition-colors hover:bg-awaj-red/10 hover:text-awaj-red"
                      aria-label="Delete article"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Form drawer */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex justify-end bg-navy/40" onClick={() => setShowForm(false)}>
          <div
            className="flex h-full w-full max-w-lg flex-col overflow-y-auto bg-ivory shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between border-b border-gold/20 px-6 py-4">
              <h2 className="font-serif text-xl font-bold text-navy-text">
                {editing ? "Edit Article" : "New Article"}
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
              <div className="flex flex-col gap-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="h-9 rounded-md border border-input bg-white px-3 text-sm text-navy-text"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="publishedAt">Publish date</Label>
                  <Input
                    id="publishedAt"
                    type="date"
                    value={form.publishedAt}
                    onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="location">Location (optional)</Label>
                <Input
                  id="location"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  placeholder="Tokyo, Japan"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="imageUrl">Image URL (optional)</Label>
                <Input
                  id="imageUrl"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  placeholder="/images/news-1.png"
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="excerpt">Excerpt</Label>
                <Textarea
                  id="excerpt"
                  value={form.excerpt}
                  onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
                  rows={2}
                  required
                />
              </div>

              <div className="flex flex-col gap-2">
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={form.content}
                  onChange={(e) => setForm({ ...form, content: e.target.value })}
                  rows={8}
                  placeholder="Full article body. Separate paragraphs with a blank line."
                  required
                />
              </div>

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
    </main>
  )
}
