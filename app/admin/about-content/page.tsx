"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Target, Users, Award, Eye } from "lucide-react"
import { toast } from "sonner"

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

export default function AboutContentManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSection, setEditingSection] = useState<'story' | 'heritage' | 'specialMoments' | null>(null)
  const [storyFormData, setStoryFormData] = useState<StoryContent>({
    title: '',
    paragraphs: ['', '']
  })
  const [heritageFormData, setHeritageFormData] = useState<HeritageContent>({
    title: '',
    paragraphs: ['', '']
  })
  const [specialMomentsFormData, setSpecialMomentsFormData] = useState<SpecialMomentsContent>({
    mainTitle: '',
    description: '',
    moments: [{ title: '', description: '' }]
  })

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

  const handleStoryEdit = () => {
    setEditingSection('story')
    setStoryFormData(aboutContent.story)
    setIsDialogOpen(true)
  }

  const handleHeritageEdit = () => {
    setEditingSection('heritage')
    setHeritageFormData(aboutContent.heritage)
    setIsDialogOpen(true)
  }

  const handleSpecialMomentsEdit = () => {
    setEditingSection('specialMoments')
    setSpecialMomentsFormData(aboutContent.specialMoments || {
      mainTitle: 'Özelleştiğimiz Anlar',
      description: '',
      moments: [{ title: '', description: '' }]
    })
    setIsDialogOpen(true)
  }

  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedContent = {
      ...aboutContent,
      story: {
        ...storyFormData,
        paragraphs: storyFormData.paragraphs.filter(p => p.trim() !== '')
      }
    }
    
    setAboutContent(updatedContent)
    localStorage.setItem('aboutContent', JSON.stringify(updatedContent))
    toast.success('Hikayemiz bölümü güncellendi')
    
    setIsDialogOpen(false)
    setEditingSection(null)
  }

  const handleHeritageSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedContent = {
      ...aboutContent,
      heritage: {
        ...heritageFormData,
        paragraphs: heritageFormData.paragraphs.filter(p => p.trim() !== '')
      }
    }
    
    setAboutContent(updatedContent)
    localStorage.setItem('aboutContent', JSON.stringify(updatedContent))
    toast.success('Çeliğin Işıltılı Dünyası bölümü güncellendi')
    
    setIsDialogOpen(false)
    setEditingSection(null)
  }

  const handleSpecialMomentsSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedContent = {
      ...aboutContent,
      specialMoments: {
        ...specialMomentsFormData,
        moments: (specialMomentsFormData?.moments || []).filter(moment => moment.title.trim() !== '' && moment.description.trim() !== '')
      }
    }
    
    setAboutContent(updatedContent)
    localStorage.setItem('aboutContent', JSON.stringify(updatedContent))
    toast.success('Özelleştiğimiz Anlar bölümü güncellendi')
    
    setIsDialogOpen(false)
    setEditingSection(null)
  }

  // Special Moments utility fonksiyonları
  const updateMoment = (index: number, field: 'title' | 'description', value: string) => {
    setSpecialMomentsFormData(prev => ({
      ...prev,
      mainTitle: prev?.mainTitle || 'Özelleştiğimiz Anlar',
      description: prev?.description || '',
      moments: (prev?.moments || []).map((moment, i) => 
        i === index ? { ...moment, [field]: value } : moment
      )
    }))
  }

  const addMoment = () => {
    setSpecialMomentsFormData(prev => ({
      ...prev,
      mainTitle: prev?.mainTitle || 'Özelleştiğimiz Anlar',
      description: prev?.description || '',
      moments: [...(prev?.moments || []), { title: '', description: '' }]
    }))
  }

  const removeMoment = (index: number) => {
    setSpecialMomentsFormData(prev => ({
      ...prev,
      mainTitle: prev?.mainTitle || 'Özelleştiğimiz Anlar',
      description: prev?.description || '',
      moments: (prev?.moments || []).filter((_, i) => i !== index)
    }))
  }

  // Story paragraph fonksiyonları
  const updateStoryParagraph = (index: number, value: string) => {
    setStoryFormData(prev => ({
      ...prev,
      paragraphs: (prev?.paragraphs || []).map((p, i) => i === index ? value : p)
    }))
  }

  const addStoryParagraph = () => {
    setStoryFormData(prev => ({
      ...prev,
      paragraphs: [...(prev?.paragraphs || []), '']
    }))
  }

  const removeStoryParagraph = (index: number) => {
    setStoryFormData(prev => ({
      ...prev,
      paragraphs: (prev?.paragraphs || []).filter((_, i) => i !== index)
    }))
  }

  // Heritage paragraph fonksiyonları
  const updateHeritageParagraph = (index: number, value: string) => {
    setHeritageFormData(prev => ({
      ...prev,
      paragraphs: (prev?.paragraphs || []).map((p, i) => i === index ? value : p)
    }))
  }

  const addHeritageParagraph = () => {
    setHeritageFormData(prev => ({
      ...prev,
      paragraphs: [...(prev?.paragraphs || []), '']
    }))
  }

  const removeHeritageParagraph = (index: number) => {
    setHeritageFormData(prev => ({
      ...prev,
      paragraphs: (prev?.paragraphs || []).filter((_, i) => i !== index)
    }))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Hakkımızda İçerik Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Hakkımızda sayfasındaki bölümlerin içeriklerini düzenleyin
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Hikayemiz Bölümü */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Hikayemiz</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleStoryEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Başlık:</strong> {aboutContent.story?.title || 'Doralp Hikayemiz'}</p>
              <p className="text-sm text-gray-600"><strong>Paragraf sayısı:</strong> {aboutContent.story?.paragraphs?.length || 0}</p>
              <p className="text-sm text-gray-600"><strong>Önizleme:</strong> {aboutContent.story?.paragraphs?.[0]?.substring(0, 80) || 'Önizleme yükleniyor...'}...</p>
            </div>
          </CardContent>
        </Card>

        {/* Çeliğin Işıltılı Dünyası Bölümü */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Çeliğin Işıltılı Dünyası</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleHeritageEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Başlık:</strong> {aboutContent.heritage?.title || 'Çeliğin Işıltılı Dünyası'}</p>
              <p className="text-sm text-gray-600"><strong>Paragraf sayısı:</strong> {aboutContent.heritage?.paragraphs?.length || 0}</p>
              <p className="text-sm text-gray-600"><strong>Önizleme:</strong> {aboutContent.heritage?.paragraphs?.[0]?.substring(0, 80) || 'Önizleme yükleniyor...'}...</p>
            </div>
          </CardContent>
        </Card>

        {/* Özelleştiğimiz Anlar Bölümü */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center">
                  <Award className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">Özelleştiğimiz Anlar</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSpecialMomentsEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Ana Başlık:</strong> {aboutContent.specialMoments?.mainTitle || 'Özelleştiğimiz Anlar'}</p>
              <p className="text-sm text-gray-600"><strong>Açıklama:</strong> {aboutContent.specialMoments?.description || 'Açıklama yükleniyor...'}</p>
              <p className="text-sm text-gray-600"><strong>An sayısı:</strong> {aboutContent.specialMoments?.moments?.length || 0}</p>
              <div className="text-sm text-gray-600">
                <strong>Anlar:</strong>
                <ul className="list-disc list-inside mt-1">
                  {(aboutContent.specialMoments?.moments || []).slice(0, 2).map((moment, index) => (
                    <li key={index}>{moment.title}</li>
                  ))}
                  {(aboutContent.specialMoments?.moments?.length || 0) > 2 && (
                    <li className="text-gray-400">+{(aboutContent.specialMoments?.moments?.length || 0) - 2} daha...</li>
                  )}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>



      {/* Hikayemiz Düzenleme Dialog'u */}
      <Dialog open={isDialogOpen && editingSection === 'story'} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Hikayemiz Bölümünü Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleStorySubmit} className="space-y-4">
            <div>
              <Label htmlFor="storyTitle">Başlık</Label>
              <Input
                id="storyTitle"
                value={storyFormData?.title || ''}
                onChange={(e) => setStoryFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Hikayemiz başlığı"
              />
            </div>

            <div>
              <Label>Paragraflar</Label>
              {(storyFormData?.paragraphs || []).map((paragraph, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => updateStoryParagraph(index, e.target.value)}
                    placeholder={`Paragraf ${index + 1}`}
                    className="flex-1"
                    rows={3}
                  />
                  {(storyFormData?.paragraphs?.length || 0) > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeStoryParagraph(index)}
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
                onClick={addStoryParagraph}
                className="mt-2"
              >
                Yeni Paragraf Ekle
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

      {/* Çeliğin Işıltılı Dünyası Düzenleme Dialog'u */}
      <Dialog open={isDialogOpen && editingSection === 'heritage'} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Çeliğin Işıltılı Dünyası Bölümünü Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleHeritageSubmit} className="space-y-4">
            <div>
              <Label htmlFor="heritageTitle">Başlık</Label>
              <Input
                id="heritageTitle"
                value={heritageFormData?.title || ''}
                onChange={(e) => setHeritageFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Çeliğin Işıltılı Dünyası başlığı"
              />
            </div>

            <div>
              <Label>Paragraflar</Label>
              {(heritageFormData?.paragraphs || []).map((paragraph, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Textarea
                    value={paragraph}
                    onChange={(e) => updateHeritageParagraph(index, e.target.value)}
                    placeholder={`Paragraf ${index + 1}`}
                    className="flex-1"
                    rows={3}
                  />
                  {(heritageFormData?.paragraphs?.length || 0) > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeHeritageParagraph(index)}
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
                onClick={addHeritageParagraph}
                className="mt-2"
              >
                Yeni Paragraf Ekle
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

      {/* Özelleştiğimiz Anlar Düzenleme Dialog'u */}
      <Dialog open={isDialogOpen && editingSection === 'specialMoments'} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Özelleştiğimiz Anlar Bölümünü Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSpecialMomentsSubmit} className="space-y-4">
            <div>
              <Label htmlFor="specialMomentsTitle">Ana Başlık</Label>
              <Input
                id="specialMomentsTitle"
                value={specialMomentsFormData?.mainTitle || ''}
                onChange={(e) => setSpecialMomentsFormData(prev => ({ 
                  ...prev, 
                  mainTitle: e.target.value,
                  description: prev?.description || '',
                  moments: prev?.moments || [{ title: '', description: '' }]
                }))}
                required
                placeholder="Özelleştiğimiz Anlar"
              />
            </div>

            <div>
              <Label htmlFor="specialMomentsDescription">Açıklama (İsteğe bağlı)</Label>
              <Textarea
                id="specialMomentsDescription"
                value={specialMomentsFormData?.description || ''}
                onChange={(e) => setSpecialMomentsFormData(prev => ({ 
                  ...prev, 
                  description: e.target.value,
                  mainTitle: prev?.mainTitle || 'Özelleştiğimiz Anlar',
                  moments: prev?.moments || [{ title: '', description: '' }]
                }))}
                placeholder="Ana açıklama metni"
                rows={2}
              />
            </div>

            <div>
              <Label>Özel Anlar</Label>
              {(specialMomentsFormData?.moments || []).map((moment, index) => (
                <div key={index} className="border rounded-lg p-4 mt-2 space-y-3">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">An {index + 1}</h4>
                    {(specialMomentsFormData?.moments?.length || 0) > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMoment(index)}
                      >
                        Sil
                      </Button>
                    )}
                  </div>
                  <div>
                    <Label>Başlık</Label>
                    <Input
                      value={moment.title}
                      onChange={(e) => updateMoment(index, 'title', e.target.value)}
                      placeholder="An başlığı"
                    />
                  </div>
                  <div>
                    <Label>Açıklama</Label>
                    <Textarea
                      value={moment.description}
                      onChange={(e) => updateMoment(index, 'description', e.target.value)}
                      placeholder="An açıklaması"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addMoment}
                className="mt-2"
              >
                Yeni An Ekle
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