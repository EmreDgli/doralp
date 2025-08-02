import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    console.log('API: Delete bucket endpoint called');
    
    const adminClient = createAdminClient();
    
    // Bucket'ı sil
    const { error: deleteError } = await adminClient.storage.deleteBucket('project-images');
    
    if (deleteError) {
      console.log('API: Error deleting bucket:', deleteError.message);
      return NextResponse.json({ 
        error: 'Bucket silinemedi',
        details: deleteError.message
      }, { status: 500 });
    }
    
    console.log('API: Bucket deleted successfully');
    
    return NextResponse.json({ 
      message: 'project-images bucket başarıyla silindi'
    });
    
  } catch (error) {
    console.log('API: Error in delete bucket:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 