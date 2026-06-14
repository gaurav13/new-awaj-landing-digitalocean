"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { LogOut, ExternalLink } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/awaj/logo"
import { authClient } from "@/lib/auth-client"
import { formatLongDate } from "@/lib/format-date"
import { ResourceManager, type FieldDef } from "./resource-manager"
import { createNews, updateNews, deleteNews } from "@/app/actions/news"
import { createEvent, updateEvent, deleteEvent } from "@/app/actions/events"
import { createProgram, updateProgram, deleteProgram } from "@/app/actions/programs"
import { createTeamMember, updateTeamMember, deleteTeamMember } from "@/app/actions/team"

type News = {
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
type Event = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  eventDate: string
  timeLabel: string | null
  location: string | null
  imageUrl: string | null
  isFeatured: boolean
}
type Program = {
  id: number
  title: string
  slug: string
  excerpt: string
  content: string
  icon: string
  regions: string | null
  imageUrl: string | null
  sortOrder: number
}
type Team = {
  id: number
  name: string
  role: string
  bio: string | null
  imageUrl: string | null
  linkedinUrl: string | null
  sortOrder: number
}

const NEWS_CATEGORIES = ["News", "Partnerships", "Programs", "Events", "Announcements"]
const PROGRAM_ICONS = ["Rocket", "Building2", "Share2", "Globe", "GraduationCap", "Users", "Award", "Landmark"]

const NEWS_FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "category", label: "Category", type: "select", options: NEWS_CATEGORIES },
  { name: "publishedAt", label: "Publish date", type: "date" },
  { name: "location", label: "Location (optional)", type: "text", placeholder: "Tokyo, Japan" },
  { name: "imageUrl", label: "Image URL (optional)", type: "text", placeholder: "/images/news-1.png" },
  { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 2 },
  {
    name: "content",
    label: "Content",
    type: "textarea",
    required: true,
    rows: 8,
    placeholder: "Full article body. Separate paragraphs with a blank line.",
  },
]

const EVENT_FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "eventDate", label: "Event date", type: "date", required: true },
  { name: "timeLabel", label: "Time / detail (optional)", type: "text", placeholder: "12:00 PM – 4:30 PM (JST)" },
  { name: "location", label: "Location (optional)", type: "text", placeholder: "Tokyo Headquarters" },
  { name: "imageUrl", label: "Image URL (optional)", type: "text", placeholder: "/images/event-night.png" },
  { name: "isFeatured", label: "Feature this event on the homepage", type: "checkbox" },
  { name: "excerpt", label: "Excerpt", type: "textarea", required: true, rows: 2 },
  { name: "content", label: "Content", type: "textarea", required: true, rows: 8 },
]

const PROGRAM_FIELDS: FieldDef[] = [
  { name: "title", label: "Title", type: "text", required: true },
  { name: "icon", label: "Icon", type: "select", options: PROGRAM_ICONS },
  { name: "regions", label: "Regions (optional)", type: "text", placeholder: "Japan • Singapore • USA • UAE" },
  { name: "imageUrl", label: "Image URL (optional)", type: "text", placeholder: "/images/prog-city.png" },
  { name: "sortOrder", label: "Sort order", type: "number" },
  { name: "excerpt", label: "Short summary", type: "textarea", required: true, rows: 3 },
  { name: "content", label: "Full description", type: "textarea", required: true, rows: 6 },
]

const TEAM_FIELDS: FieldDef[] = [
  { name: "name", label: "Name", type: "text", required: true },
  { name: "role", label: "Role / title", type: "text", required: true, placeholder: "Founder & CEO" },
  { name: "imageUrl", label: "Photo URL (optional)", type: "text", placeholder: "/images/team-1.png" },
  { name: "linkedinUrl", label: "LinkedIn URL (optional)", type: "text", placeholder: "https://linkedin.com/in/..." },
  { name: "sortOrder", label: "Sort order", type: "number" },
  { name: "bio", label: "Bio (optional)", type: "textarea", rows: 4 },
]

