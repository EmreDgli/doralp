"use client"

import { useState, useEffect } from "react"
import { PageHeader } from "@/components/page-header"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Award, Calendar, Building, Download, FileText, X } from "lucide-react"
import Image from "next/image"

interface QualityCertificate {
  id: string
  title: string
  description: string
  certificate_number: string
  issue_date: string
  expiry_date?: string
  issuing_authority: string
  certificate_file_url?: string
  image_url?: string
  is_active: boolean
  created_at: string
}

export default function QualitySystemPage() {
  const [certificates, setCertificates] = useState<QualityCertificate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [selectedTitle, setSelectedTitle] = useState<string>("")

  // Sertifikaları yükle
  const loadCertificates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/quality-system')
      if (response.ok) {
        const data = await response.json()
        // Sadece aktif sertifikaları göster
        setCertificates(data.filter((cert: QualityCertificate) => cert.is_active))
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
      <div className="animate-fade-in">
        <PageHeader 
          title="Kalite Sistemi" 
          subtitle="Sertifikalarımız ve kalite standartlarımız"
          backgroundImage="/doralp-photo-1.jpg"
        />
      </div>

      {/* Ana İçerik */}
      <section className="py-16 md:py-24 bg-white animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Giriş Metni */}
          <div className="text-center mb-16 animate-slide-up" style={{ animationDelay: '0.3s' }}>
            <h2 className="text-3xl md:text-4xl font-bold text-doralp-navy mb-6">
              Kalite <span className="text-doralp-gold">Standartlarımız</span>
            </h2>
            <p className="text-lg text-doralp-gray max-w-4xl mx-auto leading-relaxed">
              Doralp Yapı olarak, endüstriyel çelik yapı sektöründe en yüksek kalite standartlarını yakalamak için 
              ulusal ve uluslararası sertifikasyonlarla donatılmış bir sisteme sahibiz. ISO standartları ve diğer 
              kalite belgelendirmeleriyle müşterilerimize güvenilir hizmet sunuyoruz.
            </p>
          </div>

          {/* Sertifikalar Grid */}
          {isLoading ? (
            <div className="text-center py-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doralp-navy mx-auto"></div>
              <p className="text-doralp-gray mt-4">Sertifikalar yükleniyor...</p>
            </div>
          ) : certificates.length === 0 ? (
            <div className="text-center py-12 animate-slide-up" style={{ animationDelay: '0.4s' }}>
              <Award className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-doralp-gray">Henüz sertifika bulunmuyor</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {certificates.map((certificate, index) => (
                <Card 
                  key={certificate.id} 
                  className={`hover:shadow-2xl transition-all duration-300 border-l-4 border-doralp-gold animate-card-up animate-delay-${(index + 1) * 200}`}
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
                      <div className="w-full h-48 bg-gradient-to-br from-doralp-navy to-blue-800 rounded-lg flex items-center justify-center mb-4">
                        <Award className="h-16 w-16 text-doralp-gold" />
                      </div>
                    )}
                    
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-xl font-bold text-doralp-navy leading-tight">
                        {certificate.title}
                      </CardTitle>
                      <div className="flex flex-col gap-2 ml-2">
                        {isExpired(certificate.expiry_date) && (
                          <Badge variant="destructive" className="text-xs">
                            Süresi Dolmuş
                          </Badge>
                        )}
                        {!isExpired(certificate.expiry_date) && isExpiringSoon(certificate.expiry_date) && (
                          <Badge variant="secondary" className="text-xs bg-yellow-100 text-yellow-800">
                            Yakında Bitiyor
                          </Badge>
                        )}
                        {!isExpired(certificate.expiry_date) && !isExpiringSoon(certificate.expiry_date) && (
                          <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                            Geçerli
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    {certificate.description && (
                      <p className="text-doralp-gray text-sm leading-relaxed">
                        {certificate.description}
                      </p>
                    )}
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <FileText className="h-4 w-4 text-doralp-gold flex-shrink-0" />
                        <span className="text-doralp-gray">
                          <strong>Sertifika No:</strong> {certificate.certificate_number}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-doralp-gold flex-shrink-0" />
                        <span className="text-doralp-gray">
                          <strong>Veriliş:</strong> {formatDate(certificate.issue_date)}
                        </span>
                      </div>
                      
                      {certificate.expiry_date && (
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-doralp-gold flex-shrink-0" />
                          <span className="text-doralp-gray">
                            <strong>Geçerlilik:</strong> {formatDate(certificate.expiry_date)}
                          </span>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-doralp-gold flex-shrink-0" />
                        <span className="text-doralp-gray">
                          <strong>Veren Kurum:</strong> {certificate.issuing_authority}
                        </span>
                      </div>
                    </div>
                    
                    {certificate.certificate_file_url && (
                      <div className="pt-4 border-t border-gray-100">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full hover:bg-doralp-navy hover:text-white transition-colors"
                          onClick={() => window.open(certificate.certificate_file_url, '_blank')}
                        >
                          <Download className="h-4 w-4 mr-2" />
                          Sertifikayı İndir
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Kalite Politikası */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-doralp-navy to-blue-900 text-white animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-8">
              Kalite <span className="text-doralp-gold">Politikamız</span>
            </h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Award className="h-12 w-12 text-doralp-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Sürekli İyileştirme</h3>
                <p className="text-gray-200">
                  Kalite yönetim sistemimizi sürekli geliştirerek müşteri memnuniyetini en üst seviyede tutuyoruz.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Building className="h-12 w-12 text-doralp-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Uluslararası Standartlar</h3>
                <p className="text-gray-200">
                  ISO 9001, ISO 14001 ve OHSAS 18001 standartlarıyla global kalite seviyesinde hizmet veriyoruz.
                </p>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6">
                <Calendar className="h-12 w-12 text-doralp-gold mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-3">Düzenli Denetim</h3>
                <p className="text-gray-200">
                  Sertifikalarımızı düzenli olarak yenileyerek kalite standartlarımızı koruyoruz.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Görsel Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && closeImageModal()}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 overflow-hidden">
          <div className="relative">
            {/* Kapatma butonu */}
            <Button
              variant="outline"
              size="icon"
              className="absolute top-4 right-4 z-10 bg-black/50 hover:bg-black/70 text-white border-none"
              onClick={closeImageModal}
            >
              <X className="h-4 w-4" />
            </Button>
            
            {/* Görsel */}
            {selectedImage && (
              <div className="relative w-full h-[70vh]">
                <Image
                  src={selectedImage}
                  alt={selectedTitle}
                  fill
                  className="object-contain"
                  priority
                />
              </div>
            )}
            
            {/* Başlık */}
            {selectedTitle && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                <h3 className="text-white text-xl font-bold">{selectedTitle}</h3>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}