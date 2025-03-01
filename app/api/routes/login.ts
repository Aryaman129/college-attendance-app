import type { NextApiRequest, NextApiResponse } from "next"
import { signIn } from "../auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        error: "Missing required fields",
        details: {
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null,
        },
      })
    }

    // Attempt to sign in the user
    const { user, error } = await signIn(email, password)

    if (error) {
      console.error("Login error:", error)
      return res.status(401).json({ error: "Invalid credentials" })
    }

    return res.status(200).json({ user, status: 200 })
  } catch (error) {
    console.error("Unexpected error during login:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

