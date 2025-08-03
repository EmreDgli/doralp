import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log('GET /api/safety-images - Starting request')
    const supabase = createClient()
    
    console.log('Attempting to fetch from safety table...')
    
    // Önce basit bir test sorgusu
    const { data: testData, error: testError } = await supabase
      .from('safety')
      .select('id, title')
      .limit(1)
    
    console.log('Test query result:', { testData, testError })
    
    // Basit sorgu - sıralama olmadan
    const { data: certificates, error } = await supabase
      .from('safety')
      .select('*')
    
    console.log('Supabase response:', { 
      dataLength: certificates?.length || 0, 
      error: error?.message || null,
      errorCode: error?.code || null
    })

    if (error) {
      console.error('Supabase GET error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      
      // Daha detaylı hata mesajı
      let errorMessage = 'Güvenlik sertifikaları yüklenemedi'
      if (error.code === 'PGRST116') {
        errorMessage = 'Tablo bulunamadı - safety tablosu mevcut değil'
      } else if (error.code === '42501') {
        errorMessage = 'Yetki hatası - RLS politikası engelliyor'
      } else if (error.message) {
        errorMessage = error.message
      }
      
      return NextResponse.json({ 
        error: errorMessage,
        details: error.details || 'Bilinmeyen hata',
        code: error.code
      }, { status: 500 })
    }

    console.log('GET /api/safety-images - Success, found', certificates?.length || 0, 'certificates')
    return NextResponse.json(certificates)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Sunucu hatası',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createClient()
    const body = await request.json()

    console.log('POST /api/safety-images - Received data:', {
      title: body.title,
      certificate_number: body.certificate_number,
      issue_date: body.issue_date,
      expiry_date: body.expiry_date,
      issuing_authority: body.issuing_authority,
      has_image: !!body.image_url,
      is_active: body.is_active
    })

    const insertData = {
      title: body.title,
      description: body.description,
      certificate_number: body.certificate_number,
      issue_date: body.issue_date,
      expiry_date: body.expiry_date || null,
      issuing_authority: body.issuing_authority,
      image_url: body.image_url || null,
      is_active: body.is_active ?? true
    }

    console.log('POST /api/safety-images - Inserting data:', insertData)

    const { data: certificate, error } = await supabase
      .from('safety')
      .insert([insertData])
      .select()
      .single()

    if (error) {
      console.error('Supabase insert error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json({ 
        error: `Güvenlik sertifikası eklenemedi: ${error.message}`,
        details: error.details || 'Tablo bulunamadı veya yetki sorunu'
      }, { status: 500 })
    }

    console.log('POST /api/safety-images - Success:', certificate)
    return NextResponse.json(certificate)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Sunucu hatası',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}