export function AdminDashboard({
  userName,
  news,
  events,
  programs,
  team,
}: {
  userName: string
  news: News[]
  events: Event[]
  programs: Program[]
  team: Team[]
}) {
  const router = useRouter()

  async function handleSignOut() {
    await authClient.signOut()
    router.push("/sign-in")
    router.refresh()
  }

  return (
    <main className="min-h-svh bg-ivory">
      <header className="border-b border-gold/20 bg-navy">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between px-5 py-4 lg:px-8">
          <Logo variant="light" />
          <div className="flex items-center gap-3">
            <Link
              href="/"
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
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">Admin Dashboard</p>
        <h1 className="mt-1 font-serif text-3xl font-bold text-navy-text">Content Manager</h1>
        <p className="mt-1 text-sm text-navy-text/60">Welcome back, {userName}. Manage all site content below.</p>

        <Tabs defaultValue="news" className="mt-8">
          <TabsList className="bg-beige">
            <TabsTrigger value="news">News ({news.length})</TabsTrigger>
            <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
            <TabsTrigger value="programs">Programs ({programs.length})</TabsTrigger>
            <TabsTrigger value="team">Team ({team.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="news" className="mt-6">
            <ResourceManager<News>
              title="News"
              singular="Article"
              items={news}
              fields={NEWS_FIELDS}
              emptyForm={{
                title: "",
                excerpt: "",
                content: "",
                category: "News",
                location: "",
                imageUrl: "",
                publishedAt: "",
              }}
              toForm={(a) => ({
                title: a.title,
                excerpt: a.excerpt,
                content: a.content,
                category: a.category,
                location: a.location ?? "",
                imageUrl: a.imageUrl ?? "",
                publishedAt: new Date(a.publishedAt).toISOString().slice(0, 10),
              })}
              render={{
                image: (a) => a.imageUrl,
                badge: (a) => a.category,
                meta: (a) => formatLongDate(a.publishedAt),
                title: (a) => a.title,
                viewHref: (a) => `/news/${a.slug}`,
              }}
              onCreate={(d) => createNews(d)}
              onUpdate={(id, d) => updateNews(id, d)}
              onDelete={(id) => deleteNews(id)}
            />
          </TabsContent>

          <TabsContent value="events" className="mt-6">
            <ResourceManager<Event>
              title="Events"
              singular="Event"
              items={events}
              fields={EVENT_FIELDS}
              emptyForm={{
                title: "",
                excerpt: "",
                content: "",
                eventDate: "",
                timeLabel: "",
                location: "",
                imageUrl: "",
                isFeatured: false,
              }}
              toForm={(e) => ({
                title: e.title,
                excerpt: e.excerpt,
                content: e.content,
                eventDate: e.eventDate,
                timeLabel: e.timeLabel ?? "",
                location: e.location ?? "",
                imageUrl: e.imageUrl ?? "",
                isFeatured: e.isFeatured,
              })}
              render={{
                image: (e) => e.imageUrl,
                badge: (e) => (e.isFeatured ? "Featured" : null),
                meta: (e) => formatLongDate(e.eventDate),
                title: (e) => e.title,
                viewHref: (e) => `/events/${e.slug}`,
              }}
              onCreate={(d) => createEvent(d)}
              onUpdate={(id, d) => updateEvent(id, d)}
              onDelete={(id) => deleteEvent(id)}
            />
          </TabsContent>

          <TabsContent value="programs" className="mt-6">
            <ResourceManager<Program>
              title="Programs"
              singular="Program"
              items={programs}
              fields={PROGRAM_FIELDS}
              emptyForm={{
                title: "",
                excerpt: "",
                content: "",
                icon: "Rocket",
                regions: "",
                imageUrl: "",
                sortOrder: 0,
              }}
              toForm={(p) => ({
                title: p.title,
                excerpt: p.excerpt,
                content: p.content,
                icon: p.icon,
                regions: p.regions ?? "",
                imageUrl: p.imageUrl ?? "",
                sortOrder: p.sortOrder,
              })}
              render={{
                image: (p) => p.imageUrl,
                badge: (p) => p.icon,
                meta: (p) => p.regions ?? "",
                title: (p) => p.title,
              }}
              onCreate={(d) => createProgram(d)}
              onUpdate={(id, d) => updateProgram(id, d)}
              onDelete={(id) => deleteProgram(id)}
            />
          </TabsContent>

          <TabsContent value="team" className="mt-6">
            <ResourceManager<Team>
              title="Team"
              singular="Member"
              items={team}
              fields={TEAM_FIELDS}
              emptyForm={{ name: "", role: "", bio: "", imageUrl: "", linkedinUrl: "", sortOrder: 0 }}
              toForm={(t) => ({
                name: t.name,
                role: t.role,
                bio: t.bio ?? "",
                imageUrl: t.imageUrl ?? "",
                linkedinUrl: t.linkedinUrl ?? "",
                sortOrder: t.sortOrder,
              })}
              render={{
                image: (t) => t.imageUrl,
                badge: (t) => t.role,
                meta: () => "",
                title: (t) => t.name,
              }}
              onCreate={(d) => createTeamMember(d)}
              onUpdate={(id, d) => updateTeamMember(id, d)}
              onDelete={(id) => deleteTeamMember(id)}
            />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
