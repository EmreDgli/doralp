"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { 
  FileText, 
  HandHeart, 
  Factory, 
  Target, 
  BookOpen 
} from "lucide-react"

export function HeroSection() {
  const services = [
    {
      id: "projects",
      title: "Projeler",
      icon: FileText,
      href: "/projeler",
      delay: 0.8
    },
    {
      id: "services",
      title: "Bilgi Toplumu Hizmetleri",
      icon: HandHeart,
      href: "https://mths.ttr.com.tr/firmabilgileri.aspx?mersis=0310003990900026",
      delay: 0.9
    },
    {
      id: "factory",
      title: "Fabrika",
      icon: Factory,
      href: "/fabrika",
      delay: 1.0
    },
    {
      id: "new-project",
      title: "Yeni Proje!",
      icon: Target,
      href: "/iletisim",
      delay: 1.1
    },
    {
      id: "catalog",
      title: "e-Catalog English",
      icon: BookOpen,
      href: "https://www.doralp.com.tr/Doralp_En.pdf",
      delay: 1.2
    }
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/herosection-doralp-foto.jpg"
          alt="Endüstriyel Çelik Yapı"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-doralp-navy/70"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-8"
        >
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-tight"
          >
            Endüstriyel Çelik Yapı
            <br />
            <span className="text-doralp-gold">Çözümleri</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto leading-relaxed"
          >
            25+ yıllık deneyimimizle endüstriyel çelik yapı, fabrika inşaatı ve proje yönetimi alanında güvenilir
            çözümler sunuyoruz.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16"
          >
            <Button
              asChild
              size="lg"
              className="bg-doralp-gold hover:bg-doralp-gold/90 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Link href="/iletisim">Bizimle İletişime Geç</Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white text-white hover:bg-white hover:text-doralp-navy px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300 bg-transparent"
            >
              <Link href="/projeler">Projelerimiz</Link>
            </Button>
          </motion.div>

          {/* Services Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="w-full max-w-6xl mx-auto"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {services.map((service) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: service.delay }}
                  className="group"
                >
                                  <Link 
                  href={service.href}
                  target={service.href.startsWith('http') ? "_blank" : "_self"}
                  rel={service.href.startsWith('http') ? "noopener noreferrer" : ""}
                >
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4 text-center hover:bg-white/20 transition-all duration-300 border border-white/20 hover:border-white/40">
                      <div className="flex flex-col items-center space-y-3">
                        {/* Icon */}
                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-doralp-gold/30 transition-all duration-300">
                          <service.icon className="w-6 h-6 text-white" />
                        </div>
                        
                        {/* Text */}
                        <div>
                          <h3 className="text-sm font-medium text-white group-hover:text-doralp-gold transition-colors duration-300">
                            {service.title}
                          </h3>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
            className="w-1 h-3 bg-white rounded-full mt-2"
          />
        </div>
      </motion.div>
    </section>
  )
}
