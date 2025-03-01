import type { NextApiRequest, NextApiResponse } from "next"
import { signUp } from "../auth"

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" })
  }

  try {
    const { email, password, registrationNumber } = req.body

    // Validate input
    if (!email || !password || !registrationNumber) {
      return res.status(400).json({
        error: "Missing required fields",
        details: {
          email: !email ? "Email is required" : null,
          password: !password ? "Password is required" : null,
          registrationNumber: !registrationNumber ? "Registration number is required" : null,
        },
      })
    }

    // Validate email format (basic check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: "Invalid email format" })
    }

    // Validate password strength (basic check)
    if (password.length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" })
    }

    // Attempt to sign up the user
    const { user, error } = await signUp(email, password, registrationNumber)

    if (error) {
      console.error("Signup error:", error)
      return res.status(400).json({ error: error.message })
    }

    return res.status(200).json({ user })
  } catch (error) {
    console.error("Unexpected error during signup:", error)
    return res.status(500).json({ error: "Internal server error" })
  }
}

