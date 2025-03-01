import { supabase } from "../api/auth"

export interface AttendanceRecord {
  id?: string
  user_id: string
  course_code: string
  course_title: string
  category: string
  faculty: string
  slot: string
  hours_conducted: number
  hours_absent: number
  attendance_percentage: number
}

export async function getAttendanceByUserId(userId: string) {
  try {
    const { data, error } = await supabase.from("attendance").select("*").eq("user_id", userId)

    if (error) throw error
    return { data, error: null }
  } catch (error) {
    console.error("Error fetching attendance:", error)
    return { data: null, error }
  }
}

export async function addAttendanceRecord(record: AttendanceRecord) {
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
  } catch (error) {
    console.error("Error adding attendance record:", error)
    return { data: null, error }
  }
}

export async function updateAttendanceRecord(id: string, updates: Partial<AttendanceRecord>) {
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
  } catch (error) {
    console.error("Error updating attendance record:", error)
    return { data: null, error }
  }
}

export async function deleteAttendanceRecord(id: string) {
  try {
    const { error } = await supabase.from("attendance").delete().eq("id", id)

    if (error) throw error
    return { error: null }
  } catch (error) {
    console.error("Error deleting attendance record:", error)
    return { error }
  }
}


async function safeFetch(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        return data || {};  // Ensure it's never undefined
    } catch (error) {
        console.error("API Fetch Error:", error);
        return { error: error.message };
    }
}

async function safeFetch(url, options = {}) {
    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        return data || {};  // Ensure response is never undefined
    } catch (error) {
        console.error("API Fetch Error:", error);
        return { error: error.message };
    }
}
