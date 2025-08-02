import { type NextRequest, NextResponse } from "next/server"
import { contentApi } from "@/lib/api"

export async function GET(request: NextRequest, { params }: { params: { language: string; page: string } }) {
  try {
    const { language, page } = params

    if (!["tr", "en"].includes(language)) {
      return NextResponse.json({ error: "Geçersiz dil parametresi" }, { status: 400 })
    }

    const content = await contentApi.getContent(language as "tr" | "en", page)

    if (!content) {
      return NextResponse.json({ error: "İçerik bulunamadı" }, { status: 404 })
    }

    return NextResponse.json(content)
  } catch (error) {
    console.error("Content API error:", error)
    return NextResponse.json({ error: "İçerik yüklenirken bir hata oluştu" }, { status: 500 })
  }
}
