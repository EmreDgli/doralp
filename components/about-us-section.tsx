"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { CheckCircle } from "lucide-react"

export function AboutUsSection() {
  const features = [
    "ISO 9001:2015 Kalite Yönetim Sistemi",
    "Deneyimli ve uzman kadro",
    "Modern makine parkı",
    "Zamanında teslimat garantisi",
    "Müşteri odaklı hizmet anlayışı",
    "Çevre dostu üretim süreçleri",
  ]

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-doralp-navy mb-6">
                Biz <span className="text-doralp-gold">Kimiz?</span>
              </h2>

              <p className="text-lg text-doralp-gray leading-relaxed mb-6">
                Doralp, 1998 yılından bu yana endüstriyel çelik yapı sektöründe faaliyet gösteren, kaliteli üretim ve
                güvenilir hizmet anlayışıyla sektörde öncü konumda yer alan bir firmadır.
              </p>

              <p className="text-lg text-doralp-gray leading-relaxed mb-8">
                Modern teknoloji ve deneyimli kadromuzla, fabrika binalarından endüstriyel tesislere kadar geniş bir
                yelpazede projeler gerçekleştirmekteyiz.
              </p>
            </div>

            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3"
                >
                  <CheckCircle className="h-5 w-5 text-doralp-gold flex-shrink-0" />
                  <span className="text-doralp-gray">{feature}</span>
                </div>
              ))}
            </div>

            <div>
              <Button
                asChild
                size="lg"
                className="bg-doralp-navy hover:bg-doralp-navy/90 text-white px-8 py-4 text-lg rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <Link href="/hakkimizda">Daha Fazla Bilgi</Link>
              </Button>
            </div>
          </div>

          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <Image
                src="/DoralpYapi_Ofis.jpeg"
                alt="Doralp Ofis"
                width={800}
                height={600}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-doralp-navy/20 to-transparent"></div>
            </div>

            {/* Decorative Elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-doralp-gold rounded-full opacity-20"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-doralp-navy rounded-full opacity-10"></div>
          </div>
        </div>
      </div>
    </section>
  )
}