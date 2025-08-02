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
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Right Content - Images */}
      <div className="lg:col-span-3">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeImages.map((image, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <Image
                src={image || "/placeholder.svg"}
                alt={`Galeri ${index + 1}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
