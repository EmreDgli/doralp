import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createClient()
    
    // Önce mevcut verileri kontrol et
    const { data: existingData } = await supabase
      .from('contact_info')
      .select('*')
    
    if (existingData && existingData.length > 0) {
      return NextResponse.json({ 
        message: 'Veriler zaten mevcut',
        count: existingData.length 
      })
    }

    // Default contact items
    const contactItems = [
      {
        type: 'contact_item',
        title: 'Telefon',
        icon: 'phone',
        color: 'bg-blue-500',
        details: ['(+90) 212 123 45 67', '(+90) 212 123 45 68'],
        sort_order: 1,
        is_active: true
      },
      {
        type: 'contact_item',
        title: 'E-posta',
        icon: 'email',
        color: 'bg-green-500',
        details: ['info@doralp.com.tr', 'satis@doralp.com.tr'],
        sort_order: 2,
        is_active: true
      },
      {
        type: 'contact_item',
        title: 'Adres',
        icon: 'address',
        color: 'bg-red-500',
        details: ['Organize Sanayi Bölgesi', '1. Cadde No: 123', 'İstanbul, Türkiye'],
        sort_order: 3,
        is_active: true
      },
      {
        type: 'contact_item',
        title: 'Çalışma Saatleri',
        icon: 'clock',
        color: 'bg-purple-500',
        details: ['Pazartesi - Cuma: 08:00 - 18:00', 'Cumartesi: 08:00 - 16:00'],
        sort_order: 4,
        is_active: true
      },
      {
        type: 'contact_item',
        title: 'Faks',
        icon: 'fax',
        color: 'bg-yellow-500',
        details: ['(+90) 212 123 45 69'],
        sort_order: 5,
        is_active: true
      },
      {
        type: 'contact_item',
        title: 'Website',
        icon: 'website',
        color: 'bg-indigo-500',
        details: ['www.doralp.com.tr'],
        sort_order: 6,
        is_active: true
      }
    ]

    // Location info
    const locationInfo = {
      type: 'location',
      title: 'Konum',
      subtitle: 'Fabrikamızı ve ofisimizi ziyaret etmek için aşağıdaki konum bilgilerini kullanabilirsiniz.',
      address: 'Organize Sanayi Bölgesi, 1. Cadde No: 123, İstanbul, Türkiye',
      map_embed_url: '<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3009.7542285841885!2d28.85!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDA0JzI5LjUiTiAyOMKwNTEnMDAuMCJF!5e0!3m2!1str!2str!4v1600000000000!5m2!1str!2str" width="100%" height="400" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>',
      sort_order: 1,
      is_active: true
    }

    // Insert contact items
    const { data: contactData, error: contactError } = await supabase
      .from('contact_info')
      .insert(contactItems)
      .select()

    if (contactError) {
      console.error('Contact items insert error:', contactError)
      return NextResponse.json({ error: contactError.message }, { status: 500 })
    }

    // Insert location info
    const { data: locationData, error: locationError } = await supabase
      .from('contact_info')
      .insert(locationInfo)
      .select()

    if (locationError) {
      console.error('Location info insert error:', locationError)
      return NextResponse.json({ error: locationError.message }, { status: 500 })
    }

    return NextResponse.json({ 
      success: true,
      message: 'Default contact data created successfully',
      contactItems: contactData?.length || 0,
      locationInfo: locationData?.length || 0
    })

  } catch (error) {
    console.error('Seed contact data error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}