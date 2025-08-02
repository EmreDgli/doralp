import { type NextRequest, NextResponse } from "next/server"
import { dashboardApi } from "@/lib/admin-api"

export async function GET(request: NextRequest) {
  try {
    const stats = await dashboardApi.getStats()
    return NextResponse.json(stats)
  } catch (error: any) {
    console.error("Dashboard API error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch dashboard data" }, { status: 500 })
  }
}
