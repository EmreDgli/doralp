"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Edit, Shield, FileText, Eye, Trash2, Plus } from "lucide-react"
import { toast } from "sonner"

// Safety Certificate interface
interface SafetyCertificate {
  id: string
  title: string
  description?: string
  certificate_number: string
  issue_date: string
  expiry_date?: string
  issuing_authority: string
  image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export default function SafetyPage() {
  const [certificates, setCertificates] = useState<SafetyCertificate[]>([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingCertificate, setEditingCertificate] = useState<SafetyCertificate | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    certificate_number: '',
    issue_date: '',
    expiry_date: '',
    issuing_authority: '',
    is_active: true
  })

  const [selectedFiles, setSelectedFiles] = useState<{
    image?: File
  }>({})

  // Sertifikaları yükle
  const loadCertificates = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/safety-images')
      if (response.ok) {
        const data = await response.json()
        setCertificates(data)
      } else {
        toast.error('Güvenlik sertifikaları yüklenemedi')
      }
    } catch (error) {
      console.error('Load certificates error:', error)
      toast.error('Sertifikalar yüklenirken hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadCertificates()
  }, [])

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      certificate_number: '',
      issue_date: '',
      expiry_date: '',
      issuing_authority: '',
      is_active: true
    })
    setSelectedFiles({})
    setEditingCertificate(null)
  }

  const handleAdd = () => {
    resetForm()
    setIsDialogOpen(true)
  }

  const handleEdit = (certificate: SafetyCertificate) => {
    setFormData({
      title: certificate.title,
      description: certificate.description || '',
      certificate_number: certificate.certificate_number,
      issue_date: certificate.issue_date,
      expiry_date: certificate.expiry_date || '',
      issuing_authority: certificate.issuing_authority,
      is_active: certificate.is_active
    })
    setEditingCertificate(certificate)
    setSelectedFiles({})
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Bu güvenlik sertifikasını silmek istediğinizden emin misiniz?')) return

    try {
      const response = await fetch(`/api/safety-images/${id}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        toast.success('Güvenlik sertifikası silindi')
        loadCertificates()
      } else {
        toast.error('Sertifika silinemedi')
      }
    } catch (error) {
      console.error('Delete certificate error:', error)
      toast.error('Sertifika silinirken hata oluştu')
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFiles(prev => ({
        ...prev,
        image: file
      }))
    }
  }

  const uploadFile = async (file: File, folder: string) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    })

    if (!response.ok) {
      const errorData = await response.json()
      console.error('Upload Error:', errorData)
      throw new Error(errorData.error || 'Upload failed')
    }

    const data = await response.json()
    return data.url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Form validation
    if (!formData.title.trim()) {
      toast.error('Başlık boş olamaz')
      setIsSubmitting(false)
      return
    }

    if (!formData.certificate_number.trim()) {
      toast.error('Sertifika numarası boş olamaz')
      setIsSubmitting(false)
      return
    }

    if (!formData.issue_date) {
      toast.error('Veriliş tarihi seçilmelidir')
      setIsSubmitting(false)
      return
    }

    if (!formData.issuing_authority.trim()) {
      toast.error('Veren kurum boş olamaz')
      setIsSubmitting(false)
      return
    }

    try {
      let image_url = editingCertificate?.image_url

      // Görseli yükle
      if (selectedFiles.image) {
        image_url = await uploadFile(selectedFiles.image, 'safety-images')
      }

      const submitData = {
        ...formData,
        image_url
      }

      const url = editingCertificate 
        ? `/api/safety-images/${editingCertificate.id}`
        : '/api/safety-images'
      
      const method = editingCertificate ? 'PUT' : 'POST'

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(submitData)
      })

      if (response.ok) {
        toast.success(editingCertificate ? 'Güvenlik sertifikası güncellendi' : 'Güvenlik sertifikası eklendi')
        setIsDialogOpen(false)
        resetForm()
        loadCertificates()
      } else {
        const errorData = await response.json()
        console.error('API Error:', errorData)
        toast.error(`Sertifika kaydedilemedi: ${errorData.error || 'Bilinmeyen hata'}`)
      }
    } catch (error) {
      console.error('Submit error:', error)
      toast.error('Sertifika kaydedilirken hata oluştu')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getStatusBadge = (certificate: SafetyCertificate) => {
    if (!certificate.expiry_date) {
      return <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Süresiz</span>
    }

    const expiryDate = new Date(certificate.expiry_date)
    const today = new Date()
    const thirtyDaysFromNow = new Date()
    thirtyDaysFromNow.setDate(today.getDate() + 30)

    if (expiryDate < today) {
      return <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">Süresi Dolmuş</span>
    } else if (expiryDate < thirtyDaysFromNow) {
      return <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Yenilenmeli</span>
    } else {
      return <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Geçerli</span>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">İş Güvenliği Yönetimi</h1>
        <p className="text-gray-600 mt-2">İş güvenliği belgeleri ve sertifikaları</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Güvenlik Belgeleri</h2>
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Belge Ekle
          </Button>
        </div>

        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Sertifikalar yükleniyor...</p>
          </div>
        ) : certificates.length === 0 ? (
          <div className="text-center py-8">
            <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">Henüz güvenlik sertifikası eklenmemiş</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates.map((certificate) => (
              <Card key={certificate.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-semibold text-lg">{certificate.title}</h3>
                    {getStatusBadge(certificate)}
                  </div>
                  
                  {certificate.description && (
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{certificate.description}</p>
                  )}
                  
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div><strong>Sertifika No:</strong> {certificate.certificate_number}</div>
                    <div><strong>Veriliş:</strong> {new Date(certificate.issue_date).toLocaleDateString('tr-TR')}</div>
                    {certificate.expiry_date && (
                      <div><strong>Son Geçerlilik:</strong> {new Date(certificate.expiry_date).toLocaleDateString('tr-TR')}</div>
                    )}
                    <div><strong>Veren Kurum:</strong> {certificate.issuing_authority}</div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {certificate.image_url && (
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(certificate.image_url, '_blank')}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleEdit(certificate)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleDelete(certificate.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCertificate ? 'Güvenlik Sertifikasını Düzenle' : 'Yeni Güvenlik Sertifikası Ekle'}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Sertifika başlığı"
                  required
                />
              </div>

              <div>
                <Label htmlFor="certificate_number">Sertifika Numarası *</Label>
                <Input
                  id="certificate_number"
                  value={formData.certificate_number}
                  onChange={(e) => setFormData(prev => ({ ...prev, certificate_number: e.target.value }))}
                  placeholder="Sertifika numarası"
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Açıklama</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Sertifika açıklaması"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issue_date">Veriliş Tarihi *</Label>
                <Input
                  id="issue_date"
                  type="date"
                  value={formData.issue_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, issue_date: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="expiry_date">Son Geçerlilik Tarihi</Label>
                <Input
                  id="expiry_date"
                  type="date"
                  value={formData.expiry_date}
                  onChange={(e) => setFormData(prev => ({ ...prev, expiry_date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="issuing_authority">Veren Kurum *</Label>
              <Input
                id="issuing_authority"
                value={formData.issuing_authority}
                onChange={(e) => setFormData(prev => ({ ...prev, issuing_authority: e.target.value }))}
                placeholder="Sertifikayı veren kurum"
                required
              />
            </div>

            <div>
              <Label htmlFor="image">Sertifika Görseli</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              {editingCertificate?.image_url && !selectedFiles.image && (
                <p className="text-xs text-gray-500 mt-1">Mevcut görsel: Var</p>
              )}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="is_active"
                checked={formData.is_active}
                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              />
              <Label htmlFor="is_active">Aktif</Label>
            </div>

            <div className="flex justify-end space-x-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
              >
                İptal
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? 'Kaydediliyor...' : (editingCertificate ? 'Güncelle' : 'Ekle')}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
