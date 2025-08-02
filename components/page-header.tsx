"use client"


import Image from "next/image"

interface PageHeaderProps {
  title: string
  subtitle?: string
  backgroundImage?: string
}

export function PageHeader({ title, subtitle, backgroundImage }: PageHeaderProps) {
  return (
    <section className="relative h-64 md:h-80 flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={backgroundImage || "/placeholder.svg?height=400&width=1920"}
          alt={title}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-doralp-navy/80"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">{title}</h1>
          {subtitle && <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto">{subtitle}</p>}
        </div>
      </div>
    </section>
  )
}
