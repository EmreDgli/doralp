import { PageHeader } from "@/components/page-header"
import { GalleryTabs } from "@/components/gallery-tabs"

export default function GaleriPage() {
  const galleryCategories = [
    {
      id: "urun-kabul",
      name: "Ürün Kabul",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
    },
    {
      id: "kumlama-primer",
      name: "Kumlama & Shop Primer",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
    },
    {
      id: "kesim",
      name: "Kesim",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
    },
    {
      id: "delik-delme",
      name: "Delik Delme",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
    },
    {
      id: "olcum-montaj",
      name: "Ölçüm & Montaj",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
    },
    {
      id: "kaynak",
      name: "Kaynak",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
    },
    {
      id: "mekanik-temizlik",
      name: "Mekanik Temizlik",
      images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    },
    {
      id: "ndt",
      name: "NDT",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
    },
    {
      id: "boyama",
      name: "Boyama",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
    },
    {
      id: "sevkiyat",
      name: "Sevkiyat",
      images: ["/placeholder.svg?height=400&width=400", "/placeholder.svg?height=400&width=400"],
    },
    {
      id: "saha-montaji",
      name: "Saha Montajı",
      images: [
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
        "/placeholder.svg?height=400&width=400",
      ],
    },
  ]

  return (
    <div className="min-h-screen">
      <PageHeader title="Galeri" subtitle="Üretim süreçlerimizi ve fabrika tesislerimizi keşfedin" />

      <section className="py-16 md:py-24 bg-doralp-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <GalleryTabs categories={galleryCategories} />
        </div>
      </section>
    </div>
  )
}
