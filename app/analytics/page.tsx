import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getAttendanceStats } from "@/lib/attendance"
import AnalyticsDashboard from "@/components/analytics/analytics-dashboard"

export default async function AnalyticsPage() {
  const { user, error } = await getCurrentUser()

  if (error || !user) {
    redirect("/login")
  }

  const stats = await getAttendanceStats(user.id)

  return (
    <div className="container mx-auto px-4 py-8">
      <AnalyticsDashboard stats={stats} />
    </div>
  )
}

