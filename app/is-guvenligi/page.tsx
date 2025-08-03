"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Shield, Calendar, Building, Download, FileText, X, HardHat, UserCheck, AlertTriangle } from "lucide-react"
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
  created_at: string
}

export default function SafetyPage() {
  const [certificates, setCertificates] = useState<SafetyCertificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<string>("")

  // Sertifikaları yükle
  const loadCertificates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/safety-images')
      if (response.ok) {
        const data = await response.json()
        // Sadece aktif sertifikaları göster
        setCertificates(data.filter((cert: SafetyCertificate) => cert.is_active))
      }
    } catch (error) {
      console.error('Load certificates error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCertificates()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR')
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const diffTime = expiry.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays <= 90 && diffDays > 0 // 90 gün veya daha az kaldıysa
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    return expiry < today
  }

  const openImageModal = (imageUrl: string, title: string) => {
    setSelectedImage(imageUrl)
    setSelectedTitle(title)
  }

  const closeImageModal = () => {
    setSelectedImage(null)
    setSelectedTitle("")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader 
        title="İş Güvenliği" 
        description="İş sağlığı ve güvenliği konusundaki sertifikalarımız ve politikalarımız"
        breadcrumbs={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'İş Güvenliği', href: '/is-guvenligi' }
        ]}
      />

      {/* Hero Section */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-red-800 to-red-900 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto text-center animate-slide-up">
            <HardHat className="h-16 w-16 text-yellow-400 mx-auto mb-6" />
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              İş Sağlığı ve Güvenliği
            </h1>
            <p className="text-xl md:text-2xl text-red-100 leading-relaxed">
              Çalışanlarımızın güvenliği en büyük önceliğimizdir. Uluslararası standartlarda güvenlik önlemleri alarak, 
              güvenli çalışma ortamları oluşturuyoruz.
            </p>
          </div>
        </div>
      </section>

      {/* Sertifikalar Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 animate-slide-up">
            <h2 className="text-3xl md:text-4xl font-bold text-doralp-navy mb-4">
              Güvenlik Sertifikalarımız
            </h2>
            <p className="text-lg text-doralp-gray max-w-3xl mx-auto">
              İş sağlığı ve güvenliği alanındaki sertifikalarımız, güvenli çalışma ortamı taahhüdümüzün belgesidir.
            </p>
          </div>

          {/* Sertifikalar Grid */}
          {isLoading ? (
            <div className="text-center py-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-800 mx-auto"></div>
              <p className="text-doralp-gray mt-4">Sertifikalar yükleniyor...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Shield className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-doralp-gray">Henüz güvenlik sertifikası bulunmuyor</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              {certificates.map((certificate, index) => (
                <Card 
                  key={certificate.id} 
                  className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border-0 bg-white animate-slide-up" 
                  style={{ animationDelay: `${(index + 1) * 200}ms` }}
                >
                  <CardHeader className="pb-4">
                    {certificate.image_url ? (
                      <div 
                        className="relative w-full h-48 mb-4 rounded-lg overflow-hidden cursor-pointer group"
                        onClick={() => openImageModal(certificate.image_url!, certificate.title)}
                      >
                        <Image
                          src={certificate.image_url}
                          alt={certificate.title}
                          fill
                          className="object-cover hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                          <span className="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 px-3 py-1 rounded-lg text-sm">
                            Büyütmek için tıklayın
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gradient-to-br from-red-800 to-red-900 rounded-lg flex items-center justify-center mb-4">
                        <Shield className="h-16 w-16 text-yellow-400" />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-doralp-navy mb-2 flex-1">
                        {certificate.title}
                      </CardTitle>
                      <div className="ml-2">
                        {!certificate.expiry_date ? (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                            Süresiz
                          </Badge>
                        ) : isExpired(certificate.expiry_date) ? (
                          <Badge variant="destructive" className="bg-red-100 text-red-800">
                            Süresi Dolmuş
                          </Badge>
                        ) : isExpiringSoon(certificate.expiry_date) ? (
                          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
                            Yenilenmeli
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                            Geçerli
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    {certificate.description && (
                      <p className="text-doralp-gray mb-4 leading-relaxed">
                        {certificate.description}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-start space-x-3">
                        <FileText className="h-5 w-5 text-doralp-gold mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-doralp-navy">Sertifika Numarası</p>
                          <p className="text-sm text-doralp-gray">{certificate.certificate_number}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <Calendar className="h-5 w-5 text-doralp-gold mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-doralp-navy">Veriliş Tarihi</p>
                          <p className="text-sm text-doralp-gray">{formatDate(certificate.issue_date)}</p>
                        </div>
                      </div>
                      
                      {certificate.expiry_date && (
                        <div className="flex items-start space-x-3">
                          <AlertTriangle className="h-5 w-5 text-doralp-gold mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm font-medium text-doralp-navy">Son Geçerlilik</p>
                            <p className="text-sm text-doralp-gray">{formatDate(certificate.expiry_date)}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-start space-x-3">
                        <Building className="h-5 w-5 text-doralp-gold mt-0.5 flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-doralp-navy">Veren Kurum</p>
                          <p className="text-sm text-doralp-gray">{certificate.issuing_authority}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Güvenlik Politikası */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-red-800 to-red-900 text-white animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                İş Güvenliği Politikamız
              </h2>
              <p className="text-xl text-red-100">
                Güvenli çalışma ortamı oluşturmak için benimsediğimiz temel ilkeler
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                <UserCheck className="h-12 w-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Personel Eğitimi</h3>
                <p className="text-red-100 leading-relaxed">
                  Tüm çalışanlarımız düzenli olarak iş güvenliği eğitimleri alır ve sertifikalandırılır.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                <HardHat className="h-12 w-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Koruyucu Ekipmanlar</h3>
                <p className="text-red-100 leading-relaxed">
                  EN standartlarına uygun kişisel koruyucu donanımlar kullanılır ve düzenli olarak kontrol edilir.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 hover:bg-white/20 transition-all duration-300">
                <AlertTriangle className="h-12 w-12 text-yellow-400 mb-4" />
                <h3 className="text-xl font-bold mb-3">Risk Analizi</h3>
                <p className="text-red-100 leading-relaxed">
                  Her proje öncesi detaylı risk analizi yapılır ve önleyici tedbirler alınır.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={closeImageModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <div className="relative">
            <button 
              onClick={closeImageModal}
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
            {selectedImage && (
              <div className="relative">
                <Image
                  src={selectedImage}
                  alt={selectedTitle}
                  width={800}
                  height={600}
                  className="w-full h-auto max-h-[85vh] object-contain"
                />
                {selectedTitle && (
                  <div className="absolute bottom-0 left-0 right-0 bg-black/70 text-white p-4">
                    <h3 className="text-lg font-semibold">{selectedTitle}</h3>
                  </div>
                )}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}