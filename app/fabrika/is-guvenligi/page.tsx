"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Shield, HardHat, AlertTriangle, CheckCircle, FileText, Calendar, Building } from "lucide-react"
import Image from "next/image"

interface SafetyCertificate {
  id: string
  title: string
  description?: string
  certificate_number: string
  issue_date: string
  expiry_date?: string
  issuing_authority: string
  image_url?: string
  is_active: boolean
}

export default function IsGuvenligiPage() {
  const [certificates, setCertificates] = useState<SafetyCertificate[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const safetyMeasures = [
    {
      title: "Kişisel Koruyucu Donanım",
      description: "Tüm çalışanlarımız için zorunlu KKD kullanımı",
      icon: HardHat,
      items: ["Güvenlik kaskı", "Koruyucu gözlük", "İş eldivenleri", "Güvenlik ayakkabısı"],
    },
    {
      title: "Güvenlik Eğitimleri",
      description: "Düzenli güvenlik eğitimleri ve sertifikasyon programları",
      icon: Shield,
      items: ["İş güvenliği eğitimi", "İlk yardım eğitimi", "Yangın güvenliği", "Acil durum prosedürleri"],
    },
    {
      title: "Risk Değerlendirmesi",
      description: "Sürekli risk analizi ve önleyici tedbirler",
      icon: AlertTriangle,
      items: ["İş güvenliği analizi", "Risk haritalaması", "Önleyici tedbirler", "Düzenli denetimler"],
    },
  ]

  useEffect(() => {
    loadCertificates()
  }, [])

  const loadCertificates = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/safety-images')
      if (!response.ok) {
        throw new Error('Sertifikalar yüklenirken hata oluştu')
      }
      
      const data = await response.json()
      console.log('İş güvenliği sertifikaları:', data)
      
      // Sadece aktif sertifikaları filtrele
      const activeCertificates = data.filter((cert: SafetyCertificate) => cert.is_active)
      setCertificates(activeCertificates)
    } catch (err: any) {
      console.error('Sertifika yükleme hatası:', err)
      setError(err.message || 'Sertifikalar yüklenirken bir hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (certificate: SafetyCertificate) => {
    if (!certificate.expiry_date) {
      return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Süresiz</span>
    }

    const expiryDate = new Date(certificate.expiry_date)
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    if (expiryDate < today) {
      return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Süresi Dolmuş</span>
    } else if (expiryDate < thirtyDaysFromNow) {
      return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Yenilenmeli</span>
    } else {
      return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Geçerli</span>
    }
  }

  return (
    <div className="min-h-screen">
      <PageHeader title="İş Güvenliği" subtitle="Güvenli çalışma ortamı ve iş güvenliği standartlarımız" />

      <section className="py-16 md:py-24 bg-doralp-light-gray">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-doralp-navy mb-4">
              Güvenlik <span className="text-doralp-gold">Önceliğimiz</span>
            </h2>
            <p className="text-lg text-doralp-gray max-w-3xl mx-auto">
              Çalışanlarımızın güvenliği bizim için en önemli önceliktir. Modern güvenlik standartları ile çalışıyoruz.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {safetyMeasures.map((measure, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="w-16 h-16 bg-doralp-gold rounded-full flex items-center justify-center mx-auto mb-6">
                  <measure.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-doralp-navy text-center mb-4">{measure.title}</h3>
                <p className="text-doralp-gray text-center mb-6">{measure.description}</p>
                <ul className="space-y-2">
                  {measure.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-center text-doralp-gray">
                      <CheckCircle className="h-4 w-4 text-doralp-gold mr-2 flex-shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Certifications */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="text-2xl font-bold text-doralp-navy text-center mb-8">
              Sertifikalarımız ve <span className="text-doralp-gold">Standartlarımız</span>
            </h3>
            
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doralp-gold mx-auto mb-4"></div>
                <p className="text-doralp-gray">Sertifikalar yükleniyor...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                <p className="text-doralp-gray mb-2">Sertifikalar yüklenirken hata oluştu</p>
                <p className="text-sm text-gray-500">{error}</p>
              </div>
            ) : certificates.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {certificates.map((certificate) => (
                  <div key={certificate.id} className="bg-doralp-light-gray rounded-xl p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-5 w-5 text-doralp-gold" />
                        <h4 className="font-semibold text-doralp-navy">{certificate.title}</h4>
                      </div>
                      {getStatusBadge(certificate)}
                    </div>
                    
                    {certificate.description && (
                      <p className="text-sm text-doralp-gray mb-4">{certificate.description}</p>
                    )}
                    
                    <div className="space-y-2 text-sm text-doralp-gray mb-4">
                      <div className="flex items-center space-x-2">
                        <Shield className="h-4 w-4 text-doralp-gold" />
                        <span><strong>Sertifika No:</strong> {certificate.certificate_number}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-doralp-gold" />
                        <span><strong>Veriliş:</strong> {new Date(certificate.issue_date).toLocaleDateString('tr-TR')}</span>
                      </div>
                      {certificate.expiry_date && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-doralp-gold" />
                          <span><strong>Son Geçerlilik:</strong> {new Date(certificate.expiry_date).toLocaleDateString('tr-TR')}</span>
                        </div>
                      )}
                      <div className="flex items-center space-x-2">
                        <Building className="h-4 w-4 text-doralp-gold" />
                        <span><strong>Veren Kurum:</strong> {certificate.issuing_authority}</span>
                      </div>
                    </div>
                    
                    {certificate.image_url && (
                      <div className="mt-4">
                        <button
                          onClick={() => window.open(certificate.image_url, '_blank')}
                          className="w-full bg-white rounded-lg p-3 border border-gray-200 hover:border-doralp-gold transition-colors"
                        >
                          <div className="aspect-video relative rounded overflow-hidden mb-2">
                            <Image
                              src={certificate.image_url}
                              alt={certificate.title}
                              fill
                              className="object-cover"
                              onError={(e) => {
                                console.error('Certificate image load error:', certificate.image_url)
                                e.currentTarget.src = "/placeholder.svg"
                              }}
                            />
                          </div>
                          <p className="text-xs text-center text-doralp-gray">Sertifikayı görüntüle</p>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-doralp-gray mb-2">Henüz sertifika eklenmemiş</p>
                <p className="text-sm text-gray-500">Admin panelinden sertifika ekleyebilirsiniz</p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
