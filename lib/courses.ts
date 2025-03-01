import { supabase } from "./supabase"
import type { Course, CourseResponse } from "./types"

export async function getCourses(userId: string): Promise<CourseResponse> {
  try {
    const { data, error } = await supabase.from("courses").select("*").eq("user_id", userId)

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error("Error fetching courses:", error)
    return { data: null, error }
  }
}

export async function addCourse(course: Omit<Course, "id">): Promise<CourseResponse> {
  try {
    const { data, error } = await supabase.from("courses").insert([course]).select()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error("Error adding course:", error)
    return { data: null, error }
  }
}

export async function updateCourse(id: string, updates: Partial<Course>): Promise<CourseResponse> {
  try {
    const { data, error } = await supabase.from("courses").update(updates).eq("id", id).select()

    if (error) throw error
    return { data, error: null }
  } catch (error: any) {
    console.error("Error updating course:", error)
    return { data: null, error }
  }
}

export async function deleteCourse(id: string): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.from("courses").delete().eq("id", id)

    if (error) throw error
    return { error: null }
  } catch (error: any) {
    console.error("Error deleting course:", error)
    return { error }
  }
}

