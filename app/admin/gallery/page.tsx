"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Upload, Search, GripVertical, FolderPlus } from "lucide-react"
import { adminGalleryApi, adminStorageApi } from "@/lib/admin-api"
import { toast } from "sonner"
import Image from "next/image"

interface GalleryCategory {
  id: string
  title: string
  slug: string
  description?: string
  sort_order: number
  is_active: boolean
  created_by: string
  images: GalleryImage[]
}

interface GalleryImage {
  id: string
  image_url: string
  alt_text: string | null
  sort_order: number
  is_active: boolean
  file_size: number
  created_by: string
}

export default function GalleryPage() {
  const [categories, setCategories] = useState<GalleryCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState("")
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<GalleryCategory | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(false)
  const [categoriesLoaded, setCategoriesLoaded] = useState(false)
  const [showCategoriesModal, setShowCategoriesModal] = useState(false)
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const [categoryFormData, setCategoryFormData] = useState({
    title: "",
    slug: "",
    is_active: true,
  })

  const [imageFormData, setImageFormData] = useState({
    alt_text: "",
    caption: "",
  })

  useEffect(() => {
    loadGallery()
  }, [])

  useEffect(() => {
    if (categories.length > 0 && !activeTab) {
      setActiveTab(categories[0].id)
    }
  }, [categories, activeTab])

  const loadGallery = async () => {
    try {
      setLoading(true)
      console.log('Gallery yükleniyor...')
      
      const data = await adminGalleryApi.getGallery()
      console.log('Gallery data:', data)
      console.log('Kategoriler:', data?.map(cat => ({
        id: cat.id,
        title: cat.title,
        imageCount: cat.images?.length || 0
      })))
      
      setCategories(data || [])
      
      // Eğer hiç kategori yoksa, varsayılan kategorileri yükle
      if (!data || data.length === 0) {
        console.log('Hiç kategori bulunamadı, varsayılan kategoriler yükleniyor...')
        await loadDefaultCategories(false) // Toast gösterme
        setCategoriesLoaded(true)
      }
    } catch (error) {
      console.error("Gallery load error:", error)
      // Hata durumunda basit sorgu dene
      try {
        console.log('Basit sorgu deneniyor...')
        const response = await fetch('/api/test-gallery-simple')
        const result = await response.json()
        console.log('Basit sorgu sonucu:', result)
        
        if (result.success && result.categories.length > 0) {
          setCategories(result.categories)
        }
      } catch (simpleError) {
        console.error('Basit sorgu da başarısız:', simpleError)
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCategorySubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      if (editingCategory) {
        // Update existing category logic would go here
        // For now, we'll just reload
      } else {
        await adminGalleryApi.createCategory({
          title: categoryFormData.title,
          slug: categoryFormData.slug || categoryFormData.title.toLowerCase().replace(/\s+/g, "-"),
          sort_order: categories.length + 1,
        })
      }

      await loadGallery()
      setIsCategoryDialogOpen(false)
      resetCategoryForm()
    } catch (error: any) {
      console.error("Category save error:", error)
      alert(error.message || "Kategori kaydedilirken hata oluştu")
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !selectedCategory) return

    try {
      setUploadingImage(true)
      console.log('Image upload başladı:', { fileName: file.name, fileSize: file.size, categoryId: selectedCategory })

      // Upload image to gallery-images folder
      const uploadResult = await adminStorageApi.uploadImage(file, "images", "gallery-images")
      console.log('Upload result:', uploadResult)

      // Add to gallery
      const imageData = {
        image_url: uploadResult.url,
        alt_text: imageFormData.alt_text,
        caption: imageFormData.caption,
        sort_order: 0,
        file_size: uploadResult.size,
        file_type: uploadResult.type,
      }
      console.log('Database\'e kaydedilecek veri:', imageData)
      
      const dbResult = await adminGalleryApi.addImage(selectedCategory, imageData)
      console.log('Database result:', dbResult)

      await loadGallery()
      setImageFormData({
        alt_text: "",
        caption: "",
      })
      
      console.log('Resim yükleme tamamlandı')
    } catch (error: any) {
      console.error("Image upload error:", error)
      alert(error.message || "Resim yüklenirken hata oluştu")
    } finally {
      setUploadingImage(false)
    }
  }

  const handleEditCategory = (category: GalleryCategory) => {
    setEditingCategory(category)
    setCategoryFormData({
      title: category.title,
      slug: category.slug,
      is_active: category.is_active,
    })
    setIsCategoryDialogOpen(true)
  }

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm("Bu kategoriyi ve içindeki tüm resimleri silmek istediğinizden emin misiniz?")) return

    try {
      // Delete category logic would go here
      await loadGallery()
    } catch (error: any) {
      console.error("Category delete error:", error)
      alert(error.message || "Kategori silinirken hata oluştu")
    }
  }

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm("Bu resmi silmek istediğinizden emin misiniz?")) return

    try {
      console.log('Resim siliniyor:', imageId)
      
      // Resmi sil (hem storage hem database)
      await adminGalleryApi.deleteImage(imageId)
      
      console.log('Resim başarıyla silindi')
      
      // Galeriyi yenile
      await loadGallery()
      
      toast.success("Resim başarıyla silindi!")
    } catch (error: any) {
      console.error("Image delete error:", error)
      toast.error(error.message || "Resim silinirken hata oluştu")
    }
  }

  const openImageDialog = (categoryId: string) => {
    setSelectedCategory(categoryId)
    setIsImageDialogOpen(true)
  }

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = async (e: React.DragEvent, targetItemId: string) => {
    e.preventDefault()

    if (!draggedItem || draggedItem === targetItemId) return

    try {
      // Update sort orders logic would go here
      await loadGallery()
    } catch (error: any) {
      console.error("Sort update error:", error)
      alert(error.message || "Sıralama güncellenirken hata oluştu")
    } finally {
      setDraggedItem(null)
    }
  }

  const resetCategoryForm = () => {
    setEditingCategory(null)
    setCategoryFormData({
      title: "",
      slug: "",
      is_active: true,
    })
  }

  const loadDefaultCategories = async (showToast = true) => {
    try {
      setLoadingCategories(true)
      const response = await fetch('/api/gallery/load-categories', {
        method: 'POST'
      })

      if (response.ok) {
        const result = await response.json()
        await loadGallery()
        if (showToast) {
          toast.success(result.message)
        }
      } else {
        const error = await response.json()
        if (showToast) {
          toast.error(error.error || 'Kategoriler yüklenirken hata oluştu')
        }
      }
    } catch (error) {
      console.error('Varsayılan kategoriler yüklenirken hata:', error)
      if (showToast) {
        toast.error('Kategoriler yüklenirken hata oluştu')
      }
    } finally {
      setLoadingCategories(false)
    }
  }

  const filteredCategories = (categories || []).filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeCategory = (categories || []).find((cat) => cat.id === activeTab)
  const totalImages = (categories || []).reduce((sum, cat) => sum + (cat.images?.length || 0), 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doralp-gold mx-auto mb-4"></div>
          <p className="text-doralp-gray">Galeri yükleniyor...</p>
          {(categories?.length || 0) === 0 && (
            <p className="text-sm text-blue-600 mt-2">Varsayılan kategoriler yükleniyor</p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-doralp-navy">Galeri Yönetimi</h1>
          <p className="text-doralp-gray mt-2">
            {(categories?.length || 0)} kategori • {totalImages} resim
          </p>
          {(categories?.length || 0) > 0 && (
            <p className="text-sm text-green-600 mt-1">
              ✅ {(categories?.length || 0)} adet kategori yüklendi - Üretim süreçleri hazır!
            </p>
          )}
          {(categories?.length || 0) === 0 && !categoriesLoaded && (
            <p className="text-sm text-blue-600 mt-1">
              ⚡ Kategoriler otomatik olarak yükleniyor...
            </p>
          )}
          {categoriesLoaded && (categories?.length || 0) > 0 && (
            <p className="text-sm text-green-600 mt-1">
              ✅ Varsayılan kategoriler başarıyla yüklendi!
            </p>
          )}
        </div>

        <div className="flex space-x-2">
          <Button 
            variant="outline" 
            onClick={() => loadDefaultCategories()}
            disabled={loadingCategories}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <FolderPlus className="mr-2 h-4 w-4" />
            {loadingCategories ? 'Yükleniyor...' : 'Varsayılan Kategorileri Yükle'}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => setShowCategoriesModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            📊 Kategorileri Detay Görüntüle
          </Button>
          
          <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={resetCategoryForm}>
                <FolderPlus className="mr-2 h-4 w-4" />
                Yeni Kategori
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{editingCategory ? "Kategori Düzenle" : "Yeni Kategori Ekle"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Kategori Adı</label>
                  <Input
                    value={categoryFormData.title}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, title: e.target.value })}
                    required
                    placeholder="Ürün Kabul"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">URL Slug</label>
                  <Input
                    value={categoryFormData.slug}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                    placeholder="urun-kabul"
                  />
                </div>



                <div className="flex items-center space-x-2">
                  <Switch
                    checked={categoryFormData.is_active}
                    onCheckedChange={(checked) => setCategoryFormData({ ...categoryFormData, is_active: checked })}
                  />
                  <label className="text-sm font-medium">Aktif</label>
                </div>

                <div className="flex justify-end space-x-2">
                  <Button type="button" variant="outline" onClick={() => setIsCategoryDialogOpen(false)}>
                    İptal
                  </Button>
                  <Button type="submit" className="bg-doralp-gold hover:bg-doralp-gold/90">
                    {editingCategory ? "Güncelle" : "Ekle"}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>

          <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-doralp-gold hover:bg-doralp-gold/90"
                onClick={() => openImageDialog(activeTab)}
                disabled={!activeTab}
              >
                <Plus className="mr-2 h-4 w-4" />
                Resim Ekle
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Resim Ekle</DialogTitle>
              </DialogHeader>

              <div className="space-y-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4">
                      <label htmlFor="gallery-image-upload" className="cursor-pointer">
                        <span className="mt-2 block text-sm font-medium text-gray-900">
                          Resim yüklemek için tıklayın
                        </span>
                        <input
                          id="gallery-image-upload"
                          type="file"
                          className="sr-only"
                          accept="image/jpeg,image/png,image/webp"
                          onChange={handleImageUpload}
                          disabled={uploadingImage}
                        />
                      </label>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Alt Text</label>
                  <Input
                    value={imageFormData.alt_text}
                    onChange={(e) => setImageFormData({ ...imageFormData, alt_text: e.target.value })}
                    placeholder="Resim açıklaması"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Başlık</label>
                  <Input
                    value={imageFormData.caption}
                    onChange={(e) => setImageFormData({ ...imageFormData, caption: e.target.value })}
                    placeholder="Resim başlığı"
                  />
                </div>
              </div>
            </DialogContent>
          </Dialog>
          
          {/* Kategoriler Detay Modal */}
          <Dialog open={showCategoriesModal} onOpenChange={setShowCategoriesModal}>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>📋 Galeri Kategorileri Detayları</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredCategories.map((category, index) => (
                    <div key={category.id} className="border rounded-lg p-4 bg-gray-50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-lg">#{category.sort_order} {category.title}</h4>
                        <Badge variant={category.is_active ? "default" : "secondary"}>
                          {category.is_active ? "Aktif" : "Pasif"}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-sm text-gray-600">
                        <p><strong>Slug:</strong> {category.slug}</p>
                        <p><strong>Sıralama:</strong> {category.sort_order}</p>
                        <p><strong>Resim Sayısı:</strong> {(category.images?.length || 0)}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-center text-sm text-gray-500">
                  Toplam {filteredCategories.length} kategori bulundu
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Kategori ara..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Gallery Tabs */}
      {filteredCategories.length > 0 ? (
        <div className="space-y-4">
          {/* Kategori Özeti */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold text-blue-900 mb-2">📋 Kategori Özeti ({(filteredCategories?.length || 0)} adet)</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
              {filteredCategories.map((category, index) => (
                <div key={category.id} className="flex items-center space-x-2 text-sm p-2 bg-white rounded border">
                  <div className="text-xs text-gray-500 w-6">#{category.sort_order}</div>
                  <div className={`w-3 h-3 rounded-full ${category.is_active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                  <span className="truncate font-medium">{category.title}</span>
                  <Badge variant="secondary" className="text-xs">
                    {(category.images?.length || 0)}
                  </Badge>
                </div>
              ))}
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex gap-4">
            <TabsList className="flex flex-col h-fit bg-gray-50 p-2 rounded-lg min-w-[200px]">
              {(filteredCategories || []).map((category) => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id} 
                  className="text-xs whitespace-nowrap text-left justify-start w-full mb-1"
                >
                  {category.title}
                  <Badge variant="secondary" className="ml-2">
                    {(category.images?.length || 0)}
                  </Badge>
                </TabsTrigger>
              ))}
            </TabsList>

          {(filteredCategories || []).map((category) => (
            <TabsContent key={category.id} value={category.id} className="flex-1">
              <Card className="h-full">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{category.title}</CardTitle>
                      <p className="text-sm text-doralp-gray mt-1">
                        {(category.images?.length || 0)} resim • Slug: {category.slug}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={category.is_active ? "default" : "secondary"}>
                        {category.is_active ? "Aktif" : "Pasif"}
                      </Badge>
                      <Button variant="outline" size="sm" onClick={() => handleEditCategory(category)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  {(category.images?.length || 0) > 0 ? (
                    <div className="space-y-4">
                      {/* Resim Ekle Butonu - Resimler varken */}
                      <div className="flex justify-end mb-4">
                        <Button
                          onClick={() => openImageDialog(category.id)}
                          className="bg-doralp-gold hover:bg-doralp-gold/90 text-white"
                          size="sm"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Bu Kategoriye Resim Ekle
                        </Button>
                      </div>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4">
                        {(category.images || []).map((image) => (
                          <div
                            key={image.id}
                            draggable
                            onDragStart={(e) => handleDragStart(e, image.id)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, image.id)}
                            className={`relative group cursor-move ${draggedItem === image.id ? "opacity-50" : ""}`}
                          >
                            <div className="aspect-square relative rounded-lg overflow-hidden">
                              <Image
                                src={image.image_url || "/placeholder.svg"}
                                alt={image.alt_text || "Galeri resmi"}
                                fill
                                className="object-cover"
                                onError={(e) => {
                                  console.error('Image load error:', image.image_url)
                                  e.currentTarget.src = "/placeholder.svg"
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <GripVertical className="h-4 w-4 text-white" />
                                </div>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button variant="destructive" size="sm" onClick={() => handleDeleteImage(image.id)}>
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              {!image.is_active && (
                                <div className="absolute bottom-2 left-2">
                                  <Badge variant="secondary">Pasif</Badge>
                                </div>
                              )}
                            </div>
                            {image.alt_text && <p className="text-xs text-gray-600 mt-1 truncate">{image.alt_text}</p>}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-doralp-gray h-full flex flex-col justify-center">
                      <Upload className="mx-auto h-12 w-12 text-gray-300 mb-4" />
                      <p>Bu kategoride henüz resim yok</p>
                      <Button
                        variant="outline"
                        className="mt-4 bg-transparent"
                        onClick={() => openImageDialog(category.id)}
                      >
                        İlk resmi ekle
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FolderPlus className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-doralp-gray mb-4">Henüz galeri kategorisi eklenmemiş</p>
            <div className="space-y-2">
              <Button onClick={() => setIsCategoryDialogOpen(true)} className="bg-doralp-gold hover:bg-doralp-gold/90">
                İlk kategoriyi ekle
              </Button>
              <div className="text-xs text-gray-500">
                Veya varsayılan üretim süreç kategorilerini yükleyin
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
