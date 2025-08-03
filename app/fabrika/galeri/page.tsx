"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { GalleryTabs } from "@/components/gallery-tabs"

interface GalleryCategory {
  id: string
  title: string
  slug: string
  sort_order: number
  images: GalleryImage[]
}

interface GalleryImage {
  id: string
  url: string
  alt_text: string | null
  sort_order: number
}

export default function GaleriPage() {
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/gallery')
      if (!response.ok) {
        throw new Error('Galeri yüklenirken hata oluştu')
      }
      
      const data = await response.json()
      console.log('Galeri verileri:', data)
      
      // API'den gelen veriyi GalleryTabs bileşeninin beklediği formata dönüştür
      const formattedCategories = data.map((category: any) => ({
        id: category.id,
        name: category.title,
        images: category.images?.map((image: any) => image.url) || []
      }))
      
      setCategories(formattedCategories)
    } catch (err: any) {
      console.error('Galeri yükleme hatası:', err)
      setError(err.message || 'Galeri yüklenirken bir hata oluştu')
      
      // Hata durumunda varsayılan kategorileri göster
      setCategories([
        {
          id: "urun-kabul",
          name: "Ürün Kabul",
          images: ["/placeholder.svg?height=400&width=400"],
        },
        {
          id: "kumlama-primer",
          name: "Kumlama & Shop Primer",
          images: ["/placeholder.svg?height=400&width=400"],
        },
        {
          id: "kesim",
          name: "Kesim",
          images: ["/placeholder.svg?height=400&width=400"],
        },
        {
          id: "delik-delme",
          name: "Delik Delme",
          images: ["/placeholder.svg?height=400&width=400"],
        },
        {
          id: "olcum-montaj",
          name: "Ölçüm & Montaj",
          images: ["/placeholder.svg?height=400&width=400"],
        },
        {
          id: "kaynak",
          name: "Kaynak",
          images: ["/placeholder.svg?height=400&width=400"],
        },
        {
          id: "mekanik-temizlik",
          name: "Mekanik Temizlik",
          images: ["/placeholder.svg?height=400&width=400"],
        },
        {
          id: "ndt",
          name: "NDT",
          images: ["/placeholder.svg?height=400&width=400"],
        },
        {
          id: "boyama",
          name: "Boyama",
          images: ["/placeholder.svg?height=400&width=400"],
        },
        {
          id: "sevkiyat",
          name: "Sevkiyat",
          images: ["/placeholder.svg?height=400&width=400"],
        },
        {
          id: "saha-montaji",
          name: "Saha Montajı",
          images: ["/placeholder.svg?height=400&width=400"],
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Galeri" subtitle="Üretim süreçlerimizi ve fabrika tesislerimizi keşfedin" />
        
        <section className="py-16 md:py-24 bg-doralp-light-gray">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doralp-gold mx-auto mb-4"></div>
                <p className="text-doralp-gray">Galeri yükleniyor...</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="Galeri" subtitle="Üretim süreçlerimizi ve fabrika tesislerimizi keşfedin" />

      <section className="py-16 md:py-24 bg-doralp-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {error && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                ⚠️ {error} - Varsayılan kategoriler gösteriliyor
              </p>
            </div>
          )}
          
          {categories.length > 0 ? (
            <GalleryTabs categories={categories} />
          ) : (
            <div className="text-center py-12">
              <p className="text-doralp-gray">Henüz galeri kategorisi eklenmemiş</p>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
