import { type NextRequest, NextResponse } from "next/server"
import { adminAuth } from "@/lib/admin-api"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required" }, { status: 400 })
    }

    const result = await adminAuth.signIn(email, password)

    return NextResponse.json({
      success: true,
      user: result.user,
      adminUser: result.adminUser,
    })
  } catch (error: any) {
    console.error("Admin login error:", error)
    return NextResponse.json({ error: error.message || "Login failed" }, { status: 401 })
  }
}
