import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    
    // Basit sorgu - sadece kategorileri al
    const { data: categories, error } = await supabase
      .from('gallery_categories')
      .select('*')
      .order('sort_order', { ascending: true })
    
    console.log('Simple gallery test:', {
      count: categories?.length || 0,
      error: error?.message || null,
      categories: categories?.map(c => ({ id: c.id, title: c.title, sort_order: c.sort_order })) || []
    })
    
    return NextResponse.json({
      success: true,
      count: categories?.length || 0,
      error: error?.message || null,
      categories: categories || []
    })
  } catch (error) {
    console.error('Simple test error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata',
      count: 0,
      categories: []
    }, { status: 500 })
  }
} 