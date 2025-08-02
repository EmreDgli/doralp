"use client"

import { PageHeader } from "@/components/page-header"
import { CounterSection } from "@/components/counter-section"
import Image from "next/image"
import { Award, Users, Target, ArrowRight } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: Award,
      title: "Kalite",
      description: "ISO 9001:2015 kalite standartlarında üretim",
    },
    {
      icon: Users,
      title: "Deneyim",
      description: "25+ yıllık sektör deneyimi",
    },
    {
      icon: Target,
      title: "Güvenilirlik",
      description: "Zamanında teslimat ve müşteri memnuniyeti",
    },
  ]

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="Hakkımızda" 
        subtitle="Doralp'in hikayesi, vizyonu ve değerleri"
        backgroundImage="/doralp-photo-2.jpg"
      />

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-doralp-navy mb-6">
                Doralp <span className="text-doralp-gold">Hikayemiz</span>
              </h2>

              <p className="text-lg text-doralp-gray leading-relaxed">
                Doralp, 1998 yılında kurulduğu günden bu yana endüstriyel çelik yapı sektöründe öncü bir konumda
                faaliyet göstermektedir. Kaliteli üretim, güvenilir hizmet ve müşteri memnuniyeti odaklı yaklaşımımızla
                sektörde saygın bir yer edinmiş bulunmaktayız.
              </p>

              <p className="text-lg text-doralp-gray leading-relaxed">
                Modern teknoloji altyapımız, deneyimli kadromuz ve sürekli gelişim anlayışımızla fabrika binalarından
                endüstriyel tesislere kadar geniş bir yelpazede projeler gerçekleştirmekteyiz. Müşterilerimizin
                ihtiyaçlarına özel çözümler sunarak, her projede mükemmelliği hedefliyoruz.
              </p>
            </div>

            {/* Right Image */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=500&width=700"
                  alt="Doralp Fabrika"
                  width={700}
                  height={500}
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => (
              <div key={index} className="text-center p-6 bg-doralp-light-gray rounded-2xl">
                <div className="w-16 h-16 bg-doralp-gold rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-doralp-navy mb-2">{value.title}</h3>
                <p className="text-doralp-gray">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Yeni Vizyon Bölümü - Görseldeki Renk Paleti */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50 to-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Sol Taraf - Metin İçeriği */}
            <div className="relative">
              {/* Büyük Tırnak İşareti */}
              <div className="absolute -top-8 -left-8 text-8xl md:text-9xl text-orange-300 font-serif opacity-60">
                "
              </div>
              
              <div className="relative z-10 space-y-6 pt-8">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                  Çeliğin Işıltılı Dünyası
                </h2>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  DORALP, çeliğin ışıltılı dünyası ile 1995 yılında tanışmış ve başarılarla geçmekte olan uzun bir yolculuğa adım atmıştır.
                </p>
                
                <p className="text-lg text-gray-700 leading-relaxed">
                  Endüstriyel çelik yapı sektöründe öncü konumumuzla, modern teknoloji ve geleneksel ustalığı birleştirerek müşterilerimize en kaliteli çözümleri sunuyoruz.
                </p>
                
                {/* İletişim Butonu */}
                <button className="bg-white text-orange-600 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium flex items-center gap-2">
                  Bize Ulaşın !
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sağ Taraf - Endüstriyel Görsel */}
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="/placeholder.svg?height=500&width=700"
                  alt="Doralp Endüstriyel Tesis"
                  width={700}
                  height={500}
                  className="object-cover"
                />
                {/* Endüstriyel Efekt Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CounterSection />
    </div>
  )
}
