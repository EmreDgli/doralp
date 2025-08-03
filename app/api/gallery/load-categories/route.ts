import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST() {
  try {
    const supabase = createClient()
    
    const defaultCategories = [
      { title: 'Ürün Kabul', slug: 'urun-kabul', sort_order: 1 },
      { title: 'Kumlama & Shop Primer', slug: 'kumlama-shop-primer', sort_order: 2 },
      { title: 'Kesim', slug: 'kesim', sort_order: 3 },
      { title: 'Delik Delme', slug: 'delik-delme', sort_order: 4 },
      { title: 'Ölçüm & Montaj', slug: 'olcum-montaj', sort_order: 5 },
      { title: 'Kaynak', slug: 'kaynak', sort_order: 6 },
      { title: 'Mekanik Temizlik', slug: 'mekanik-temizlik', sort_order: 7 },
      { title: 'NDT', slug: 'ndt', sort_order: 8 },
      { title: 'Boyama', slug: 'boyama', sort_order: 9 },
      { title: 'Sevkiyat', slug: 'sevkiyat', sort_order: 10 },
      { title: 'Saha Montajı', slug: 'saha-montaji', sort_order: 11 }
    ]

    const results = []
    
    for (const category of defaultCategories) {
      try {
        console.log(`Kategori ekleniyor: ${category.title}`)
        
        const insertData = {
          title: category.title,
          slug: category.slug,
          sort_order: category.sort_order,
          is_active: true
        }
        
        console.log('Insert data:', insertData)
        
        const { data, error } = await supabase
          .from('gallery_categories')
          .insert(insertData)
          .select()
          .single()

        if (error) {
          console.error(`Kategori eklenirken hata: ${category.title}`, error)
          console.error('Error details:', {
            message: error.message,
            details: error.details,
            hint: error.hint,
            code: error.code
          })
          
          // Eğer kategori zaten varsa hata verme
          if (!error.message?.includes('duplicate')) {
            results.push({ title: category.title, success: false, error: error.message })
          } else {
            results.push({ title: category.title, success: true, message: 'Zaten mevcut' })
          }
        } else {
          console.log(`Kategori başarıyla eklendi: ${category.title}`, data)
          results.push({ title: category.title, success: true, data })
        }
      } catch (error) {
        console.error(`Kategori eklenirken hata: ${category.title}`, error)
        results.push({ title: category.title, success: false, error: 'Bilinmeyen hata' })
      }
    }

    const successCount = results.filter(r => r.success).length
    const totalCount = results.length

    return NextResponse.json({
      success: true,
      message: `${successCount}/${totalCount} kategori başarıyla yüklendi`,
      results
    })
  } catch (error) {
    console.error('Kategoriler yüklenirken hata:', error)
    return NextResponse.json({ 
      success: false,
      error: 'Kategoriler yüklenirken hata oluştu'
    }, { status: 500 })
  }
} 