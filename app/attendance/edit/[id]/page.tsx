import { redirect } from "next/navigation"
import { getCurrentUser } from "@/lib/auth"
import { supabase } from "@/lib/supabase"
import EditAttendanceForm from "@/components/attendance/edit-attendance-form"

export default async function EditAttendancePage({ params }: { params: { id: string } }) {
  // Get the current user
  const { user, error } = await getCurrentUser()

  if (error || !user) {
    redirect("/login")
  }

  // Get the attendance record
  const { data: record, error: recordError } = await supabase
    .from("attendance")
    .select("*")
    .eq("id", params.id)
    .single()

  if (recordError) {
    redirect("/attendance")
  }

  // Check if the record belongs to the user
  if (record.user_id !== user.id) {
    redirect("/attendance")
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Edit Course</h1>
        <EditAttendanceForm record={record} />
      </div>
    </div>
  )
}

