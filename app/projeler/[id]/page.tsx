"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { PageHeader } from "@/components/page-header"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, MapPin, Building, ChevronLeft, ChevronRight } from "lucide-react"

interface ProjectImage {
  id: string
  image_url: string
  alt_text: string | null
  is_primary: boolean
}

interface ProjectDetail {
  id: string
  title: string
  description: string | null
  location: string | null
  category: string | null
  date: string | null
  end_date: string | null
  language: string
  created_at: string
  updated_at: string
  project_images: ProjectImage[]
}

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [project, setProject] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  useEffect(() => {
    const fetchProject = async () => {
      try {
        setLoading(true)
        console.log('Fetching project with ID:', params.id)
        const response = await fetch(`/api/projects/${params.id}`)
        
        console.log('Response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Error:', errorData)
          throw new Error(errorData.message || 'Proje bulunamadı')
        }
        
        const data = await response.json()
        console.log('Project data received:', data)
        setProject(data)
      } catch (err) {
        console.error('Error fetching project:', err)
        setError(err instanceof Error ? err.message : 'Bir hata oluştu')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchProject()
    }
  }, [params.id])

  const nextImage = () => {
    if (project?.project_images.length) {
      setCurrentImageIndex((prev) => 
        prev === project.project_images.length - 1 ? 0 : prev + 1
      )
    }
  }

  const prevImage = () => {
    if (project?.project_images.length) {
      setCurrentImageIndex((prev) => 
        prev === 0 ? project.project_images.length - 1 : prev - 1
      )
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Proje Detayı" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="h-96 bg-gray-200 rounded mb-8"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !project) {
    return (
      <div className="min-h-screen">
        <PageHeader title="Proje Bulunamadı" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Proje Bulunamadı</h2>
          <p className="text-gray-600 mb-8">{error || 'İstenen proje mevcut değil.'}</p>
          <Button onClick={() => router.push('/projeler')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Projelere Dön
          </Button>
        </div>
      </div>
    )
  }

  const currentImage = project.project_images[currentImageIndex]
  const hasImages = project.project_images.length > 0

  return (
    <div className="min-h-screen">
      <PageHeader 
        title={project.title} 
        subtitle={project.category || "Proje Detayı"}
      />

      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Geri Dön Butonu */}
          <div className="mb-8">
            <Button 
              onClick={() => router.push('/projeler')} 
              variant="outline"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Projelere Dön
            </Button>
          </div>

          <div className="grid lg:grid-cols-2 gap-12">
            {/* Sol Taraf - Görsel Galeri */}
            <div className="space-y-6">
              {hasImages ? (
                <>
                  {/* Ana Görsel */}
                  <div className="relative aspect-video bg-gray-100 rounded-2xl overflow-hidden">
                    <Image
                      src={currentImage.image_url}
                      alt={currentImage.alt_text || project.title}
                      fill
                      className="object-cover"
                    />
                    
                    {/* Navigasyon Butonları */}
                    {project.project_images.length > 1 && (
                      <>
                        <button
                          onClick={prevImage}
                          className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={nextImage}
                          className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition-colors"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                    
                    {/* Görsel Sayacı */}
                    {project.project_images.length > 1 && (
                      <div className="absolute bottom-4 right-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
                        {currentImageIndex + 1} / {project.project_images.length}
                      </div>
                    )}
                  </div>

                  {/* Küçük Görseller */}
                  {project.project_images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto pb-2">
                      {project.project_images.map((img, index) => (
                        <button
                          key={img.id}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                            index === currentImageIndex 
                              ? 'border-doralp-gold' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <Image
                            src={img.image_url}
                            alt={img.alt_text || `${project.title} ${index + 1}`}
                            fill
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
                  <div className="text-center text-gray-500">
                    <Building className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Görsel mevcut değil</p>
                  </div>
                </div>
              )}
            </div>

            {/* Sağ Taraf - Proje Bilgileri */}
            <div className="space-y-6">
              {/* Başlık ve Kategori */}
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <h1 className="text-3xl md:text-4xl font-bold text-doralp-navy">
                    {project.title}
                  </h1>
                  {project.category && (
                    <Badge className="bg-doralp-gold text-white">
                      {project.category}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Proje Detayları */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {project.location && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-doralp-gold flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Konum</p>
                      <p className="font-medium text-doralp-navy">{project.location}</p>
                    </div>
                  </div>
                )}

                {project.date && (
                  <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
                    <Calendar className="w-5 h-5 text-doralp-gold flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Tarih</p>
                      <p className="font-medium text-doralp-navy">
                        {new Date(project.date).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Açıklama */}
              {project.description && (
                <div className="prose prose-lg max-w-none">
                  <h3 className="text-xl font-bold text-doralp-navy mb-3">Proje Hakkında</h3>
                  <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {project.description}
                  </div>
                </div>
              )}

              {/* İletişim Butonu */}
              <div className="pt-6">
                <Button 
                  size="lg" 
                  className="w-full bg-doralp-navy hover:bg-doralp-navy/90"
                  onClick={() => router.push('/iletisim')}
                >
                  Benzer Proje İçin İletişime Geçin
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}