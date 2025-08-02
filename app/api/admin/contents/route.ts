import { type NextRequest, NextResponse } from "next/server"
import { adminContentApi } from "@/lib/admin-api"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const language = searchParams.get("language") as "tr" | "en" | null
    const page = searchParams.get("page")
    const limit = Number.parseInt(searchParams.get("limit") || "20")
    const offset = Number.parseInt(searchParams.get("offset") || "0")

    const contents = await adminContentApi.getContents({
      language: language || undefined,
      page: page || undefined,
      limit,
      offset,
    })

    return NextResponse.json(contents)
  } catch (error: any) {
    console.error("Contents API error:", error)
    return NextResponse.json({ error: error.message || "Failed to fetch contents" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentData = await request.json()
    const content = await adminContentApi.createContent(contentData)
    return NextResponse.json(content)
  } catch (error: any) {
    console.error("Create content error:", error)
    return NextResponse.json({ error: error.message || "Failed to create content" }, { status: 500 })
  }
}
