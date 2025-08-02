import { type NextRequest, NextResponse } from "next/server"
import { adminContentApi } from "@/lib/admin-api"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const content = await adminContentApi.getContent(params.id)
    return NextResponse.json(content)
  } catch (error: any) {
    console.error("Get content error:", error)
    return NextResponse.json({ error: error.message || "Content not found" }, { status: 404 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const updates = await request.json()
    const content = await adminContentApi.updateContent(params.id, updates)
    return NextResponse.json(content)
  } catch (error: any) {
    console.error("Update content error:", error)
    return NextResponse.json({ error: error.message || "Failed to update content" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await adminContentApi.deleteContent(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Delete content error:", error)
    return NextResponse.json({ error: error.message || "Failed to delete content" }, { status: 500 })
  }
}
