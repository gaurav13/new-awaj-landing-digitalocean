import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getMyNews } from "@/app/actions/news"
import { getMyEvents } from "@/app/actions/events"
import { getMyPrograms } from "@/app/actions/programs"
import { getMyTeam } from "@/app/actions/team"
import { getMyPartners } from "@/app/actions/partners"
import { getMyMembers } from "@/app/actions/members"
import { getMyMessages } from "@/app/actions/contact"
import { getMyBanners } from "@/app/actions/banners"
import { getAllUsers } from "@/app/actions/users"
import { isSuperAdmin } from "@/lib/admin-helpers"
import { getSiteSettings } from "@/app/actions/settings"
import { AdminDashboard } from "@/components/admin/admin-dashboard"

export const metadata = {
  title: "Admin · Content Manager | AWAJ",
}

export default async function AdminPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) redirect("/sign-in")

  const superAdmin = await isSuperAdmin()

  const [news, events, programs, team, partners, members, banners, messages, settings, users] =
    await Promise.all([
      getMyNews(),
      getMyEvents(),
      getMyPrograms(),
      getMyTeam(),
      getMyPartners(),
      getMyMembers(),
      getMyBanners(),
      getMyMessages(),
      getSiteSettings(),
      superAdmin ? getAllUsers() : Promise.resolve([]),
    ])

  return (
    <AdminDashboard
      userName={session.user.name}
      currentUserId={session.user.id}
      isSuperAdmin={superAdmin}
      news={news}
      events={events}
      programs={programs}
      team={team}
      partners={partners}
      members={members}
      banners={banners}
      messages={messages}
      settings={settings}
      users={users}
    />
  )
}
