import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getCurrentUser()

    if (error) {
      console.error("Get user error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Unexpected error getting user:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

