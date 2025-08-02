"use client"

import { PageHeader } from "@/components/page-header"
import { ContactForm } from "@/components/contact-form"
import { MapEmbed } from "@/components/map-embed"
import { Mail, Phone, MapPin, Clock } from "lucide-react"

// Statik iletişim kartları
const contactItems = [
  {
    id: '1',
    title: 'Telefon',
    icon: Phone,
    color: 'bg-blue-500',
    details: [
      '(+90) 212 123 45 67',
      '(+90) 212 123 45 68'
    ]
  },
  {
    id: '2',
    title: 'E-posta',
    icon: Mail,
    color: 'bg-green-500',
    details: [
      'info@doralp.com.tr',
      'satis@doralp.com.tr'
    ]
  },
  {
    id: '3',
    title: 'Adres',
    icon: MapPin,
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
    icon: Clock,
    color: 'bg-purple-500',
    details: [
      'Pazartesi - Cuma: 08:00 - 18:00',
      'Cumartesi: 08:00 - 16:00'
    ]
  }
]

// Statik konum bilgisi
const locationInfo = {
  title: 'Konum',
  subtitle: 'Fabrikamızı ve ofisimizi ziyaret etmek için aşağıdaki konum bilgilerini kullanabilirsiniz.',
  address: 'Organize Sanayi Bölgesi, 1. Cadde No: 123, İstanbul, Türkiye'
}

export default function IletisimPage() {
  return (
    <div className="min-h-screen">
      <PageHeader 
        title="İletişim" 
        subtitle="Bizimle iletişime geçin, projeleriniz için destek alalım"
        backgroundImage="/doralp-photo-3.jpg"
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
                  const IconComponent = info.icon
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
            <p className="text-lg text-doralp-gray max-w-2xl mx-auto">
              {locationInfo.subtitle}
            </p>
            <p className="text-md text-doralp-gray max-w-2xl mx-auto mt-2">
              {locationInfo.address}
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8">
            <MapEmbed />
          </div>
        </div>
      </section>
    </div>
  )
}