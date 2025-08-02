"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Edit, Phone, Mail, MapPin, Clock, Printer, Globe, Trash2, Plus, RefreshCw } from "lucide-react"
import { toast } from "sonner"
import type { ContactInfo, ContactFormData, CONTACT_ICONS, CONTACT_COLORS } from "@/types/contact"

const iconMap = {
  phone: Phone,
  email: Mail,
  address: MapPin,
  clock: Clock,
  fax: Printer,
  website: Globe
}

const contactIcons = [
  { value: 'phone', label: 'Telefon' },
  { value: 'email', label: 'E-posta' },
  { value: 'address', label: 'Adres' },
  { value: 'clock', label: 'Saat' },
  { value: 'fax', label: 'Faks' },
  { value: 'website', label: 'Website' }
]

const contactColors = [
  { value: 'bg-blue-500', label: 'Mavi' },
  { value: 'bg-green-500', label: 'Yeşil' },
  { value: 'bg-red-500', label: 'Kırmızı' },
  { value: 'bg-purple-500', label: 'Mor' },
  { value: 'bg-yellow-500', label: 'Sarı' },
  { value: 'bg-indigo-500', label: 'İndigo' },
  { value: 'bg-pink-500', label: 'Pembe' },
  { value: 'bg-orange-500', label: 'Turuncu' }
]

