import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import { getMyNews } from "@/app/actions/news"
import { getMyMedia } from "@/app/actions/media"
import { getMyGalleries } from "@/app/actions/gallery"
import { getMyEvents } from "@/app/actions/events"
import { getMyPrograms } from "@/app/actions/programs"
import { getMyTeam } from "@/app/actions/team"
import { getMyPartners } from "@/app/actions/partners"
import { getMyMembers } from "@/app/actions/members"
import { getMyMembershipPlans } from "@/app/actions/membership"
import { getMembershipContent } from "@/app/actions/membership-content"
import { getMyPeople, getPeopleCounts } from "@/app/actions/people"
import { getMyOrganizations, getOrganizationCounts } from "@/app/actions/organizations"
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

  const [
    news,
    media,
    galleries,
    events,
    programs,
    team,
    partners,
    members,
    membershipPlans,
    membershipContent,
    people,
    peopleCounts,
    organizations,
    organizationCounts,
    banners,
    messages,
    settings,
    users,
  ] = await Promise.all([
    getMyNews(),
    getMyMedia(),
    getMyGalleries(),
    getMyEvents(),
    getMyPrograms(),
    getMyTeam(),
    getMyPartners(),
    getMyMembers(),
    getMyMembershipPlans(),
    getMembershipContent(),
    getMyPeople(),
    getPeopleCounts(),
    getMyOrganizations(),
    getOrganizationCounts(),
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
      media={media}
      galleries={galleries}
      events={events}
      programs={programs}
      team={team}
      partners={partners}
      members={members}
      membershipPlans={membershipPlans}
      membershipContent={membershipContent}
      people={people}
      peopleCounts={peopleCounts}
      organizations={organizations}
      organizationCounts={organizationCounts}
      banners={banners}
      messages={messages}
      settings={settings}
      users={users}
    />
  )
}
