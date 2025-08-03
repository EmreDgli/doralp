import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    
    // Galeri resimlerini listele
    const { data: galleryImages, error: listError } = await supabase.storage
      .from('images')
      .list('gallery-images', {
        limit: 100,
        offset: 0,
      })
    
    console.log('Gallery images in storage:', {
      count: galleryImages?.length || 0,
      error: listError?.message || null,
      files: galleryImages?.map(f => f.name) || []
    })
    
    // Galeri kategorilerini kontrol et
    const { data: categories, error: categoriesError } = await supabase
      .from('gallery_categories')
      .select('*')
      .order('sort_order', { ascending: true })
    
    console.log('Gallery categories:', {
      count: categories?.length || 0,
      error: categoriesError?.message || null
    })
    
    // Galeri resimlerini kontrol et
    const { data: images, error: imagesError } = await supabase
      .from('gallery_images')
      .select('*')
      .order('created_at', { ascending: false })
    
    console.log('Gallery images in database:', {
      count: images?.length || 0,
      error: imagesError?.message || null,
      sample: images?.slice(0, 3).map(img => ({
        id: img.id,
        url: img.image_url,
        category_id: img.category_id
      })) || []
    })
    
    return NextResponse.json({
      success: true,
      storage: {
        count: galleryImages?.length || 0,
        files: galleryImages?.map(f => f.name) || [],
        error: listError?.message || null
      },
      categories: {
        count: categories?.length || 0,
        error: categoriesError?.message || null
      },
      images: {
        count: images?.length || 0,
        error: imagesError?.message || null,
        sample: images?.slice(0, 3) || []
      }
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
} 