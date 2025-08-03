import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()
    
    const { data: certificate, error } = await supabase
      .from('quality_system')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Sertifika bulunamadı' }, { status: 404 })
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

    const { data: certificate, error } = await supabase
      .from('quality_system')
      .update({
        title: body.title,
        description: body.description,
        certificate_number: body.certificate_number,
        issue_date: body.issue_date,
        expiry_date: body.expiry_date || null,
        issuing_authority: body.issuing_authority,
        image_url: body.image_url || null,
        is_active: body.is_active ?? true,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Sertifika güncellenemedi' }, { status: 500 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('quality_system')
      .delete()
      .eq('id', params.id)

    if (error) {
      console.error('Supabase error:', error)
      return NextResponse.json({ error: 'Sertifika silinemedi' }, { status: 500 })
    }

    return NextResponse.json({ message: 'Sertifika silindi' })
  } catch (error) {
    console.error('API error:', error)
    return NextResponse.json({ error: 'Sunucu hatası' }, { status: 500 })
  }
}