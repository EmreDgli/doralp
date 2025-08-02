import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Check database endpoint called');
    
    const adminClient = createAdminClient();
    
    // Projects tablosunu kontrol et
    const { data: projects, error: projectsError } = await adminClient
      .from('projects')
      .select('*')
      .limit(5);
    
    console.log('Projects table check:', { count: projects?.length, error: projectsError?.message });
    
    // Project-images tablosunu kontrol et
    const { data: projectImages, error: imagesError } = await adminClient
      .from('project-images')
      .select('*')
      .limit(10);
    
    console.log('Project-images table check:', { count: projectImages?.length, error: imagesError?.message });
    
    // Tablo yapısını kontrol et - basit sorgu ile
    const { data: tableColumns, error: tableError } = await adminClient
      .from('project-images')
      .select('*')
      .limit(0);
    
    console.log('Table structure check:', { 
      hasTable: !tableError, 
      error: tableError?.message,
      tableError: tableError
    });
    
    return NextResponse.json({
      success: true,
      projects: {
        count: projects?.length || 0,
        sample: projects?.[0] || null,
        error: projectsError?.message
      },
      'project-images': {
        count: projectImages?.length || 0,
        sample: projectImages?.[0] || null,
        error: imagesError?.message
      },
      table_structure: tableError ? `Error: ${tableError.message}` : 'Table exists and accessible'
    });
    
  } catch (error) {
    console.log('API: Error in check database:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 