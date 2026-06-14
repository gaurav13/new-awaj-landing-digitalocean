import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getMyNews } from "@/app/actions/news"
import { getMyEvents } from "@/app/actions/events"
import { getMyPrograms } from "@/app/actions/programs"
import { getMyTeam } from "@/app/actions/team"
import { getMyPartners } from "@/app/actions/partners"
import { getSiteSettings } from "@/app/actions/settings"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "Admin · Content Manager | AWAJ",
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const [news, events, programs, team, partners, settings] = await Promise.all([
    getMyNews(),
    getMyEvents(),
    getMyPrograms(),
    getMyTeam(),
    getMyPartners(),
    getSiteSettings(),
  ])

  return (
    <AdminDashboard
      userName={session.user.name}
      news={news}
      events={events}
      programs={programs}
      team={team}
      partners={partners}
      settings={settings}
    />
  )
}
