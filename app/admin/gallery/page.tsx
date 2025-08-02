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
import Image from "next/image"

interface GalleryCategory {
  id: string
  title: string
  slug: string
  sort_order: number
  is_active: boolean
  created_by: string
  images: GalleryImage[]
}

interface GalleryImage {
  id: string
  url: string
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
  const [draggedItem, setDraggedItem] = useState<string | null>(null)

  const [categoryFormData, setCategoryFormData] = useState({
    title: "",
    slug: "",
    description: "",
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
      const data = await adminGalleryApi.getGallery()
      setCategories(data || [])
    } catch (error) {
      console.error("Gallery load error:", error)
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
          description: categoryFormData.description,
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

      // Upload image
      const uploadResult = await adminStorageApi.uploadImage(file, "admin-images", "gallery")

      // Add to gallery
      await adminGalleryApi.addImage(selectedCategory, {
        image_url: uploadResult.url,
        alt_text: imageFormData.alt_text,
        caption: imageFormData.caption,
        sort_order: 0,
        file_size: uploadResult.size,
        file_type: uploadResult.type,
      })

      await loadGallery()
      setImageFormData({
        alt_text: "",
        caption: "",
      })
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
      description: "",
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
      // Delete image logic would go here
      await loadGallery()
    } catch (error: any) {
      console.error("Image delete error:", error)
      alert(error.message || "Resim silinirken hata oluştu")
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
      description: "",
      is_active: true,
    })
  }

  const filteredCategories = categories.filter((category) =>
    category.title.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const activeCategory = categories.find((cat) => cat.id === activeTab)
  const totalImages = categories.reduce((sum, cat) => sum + cat.images.length, 0)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-doralp-gold"></div>
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
            {categories.length} kategori • {totalImages} resim
          </p>
        </div>

        <div className="flex space-x-2">
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

                <div>
                  <label className="block text-sm font-medium mb-2">Açıklama</label>
                  <Textarea
                    value={categoryFormData.description}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value })}
                    rows={2}
                    placeholder="Kategori açıklaması"
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
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList
            className="grid w-full"
            style={{ gridTemplateColumns: `repeat(${Math.min(filteredCategories.length, 6)}, 1fr)` }}
          >
            {filteredCategories.slice(0, 6).map((category) => (
              <TabsTrigger key={category.id} value={category.id} className="text-xs">
                {category.title}
                <Badge variant="secondary" className="ml-2">
                  {category.images.length}
                </Badge>
              </TabsTrigger>
            ))}
          </TabsList>

          {filteredCategories.map((category) => (
            <TabsContent key={category.id} value={category.id}>
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>{category.title}</CardTitle>
                      <p className="text-sm text-doralp-gray mt-1">
                        {category.images.length} resim • Slug: {category.slug}
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
                <CardContent>
                  {category.images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {category.images.map((image) => (
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
                              src={image.url || "/placeholder.svg"}
                              alt={image.alt_text || "Galeri resmi"}
                              fill
                              className="object-cover"
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
                  ) : (
                    <div className="text-center py-12 text-doralp-gray">
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
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FolderPlus className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-doralp-gray mb-4">Henüz galeri kategorisi eklenmemiş</p>
            <Button onClick={() => setIsCategoryDialogOpen(true)} className="bg-doralp-gold hover:bg-doralp-gold/90">
              İlk kategoriyi ekle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
