import { supabase } from "./supabase"
import type { AuthResponse } from "./types"

export async function signUp(email: string, password: string, registrationNumber: string): Promise<AuthResponse> {
  try {
    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // 2. Add the user to the users table with additional information
    if (authData.user) {
      const { error: dbError } = await supabase.from("users").insert([
        {
          id: authData.user.id, // Use the same ID from Auth
          email,
          registration_number: registrationNumber,
        },
      ])

      if (dbError) {
        console.error("Error inserting user into database:", dbError)
        // If database insert fails, we should ideally delete the auth user
        // but for simplicity, we'll just return the error
        return { user: null, error: dbError }
      }

      return { user: authData.user, error: null }
    }

    return { user: null, error: new Error("User creation failed") }
  } catch (error: any) {
    console.error("Signup error:", error)
    return { user: null, error }
  }
}

export async function signIn(email: string, password: string): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { user: data.user, error: null }
  } catch (error: any) {
    console.error("Login error:", error)
    return { user: null, error }
  }
}

export async function signOut(): Promise<{ error: Error | null }> {
  try {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    return { error: null }
  } catch (error: any) {
    console.error("Logout error:", error)
    return { error }
  }
}

export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error

    if (data.user) {
      // Get additional user data from the users table
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("id", data.user.id)
        .single()

      if (userError && userError.code !== "PGRST116") {
        // PGRST116 is "no rows returned" error
        console.error("Error fetching user data:", userError)
      }

      // Combine auth user with database user data
      return {
        user: {
          ...data.user,
          ...userData,
        },
        error: null,
      }
    }

    return { user: null, error: null }
  } catch (error: any) {
    console.error("Get current user error:", error)
    return { user: null, error }
  }
}

