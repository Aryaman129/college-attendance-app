import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"
import { updateAttendanceRecord, deleteAttendanceRecord } from "@/lib/attendance"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get the attendance record
    const { data, error } = await supabase.from("attendance").select("*").eq("id", params.id).single()

    if (error) {
      console.error("Get attendance error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    // Check if the attendance record belongs to the user
    if (data.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Unexpected error getting attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get the attendance record to check ownership
    const { data: existingRecord, error: getError } = await supabase
      .from("attendance")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (getError) {
      console.error("Get attendance error:", getError)
      return NextResponse.json({ error: getError.message }, { status: 400 })
    }

    // Check if the attendance record belongs to the user
    if (existingRecord.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Get the updates from the request body
    const updates = await request.json()

    // Update the attendance record
    const { data, error } = await updateAttendanceRecord(params.id, updates)

    if (error) {
      console.error("Update attendance error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ data })
  } catch (error) {
    console.error("Unexpected error updating attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Get the attendance record to check ownership
    const { data: existingRecord, error: getError } = await supabase
      .from("attendance")
      .select("user_id")
      .eq("id", params.id)
      .single()

    if (getError) {
      console.error("Get attendance error:", getError)
      return NextResponse.json({ error: getError.message }, { status: 400 })
    }

    // Check if the attendance record belongs to the user
    if (existingRecord.user_id !== user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete the attendance record
    const { error } = await deleteAttendanceRecord(params.id)

    if (error) {
      console.error("Delete attendance error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error deleting attendance:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

