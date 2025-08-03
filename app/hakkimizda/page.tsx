"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { CounterSection } from "@/components/counter-section"
import Image from "next/image"
import { Award, Users, Target, ArrowRight, Eye } from "lucide-react"

// Hakkımızda sayfa içerik interface'leri
interface StoryContent {
  title: string
  paragraphs: string[]
}

interface HeritageContent {
  title: string
  paragraphs: string[]
}

interface MomentContent {
  title: string
  description: string
}

interface SpecialMomentsContent {
  mainTitle: string
  description?: string
  moments: MomentContent[]
}

interface AboutContent {
  story: StoryContent
  heritage: HeritageContent
  specialMoments: SpecialMomentsContent
}

export default function AboutPage() {
  // Varsayılan hakkımızda içeriği
  const defaultAboutContent: AboutContent = {
    story: {
      title: 'Doralp Hikayemiz',
      paragraphs: [
        'Doralp, 1998 yılında kurulduğu günden bu yana endüstriyel çelik yapı sektöründe öncü bir konumda faaliyet göstermektedir. Kaliteli üretim, güvenilir hizmet ve müşteri memnuniyeti odaklı yaklaşımımızla sektörde saygın bir yer edinmiş bulunmaktayız.',
        'Modern teknoloji altyapımız, deneyimli kadromuz ve sürekli gelişim anlayışımızla fabrika binalarından endüstriyel tesislere kadar geniş bir yelpazede projeler gerçekleştirmekteyiz. Müşterilerimizin ihtiyaçlarına özel çözümler sunarak, her projede mükemmelliği hedefliyoruz.'
      ]
    },
    heritage: {
      title: 'Çeliğin Işıltılı Dünyası',
      paragraphs: [
        'DORALP, çeliğin ışıltılı dünyası ile 1995 yılında tanışmış ve başarılarla geçmekte olan uzun bir yolculuğa adım atmıştır.',
        'Endüstriyel çelik yapı sektöründe öncü konumumuzla, modern teknoloji ve geleneksel ustalığı birleştirerek müşterilerimize en kaliteli çözümleri sunuyoruz.'
      ]
    },
    specialMoments: {
      mainTitle: 'Özelleştiğimiz Anlar',
      description: 'Her projede fark yaratan anlarımız ve başarı hikayelerimiz',
      moments: [
        {
          title: 'İlk Büyük Proje',
          description: '1998 yılında aldığımız ilk büyük endüstriyel tesis projesi ile sektördeki yerimizi sağlamlaştırdık.'
        },
        {
          title: 'Teknolojik Dönüşüm',
          description: 'Modern üretim teknolojilerini bünyemize katarak kalite standartlarımızı uluslararası seviyeye taşıdık.'
        },
        {
          title: 'Sürdürülebilirlik',
          description: 'Çevre dostu üretim süreçleri ile hem doğayı koruyor hem de gelecek nesillere yaşanabilir bir dünya bırakıyoruz.'
        }
      ]
    }
  }

  const [aboutContent, setAboutContent] = useState<AboutContent>(defaultAboutContent)

  // localStorage'dan verileri yükle
  useEffect(() => {
    const savedContent = localStorage.getItem('aboutContent')
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent)
        setAboutContent(parsedContent)
      } catch (error) {
        console.error('About content parse error:', error)
        setAboutContent(defaultAboutContent)
      }
    }
  }, [])

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
      <div className="animate-fade-in">
        <PageHeader 
          title="Hakkımızda" 
          subtitle="Doralp'in hikayesi, vizyonu ve değerleri"
          backgroundImage="/doralp-photo-2.jpg"
        />
      </div>

      {/* Main Content */}
      <section className="py-16 md:py-24 bg-white animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center mb-16">
            {/* Left Content */}
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-doralp-navy mb-6">
                {aboutContent.story?.title ? (
                  <>
                    {aboutContent.story.title.split(' ').slice(0, -1).join(' ')} <span className="text-doralp-gold">{aboutContent.story.title.split(' ').slice(-1)[0]}</span>
                  </>
                ) : (
                  <>Doralp <span className="text-doralp-gold">Hikayemiz</span></>
                )}
              </h2>

              {(aboutContent.story?.paragraphs || []).map((paragraph, index) => (
                <p key={index} className="text-lg text-doralp-gray leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Right Image */}
            <div className="relative max-w-md mx-auto lg:max-w-lg">
              <div className="relative overflow-hidden">
                <Image
                  src="/doralp-photo-5.jpg"
                  alt="Doralp Fabrika"
                  width={500}
                  height={350}
                  className="object-cover w-full h-auto"
                />
              </div>
            </div>
          </div>

          {/* Values Section */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {values.map((value, index) => (
              <div 
                key={index} 
                className={`text-center p-6 bg-doralp-light-gray rounded-2xl animate-card-up animate-delay-${(index + 1) * 200}`}
              >
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
      <section className="py-16 md:py-24 bg-gradient-to-br from-orange-50 to-orange-100 animate-slide-up" style={{ animationDelay: '0.4s' }}>
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
                  {aboutContent.heritage?.title || 'Çeliğin Işıltılı Dünyası'}
                </h2>
                
                {(aboutContent.heritage?.paragraphs || []).map((paragraph, index) => (
                  <p key={index} className="text-lg text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))}
                
                {/* İletişim Butonu */}
                <button className="bg-white text-orange-600 px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 font-medium flex items-center gap-2">
                  Bize Ulaşın !
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Sağ Taraf - Endüstriyel Görsel */}
            <div className="relative">
              <div className="relative overflow-hidden">
                <Image
                  src="/herosection-doralp-foto.jpg"
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

      {/* Özelleştiğimiz Anlar Bölümü */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-gray-50 to-blue-50 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-doralp-navy mb-6">
              {aboutContent.specialMoments?.mainTitle || 'Özelleştiğimiz Anlar'}
            </h2>
            {aboutContent.specialMoments?.description && (
              <p className="text-xl text-doralp-gray max-w-4xl mx-auto leading-relaxed">
                {aboutContent.specialMoments.description}
              </p>
            )}
            <div className="w-24 h-1 bg-gradient-to-r from-doralp-gold to-doralp-navy mx-auto mt-8"></div>
          </div>

          <div className="space-y-12">
            {(aboutContent.specialMoments?.moments || []).map((moment, index) => (
              <div 
                key={index} 
                className={`flex flex-col lg:flex-row items-center gap-8 lg:gap-12 animate-card-up animate-delay-${(index + 3) * 200} ${
                  index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                }`}
              >
                {/* İçerik Kısmı */}
                <div className="flex-1 lg:max-w-2xl">
                  <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl hover:shadow-2xl transition-all duration-300 border border-gray-100">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-doralp-gold to-yellow-500 rounded-full flex items-center justify-center mr-4 shadow-lg">
                        <span className="text-white font-bold text-xl">{index + 1}</span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold text-doralp-navy">
                        {moment.title}
                      </h3>
                    </div>
                    <p className="text-lg text-doralp-gray leading-relaxed">
                      {moment.description}
                    </p>
                    
                    {/* Decorative Element */}
                    <div className="mt-6 flex items-center">
                      <div className="flex-1 h-px bg-gradient-to-r from-doralp-gold/30 to-transparent"></div>
                      <div className="w-2 h-2 bg-doralp-gold rounded-full mx-3"></div>
                      <div className="flex-1 h-px bg-gradient-to-l from-doralp-gold/30 to-transparent"></div>
                    </div>
                  </div>
                </div>

                {/* Görsel/İkon Kısmı */}
                <div className="flex-shrink-0">
                  <div className="w-48 h-48 lg:w-56 lg:h-56 bg-gradient-to-br from-doralp-navy to-blue-800 flex items-center justify-center relative overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-20">
                      <div className="absolute top-4 left-4 w-8 h-8 border-2 border-white"></div>
                      <div className="absolute top-12 right-8 w-4 h-4 border border-white"></div>
                      <div className="absolute bottom-8 left-8 w-6 h-6 border border-white"></div>
                      <div className="absolute bottom-4 right-4 w-3 h-3 bg-white"></div>
                    </div>
                    
                    {/* Ana İkon */}
                    <div className="relative z-10">
                      {index === 0 && (
                        <svg className="w-20 h-20 text-doralp-gold" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" />
                        </svg>
                      )}
                      {index === 1 && (
                        <svg className="w-20 h-20 text-doralp-gold" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9.5 3A6.5 6.5 0 0 1 16 9.5c0 1.61-.59 3.09-1.56 4.23l.27.27h.79l5 5-1.5 1.5-5-5v-.79l-.27-.27A6.516 6.516 0 0 1 9.5 16 6.5 6.5 0 0 1 3 9.5 6.5 6.5 0 0 1 9.5 3m0 2C7 5 5 7 5 9.5S7 14 9.5 14 14 12 14 9.5 12 5 9.5 5z"/>
                        </svg>
                      )}
                      {index === 2 && (
                        <svg className="w-20 h-20 text-doralp-gold" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M17,8C8,10 5.9,16.17 3.82,21.34L5.71,22L6.66,19.7C7.14,19.87 7.64,20 8,20C19,20 22,3 22,3C21,5 14,5.25 9,6.25C4,7.25 2,11.5 2,13.5C2,15.5 3.75,17.25 3.75,17.25C7,8 17,8 17,8Z"/>
                        </svg>
                      )}
                      {index > 2 && (
                        <svg className="w-20 h-20 text-doralp-gold" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4M12,6A6,6 0 0,0 6,12A6,6 0 0,0 12,18A6,6 0 0,0 18,12A6,6 0 0,0 12,6M12,8A4,4 0 0,1 16,12A4,4 0 0,1 12,16A4,4 0 0,1 8,12A4,4 0 0,1 12,8Z"/>
                        </svg>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Alt Decorative Section */}
          <div className="mt-20 text-center">
            <div className="inline-flex items-center justify-center space-x-2">
              <div className="w-8 h-px bg-doralp-gold"></div>
              <div className="w-2 h-2 bg-doralp-gold rounded-full"></div>
              <div className="w-12 h-px bg-doralp-gold"></div>
              <div className="w-3 h-3 bg-doralp-navy rounded-full"></div>
              <div className="w-12 h-px bg-doralp-gold"></div>
              <div className="w-2 h-2 bg-doralp-gold rounded-full"></div>
              <div className="w-8 h-px bg-doralp-gold"></div>
            </div>
          </div>
        </div>
      </section>

      <div className="animate-slide-up" style={{ animationDelay: '0.8s' }}>
        <CounterSection />
      </div>
    </div>
  )
}
