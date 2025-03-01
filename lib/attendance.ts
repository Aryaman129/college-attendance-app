import { supabase } from "./supabase"
import type { AttendanceRecord, AttendanceResponse, AttendanceStats } from "./types"

export async function getAttendanceByUserId(userId: string): Promise<AttendanceResponse> {
  try {
    const { data, error } = await supabase.from("attendance").select("*").eq("user_id", userId)

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error("Error fetching attendance:", error)
    return { data: null, error }
  }
}

export async function addAttendanceRecord(record: AttendanceRecord): Promise<AttendanceResponse> {
  try {
    // Calculate attendance percentage
    const hoursAttended = record.hours_conducted - record.hours_absent
    const percentage = (hoursAttended / record.hours_conducted) * 100

    const { data, error } = await supabase
      .from("attendance")
      .insert([
        {
          ...record,
          attendance_percentage: percentage,
        },
      ])
      .select()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error("Error adding attendance record:", error)
    return { data: null, error }
  }
}

export async function updateAttendanceRecord(
  id: string,
  updates: Partial<AttendanceRecord>,
): Promise<AttendanceResponse> {
  try {
    // If hours are being updated, recalculate the percentage
    if (updates.hours_conducted !== undefined || updates.hours_absent !== undefined) {
      // Get the current record
      const { data: currentRecord } = await supabase
        .from("attendance")
        .select("hours_conducted, hours_absent")
        .eq("id", id)
        .single()

      if (currentRecord) {
        const hoursConducted = updates.hours_conducted ?? currentRecord.hours_conducted
        const hoursAbsent = updates.hours_absent ?? currentRecord.hours_absent
        const hoursAttended = hoursConducted - hoursAbsent
        const percentage = (hoursAttended / hoursConducted) * 100

        updates.attendance_percentage = percentage
      }
    }

    const { data, error } = await supabase.from("attendance").update(updates).eq("id", id).select()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error("Error updating attendance record:", error)
    return { data: null, error }
  }
}

export async function deleteAttendanceRecord(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from("attendance").delete().eq("id", id)

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    console.error("Error deleting attendance record:", error)
    return { error }
  }
}

export async function getAttendanceStats(userId: string): Promise<AttendanceStats> {
  try {
    // Get all attendance records for the user
    const { data: records, error } = await supabase.from("attendance").select("*").eq("user_id", userId)

    if (error) throw error

    // Get all courses for the user
    const { data: courses } = await supabase.from("courses").select("*").eq("user_id", userId)

    if (!records || !courses) {
      throw new Error("Failed to fetch attendance data")
    }

    // Calculate overall statistics
    const totalClasses = courses.reduce((sum, course) => sum + course.total_classes, 0)
    const classesAttended = records.filter((record) => record.status === "present").length
    const overall = totalClasses > 0 ? (classesAttended / totalClasses) * 100 : 0

    // Calculate course-wise statistics
    const courseStats = courses.map((course) => {
      const courseRecords = records.filter((record) => record.course_id === course.id)
      const total = courseRecords.length
      const attended = courseRecords.filter((record) => record.status === "present").length
      const percentage = total > 0 ? (attended / total) * 100 : 0

      return {
        course_code: course.course_code,
        total_classes: total,
        classes_attended: attended,
        attendance_percentage: percentage,
      }
    })

    // Calculate attendance trends (last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const trends = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(thirtyDaysAgo)
      date.setDate(date.getDate() + i)
      const dateStr = date.toISOString().split("T")[0]

      const dayRecords = records.filter((record) => record.date === dateStr)
      const total = dayRecords.length
      const attended = dayRecords.filter((record) => record.status === "present").length
      const percentage = total > 0 ? (attended / total) * 100 : 0

      return {
        date: dateStr,
        percentage,
      }
    })

    return {
      overall,
      totalClasses,
      classesAttended,
      courses: courseStats,
      trends,
    }
  } catch (error: any) {
    console.error("Error calculating attendance stats:", error)
    throw error
  }
}

