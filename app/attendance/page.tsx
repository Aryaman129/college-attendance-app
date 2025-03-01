import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { getAttendanceByUserId } from "@/lib/attendance"
import AttendanceContent from "@/components/attendance/attendance-content"

export default async function AttendancePage() {
  // Get the current user
  const { user, error } = await getCurrentUser()

  if (error || !user) {
    redirect("/login")
  }

  // Get attendance records for the user
  const { data: attendanceRecords } = await getAttendanceByUserId(user.id)

  return (
    <div className="min-h-screen bg-gray-100">
      <AttendanceContent user={user} attendanceRecords={attendanceRecords || []} />
    </div>
  )
}

