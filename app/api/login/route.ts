
import { type NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const { user, error } = await signIn(email, password);

    if (error) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch (error) {
    console.error("Unexpected error during login:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// Handle preflight request
export async function OPTIONS() {
  return NextResponse.json({}, { status: 204 });
}

// Enable dynamic API handling
export const dynamic = "force-dynamic";
