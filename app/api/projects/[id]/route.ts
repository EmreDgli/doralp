import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"
import { createAdminClient } from "@/lib/supabase/admin"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Public erişim için admin client kullan
    const supabase = createAdminClient()
    const { id } = params

    // Proje bilgisini ve resimleri al
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .select(`
        *,
        project_images (
          id,
          image_url,
          alt_text,
          is_primary
        )
      `)
      .eq('id', id)
      .single()

    if (projectError) {
      console.error('Error fetching project:', projectError)
      return NextResponse.json({ message: 'Proje bulunamadı', error: projectError.message }, { status: 404 })
    }

    if (!project) {
      return NextResponse.json({ message: 'Proje bulunamadı' }, { status: 404 })
    }

    console.log('Project detail fetched:', project.id, project.title)
    return NextResponse.json(project)

  } catch (error) {
    console.error('Project detail API error:', error)
    return NextResponse.json({ message: 'Internal server error', error: error instanceof Error ? error.message : String(error) }, { status: 500 })
  }
}