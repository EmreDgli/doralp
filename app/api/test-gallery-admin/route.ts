import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    const supabase = createClient()
    
    // 1. Basit sorgu - tüm kategorileri al
    const { data: simpleCategories, error: simpleError } = await supabase
      .from('gallery_categories')
      .select('*')
      .order('sort_order', { ascending: true })
    
    console.log('Simple query result:', { 
      count: simpleCategories?.length || 0, 
      error: simpleError?.message || null 
    })
    
    // 2. RPC fonksiyonu test et
    const { data: rpcData, error: rpcError } = await supabase.rpc("get_admin_gallery")
    
    console.log('RPC query result:', { 
      count: rpcData?.length || 0, 
      error: rpcError?.message || null 
    })
    
    // 3. Admin kontrolü
    const { data: { user } } = await supabase.auth.getUser()
    
    return NextResponse.json({
      success: true,
      simpleCategories: {
        count: simpleCategories?.length || 0,
        data: simpleCategories || [],
        error: simpleError?.message || null
      },
      rpcCategories: {
        count: rpcData?.length || 0,
        data: rpcData || [],
        error: rpcError?.message || null
      },
      user: {
        id: user?.id || null,
        email: user?.email || null
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