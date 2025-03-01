import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import AddAttendanceForm from "@/components/attendance/add-attendance-form"

export default async function AddAttendancePage() {
  // Get the current user
  const { user, error } = await getCurrentUser()

  if (error || !user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Add New Course</h1>
        <AddAttendanceForm userId={user.id} />
      </div>
    </div>
  )
}

