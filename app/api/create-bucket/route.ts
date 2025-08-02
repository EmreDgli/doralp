import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    console.log('API: Create bucket endpoint called');
    
    const adminClient = createAdminClient();
    
    // Önce mevcut bucket'ları kontrol et
    const { data: existingBuckets, error: listError } = await adminClient.storage.listBuckets();
    
    if (listError) {
      console.log('API: Error listing buckets:', listError.message);
      return NextResponse.json({ error: 'Bucket\'lar listelenemedi' }, { status: 500 });
    }
    
    console.log('API: Existing buckets:', existingBuckets?.map(b => b.name));
    
    // project-images bucket'ı zaten var mı kontrol et
    const projectImagesBucket = existingBuckets?.find(bucket => bucket.name === 'project-images');
    
    if (projectImagesBucket) {
      return NextResponse.json({ 
        message: 'project-images bucket zaten mevcut',
        bucket: projectImagesBucket
      });
    }
    
    // Yeni bucket oluştur
    const { data: newBucket, error: createError } = await adminClient.storage.createBucket('project-images', {
      public: true,
      allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
      fileSizeLimit: 5242880 // 5MB
    });
    
    if (createError) {
      console.log('API: Error creating bucket:', createError.message);
      return NextResponse.json({ 
        error: 'Bucket oluşturulamadı',
        details: createError.message
      }, { status: 500 });
    }
    
    console.log('API: Bucket created successfully:', newBucket);
    
    return NextResponse.json({ 
      message: 'project-images bucket başarıyla oluşturuldu',
      bucket: newBucket
    });
    
  } catch (error) {
    console.log('API: Error in create bucket:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 