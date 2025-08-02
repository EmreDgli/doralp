"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Plus, Edit, Trash2, Move, Image as ImageIcon } from "lucide-react"
import { sliderApi } from "@/lib/api"
import { adminStorageApi } from "@/lib/admin-api"
import type { Slide } from "../../../types/slide"
import Image from "next/image"
import { toast } from "sonner"

export default function SlidesPage() {
  const [slides, setSlides] = useState<Slide[]>([])
  const [loading, setLoading] = useState(true)
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    image_url: "",
    buttons: [] as { id: string; text: string; url: string; style: 'primary' | 'secondary' | 'outline' }[],
    is_active: true,
    sort_order: 0,
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [imageUploading, setImageUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  useEffect(() => {
    fetchSlides()
  }, [])

  const fetchSlides = async () => {
    try {
      const data = await sliderApi.getAllSlides()
      setSlides(data)
    } catch (error) {
      console.error("Slides yüklenirken hata:", error)
      toast.error("Slides yüklenirken hata oluştu")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Yeni sistem: Hem buttons hem de backward compatibility için legacy alanlar
      const slideData = {
        title: formData.title,
        subtitle: formData.subtitle,
        image_url: formData.image_url,
        buttons: formData.buttons,
        // Backward compatibility için ilk butonu legacy alanlara da koy
        button_text: formData.buttons?.[0]?.text || "",
        button_url: formData.buttons?.[0]?.url || "",
        is_active: formData.is_active,
        sort_order: formData.sort_order,
      }
      
      if (editingId) {
        await sliderApi.updateSlide(editingId, slideData)
        toast.success("Slide başarıyla güncellendi")
      } else {
        await sliderApi.createSlide({
          ...slideData,
          sort_order: slides.length,
        })
        toast.success("Slide başarıyla oluşturuldu")
      }
      
      fetchSlides()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error("Slide kaydedilirken hata:", error)
      toast.error("Slide kaydedilirken hata oluştu")
    }
  }

  // Eski formattan yeni formata dönüştür
  const convertFromLegacyFormat = (slide: any) => {
    // Önce yeni sistem: buttons array'i varsa onu kullan
    if (slide.buttons && Array.isArray(slide.buttons) && slide.buttons.length > 0) {
      return slide.buttons.map((btn: any) => ({
        id: btn.id || Date.now().toString() + Math.random(),
        text: btn.text,
        url: btn.url,
        style: btn.style || 'primary'
      }))
    }
    
    // Eski sistem fallback: button_text ve button_url varsa, ilk buton olarak ekle
    if (slide.button_text && slide.button_url) {
      return [{
        id: Date.now().toString(),
        text: slide.button_text,
        url: slide.button_url,
        style: 'primary' as const
      }]
    }
    
    return []
  }

  const handleEdit = (slide: Slide) => {
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || "",
      image_url: slide.image_url,
      buttons: convertFromLegacyFormat(slide),
      is_active: slide.is_active,
      sort_order: slide.sort_order,
    })
    setEditingId(slide.id)
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Bu slide'ı silmek istediğinizden emin misiniz?")) return

    try {
      await sliderApi.deleteSlide(id)
      toast.success("Slide başarıyla silindi")
      fetchSlides()
    } catch (error) {
      console.error("Slide silinirken hata:", error)
      toast.error("Slide silinirken hata oluştu")
    }
  }

  const uploadFile = async (file: File) => {
    setImageUploading(true)
    try {
      console.log("Upload başlıyor:", {
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        bucket: "images",
        folder: "slider-images"
      })
      
      const result = await adminStorageApi.uploadImage(file, "images", "slider-images")
      
      console.log("Upload sonucu:", result)
      
      setFormData(prev => ({ ...prev, image_url: result.url }))
      toast.success("Görsel başarıyla yüklendi")
    } catch (error) {
      console.error("Görsel yüklenirken hata:", error)
      toast.error(error instanceof Error ? error.message : "Görsel yüklenirken hata oluştu")
    } finally {
      setImageUploading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    await uploadFile(file)
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    const file = e.dataTransfer.files?.[0]
    if (file && file.type.startsWith('image/')) {
      await uploadFile(file)
    } else {
      toast.error("Lütfen geçerli bir görsel dosyası seçin")
    }
  }

  const moveSlide = async (id: string, direction: "up" | "down") => {
    const slideIndex = slides.findIndex(s => s.id === id)
    if (slideIndex === -1) return

    const newIndex = direction === "up" ? slideIndex - 1 : slideIndex + 1
    if (newIndex < 0 || newIndex >= slides.length) return

    const newSlides = [...slides]
    const [movedSlide] = newSlides.splice(slideIndex, 1)
    newSlides.splice(newIndex, 0, movedSlide)

    const updates = newSlides.map((slide, index) => ({
      id: slide.id,
      sort_order: index,
    }))

    try {
      await sliderApi.updateSlideOrder(updates)
      setSlides(newSlides.map((slide, index) => ({ ...slide, sort_order: index })))
      toast.success("Slide sırası güncellendi")
    } catch (error) {
      console.error("Slide sırası güncellenirken hata:", error)
      toast.error("Slide sırası güncellenirken hata oluştu")
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      image_url: "",
      buttons: [],
      is_active: true,
      sort_order: 0,
    })
    setEditingId(null)
  }

  // Buton yönetimi fonksiyonları
  const addButton = () => {
    const newButton = {
      id: Date.now().toString(),
      text: "",
      url: "",
      style: 'primary' as const
    }
    setFormData(prev => ({
      ...prev,
      buttons: [...prev.buttons, newButton]
    }))
  }

  const removeButton = (buttonId: string) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.filter(btn => btn.id !== buttonId)
    }))
  }

  const updateButton = (buttonId: string, field: 'text' | 'url' | 'style', value: string) => {
    setFormData(prev => ({
      ...prev,
      buttons: prev.buttons.map(btn => 
        btn.id === buttonId ? { ...btn, [field]: value } : btn
      )
    }))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-doralp-navy"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
      <div>
          <h1 className="text-3xl font-bold text-doralp-navy">Slider Yönetimi</h1>
          <p className="text-gray-600 mt-2">Ana sayfa slider görsellerini yönetin</p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} className="bg-doralp-gold hover:bg-doralp-gold/90">
              <Plus className="mr-2 h-4 w-4" />
              Yeni Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingId ? "Slide Düzenle" : "Yeni Slide Oluştur"}
              </DialogTitle>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="subtitle">Alt Başlık</Label>
                <Textarea
                  id="subtitle"
                  value={formData.subtitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                  rows={3}
                />
              </div>

                            <div>
                <Label htmlFor="image">Görsel *</Label>
                <div className="space-y-3">
                  {/* File Upload */}
                  <div 
                    className={`border-2 border-dashed rounded-lg p-4 text-center transition-colors ${
                      dragActive 
                        ? "border-blue-500 bg-blue-50" 
                        : "border-gray-300 hover:border-gray-400"
                    } ${imageUploading ? "opacity-50 cursor-not-allowed" : ""}`}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                  >
                    <Input
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleImageUpload}
                      disabled={imageUploading}
                      className="hidden"
                      id="file-upload"
                    />
                    <label htmlFor="file-upload" className={`cursor-pointer ${imageUploading ? "pointer-events-none" : ""}`}>
                      <div className="space-y-2">
                        <ImageIcon className={`mx-auto h-8 w-8 ${dragActive ? "text-blue-500" : "text-gray-400"}`} />
                        <div>
                          <span className="text-sm font-medium text-blue-600">
                            {dragActive ? "Dosyayı bırakın" : "Dosya seçin"}
                          </span>
                          <span className="text-sm text-gray-500"> veya sürükleyin</span>
                        </div>
                        <p className="text-xs text-gray-500">
                          JPEG, PNG, WebP (Max: 5MB)
                        </p>
                      </div>
                    </label>
                  </div>
                  
                  {imageUploading && (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                      <p className="text-sm text-blue-600">Görsel yükleniyor...</p>
                    </div>
                  )}
                  
                  {/* Preview */}
                  {formData.image_url && (
                    <div className="relative w-full h-32 border rounded-lg overflow-hidden">
                      <Image
                        src={formData.image_url}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  
                  {/* URL Input */}
                  <div className="relative">
                    <Input
                      placeholder="veya görsel URL'si girin"
                      value={formData.image_url}
                      onChange={(e) => setFormData(prev => ({ ...prev, image_url: e.target.value }))}
                      required
                    />
            </div>
            </div>
          </div>

              {/* Butonlar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>Butonlar</Label>
                  <Button 
                    type="button" 
                    onClick={addButton}
                    size="sm"
                    className="bg-doralp-navy hover:bg-doralp-navy/90"
                  >
                    + Buton Ekle
                  </Button>
                </div>
                
                {formData.buttons.map((button, index) => (
                  <div key={button.id} className="border rounded-lg p-4 mb-3 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Buton {index + 1}</span>
                      <Button 
                        type="button" 
                        onClick={() => removeButton(button.id)}
                        size="sm"
                        variant="outline"
                        className="text-red-600 hover:text-red-700"
                      >
                        Sil
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label>Buton Metni</Label>
                        <Input
                          value={button.text}
                          onChange={(e) => updateButton(button.id, 'text', e.target.value)}
                          placeholder="Örn: Daha Fazla Bilgi"
                        />
                      </div>
                      
                      <div>
                        <Label>Buton URL</Label>
                        <Input
                          type="text"
                          value={button.url}
                          onChange={(e) => updateButton(button.id, 'url', e.target.value)}
                          placeholder="Örn: /hakkimizda"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <Label>Buton Stili</Label>
                      <select 
                        value={button.style}
                        onChange={(e) => updateButton(button.id, 'style', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="primary">Ana Buton (Gold)</option>
                        <option value="secondary">İkincil Buton (Beyaz)</option>
                        <option value="outline">Çerçeveli Buton</option>
                      </select>
                    </div>
                  </div>
                ))}
                
                {formData.buttons.length === 0 && (
                  <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                    <p>Henüz buton eklenmemiş</p>
                    <p className="text-sm">Buton eklemek için yukarıdaki "Buton Ekle" düğmesini kullanın</p>
                  </div>
                )}
              </div>

            <div className="flex items-center space-x-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                <Label htmlFor="is_active">Aktif</Label>
              </div>

              {/* Ön İzleme */}
              {(formData.title || formData.subtitle || formData.image_url) && (
                <div className="space-y-3">
                  <Label className="text-lg font-semibold">Ön İzleme</Label>
                  <div className="relative w-full h-48 md:h-64 rounded-lg overflow-hidden border-2 border-gray-200 bg-gray-900">
                    {/* Background Image */}
                    {formData.image_url && (
                      <div className="absolute inset-0">
                        <Image
                          src={formData.image_url}
                          alt="Ön izleme"
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-doralp-navy/70"></div>
                      </div>
                    )}
                    
                    {/* Content */}
                    <div className="relative z-10 h-full flex items-center justify-center p-6">
                      <div className="text-center space-y-4">
                        {formData.title && (
                          <h1 className="text-2xl md:text-4xl font-bold text-white leading-tight">
                            {formData.title}
                          </h1>
                        )}
                        
                        {formData.subtitle && (
                          <p className="text-lg md:text-xl text-gray-200 max-w-2xl mx-auto leading-relaxed">
                            {formData.subtitle}
                          </p>
                        )}
                        
                        {formData.buttons.length > 0 && (
                          <div className="pt-4 flex flex-wrap gap-3 justify-center">
                            {formData.buttons.filter(btn => btn.text).map((button) => (
                              <span
                                key={button.id}
                                className={`inline-block px-6 py-2 rounded-md font-medium transition-colors ${
                                  button.style === 'primary'
                                    ? 'bg-doralp-gold hover:bg-doralp-gold/90 text-white'
                                    : button.style === 'secondary'
                                    ? 'bg-white hover:bg-gray-100 text-doralp-navy'
                                    : 'border-2 border-white text-white hover:bg-white hover:text-doralp-navy'
                                }`}
                              >
                                {button.text}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Ön izleme etiketi */}
                    <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                      Ön İzleme
            </div>
          </div>

                  {!formData.image_url && (
                    <p className="text-sm text-gray-500 text-center">
                      Ön izleme için görsel ekleyin
                    </p>
                  )}
                </div>
              )}

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  İptal
                </Button>
                <Button type="submit" className="bg-doralp-gold hover:bg-doralp-gold/90">
                  {editingId ? "Güncelle" : "Oluştur"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
            </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5" />
            Slider Listesi ({slides.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {slides.length === 0 ? (
            <p className="text-center text-gray-500 py-8">Henüz slider oluşturulmamış.</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Sıra</TableHead>
                  <TableHead>Görsel</TableHead>
                  <TableHead>Başlık</TableHead>
                  <TableHead>Durum</TableHead>
                  <TableHead>İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {slides.map((slide, index) => (
                  <TableRow key={slide.id}>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <span>{index + 1}</span>
                        <div className="flex flex-col">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSlide(slide.id, "up")}
                            disabled={index === 0}
                            className="h-6 w-6 p-0"
                          >
                            ↑
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => moveSlide(slide.id, "down")}
                            disabled={index === slides.length - 1}
                            className="h-6 w-6 p-0"
                          >
                            ↓
                          </Button>
            </div>
          </div>
                    </TableCell>
                    <TableCell>
                      <div className="relative w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={slide.image_url}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{slide.title}</p>
                        {slide.subtitle && (
                          <p className="text-sm text-gray-500 truncate max-w-xs">
                            {slide.subtitle}
                          </p>
                        )}
        </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={slide.is_active ? "default" : "secondary"}>
                        {slide.is_active ? "Aktif" : "Pasif"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(slide)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(slide.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  )
}