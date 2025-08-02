"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Phone, Mail, MapPin, Clock, Map } from "lucide-react"
import { toast } from "sonner"

// İletişim kartları için interface
interface ContactCard {
  id: string
  title: string
  icon: string
  color: string
  details: string[]
}

// Konum bilgisi interface'i
interface LocationInfo {
  title: string
  subtitle: string
  address: string
  mapEmbedUrl?: string
}

const iconMap = {
  phone: Phone,
  email: Mail,
  address: MapPin,
  clock: Clock
}

export default function ContactCardsManagementPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isLocationDialogOpen, setIsLocationDialogOpen] = useState(false)
  const [editingCard, setEditingCard] = useState<ContactCard | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    details: ['', '']
  })
  const [locationFormData, setLocationFormData] = useState({
    title: '',
    subtitle: '',
    address: '',
    mapEmbedUrl: ''
  })

  // İletişim kartları - varsayılan değerler
  const defaultCards: ContactCard[] = [
    {
      id: '1',
      title: 'Telefon',
      icon: 'phone',
      color: 'bg-blue-500',
      details: ['(+90) 212 123 45 67', '(+90) 212 123 45 68']
    },
    {
      id: '2',
      title: 'E-posta',
      icon: 'email',
      color: 'bg-green-500',
      details: ['info@doralp.com.tr', 'satis@doralp.com.tr']
    },
    {
      id: '3',
      title: 'Adres',
      icon: 'address',
      color: 'bg-red-500',
      details: ['Organize Sanayi Bölgesi', '1. Cadde No: 123', 'İstanbul, Türkiye']
    },
    {
      id: '4',
      title: 'Çalışma Saatleri',
      icon: 'clock',
      color: 'bg-purple-500',
      details: ['Pazartesi - Cuma: 08:00 - 18:00', 'Cumartesi: 08:00 - 16:00']
    }
  ]

  // Varsayılan konum bilgisi
  const defaultLocation: LocationInfo = {
    title: 'Konum',
    subtitle: 'Fabrikamızı ve ofisimizi ziyaret etmek için aşağıdaki konum bilgilerini kullanabilirsiniz.',
    address: 'Organize Sanayi Bölgesi, 1. Cadde No: 123, İstanbul, Türkiye',
    mapEmbedUrl: ''
  }

  const [contactCards, setContactCards] = useState<ContactCard[]>(defaultCards)
  const [locationInfo, setLocationInfo] = useState<LocationInfo>(defaultLocation)

  // localStorage'dan verileri yükle
  useEffect(() => {
    // İletişim kartlarını yükle
    const savedCards = localStorage.getItem('contactCards')
    if (savedCards) {
      try {
        const parsedCards = JSON.parse(savedCards)
        setContactCards(parsedCards)
      } catch (error) {
        console.error('Contact cards parse error:', error)
        setContactCards(defaultCards)
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
        setLocationInfo(defaultLocation)
      }
    }
  }, [])

  const handleEdit = (card: ContactCard) => {
    setEditingCard(card)
    setFormData({
      title: card.title,
      details: [...card.details]
    })
    setIsDialogOpen(true)
  }

  const handleLocationEdit = () => {
    setLocationFormData({
      title: locationInfo.title,
      subtitle: locationInfo.subtitle,
      address: locationInfo.address,
      mapEmbedUrl: locationInfo.mapEmbedUrl || ''
    })
    setIsLocationDialogOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (editingCard) {
      // Kartı güncelle
      const updatedCards = contactCards.map(card => 
        card.id === editingCard.id 
          ? { 
              ...card, 
              title: formData.title,
              details: formData.details.filter(detail => detail.trim() !== '')
            }
          : card
      )
      
      setContactCards(updatedCards)
      localStorage.setItem('contactCards', JSON.stringify(updatedCards))
      toast.success('İletişim kartı güncellendi')
    }
    
    setIsDialogOpen(false)
    setEditingCard(null)
    resetForm()
  }

  const handleLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const updatedLocation = {
      title: locationFormData.title,
      subtitle: locationFormData.subtitle,
      address: locationFormData.address,
      mapEmbedUrl: locationFormData.mapEmbedUrl
    }
    
    setLocationInfo(updatedLocation)
    localStorage.setItem('locationInfo', JSON.stringify(updatedLocation))
    toast.success('Konum bilgisi güncellendi')
    
    setIsLocationDialogOpen(false)
  }

  const resetForm = () => {
    setFormData({
      title: '',
      details: ['', '']
    })
  }

  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...prev.details, '']
    }))
  }

  const removeDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.filter((_, i) => i !== index)
    }))
  }

  const updateDetail = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details.map((detail, i) => i === index ? value : detail)
    }))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">İletişim Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            İletişim sayfasındaki kartların ve konum bilgisinin içeriklerini düzenleyin
          </p>
        </div>
      </div>

      {/* İletişim Kartları */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">İletişim Kartları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {contactCards.map((card) => {
            const IconComponent = iconMap[card.icon as keyof typeof iconMap]
            return (
              <Card key={card.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 ${card.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="h-5 w-5 text-white" />
                      </div>
                      <CardTitle className="text-lg">{card.title}</CardTitle>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(card)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1">
                    {card.details.map((detail, index) => (
                      <p key={index} className="text-sm text-gray-600">
                        {detail}
                      </p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Konum Bilgisi */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Konum Bilgisi</h2>
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center">
                  <Map className="h-5 w-5 text-white" />
                </div>
                <CardTitle className="text-lg">{locationInfo.title}</CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLocationEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">{locationInfo.subtitle}</p>
              <p className="text-sm text-gray-600 font-medium">{locationInfo.address}</p>
              {locationInfo.mapEmbedUrl && (
                <p className="text-xs text-green-600">✓ Harita embed kodu eklendi</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* İletişim Kartı Düzenleme Dialog'u */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>İletişim Kartını Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                disabled
                className="bg-gray-50"
                placeholder="Başlık değiştirilemez"
              />
            </div>

            <div>
              <Label>Detaylar</Label>
              {formData.details.map((detail, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={detail}
                    onChange={(e) => updateDetail(index, e.target.value)}
                    placeholder={`${formData.title} bilgisi ${index + 1}`}
                    className="flex-1"
                  />
                  {formData.details.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeDetail(index)}
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
                onClick={addDetail}
                className="mt-2"
              >
                Yeni Ekle
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

      {/* Konum Düzenleme Dialog'u */}
      <Dialog open={isLocationDialogOpen} onOpenChange={setIsLocationDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Konum Bilgisini Düzenle</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleLocationSubmit} className="space-y-4">
            <div>
              <Label htmlFor="locationTitle">Başlık</Label>
              <Input
                id="locationTitle"
                value={locationFormData.title}
                onChange={(e) => setLocationFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="Başlık girin"
              />
            </div>

            <div>
              <Label htmlFor="locationSubtitle">Alt Başlık</Label>
              <Textarea
                id="locationSubtitle"
                value={locationFormData.subtitle}
                onChange={(e) => setLocationFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                placeholder="Alt başlık girin"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="locationAddress">Adres</Label>
              <Textarea
                id="locationAddress"
                value={locationFormData.address}
                onChange={(e) => setLocationFormData(prev => ({ ...prev, address: e.target.value }))}
                required
                placeholder="Adres girin"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="mapEmbedUrl">Harita Embed Kodu (isteğe bağlı)</Label>
              <Textarea
                id="mapEmbedUrl"
                value={locationFormData.mapEmbedUrl}
                onChange={(e) => setLocationFormData(prev => ({ ...prev, mapEmbedUrl: e.target.value }))}
                placeholder="Google Maps embed iframe kodunu buraya yapıştırın"
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                Google Maps'ten "Paylaş" → "Harita yerleştir" → iframe kodunu kopyalayın
                <br />
                Harita alanı otomatik olarak tam genişlik ve yüksekliği kaplayacaktır.
              </p>
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsLocationDialogOpen(false)}>
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