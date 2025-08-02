import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    console.log('API: Test Storage endpoint called');
    
    const supabase = createClient();
    
    // Bucket'ları listele
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    console.log('API: Available buckets:', buckets);
    console.log('API: Buckets error:', bucketsError);
    
    if (bucketsError) {
      return NextResponse.json({ 
        error: 'Bucket listesi alınamadı', 
        details: bucketsError.message 
      }, { status: 500 });
    }
    
    // project-images bucket'ını kontrol et
    const projectImagesBucket = buckets?.find(bucket => bucket.name === 'project-images');
    
    if (!projectImagesBucket) {
      return NextResponse.json({ 
        error: 'project-images bucket bulunamadı',
        availableBuckets: buckets?.map(b => b.name) || []
      }, { status: 404 });
    }
    
    // Bucket içeriğini listele
    const { data: files, error: filesError } = await supabase.storage
      .from('project-images')
      .list('', {
        limit: 10,
        offset: 0
      });
    
    console.log('API: Files in bucket:', files);
    console.log('API: Files error:', filesError);
    
    return NextResponse.json({
      success: true,
      bucket: projectImagesBucket,
      files: files || [],
      filesError: filesError?.message
    });
    
  } catch (error) {
    console.log('API: Error in test storage:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 