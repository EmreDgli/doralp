import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    
    // Kategorileri kontrol et
    const { data: categories, error } = await supabase
      .from('gallery_categories')
      .select('*')
      .order('sort_order', { ascending: true })
    
    if (error) {
      console.error('Kategoriler yüklenirken hata:', error)
      return NextResponse.json({ 
        success: false,
        error: error.message,
        categories: []
      })
    }

    console.log('Bulunan kategoriler:', categories?.length || 0)
    
    return NextResponse.json({
      success: true,
      totalCategories: categories?.length || 0,
      categories: categories || [],
      expectedCategories: [
        'Ürün Kabul',
        'Kumlama & Shop Primer', 
        'Kesim',
        'Delik Delme',
        'Ölçüm & Montaj',
        'Kaynak',
        'Mekanik Temizlik',
        'NDT',
        'Boyama',
        'Sevkiyat',
        'Saha Montajı'
      ]
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      categories: []
    }, { status: 500 })
  }
} 