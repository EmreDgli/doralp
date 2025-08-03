import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    
    // Galeri resimlerini kontrol et
    const { data: images, error } = await supabase
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
    
    console.log('Gallery images test:', {
      count: images?.length || 0,
      error: error?.message || null,
      images: images?.slice(0, 3).map(img => ({
        id: img.id,
        url: img.image_url,
        category: img.gallery_categories?.title,
        file_size: img.file_size,
        file_type: img.file_type,
        created_at: img.created_at
      })) || []
    })
    
    return NextResponse.json({
      success: true,
      count: images?.length || 0,
      error: error?.message || null,
      images: images?.slice(0, 5) || []
    })
  } catch (error) {
    console.error('Gallery images test error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      count: 0,
      images: []
    }, { status: 500 })
  }
} 