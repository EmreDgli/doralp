"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { ContactForm } from "@/components/contact-form"
import { MapEmbed } from "@/components/map-embed"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

// İletişim kartı interface'i
interface ContactCard {
  id: string
  title: string
  icon: string
  color: string
  details: string[]
}

const iconMap = {
  phone: Phone,
  email: Mail,
  address: MapPin,
  clock: Clock
}

// Varsayılan iletişim kartları
const defaultContactItems: ContactCard[] = [
  {
    id: '1',
    title: 'Telefon',
    icon: 'phone',
    color: 'bg-blue-500',
    details: [
      '(+90) 212 123 45 67',
      '(+90) 212 123 45 68'
    ]
  },
  {
    id: '2',
    title: 'E-posta',
    icon: 'email',
    color: 'bg-green-500',
    details: [
      'info@doralp.com.tr',
      'satis@doralp.com.tr'
    ]
  },
  {
    id: '3',
    title: 'Adres',
    icon: 'address',
    color: 'bg-red-500',
    details: [
      'Organize Sanayi Bölgesi',
      '1. Cadde No: 123',
      'İstanbul, Türkiye'
    ]
  },
  {
    id: '4',
    title: 'Çalışma Saatleri',
    icon: 'clock',
    color: 'bg-purple-500',
    details: [
      'Pazartesi - Cuma: 08:00 - 18:00',
      'Cumartesi: 08:00 - 16:00'
    ]
  }
]

// Konum bilgisi interface'i
interface LocationInfo {
  title: string
  subtitle: string
  address: string
  mapEmbedUrl?: string
}

// Varsayılan konum bilgisi
const defaultLocationInfo: LocationInfo = {
  title: 'Konum',
  subtitle: 'Fabrikamızı ve ofisimizi ziyaret etmek için aşağıdaki konum bilgilerini kullanabilirsiniz.',
  address: 'Organize Sanayi Bölgesi, 1. Cadde No: 123, İstanbul, Türkiye',
  mapEmbedUrl: ''
}

export default function IletisimPage() {
  const [contactItems, setContactItems] = useState<ContactCard[]>(defaultContactItems)
  const [locationInfo, setLocationInfo] = useState<LocationInfo>(defaultLocationInfo)

  // localStorage'dan kartları ve konum bilgisini yükle
  useEffect(() => {
    // İletişim kartlarını yükle
    const savedCards = localStorage.getItem('contactCards')
    if (savedCards) {
      try {
        const parsedCards = JSON.parse(savedCards)
        setContactItems(parsedCards)
      } catch (error) {
        console.error('Contact cards parse error:', error)
        setContactItems(defaultContactItems)
      }
    }

    // Konum bilgisini yükle
    const savedLocation = localStorage.getItem('locationInfo')
    if (savedLocation) {
      try {
        const parsedLocation = JSON.parse(savedLocation)
        setLocationInfo(parsedLocation)
      } catch (error) {
        console.error('Location info parse error:', error)
        setLocationInfo(defaultLocationInfo)
      }
    }
  }, [])

  return (
    <div className="min-h-screen">
      <PageHeader 
        title="İletişim" 
        subtitle="Bizimle iletişime geçin, projeleriniz için destek alalım"
        backgroundImage="/iletisimresmi.png"
      />

      {/* Contact Form and Info Cards */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Left Side - Contact Form */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
              <h3 className="text-2xl md:text-3xl font-bold text-doralp-navy mb-4">
                Bize <span className="text-doralp-gold">Ulaşın</span>
              </h3>
              <p className="text-doralp-gray mb-6">
                Projeniz hakkında detaylı bilgi almak için formu doldurun, 
                size en kısa sürede dönüş yapalım.
              </p>
              <ContactForm />
            </div>

            {/* Right Side - Contact Info Cards */}
            <div className="space-y-6">
              <div className="text-center lg:text-left mb-6">
                <h3 className="text-2xl md:text-3xl font-bold text-doralp-navy mb-4">
                  İletişim <span className="text-doralp-gold">Bilgileri</span>
                </h3>
                <p className="text-lg text-doralp-gray">
                  Endüstriyel çelik yapı projeleri için profesyonel çözümler sunuyoruz.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
                {contactItems.map((info) => {
                  const IconComponent = iconMap[info.icon as keyof typeof iconMap]
                  return (
                    <div
                      key={info.id}
                      className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 group border border-gray-100 hover:border-doralp-gold/20"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`w-12 h-12 ${info.color} rounded-full flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300`}>
                          <IconComponent className="h-6 w-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-doralp-navy mb-2 group-hover:text-doralp-gold transition-colors">
                            {info.title}
                          </h4>
                          <div className="space-y-1">
                            {info.details.map((detail, detailIndex) => (
                              <p key={detailIndex} className="text-doralp-gray text-sm leading-relaxed">
                                {detail}
                              </p>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 md:py-20 bg-doralp-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl md:text-3xl font-bold text-doralp-navy mb-4">
              <span className="text-doralp-gold">{locationInfo.title}</span>
            </h3>
            {locationInfo.subtitle && (
              <p className="text-lg text-doralp-gray max-w-2xl mx-auto">
                {locationInfo.subtitle}
              </p>
            )}
            {locationInfo.address && (
              <p className="text-md text-doralp-gray max-w-2xl mx-auto mt-2">
                {locationInfo.address}
              </p>
            )}
          </div>
          
          <div className="bg-white rounded-2xl p-4 md:p-8">
            {locationInfo.mapEmbedUrl ? (
              <div className="w-full h-96 md:h-[500px] lg:h-[600px] rounded-lg overflow-hidden">
                <div 
                  className="w-full h-full"
                  dangerouslySetInnerHTML={{ 
                    __html: locationInfo.mapEmbedUrl.replace(
                      /width="[^"]*"/g, 'width="100%"'
                    ).replace(
                      /height="[^"]*"/g, 'height="100%"'
                    ).replace(
                      /style="[^"]*"/g, 'style="border:0; width: 100%; height: 100%;"'
                    )
                  }}
                />
              </div>
            ) : (
              <div className="w-full h-96 md:h-[500px] lg:h-[600px] bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3010.2441!2d29.0875!3d41.0082!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDHCsDAwJzI5LjUiTiAyOcKwMDUnMTUuMCJF!5e0!3m2!1str!2str!4v1234567890"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}