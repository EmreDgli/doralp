import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET() {
  try {
    console.log('GET /api/quality-system - Starting request')
    const supabase = createClient()
    
    const { data: certificates, error } = await supabase
      .from('quality_system')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Supabase GET error:', error)
      console.error('Error details:', {
        message: error.message,
        details: error.details,
        hint: error.hint,
        code: error.code
      })
      return NextResponse.json({ 
        error: `Sertifikalar yüklenemedi: ${error.message}`,
        details: error.details || 'Tablo bulunamadı'
      }, { status: 500 })
    }

    console.log('GET /api/quality-system - Success, found', certificates?.length || 0, 'certificates')
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

    console.log('POST /api/quality-system - Received data:', {
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

    console.log('POST /api/quality-system - Inserting data:', insertData)

    const { data: certificate, error } = await supabase
      .from('quality_system')
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
        error: `Sertifika eklenemedi: ${error.message}`,
        details: error.details || 'Tablo bulunamadı veya yetki sorunu'
      }, { status: 500 })
    }

    console.log('POST /api/quality-system - Success:', certificate)
    return NextResponse.json(certificate)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Sunucu hatası',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}