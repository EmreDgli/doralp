import { type NextRequest, NextResponse } from "next/server"
import { adminStorageApi } from "@/lib/admin-api"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File
    const bucket = formData.get("bucket") as string
    const folder = formData.get("folder") as string

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!bucket) {
      return NextResponse.json({ error: "Bucket name is required" }, { status: 400 })
    }

    const result = await adminStorageApi.uploadImage(file, bucket, folder || "")

    return NextResponse.json({
      success: true,
      ...result,
    })
  } catch (error: any) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: error.message || "Upload failed" }, { status: 500 })
  }
}
