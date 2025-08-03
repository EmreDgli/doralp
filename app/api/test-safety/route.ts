import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log('GET /api/test-safety - Testing safety table')
    const supabase = createClient()
    
    // 1. Tablo varlığını kontrol et
    const { data: tableCheck, error: tableError } = await supabase
      .from('safety')
      .select('count(*)', { count: 'exact', head: true })
    
    console.log('Table check result:', { tableCheck, tableError })
    
    // 2. Basit veri çekme denemesi
    const { data: certificates, error } = await supabase
      .from('safety')
      .select('*')
      .limit(1)
    
    console.log('Data fetch result:', { certificates, error })
    
    return NextResponse.json({
      success: true,
      tableExists: !tableError,
      dataCount: certificates?.length || 0,
      error: error?.message || null,
      tableError: tableError?.message || null
    })
  } catch (error) {
    console.error('Test API error:', error)
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
} 