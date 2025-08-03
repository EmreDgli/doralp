"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Home, Users, Target, Award } from "lucide-react"
import { toast } from "sonner"

// Ana sayfa içerik interface'leri
interface HeroContent {
  title: string
  subtitle: string
  description: string
  background_image?: string
}

interface AboutSectionContent {
  title: string
  description: string
  features: string[]
}

interface HomeContent {
  hero: HeroContent
  about_section: AboutSectionContent
}

const iconMap = {
  home: Home,
  users: Users,
  target: Target,
  award: Award
}

export default function HomeContentManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<'hero' | 'about_section' | null>(null)
  const [heroFormData, setHeroFormData] = useState<HeroContent>({
    title: '',
    subtitle: '',
    description: '',
    background_image: ''
  })
  const [aboutFormData, setAboutFormData] = useState<AboutSectionContent>({
    title: '',
    description: '',
    features: ['', '', '', '']
  })

  // Varsayılan ana sayfa içeriği
  const defaultHomeContent: HomeContent = {
    hero: {
      title: 'Doralp Yapı',
      subtitle: 'Güvenilir İnşaat Çözümleri',
      description: '25 yıllık deneyimle kaliteli inşaat hizmetleri sunuyoruz',
      background_image: '/herosection-doralp-foto.jpg'
    },
    about_section: {
      title: 'Neden Doralp Yapı?',
      description: '25 yıllık deneyimimiz, kaliteli malzemelerimiz ve uzman ekibimizle her projede mükemmelliği hedefliyoruz.',
      features: ['Deneyimli Ekip', 'Kaliteli Malzeme', 'Zamanında Teslimat', 'Müşteri Memnuniyeti']
    }
  }

  const [homeContent, setHomeContent] = useState<HomeContent>(defaultHomeContent)

  // localStorage'dan verileri yükle
  useEffect(() => {
    const savedContent = localStorage.getItem('homeContent')
    if (savedContent) {
      try {
        const parsedContent = JSON.parse(savedContent)
        setHomeContent(parsedContent)
      } catch (error) {
        console.error('Home content parse error:', error)
        setHomeContent(defaultHomeContent)
      }
    }
  }, [])

  const handleHeroEdit = () => {
    setEditingSection('hero')
    setHeroFormData(homeContent.hero)
    setIsDialogOpen(true)
  }

  const handleAboutEdit = () => {
    setEditingSection('about_section')
    setAboutFormData(homeContent.about_section)
    setIsDialogOpen(true)
  }

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedContent = {
      ...homeContent,
      hero: heroFormData
    }
    
    setHomeContent(updatedContent)
    localStorage.setItem('homeContent', JSON.stringify(updatedContent))
    toast.success('Hero bölümü güncellendi')
    
    setIsDialogOpen(false)
    setEditingSection(null)
  }

  const handleAboutSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedContent = {
      ...homeContent,
      about_section: {
        ...aboutFormData,
        features: aboutFormData.features.filter(feature => feature.trim() !== '')
      }
    }
    
    setHomeContent(updatedContent)
    localStorage.setItem('homeContent', JSON.stringify(updatedContent))
    toast.success('Biz Kimiz bölümü güncellendi')
    
    setIsDialogOpen(false)
    setEditingSection(null)
  }

  const updateFeature = (index: number, value: string) => {
    setAboutFormData(prev => ({
      ...prev,
      features: prev.features.map((feature, i) => i === index ? value : feature)
    }))
  }

  const addFeature = () => {
    setAboutFormData(prev => ({
      ...prev,
      features: [...prev.features, '']
    }))
  }

  const removeFeature = (index: number) => {
    setAboutFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Ana Sayfa İçerik Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Ana sayfadaki bölümlerin içeriklerini düzenleyin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Hero Bölümü */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                  <Home className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Hero Bölümü</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleHeroEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Başlık:</strong> {homeContent.hero.title}</p>
              <p className="text-sm text-gray-600"><strong>Alt Başlık:</strong> {homeContent.hero.subtitle}</p>
              <p className="text-sm text-gray-600"><strong>Açıklama:</strong> {homeContent.hero.description}</p>
              {homeContent.hero.background_image && (
                <p className="text-xs text-green-600">✓ Arka plan görseli: {homeContent.hero.background_image}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Hakkımızda Bölümü */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Biz Kimiz Bölümü</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAboutEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Başlık:</strong> {homeContent.about_section.title}</p>
              <p className="text-sm text-gray-600"><strong>Açıklama:</strong> {homeContent.about_section.description}</p>
              <div className="text-sm text-gray-600">
                <strong>Özellikler:</strong>
                <ul className="list-disc list-inside mt-1">
                  {homeContent.about_section.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Hero Düzenleme Dialog'u */}
      <Dialog open={isDialogOpen && editingSection === 'hero'} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Hero Bölümünü Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleHeroSubmit} className="space-y-4">
            <div>
              <Label htmlFor="heroTitle">Başlık</Label>
              <Input
                id="heroTitle"
                value={heroFormData.title}
                onChange={(e) => setHeroFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Ana başlık"
              />
            </div>

            <div>
              <Label htmlFor="heroSubtitle">Alt Başlık</Label>
              <Input
                id="heroSubtitle"
                value={heroFormData.subtitle}
                onChange={(e) => setHeroFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                required
                placeholder="Alt başlık"
              />
            </div>

            <div>
              <Label htmlFor="heroDescription">Açıklama</Label>
              <Textarea
                id="heroDescription"
                value={heroFormData.description}
                onChange={(e) => setHeroFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Hero bölümü açıklaması"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="heroBackgroundImage">Arka Plan Görseli (URL)</Label>
              <Input
                id="heroBackgroundImage"
                value={heroFormData.background_image}
                onChange={(e) => setHeroFormData(prev => ({ ...prev, background_image: e.target.value }))}
                placeholder="/path/to/image.jpg"
              />
              <p className="text-xs text-gray-500 mt-1">
                Public klasöründeki görselin yolunu girin (örn: /hero-bg.jpg)
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                Güncelle
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      {/* Hakkımızda Düzenleme Dialog'u */}
      <Dialog open={isDialogOpen && editingSection === 'about_section'} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Biz Kimiz Bölümünü Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAboutSubmit} className="space-y-4">
            <div>
              <Label htmlFor="aboutTitle">Başlık</Label>
              <Input
                id="aboutTitle"
                value={aboutFormData.title}
                onChange={(e) => setAboutFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Biz Kimiz başlığı"
              />
            </div>

            <div>
              <Label htmlFor="aboutDescription">Açıklama</Label>
              <Textarea
                id="aboutDescription"
                value={aboutFormData.description}
                onChange={(e) => setAboutFormData(prev => ({ ...prev, description: e.target.value }))}
                required
                placeholder="Biz Kimiz açıklaması"
                rows={3}
              />
            </div>

            <div>
              <Label>Özellikler</Label>
              {aboutFormData.features.map((feature, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={feature}
                    onChange={(e) => updateFeature(index, e.target.value)}
                    placeholder={`Özellik ${index + 1}`}
                    className="flex-1"
                  />
                  {aboutFormData.features.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                    >
                      Sil
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addFeature}
                className="mt-2"
              >
                Yeni Özellik Ekle
              </Button>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                Güncelle
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}