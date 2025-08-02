import { type NextRequest, NextResponse } from "next/server"
import { galleryApi } from "@/lib/api"

export async function GET(request: NextRequest) {
  try {
    const gallery = await galleryApi.getGallery()
    return NextResponse.json(gallery)
  } catch (error) {
    console.error("Gallery API error:", error)
    return NextResponse.json({ error: "Galeri yüklenirken bir hata oluştu" }, { status: 500 })
  }
}
