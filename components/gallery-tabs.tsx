"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

interface GalleryTabsProps {
  categories: {
    id: string
    name: string
    images: string[]
  }[]
}

export function GalleryTabs({ categories }: GalleryTabsProps) {
  const [activeCategory, setActiveCategory] = useState(categories[0]?.id || "")

  const activeImages = categories.find((cat) => cat.id === activeCategory)?.images || []
  const activeCategoryData = categories.find((cat) => cat.id === activeCategory)

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Left Sidebar - Categories */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-2xl shadow-lg p-6 sticky top-24">
          <h3 className="text-xl font-bold text-doralp-navy mb-6">Kategoriler</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={activeCategory === category.id ? "default" : "ghost"}
                className={`w-full justify-start text-left ${
                  activeCategory === category.id
                    ? "bg-doralp-gold hover:bg-doralp-gold/90 text-white"
                    : "text-doralp-gray hover:text-doralp-navy"
                }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <div className="flex items-center justify-between w-full">
                  <span>{category.name}</span>
                  <span className="text-xs opacity-70">({category.images.length})</span>
                </div>
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content - Images */}
      <div className="lg:col-span-3">
        {activeCategoryData && (
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-doralp-navy mb-2">{activeCategoryData.name}</h2>
            <p className="text-doralp-gray">
              {activeImages.length} resim • {activeCategoryData.name} süreci
            </p>
          </div>
        )}
        
        {activeImages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeImages.map((image, index) => (
              <div
                key={index}
                className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 group"
              >
                <Image
                  src={image || "/placeholder.svg"}
                  alt={`${activeCategoryData?.name || 'Galeri'} ${index + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    console.error('Image load error:', image)
                    e.currentTarget.src = "/placeholder.svg"
                  }}
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <p className="text-white text-sm font-medium">
                      {activeCategoryData?.name} - Resim {index + 1}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <div className="text-gray-400 mb-4">
              <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-doralp-gray mb-2">Bu kategoride henüz resim yok</p>
            <p className="text-sm text-gray-500">Admin panelinden resim ekleyebilirsiniz</p>
          </div>
        )}
      </div>
    </div>
  )
}