export default function ContactManagementPage() {
  const [contacts, setContacts] = useState<ContactInfo[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<ContactInfo | null>(null)
  const [formData, setFormData] = useState<ContactFormData>({
    type: 'contact_item',
    title: '',
    subtitle: '',
    icon: '',
    color: '',
    details: [''],
    address: '',
    map_embed_url: '',
    sort_order: 0,
    is_active: true
  })

  useEffect(() => {
    fetchContacts()
  }, [])

  const fetchContacts = async () => {
    try {
      const response = await fetch('/api/contact')
      if (response.ok) {
        const data = await response.json()
        setContacts(data)
      }
    } catch (error) {
      console.error('Error fetching contacts:', error)
      toast.error('İletişim bilgileri yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      type: 'contact_item',
      title: '',
      subtitle: '',
      icon: '',
      color: '',
      details: [''],
      address: '',
      map_embed_url: '',
      sort_order: 0,
      is_active: true
    })
    setEditingContact(null)
  }

  const handleEdit = (contact: ContactInfo) => {
    setEditingContact(contact)
    setFormData({
      type: contact.type,
      title: contact.title,
      subtitle: contact.subtitle || '',
      icon: contact.icon || '',
      color: contact.color || '',
      details: contact.details || [''],
      address: contact.address || '',
      map_embed_url: contact.map_embed_url || '',
      sort_order: contact.sort_order,
      is_active: contact.is_active
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const method = editingContact ? 'PUT' : 'POST'
      const body = editingContact 
        ? { id: editingContact.id, ...formData }
        : formData

      const response = await fetch('/api/contact', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (response.ok) {
        toast.success(editingContact ? 'İletişim bilgisi güncellendi' : 'İletişim bilgisi oluşturuldu')
        setIsDialogOpen(false)
        resetForm()
        fetchContacts()
      } else {
        toast.error('Hata oluştu')
      }
    } catch (error) {
      console.error('Error saving contact:', error)
      toast.error('Kaydetme sırasında hata oluştu')
    }
  }



  const addDetail = () => {
    setFormData(prev => ({
      ...prev,
      details: [...(prev.details || []), '']
    }))
  }

  const updateDetail = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details?.map((detail, i) => i === index ? value : detail) || []
    }))
  }

  const removeDetail = (index: number) => {
    setFormData(prev => ({
      ...prev,
      details: prev.details?.filter((_, i) => i !== index) || []
    }))
  }

  const handleSeedData = async () => {
    try {
      // Manuel olarak kartları oluştur
      const defaultCards = [
        {
          type: 'contact_item',
          title: 'Telefon',
          icon: 'phone',
          color: 'bg-blue-500',
          details: ['(+90) 212 123 45 67', '(+90) 212 123 45 68'],
          sort_order: 1,
          is_active: true
        },
        {
          type: 'contact_item',
          title: 'E-posta',
          icon: 'email',
          color: 'bg-green-500',
          details: ['info@doralp.com.tr', 'satis@doralp.com.tr'],
          sort_order: 2,
          is_active: true
        },
        {
          type: 'contact_item',
          title: 'Adres',
          icon: 'address',
          color: 'bg-red-500',
          details: ['Organize Sanayi Bölgesi', '1. Cadde No: 123', 'İstanbul, Türkiye'],
          sort_order: 3,
          is_active: true
        },
        {
          type: 'contact_item',
          title: 'Çalışma Saatleri',
          icon: 'clock',
          color: 'bg-purple-500',
          details: ['Pazartesi - Cuma: 08:00 - 18:00', 'Cumartesi: 08:00 - 16:00'],
          sort_order: 4,
          is_active: true
        },
        {
          type: 'contact_item',
          title: 'Faks',
          icon: 'fax',
          color: 'bg-yellow-500',
          details: ['(+90) 212 123 45 69'],
          sort_order: 5,
          is_active: true
        },
        {
          type: 'contact_item',
          title: 'Website',
          icon: 'website',
          color: 'bg-indigo-500',
          details: ['www.doralp.com.tr'],
          sort_order: 6,
          is_active: true
        },
        {
          type: 'location',
          title: 'Konum',
          subtitle: 'Fabrikamızı ve ofisimizi ziyaret etmek için aşağıdaki konum bilgilerini kullanabilirsiniz.',
          address: 'Organize Sanayi Bölgesi, 1. Cadde No: 123, İstanbul, Türkiye',
          map_embed_url: '',
          sort_order: 1,
          is_active: true
        }
      ]

      // Her kartı ayrı ayrı oluştur
      for (const card of defaultCards) {
        await fetch('/api/contact', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(card),
        })
      }
      
      toast.success('Varsayılan iletişim kartları oluşturuldu')
      fetchContacts()
    } catch (error) {
      console.error('Error seeding data:', error)
      toast.error('Varsayılan veriler yüklenirken hata oluştu')
    }
  }

  const contactItems = contacts.filter(c => c.type === 'contact_item')
  const locationInfo = contacts.find(c => c.type === 'location')

  if (loading) {
    return <div className="p-6">Yükleniyor...</div>
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">İletişim Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            İletişim kartlarının içeriklerini düzenleyebilirsiniz. Kart türleri, ikonlar ve renkler değiştirilemez.
          </p>
        </div>
        <div className="flex space-x-2">
          {contacts.length === 0 && (
            <Button onClick={handleSeedData} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Varsayılan Verileri Yükle
            </Button>
          )}
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                İletişim Bilgisini Düzenle
              </DialogTitle>
              <p className="text-sm text-gray-600 mt-2">
                {formData.type === 'contact_item' 
                  ? 'Sadece detay bilgilerini ve aktiflik durumunu değiştirebilirsiniz'
                  : 'Konum bilgilerini düzenleyebilirsiniz'
                }
              </p>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                  disabled={formData.type === 'contact_item'}
                  placeholder={formData.type === 'contact_item' ? 'Bu kart türü için başlık değiştirilemez' : 'Başlık girin'}
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Alt Başlık</Label>
                <Input
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                />
              </div>

              {formData.type === 'contact_item' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="icon">İkon</Label>
                      <Select value={formData.icon} onValueChange={(value) => setFormData(prev => ({ ...prev, icon: value }))} disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="İkon değiştirilemez" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactIcons.map((icon) => (
                            <SelectItem key={icon.value} value={icon.value}>
                              {icon.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="color">Renk</Label>
                      <Select value={formData.color} onValueChange={(value) => setFormData(prev => ({ ...prev, color: value }))} disabled>
                        <SelectTrigger>
                          <SelectValue placeholder="Renk değiştirilemez" />
                        </SelectTrigger>
                        <SelectContent>
                          {contactColors.map((color) => (
                            <SelectItem key={color.value} value={color.value}>
                              {color.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label>Detaylar</Label>
                    {formData.details?.map((detail, index) => (
                      <div key={index} className="flex gap-2 mt-2">
                        <Input
                          value={detail}
                          onChange={(e) => updateDetail(index, e.target.value)}
                          placeholder="Detay bilgisi"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeDetail(index)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addDetail}
                      className="mt-2"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Detay Ekle
                    </Button>
                  </div>
                </>
              )}

              {formData.type === 'location' && (
                <>
                  <div>
                    <Label htmlFor="address">Adres</Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="map_embed_url">Harita Embed URL</Label>
                    <Input
                      id="map_embed_url"
                      value={formData.map_embed_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, map_embed_url: e.target.value }))}
                    />
                  </div>
                </>
              )}

              <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Bu kartı aktif göster</Label>
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

      <div className="grid gap-6">
        {/* İletişim Kartları */}
        <Card>
          <CardHeader>
            <CardTitle>İletişim Kartları</CardTitle>
          </CardHeader>
          <CardContent>
            {contactItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">Henüz iletişim kartı bulunmuyor</p>
                <Button onClick={handleSeedData} variant="outline">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Varsayılan Kartları Yükle
                </Button>
              </div>
            ) : (
              <div className="grid gap-4">
                {contactItems.map((contact) => {
                const IconComponent = contact.icon ? iconMap[contact.icon as keyof typeof iconMap] : Phone
                return (
                  <div key={contact.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 ${contact.color} rounded-full flex items-center justify-center`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-medium">{contact.title}</h3>
                        {contact.details && (
                          <div className="text-sm text-gray-600">
                            {contact.details.map((detail, index) => (
                              <div key={index}>{detail}</div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(contact)}
                      >
                        <Edit className="w-4 h-4" />
                        Düzenle
                      </Button>
                    </div>
                  </div>
                                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Konum Bilgisi */}
        <Card>
          <CardHeader>
            <CardTitle>Konum Bilgisi</CardTitle>
          </CardHeader>
          <CardContent>
            {locationInfo ? (
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h3 className="font-medium">{locationInfo.title}</h3>
                  <p className="text-sm text-gray-600">{locationInfo.subtitle}</p>
                  {locationInfo.address && (
                    <p className="text-sm text-gray-600 mt-1">{locationInfo.address}</p>
                  )}
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(locationInfo)}
                  >
                    <Edit className="w-4 h-4" />
                    Düzenle
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Henüz konum bilgisi eklenmemiş</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}