import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// GET - Tüm projeleri getir (public erişim)
export async function GET() {
  try {
    console.log('API: Public projects endpoint called')
    
    // Admin client ile projeleri getir (public erişim için)
    const adminClient = createAdminClient()
    console.log('API: Fetching projects with admin client for public')
    
    const { data: projects, error } = await adminClient
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
      .order('created_at', { ascending: false })

    console.log('API: Public projects fetch result:', { 
      projectsCount: projects?.length, 
      error: error?.message,
      firstProject: projects?.[0]?.title
    })

    if (error) {
      console.log('API: Error fetching public projects:', error.message)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(projects)
  } catch (error) {
    console.error('API: Public projects error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}