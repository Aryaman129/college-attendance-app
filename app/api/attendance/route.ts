import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { getAttendanceByUserId, addAttendanceRecord } from "@/lib/attendance"
import type { AttendanceRecord } from "@/lib/types"

export async function GET(request: NextRequest) {
  try {
    // Get the current user
    const { user, error: userError } = await getCurrentUser()

    if (userError) {
      console.error("Get user error:", userError)
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get attendance records for the user
    const { data, error } = await getAttendanceByUserId(user.id)

    if (error) {
      console.error("Get attendance error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Unexpected error getting attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Get the current user
    const { user, error: userError } = await getCurrentUser()

    if (userError) {
      console.error("Get user error:", userError)
      return NextResponse.json({ error: userError.message }, { status: 400 })
    }

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the attendance record from the request body
    const body = await request.json()
    const attendanceRecord: AttendanceRecord = {
      ...body,
      user_id: user.id,
    }

    // Validate the attendance record
    if (!attendanceRecord.course_code || !attendanceRecord.course_title) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Add the attendance record
    const { data, error } = await addAttendanceRecord(attendanceRecord)

    if (error) {
      console.error("Add attendance error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Unexpected error adding attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

