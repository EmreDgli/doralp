"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  FileText, 
  HandHeart, 
  Factory, 
  Target, 
  BookOpen 
} from "lucide-react"

const services = [
  {
    id: "projects",
    title: "Projeler",
    description: "Projeler",
    icon: FileText,
    href: "/projeler",
    delay: 0.1
  },
  {
    id: "services",
    title: "Bilgi Toplumu Hizmetleri",
    description: "Bilgi Toplumu Hizmetleri",
    icon: HandHeart,
    href: "/hizmetler",
    delay: 0.2
  },
  {
    id: "factory",
    title: "Fabrika",
    description: "Fabrika",
    icon: Factory,
    href: "/fabrika",
    delay: 0.3
  },
  {
    id: "new-project",
    title: "Yeni Proje!",
    description: "Yeni Proje!",
    icon: Target,
    href: "/yeni-proje",
    delay: 0.4
  },
  {
    id: "catalog",
    title: "e-Catalog English",
    description: "e-Catalog English",
    icon: BookOpen,
    href: "/catalog",
    delay: 0.5
  }
]

export function ServicesNavigation() {
  return (
    <section className="relative py-16 bg-gradient-to-b from-doralp-navy to-doralp-navy/90">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Hizmetlerimiz
          </h2>
          <p className="text-lg text-gray-200 max-w-2xl mx-auto">
            Endüstriyel çelik yapı çözümlerimiz ve hizmetlerimiz
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: service.delay }}
              className="group"
            >
              <Link href={service.href}>
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                  <div className="flex flex-col items-center space-y-4">
                    {/* Icon */}
                    <div className="w-16 h-16 bg-doralp-gold/20 rounded-full flex items-center justify-center group-hover:bg-doralp-gold/30 transition-all duration-300">
                      <service.icon className="w-8 h-8 text-white" />
                    </div>
                    
                    {/* Text */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-white group-hover:text-doralp-gold transition-colors duration-300">
                        {service.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {service.description}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Divider Lines */}
        <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-px bg-white/20 -translate-y-1/2 z-0"></div>
        <div className="hidden lg:block absolute top-0 bottom-0 left-1/5 w-px bg-white/20 -translate-x-1/2 z-0"></div>
        <div className="hidden lg:block absolute top-0 bottom-0 left-2/5 w-px bg-white/20 -translate-x-1/2 z-0"></div>
        <div className="hidden lg:block absolute top-0 bottom-0 left-3/5 w-px bg-white/20 -translate-x-1/2 z-0"></div>
        <div className="hidden lg:block absolute top-0 bottom-0 left-4/5 w-px bg-white/20 -translate-x-1/2 z-0"></div>
      </div>
    </section>
  )
} 