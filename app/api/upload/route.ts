import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(request: NextRequest) {
  try {
    console.log('API: Upload endpoint called');
    
    const adminClient = createAdminClient();
    
    console.log('API: Using admin client for upload');

    const formData = await request.formData();
    const file = formData.get('file') as File;
    const folder = formData.get('folder') as string || 'project-images';
    
    if (!file) {
      return NextResponse.json({ error: 'Dosya bulunamadı' }, { status: 400 });
    }

    // Dosya boyutu kontrolü (10MB for PDFs, 5MB for images)
    const maxSize = folder.includes('certificates') ? 10 * 1024 * 1024 : 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: `Dosya boyutu ${folder.includes('certificates') ? '10MB' : '5MB'}'dan büyük olamaz` 
      }, { status: 400 });
    }

    // Dosya tipi kontrolü
    const allowedTypes = folder.includes('certificates') 
      ? ['application/pdf'] 
      : ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    
    if (!allowedTypes.includes(file.type)) {
      const typeMessage = folder.includes('certificates') 
        ? 'Sadece PDF dosyaları kabul edilir'
        : 'Sadece JPEG, PNG, WebP ve GIF dosyaları kabul edilir';
      return NextResponse.json({ error: typeMessage }, { status: 400 });
    }

    // Önce bucket'ın var olup olmadığını kontrol et
    const { data: buckets, error: bucketsError } = await adminClient.storage.listBuckets();
    console.log('API: Available buckets:', buckets?.map(b => b.name));
    
    if (bucketsError) {
      console.log('API: Error listing buckets:', bucketsError.message);
      return NextResponse.json({ error: 'Storage bucket\'ları listelenemedi' }, { status: 500 });
    }
    
    const imagesBucket = buckets?.find(bucket => bucket.name === 'images');
    if (!imagesBucket) {
      console.log('API: images bucket bulunamadı');
      return NextResponse.json({ 
        error: 'images bucket bulunamadı. Lütfen Supabase\'de bucket oluşturun.',
        availableBuckets: buckets?.map(b => b.name) || []
      }, { status: 500 });
    }

    // Benzersiz dosya adı oluştur
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${folder}/${timestamp}-${Math.random().toString(36).substring(2)}.${fileExtension}`;

    // Supabase Storage'a yükle
    console.log('API: Attempting to upload to bucket: images');
    console.log('API: File name:', fileName);
    console.log('API: File size:', file.size);
    console.log('API: File type:', file.type);
    console.log('API: Folder:', folder);
    console.log('API: Full file path will be:', `images/${fileName}`);
    
    const { data, error } = await adminClient.storage
      .from('images')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.log('API: Upload error:', error.message);
      console.log('API: Upload error details:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Public URL oluştur
    const { data: { publicUrl } } = adminClient.storage
      .from('images')
      .getPublicUrl(fileName);

    console.log('API: File uploaded successfully:', publicUrl);
    console.log('API: Full upload response:', { fileName, publicUrl, fileSize: file.size, fileType: file.type });
    return NextResponse.json({ 
      url: publicUrl,
      fileName: fileName
    });
  } catch (error) {
    console.log('API: Error in upload:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 