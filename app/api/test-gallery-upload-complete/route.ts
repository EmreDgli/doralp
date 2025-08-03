import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    
    // 1. Storage'da gallery-images folder'ını kontrol et
    const { data: storageFiles, error: storageError } = await supabase.storage
      .from('images')
      .list('gallery-images', {
        limit: 100,
        offset: 0,
      })
    
    console.log('Gallery storage files:', {
      count: storageFiles?.length || 0,
      error: storageError?.message || null,
      files: storageFiles?.map(f => f.name) || []
    })
    
    // 2. Database'de gallery_images tablosunu kontrol et
    const { data: dbImages, error: dbError } = await supabase
      .from('gallery_images')
      .select(`
        id,
        category_id,
        image_url,
        alt_text,
        caption,
        sort_order,
        is_active,
        file_size,
        file_type,
        created_at,
        gallery_categories!inner(title, slug)
      `)
      .order('created_at', { ascending: false })
    
    console.log('Gallery database images:', {
      count: dbImages?.length || 0,
      error: dbError?.message || null,
      images: dbImages?.slice(0, 3).map(img => ({
        id: img.id,
        url: img.image_url,
        category: img.gallery_categories?.title,
        file_size: img.file_size,
        file_type: img.file_type
      })) || []
    })
    
    // 3. Kategorileri kontrol et
    const { data: categories, error: categoriesError } = await supabase
      .from('gallery_categories')
      .select('*')
      .order('sort_order', { ascending: true })
    
    console.log('Gallery categories:', {
      count: categories?.length || 0,
      error: categoriesError?.message || null
    })
    
    return NextResponse.json({
      success: true,
      storage: {
        count: storageFiles?.length || 0,
        files: storageFiles?.map(f => f.name) || [],
        error: storageError?.message || null
      },
      database: {
        count: dbImages?.length || 0,
        images: dbImages?.slice(0, 5) || [],
        error: dbError?.message || null
      },
      categories: {
        count: categories?.length || 0,
        error: categoriesError?.message || null
      }
    })
  } catch (error) {
    console.error('Complete test error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
} 