"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash2, FileText } from "lucide-react"
import { toast } from "sonner"
import type { Content, ContentFormData, LANGUAGES } from "@/types/content"
import { LANGUAGE_OPTIONS, PAGE_OPTIONS } from "@/types/content"

export default function ContentsManagementPage() {
  const [contents, setContents] = useState<Content[]>([])
  const [loading, setLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [formData, setFormData] = useState<ContentFormData>({
    language: 'tr',
    page: '',
    title: '',
    body: ''
  })

  useEffect(() => {
    fetchContents()
  }, [])

  const fetchContents = async () => {
    try {
      const response = await fetch('/api/contents')
      const data = await response.json()
      setContents(data)
    } catch (error) {
      console.error('Error fetching contents:', error)
      toast.error('İçerikler yüklenirken hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      language: 'tr',
      page: '',
      title: '',
      body: ''
    })
    setEditingContent(null)
  }

  const handleEdit = (content: Content) => {
    setEditingContent(content)
    setFormData({
      language: content.language,
      page: content.page,
      title: content.title,
      body: content.body || ''
    })
    setIsDialogOpen(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      if (editingContent) {
        // Update existing content
        const response = await fetch(`/api/contents?id=${editingContent.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast.success('İçerik güncellendi')
          fetchContents()
          setIsDialogOpen(false)
          resetForm()
        } else {
          toast.error('İçerik güncellenirken hata oluştu')
        }
      } else {
        // Create new content
        const response = await fetch('/api/contents', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          toast.success('İçerik oluşturuldu')
          fetchContents()
          setIsDialogOpen(false)
          resetForm()
        } else {
          toast.error('İçerik oluşturulurken hata oluştu')
        }
      }
    } catch (error) {
      console.error('Error submitting content:', error)
      toast.error('İçerik kaydedilirken hata oluştu')
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu içeriği silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/contents?id=${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        toast.success('İçerik silindi')
        fetchContents()
      } else {
        toast.error('İçerik silinirken hata oluştu')
      }
    } catch (error) {
      console.error('Error deleting content:', error)
      toast.error('İçerik silinirken hata oluştu')
    }
  }

  const getLanguageBadgeColor = (language: LANGUAGES) => {
    return language === 'tr' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
  }

  const getPageDisplayName = (page: string) => {
    const pageOption = PAGE_OPTIONS.find(option => option.value === page)
    return pageOption ? pageOption.label : page
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">İçerik Yönetimi</h1>
          <p className="text-gray-600 mt-1">
            Web sitesindeki sayfa içeriklerini yönetin. Çok dilli destek mevcuttur.
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="w-4 h-4 mr-2" />
              Yeni İçerik
            </Button>
          </DialogTrigger>
        </Dialog>
      </div>

      {/* İçerik Listesi */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Mevcut İçerikler
          </CardTitle>
          <CardDescription>
            Toplam {contents.length} içerik bulunuyor
          </CardDescription>
        </CardHeader>
        <CardContent>
          {contents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-3 opacity-50" />
              <p>Henüz içerik eklenmemiş</p>
              <p className="text-sm">Yeni içerik eklemek için yukarıdaki butonu kullanın</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Dil</TableHead>
                  <TableHead>Sayfa</TableHead>
                  <TableHead>Başlık</TableHead>
                  <TableHead>İçerik Önizleme</TableHead>
                  <TableHead>Son Güncelleme</TableHead>
                  <TableHead className="text-right">İşlemler</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contents.map((content) => (
                  <TableRow key={content.id}>
                    <TableCell>
                      <Badge className={getLanguageBadgeColor(content.language)}>
                        {content.language.toUpperCase()}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getPageDisplayName(content.page)}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {content.title}
                    </TableCell>
                    <TableCell className="max-w-xs">
                      <p className="text-sm text-gray-600 truncate">
                        {content.body ? content.body.substring(0, 100) + '...' : 'İçerik yok'}
                      </p>
                    </TableCell>
                    <TableCell className="text-sm text-gray-500">
                      {content.updated_at ? new Date(content.updated_at).toLocaleDateString('tr-TR') : 'Bilinmiyor'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(content)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(content.id)}
                        >
                          <Trash2 className="w-4 h-4" />
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

      {/* Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingContent ? 'İçeriği Düzenle' : 'Yeni İçerik Ekle'}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="language">Dil</Label>
                <Select 
                  value={formData.language} 
                  onValueChange={(value: LANGUAGES) => setFormData(prev => ({ ...prev, language: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <SelectItem key={lang.value} value={lang.value}>
                        {lang.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="page">Sayfa</Label>
                <Select 
                  value={formData.page} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, page: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sayfa seçin" />
                  </SelectTrigger>
                  <SelectContent>
                    {PAGE_OPTIONS.map((page) => (
                      <SelectItem key={page.value} value={page.value}>
                        {page.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="title">Başlık</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                placeholder="İçerik başlığını girin"
              />
            </div>

            <div>
              <Label htmlFor="body">İçerik</Label>
              <Textarea
                id="body"
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                rows={8}
                placeholder="İçerik metnini girin..."
                className="resize-none"
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                İptal
              </Button>
              <Button type="submit">
                {editingContent ? 'Güncelle' : 'Oluştur'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}