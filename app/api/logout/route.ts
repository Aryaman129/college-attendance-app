import { type NextRequest, NextResponse } from "next/server"
import { signOut } from "@/lib/auth"

export async function POST(request: NextRequest) {
  try {
    const { error } = await signOut()

    if (error) {
      console.error("Logout error:", error)
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Unexpected error during logout:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

