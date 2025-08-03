import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    const { data: certificate, error } = await supabase
      .from('safety')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Güvenlik sertifikası bulunamadı' }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    const body = await request.json()

    console.log('PUT /api/safety-images - Updating certificate:', params.id)
    console.log('PUT /api/safety-images - Received data:', {
      title: body.title,
      certificate_number: body.certificate_number,
      issue_date: body.issue_date,
      expiry_date: body.expiry_date,
      issuing_authority: body.issuing_authority,
      has_image: !!body.image_url,
      is_active: body.is_active
    })

    const updateData = {
      title: body.title,
      description: body.description,
      certificate_number: body.certificate_number,
      issue_date: body.issue_date,
      expiry_date: body.expiry_date || null,
      issuing_authority: body.issuing_authority,
      image_url: body.image_url || null,
      is_active: body.is_active ?? true,
      updated_at: new Date().toISOString()
    }

    const { data: certificate, error } = await supabase
      .from('safety')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase update error:', error)
      return NextResponse.json({ 
        error: `Güvenlik sertifikası güncellenemedi: ${error.message}`,
        details: error.details || 'Kayıt bulunamadı veya yetki sorunu'
      }, { status: 500 })
    }

    console.log('PUT /api/safety-images - Success:', certificate)
    return NextResponse.json(certificate)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Sunucu hatası',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    console.log('DELETE /api/safety-images - Deleting certificate:', params.id)

    const { error } = await supabase
      .from('safety')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Supabase delete error:', error)
      return NextResponse.json({ 
        error: `Güvenlik sertifikası silinemedi: ${error.message}`,
        details: error.details || 'Kayıt bulunamadı veya yetki sorunu'
      }, { status: 500 })
    }

    console.log('DELETE /api/safety-images - Success')
    return NextResponse.json({ message: 'Güvenlik sertifikası silindi' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ 
      error: 'Sunucu hatası',
      details: error instanceof Error ? error.message : 'Bilinmeyen hata'
    }, { status: 500 })
  }
}